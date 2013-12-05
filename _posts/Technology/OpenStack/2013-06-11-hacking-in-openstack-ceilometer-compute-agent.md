---
layout: post
title: OpenStack Ceilometer Compute Agent源码解读
category: 技术
tags: OpenStack
keywords: OpenStack,Ceilometer,Compute Agent,Source Code
description: Ceilometer中的Compute Agent是和虚拟机运行最紧密的一个监控代理模块，在读Ceilometer代码时，由于有Libvirt的基础，所以看起来会相对容易些
---

### Compute Agent功能
不知道代码干了什么就盲目去读的话，基本是事倍功半的结果。

Ceilometer通过Agent模块去polling虚拟机或者OpenStack中需要的信息，然后将它传送至Ceilometer Event Bus中去。对于虚拟机的具体信息（CPU，Memory,Disk I/O,Network I/O）需要去虚拟机所运行的节点上获取（其实使用libvirt可以直接tcp到哪个节点上），所以需要将Agent模块丢到计算机点上，然后通过Libvirt获取虚拟机状态，这就是Compute Agent的功能。

### 入口文件
Compute Agent以OpenStack Service（OpenStack服务分为Service和WSGI Service）的形式运行在计算节点上，它由一个可执行文件开启，这个可执行文件安装时生成（目前最新版本，比Grizzly新比Havana旧……）。如果是Grizzly版本，可以去`ceilometer/bin`下找`ceilometer-agent-compute`文件，如果是和我用的一样，选最新版本，就直接看`ceilometer/setup.cfg`文件

    console_scripts =
        ceilometer-agent-central = ceilometer.central.manager:agent_central
        ceilometer-agent-compute = ceilometer.compute.manager:agent_compute
        ceilometer-dbsync = ceilometer.storage:dbsync
        ceilometer-collector = ceilometer.collector.service:collector
        ceilometer-collector-udp = ceilometer.collector.service:udp_collector

这里表明ceilometer-agent-compute从`ceilometer.compute.manager:agent_compute`运行

### 入口函数
入口函数很简单，基本就把compute的功能写清楚了，我这个版本在`ceilometer/ceilometer/compute/manager.py`中

    def agent_compute():
        eventlet.monkey_patch()
        gettextutils.install('ceilometer')
        service.prepare_service(sys.argv)
        os_service.launch(rpc_service.Service(cfg.CONF.host,
                                              'ceilometer.agent.compute',
                                              AgentManager())).wait()

前4行都是准备步骤，包括参数获取等功能，真正实现功能的是最后一行

    os_service.launch(rpc_service.Service(cfg.CONF.host,'ceilometer.agent.compute',AgentManager())).wait()

我再把它展开

    ceilometer.openstack.common.service.launch(
        ceilometer.openstack.common.rpc.service.Service(
            cfg.CONF.host,'ceilometer.agent.compute',AgentManager()
            )
        ).wait()

两个Service函数的作用都是OpenStack服务的基本作用————启动一个服务（关于服务我有时间再详细写一个分析服务的博客），然后启动服务后，执行AgentManager()（它继承自`ceilometer.agent.AgentManager`）中的`initialize_service_hook()`函数

### agent.py
这个模块中包含了非常重要的两个类`AgentManager`和`PollingTask`，Compute Agent和Central Agent的Manager都继承自AgentManger

在AgentManager的构造函数中，有这么一句

    self.pollster_manager = extension_manager

它是一种动态加载模块的机制(见[学习Python动态扩展包stevedore](/2013/06/09/learn-python-stevedore-module-in-detail.html))，它将载入所有它可以用来获取虚拟机状态的模块。在Compute Agent的构造函数中说明了是`namespace='ceilometer.poll.compute'`，即`setup.cfg`中的：

    ceilometer.poll.compute =
        diskio = ceilometer.compute.pollsters:DiskIOPollster
        cpu = ceilometer.compute.pollsters:CPUPollster
        net = ceilometer.compute.pollsters:NetPollster
        instance = ceilometer.compute.pollsters:InstancePollster

这样就让Agent明白了它要调用哪些Pollster来获取虚拟机信息

构造函数中还有一个很重要的东西

    self._inspector = virt_inspector.get_hypervisor_inspector()

inspector的作用是获取虚拟机信息的，它现在只有一种实现方式---Libvirt

接着是启动服务时运行的那个函数`initialize_service_hook()`了

    def initialize_service_hook(self, service):
        self.service = service
        for interval, task in self.setup_polling_tasks().iteritems():
            self.service.tg.add_timer(interval,
                                      self.interval_task,
                                      task=task)

大概看一下这个函数，它利用`setup_polling_tasks()`返回的迭代器（interval是间隔时长，task是执行的任务），将interval_task(task)以interval的间隔执行

    def interval_task(self, task):
        task.poll_and_publish()

那么task是什么呢？这个就是前面提到的`PollingTask`类了，Compute Agent的PollingTask在`manager.py`文件中

    class PollingTask(agent.PollingTask):
        def poll_and_publish_instances(self, instances):
            with self.publish_context as publisher:
                for instance in instances:
                    if getattr(instance, 'OS-EXT-STS:vm_state', None) != 'error':
                        for pollster in self.pollsters:
                            publisher(list(pollster.obj.get_counters(self.manager,instance)))

        def poll_and_publish(self):
            self.poll_and_publish_instances(
                self.manager.nv.instance_get_all_by_host(cfg.CONF.host))

我只写了摘了必要部分，`poll_and_publish`通过nova_client获得现有的所有虚拟机，然后调用`poll_and_pusblish_instances`

通过pollster.get_counters获得虚拟机的数据，然后通过pipeline将数据转换和传送给publisher，由publisher发送到MQ中去。这里涉及到的pipeline和publisher单独拿出来研究，之后再写。

### pollsters.py
这个文件位于`ceilometer/ceilometer/compute`下，它是轮询虚拟机信息的主要代码所在

以cpu为例说明

    class CPUPollster(plugin.ComputePollster):
        def get_counters(self, manager, instance):
            instance_name = _instance_name(instance)
            cpu_info = manager.inspector.inspect_cpus(instance_name)
            yield make_counter_from_instance(instance,
                                             name='cpu',
                                             type=counter.TYPE_CUMULATIVE,
                                             unit='ns',
                                             volume=cpu_info.time,
                                             )

这里省略了大部分代码，只是给出一个Pollster的写法，它需要一个get_counters的函数，用来返回货取到的虚拟机数据。执行获取的代码来自于inspector，也就是`ceilometer/ceilometer/compute/virt/inspector.py`中的功能了

### inspector.py
inspector要做的就是去获得虚拟机数据了，它可以有多重方式，暂时ceilometer只写了基于libvirt获得的。暂时inspector可以做的内容主要有一下几个：

    def inspect_instances(self):
    def inspect_cpus(self, instance_name):
    def inspect_vnics(self, instance_name):
    def inspect_disks(self, instance_name):

通过Libvirt获得虚拟机信息方法应该在之前讲[kanyun worker原理](/2013/01/30/introduction-of-kanyun-worker.html)的时候说到了，再这里就不赘述了

### TODO
基本先写到这里，对于了解Compute Agent代码运行机制，对它进行二次开发也有很大帮助，再有内容以后再补充


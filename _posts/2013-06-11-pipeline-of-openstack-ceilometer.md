---
layout: post
title: OpenStack Ceilometer中的Pipeline机制
category: 技术
tags: OpenStack
keywords: OpenStack,Ceilometer,Pipeline
description: 在阅读Ceilometer代码时，发现它使用了一个pipeline机制
---
### Pipeline作用
Pipeline翻译过来是管道的意思，它在ceilometer中的作用类似一个过滤器一样，或者说是转换器。它是一般是一个方法链，这个方法链前面一部分是transformer，transformer实现数据转换等功能，它可以有多个。在链尾是publisher，它负责将数据发送到AMQP中去。

### Pipeline定义
在Agent的构造函数中，第一个创建的属性就是pipeline_manager

    self.pipeline_manager = pipeline.setup_pipeline(
        transformer.TransformerExtensionManager(
            'ceilometer.transformer',
        ),
        publisher.PublisherExtensionManager(
            'ceilometer.publisher',
        ),
    )

其中，transformer和publisher来自setup.cfg中

    ceilometer.transformer =
        accumulator = ceilometer.transformer.accumulator:TransformerAccumulator

    ceilometer.publisher =
        meter_publisher = ceilometer.publisher.meter:MeterPublisher
        meter = ceilometer.publisher.meter:MeterPublisher
        udp = ceilometer.publisher.udp:UDPPublisher

### Pipeline设置
它调用了`ceilometer.pipeline`中的`setup_pipline()`,`setup_pipeline()`通过导入`pipeline.yaml`，获得pipeline的配置，默认配置如下

    name: meter_pipeline
    interval: 600
    counters:
        - "*"
    transformers:
    publishers:
        - meter

最后它创建了一个PipelineManager给self.pipeline_manager
    
    PipelineManager(pipeline_cfg,transformer_manager,publisher_manager)


PipelineManager做的事情如下：
    
    self.pipelines = [Pipeline(pipedef, publisher_manager,transformer_manager) for pipedef in cfg]

它遍历cfg中对pipeline的定义（基本都是一个），然后生成一个Pipeline对象数组

    def __init__(self, cfg, publisher_manager, transformer_manager):
        self.cfg = cfg
        self.name = cfg['name']
        self.interval = int(cfg['interval'])
        self.counters = cfg['counters']
        self.publishers = cfg['publishers']
        self.transformer_cfg = cfg['transformers'] or []
        self.publisher_manager = publisher_manager
        self._check_counters()
        self._check_publishers(cfg, publisher_manager)
        self.transformers = self._setup_transformers(cfg, transformer_manager)

Pipeline的构造函数如上，它的作用是处理transformer和publisher

### Pipeline使用
pipeline的使用位置在agent.py中

    def setup_polling_tasks(self):
        polling_tasks = {}
        for pipeline, pollster in itertools.product(
                self.pipeline_manager.pipelines,
                self.pollster_manager.extensions):
            for counter in pollster.obj.get_counter_names():
                if pipeline.support_counter(counter):
                    polling_task = polling_tasks.get(pipeline.interval, None)
                    if not polling_task:
                        polling_task = self.create_polling_task()
                        polling_tasks[pipeline.interval] = polling_task
                    polling_task.add(pollster, [pipeline])
                    break

        return polling_tasks

首先通过product生成pipeline和pollster的笛卡尔积，即将每一个pollster都和pipeline配对（一般只有一个pipeline）。

`pipeline.support_counter(counter)`用来检查这个counter是否同意进入pipeline

另外，每一个polling_task都在构造函数中

    self.publish_context = pipeline.PublishContext(
        agent_manager.context,
        cfg.CONF.counter_source)

声明了一个pipeline.PublishContext()

在执行`task.poll_and_publish`前，会先执行

    def add(self, pollster, pipelines):
        self.publish_context.add_pipelines(pipelines)
        self.pollsters.update([pollster])

即增加一个pipeline管理

最后是publish_context的使用位置

    def poll_and_publish_instances(self, instances):
        with self.publish_context as publisher:
            for instance in instances:
                if getattr(instance, 'OS-EXT-STS:vm_state', None) != 'error':
                    for pollster in self.pollsters:
                        publisher(list(pollster.obj.get_counters(
                            self.manager,
                            instance)))

这里用了with as作为pipeline的管理

在`__enter__()`中，定义了一个函数

    def p(counters):
        for p in self.pipelines:
            p.publish_counters(self.context,
                               counters,
                               self.source)

这个函数执行pipeline中的publish_counters，然后最终的执行代码来自

    ext.obj.publish_counters(ctxt, counters, source)

即publisher的publish_counters，在这里是`ceilometer.publisher.meter:publish_counters`，它负责将数据发送到AMQP中去

### 总结
Pipeline机制一定程度上保证了数据的安全性，并且可以统一数据格式，了解它对于了解Ceilometer的数据流有一定帮助
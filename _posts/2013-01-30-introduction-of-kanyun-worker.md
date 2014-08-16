---
layout: post
title: kanyun worker原理
category: 技术
tags: OpenStack
description: kanyun中worker运行在计算节点上，负责计算节点上虚拟机数据的采集
---

## 信息获取
主要是有几个plugin函数，依次调用，并把结果发给server

### 获得主机信息

    plugin_local_cpu()
    使用命令 sleep %d;top -n 1 -b|grep Cpu|awk '{print $2}' 来检测计算节点（非虚拟机）cpu占用率
    plugin_traffic_accounting_info()
    获得流量信息，测试不好用

### 获得宿主机信息

    plugin_agent_info(){
        import libvirt 
        conn = libvirt.openReadOnly('qemu:///system')
        hostname = conn.getHostname() #获得主机信息
        conn.listDomainsID() #列出宿主机   
        dom_conn = conn.lookupByID(1) #连接到第一台宿主机
        dom_conn.name() #宿主机名称
        dom_conn.info() #宿主机信息[id,mem_usage,mem_max,vcpu,cpu_time]
        dom_conn.memoryStats() #宿主机内存使用{actual,rss}
    }
    通过调用libvirt来获取本台机器上虚拟机的使用情况

#### 获得cpu信息
获得cpu使用率方式：

    宿主机上cpu两段时间cpu运行时长间隔/主机上实际时长间隔
    cpu = 100.0 * self.diffs[dom_id].get_diff() / (self.diffs[dom_id].get_time_pass() * dom_nr_virt_cpu * 1e9)

#### 获得内存信息
获得内存总量和使用量有info()和memoryStats()两个函数。
info()函数取到的内存信息在这里测试时不准确，每次usage和max都是一样的值，而使用memoryStats()取到的是正常的，没有深究区别，先使用后者。
    
## 信息发送到server

    self.send([msg_type, json.dumps(info)])

通过这句代码将数据发送到server端

其中包括采集到的info信息和本次发送信息的类型msg_type
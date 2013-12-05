---
layout: post
title: OpenStack监控项目Ceilometer的一些术语
category: 技术
tags: OpenStack
description: 在研究Ceilometer项目时，首先应该了解各个术语
---

[原文档](http://docs.openstack.org/developer/ceilometer/glossary.html#id3)

### agent
代理，运行在OpenStack架构中用来测量和发送监控结果到收集器的服务。

### API server
Ceilometer的HTTP REST API服务

### [ceilometer](http://en.wikipedia.org/wiki/Ceilometer)
本项目名称，来源于云高计/云幂测量仪，测量云底的高度的仪器

### central agent
中央代理，运行在OpenStack架构中中央管理节点上用来测量和发送监控结果到收集器的服务。

### collector
收集器，运行在OpenStack架构中的服务，用来监控来自其他OpenStack组件和监控代理发送来的通知，并且将其存入数据库中。

### compute agent
计算代理，运行再OpenStack架构中计算节点上的服务，用来测量和发送监控结果到搜集器中。

### data store
数据存储，搜集数据的存储系统。

### meter
计量值，被跟踪资源的测量值。一个实例有很多的计量值，比如实例运行时长、CPU使用时间、请求磁盘的数量等。在Ceilometer中有三种计量值：

- Cumulative: 累计的，随着时间增长(如磁盘读写)
- Gauge: 计量单位，离散的项目(如浮动IP，镜像上传)和波动的值(如对象存储数值)
- Delta: 增量，随着时间的改变而增加的值(如带宽变化)

### [non-repudiable](http://en.wikipedia.org/wiki/Non-repudiation)
"不可拒绝"

### project
项目，OpenStack中的租户或者项目。

### resource
资源，OpenStack中被计量的基本单位(如实例，卷，镜像等)

### sample
采样数据，一个详细的计量的采样数据。

### source
原始数据，计量数据的原始数据。这个字段一般默认为"openstack"，它可以通过ceilometer.conf文件中的counter_source来设置。

### user
OpenStack中的一个用户。
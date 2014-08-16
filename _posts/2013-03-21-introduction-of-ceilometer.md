---
layout: post
title: OpenStack Ceilometer项目简介
category: 技术
tags: OpenStack
description: OpenStack Ceilometer项目简介，转载自alexyang的博客
---

Ceilometer项目创建时最初的目的是实现一个能为计费系统采集数据的框架。在G版的开发中，社区已经更新了他们的目标，新目标是希望Ceilometer成为OpenStack里数据采集（监控数据、计费数据）的唯一基础设施，采集到的数据提供给监控、计费、面板等项目使用。

### Project Goal

For Grizzly, the new objective is The project aims to become the infrastructure to collect measurements within OpenStack so that no two agents would need to be written to collect the same data. It’s primary targets are monitoring and metering, but the framework should be easily expandable to collect for other needs. To that effect, Ceilometer should be able to share collected data with a variety of consumers.

In the 0.1 (folsom) release its goal was just to deliver a unique point of contact for billing systems to aquire all meters they need to establish customer billing, across all current and futureOpenStack core components.

**Wiki地址：** https://wiki.openstack.org/wiki/Ceilometer
**代码地址：** https://github.com/openstack/ceilometer
**文档地址：** http://docs.openstack.org/developer/ceilometer/

 

### 社区现状

目前Ceilometer项目有11000+ lines代码，16位贡献者，最近的活跃贡献者有7位。社区的Roadmap如下：

v1 delivered with Folsom with all functions required to collect base metering info and provide standard API access
v2 delivered with G as an incubated project with (subject to variation)
End-User API access to own metering information
Integration of information summary as an Horizon plugin
New agents for other OpenStack components (Quantum Engines? Heat? etc…)
Multi publisher to handle other usage for data collection
Individual frequency per meter
Move to core for H

### Ceilometer架构介绍

![Ceilometer架构介绍](http://yansu-uploads.stor.sinaapp.com/imgs/ceilometer-architecture.png)

### Ceilometer项目主要由Agent，Collector，DataStore，API和消息队列组成。

#### Agent

Agent的主要职责是周期性的从它管理的Plugin中轮询，触发查询，Plugin中有具体获取数据的逻辑。Ceilometer中的Agent分为Central Agent和Compute Agent。
Central Agent负责管理除了Compute（Nova）之外所有的Plugin，例如Swift，Cinder的Plugin。这些Plugin通过RPC调用相关服务的API并获取数据，然后将数据publish到Message Queue。Central Agent作为一个中心的数据采集调度器，之需要部署一个即可。
Compute Agent负责Compute节点的数据采集，在每一个Compute节点都需要部署一个Compute Agent。它一方主要负责周期性的采集Compute相关的数据并发布到MQ。
目前所规划的监控指标：http://docs.openstack.org/developer/ceilometer/measurements.html

#### Plugin

Ceilometer实现的Plugin框架依赖setuptools的Dynamic Discovery of Services and Plugins实现。这是Ceilometer能进行扩展的基础。Ceilometer中有四种类型的Plugin：Poller，Publisher，Notification和Transformer。

Poller主要负责被Agent调用去查询数据，返回Counter类型的结果给Agent框架；

- Notification负责在MQ中监听相关topic的消息（虚拟机创建等），并把他转换成Counter类型的结果给Agent框架。
- Transformer负责转换Counter（目前在代码中还没有发现具体用例）
- Publisher负责将Agent框架中Counter类型的结果转换成消息（包括签名），并将消息发送到MQ；
- Agent的Pipeline定义了这些插件之间的数据流。Agent的Plugin框架就向一个流水线，每个Plugin就像流水线上的工人。

#### Collector

Collector负责监听消息队列，将Publisher发布的消息（Meter Message）存储到DataStore。

#### DataStore

由MongoDB实现。

#### API

负责为其它项目提供数据，例如计费、面板等。

[原文地址](http://www.cnblogs.com/alexyang8/archive/2013/02/18/2915981.html)
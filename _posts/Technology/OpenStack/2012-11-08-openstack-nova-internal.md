---
layout: post
title: OpenStack Nova内部机制【译】
category: 技术
tags: OpenStack
description: 本文经原作者同意后进行转载和翻译
---

> 本文经原作者同意后进行转载和翻译，[原文链接](http://www.sandywalsh.com/2012/04/openstack-nova-internals-pt1-overview.html)

本人正在学习Openstack源码，为了自己学习和他人学习方便，故可能将一些国外优秀博客翻译转载。本人看英语文章基本顺利，但是翻译却不太在行，也希望通过这个方式提升一下英语水平，如果您发现我翻译后的文章问题太严重，尽管指出，谢谢！另外也希望志同道合的朋友一起探讨有关Openstack的问题!

作为 核心开发者 ，我已经为 Openstack 的 Nova 项目工作了18个月多。开始的时候这个项目很小，所以你可以很容易的从代码库找到你想要的东西。你的代码不必完全遵守 PEP8 即可提交。但是，对于任何一个项目来说，随着项目的深入，更多琐碎的问题将接踵而来。严格控制异常处理、并发、状态管理、同步异步操作及数据分区变得至关重要。作为核心开发者也越来越难以记住所有的规则，更不用说是一个新的贡献者，所以新的贡献者很难完成第一次提交。

出于这个原因，我想我会在我博客中写一些深入介绍Openstack项目的文章，帮助一些人少走弯路。在这开始，我需要先介绍一下Openstack源码布局和基础架构。

我将假设你懂得 Cloud IaaS (镜像管理、虚拟机管理器、实例管理、网络管理等概念)， Python (如果你是经验丰富的程序员，语言不是问题)还有基于事件驱动的框架(又叫做 Reactor pattern )。

### 源码布局

在你一拿到Nova的源码后，你会很容易的了解它的主要布局。

git clone https://github.com/openstack/nova.git
真正的Nova服务的代码在 ./nova 下，相应的单元测试在 ./nova/tests 下。这是一个简化的Nova源码目录结构：

    ├── etc
    │   └── nova
    ├── nova
    │   ├── api - the Nova HTTP service
    │   │   ├── ec2 - the Amazon EC2 API bindings
    │   │   ├── metadata
    │   │   └── openstack - the OpenStack API
    │   ├── auth - authentication libraries
    │   ├── common - shared Nova components
    │   ├── compute - the Nova Compute service
    │   ├── console - instance console library
    │   ├── db - database abstraction
    │   │   └── sqlalchemy
    │   │         └── migrate_repo
    │   │               └── versions - Schema migrations for SqlAlchemy
    │   ├── network - the Nova Network service
    │   ├── notifier - event notification library
    │   ├── openstack - ongoing effort to reuse Nova parts with other OpenStack parts.
    │   │   └── common
    │   ├── rpc - Remote Procedure Call libraries for Nova Services
    │   ├── scheduler - Nova Scheduler service
    │   ├── testing
    │   │   └── fake - “Fakes” for testing
    │   ├── tests - Unit tests. Sub directories should mirror ./nova
    │   ├── virt - Hypervisor abstractions
    │   ├── vnc - VNC libraries for accessing Windows instances
    │   └── volume - the Volume service
    ├── plugins - hypervisor host plugins. Mostly for XenServer.

深入看代码前，我们需要仔细了解Nova的架构。Openstack是多个服务的集合，一个服务意味着运行着的一个进程。根据部署Openstack的规模，决定了你是选择将所有服务运行在同一个机器上还是多个机器上。

Openstack的核心服务为: API、Compute、Scheduler和Network。你也可能需要管理主机镜像(可存储在 Swift Storage Service )的 Glance Image Service 。我们会在之后深入了解每一个服务，但是现在需要了解他们各自的任务是什么。 API是进入Nova的HTTP接口。Compute和虚拟机管理器交互来运行虚拟机（经常是一个主机一个Compute服务)。Network通过和交换机、路由器、防火墙以及相关设备来管理Ip地址池。Scheduler从可用池中选择最合适的计算节点来创建新的实例（它也可能用来选择Volumes）。

数据库本身不是Nova的服务之一。每一个Nova服务都可以直接访问数据库（尽管它不应该这样访问，我们正在修正这个问题）。如果一个计算节点被攻击，我们要避免它来访问数据库。

你可能单独的运行一个 Authentication 服务（像Kenstone） 或者负责管理硬盘的 Volume 服务，这都不是必须的。

Openstack Nova 使用 AMQP (特别是 RabbitMQ ) 作为服务之间的交流总线。AMQP 信息写入到专门的队列中，然后由专门的服务从中去走进行处理。这个决定了Nova的性能。如果你发现一个单一的计算节点不能处理所有的请求，你可以增加另外一个计算节点，其他服务也可以这么做。

如果AMQP是服务之间唯一的交互方式，那么用户如何执行指令？答案是API服务,它是一个HTTP服务（一个Python中的 WSGI 应用）。API服务监听HTTP上的 REST 命令并且将他们转换成相应服务的AMQP消息。同样的，来自服务的相应也通过 AMQP和API服务转换成HTTP相应返回给请求者。 OpenStack当前可以使用 EC2 （亚马逊API） 和 OpenStack （是 Rackspace API 的变种）。我们将在后面的文章中详细介绍API服务。

但是不仅仅是API可以和服务交互。服务之间也可以交互。Compute可能需要和Network和Volume交互来获得必须的资源。如果我们不关心怎么组织源码，这些功能会是代码有一点点凌乱。现在，我们开始深入了解服务和RPC机制。

### 注释

我将使用Python的单元测试模块，方法以及函数。特别的，nova.compute.api:API.run_instance 等同与 ./nova/compute/api.py文件中的run_instance方法。同样的，nova.compute.api.do_something指的是./nova/compute/api.py文件中的do_something函数。

和一个服务交互

除了API服务，每一个Nova服务必须有一个相应的Python模块来处理RPC命令的封装处理。例如：

Network服务 ./nova/network/api.py
Compute服务 ./nova/compute/api.py
Scheduler服务 ./nova/scheduler/api.py
…
这些模块通过集合大量函数来使服务正常工作。但是有的时候他们包含一些类来工作。这都依赖与我们是否需要截断一些服务对函数的调用。我们会在接下来接触这些用例。

Scheduler服务nova.scheduler.api可能有着最多的简单接口，包含最难的函数。

Network是一个有着唯一API类的服务，尽管它可以通过简单的函数被实现。

Compute有一个有趣的类层封装，如：

BaseAPI->API->AggregateAPI
BaseAPI->HostAPI
nova.compute.api.API 是类中的主力，我们将在以后做别的派生。

如果我想要暂停一个运行中的实例，我需要导入nova.compute.api，实例化API类并且调用pause()方法。这个过程将封装参数并且将它传送给Compute服务，由Compute通过相应的AMQP队列来管理那个实例。寻找相应的compute服务的AMQP是通过一个数据库的快速扫描实现的，这个方法在nova.compute.api:BaseAPI._cast_or_call_compute_message。对与其他服务也是这样，通过调用相应的api模块然后调用函数。

### Cast和Call

AMQP不是完全的 RPC 机制，但是我们可以从它那里获得类RPC特性。在nova.rpc._init_中有两个调用来操作cast()和call()。cast()在一个服务上执行异步的调用，而call()是一个同步的操作所以它需要一个返回值。call()真正做的是从服务动态创建一个短暂的AMQP来返回消息。它会一直等待一个 eventlet greenthread 直到接收到响应。

如果异常是源于nova.exception:NovaException的，那么它也可以通过这个响应传递以及在调用者方重生成/重抛出。否则，一个nova.rpc.common:RemoteError会被抛出。

理论上，我们将仅仅执行异步cast()来和服务通信，而call()很明耗费更大的代价。认真选择你需要的，如果可能，尽量不要依赖返回值。同时，尽量使你的函数是幂等的，因为它们可能会在未来一直执行。

如果你对rpc-over-amqp的工作原理感兴趣，多看看nova.rpc.impl_kombu

### Fail-Fast 系统架构

Openstack使用的是“快速失败”的系统架构。如果一个请求不成功，则马上返回一个一场丢给其调用者。但是，当一个Nova服务是eventlet中的一个操作时，它一般不会以我们希望的状态终止任何进程或离开系统。一个新的请求可以通过AMQP或HTTP非常容易的被处理。除非我们正在做的一件事情需要显示的进行清理。如果你期望字典中一个确定的值，一个关键错误弹出是正确的。对于不同的错误情况，你不需要常常派生一个独立的异常，甚至在最坏的情况下，WSGI中间件将把它转化成客户端可以处理的。对于事件驱动的编程这是很不错的方式，我们会在后续的文章中讲解nova的错误处理。

好了，这是一些Nova源码的布局和服务间如何通讯。下一此我们将探究服务管理器和驱动，来了解服务如何在被调用方实现。
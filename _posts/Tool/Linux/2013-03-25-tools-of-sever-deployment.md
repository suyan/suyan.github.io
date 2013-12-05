---
layout: post
title: 服务器自动化部署及运维常见工具
category: 工具
tags: Linux
description: 服务器自动化部署时，应用适当的工具，可以大大减轻工作量
---

## Cobbler

Cobbler是一个Linux的安装服务，它可以在网络环境下迅速安装。它可以将众多Linux任务关连在一起，这样在你安装或修改系统时，就可以不必在众多命令和应用程序之间切换了。

随着一系列简单的命令，可以配置网络安装PXE(Preboot Execute Environment)、重新安装、基于媒体的网络安装和虚拟化安装(支持Xen、qemu、KVM、和一些类型的VMware)。Cobbler使用一个叫做'koan'(和Cobbler交互)的程序来重新安装及虚拟化支持。

Cobbler是一个轻量级的应用程序(只有1.5万行Python代码)。它试图在小型和大型安装时都非常简单易用，而且容易工作、扩展和阅读。它避免成为"企业级"(像那么复杂)，但是它又拥有众多优秀的功能，非常适合在各种企业环境中使用，在重复性工作中节省大量的时间。

Cobbler可以选择性的帮助管理DHCP、DNS和yum包镜像基础设施，再者方面，它是一个更广义的自动化应用程序，而不仅仅只是处理配置。它还有一个轻量级的内置配置管理系统，以及整合与配置管理系统，像Puppet一样。Cobbler有一个命令行界面，一个网络界面，和许多用来访问配置的API。

## Puppet

puppet是一种Linux、Unix平台的集中配置管理系统，使用ruby语言，可管理配置文件、用户、cron任务、软件包、系统服务等。puppet把这些系统实体称之为资源，puppet的设计目标是简化对这些资源的管理以及妥善处理资源间的依赖关系。

Puppet是一个C/S架构的配置管理工具，在中央服务器上安装puppet-server软件包（被称作Puppet master）。在需要管理的目标主机上安装puppet客户端软件（被称作Puppet Client）。当客户端连接上Puppet master后，定义在Puppet master上的配置文件会被编译，然后在客户端上运行。每个客户端默认每半个小时和服务器进行一次通信，确认配置信息的更新情况。如果有新的配置信息或者配置信息已经改变，配置将会被重新编译并发布到各客户端执行。也可以在服务器上主动触发一个配置信息的更新，强制各客户端进行配置。如果客户端的配置信息被改变了，它可以从服务器获得原始配置进行校正。

## FUNC

func全称 Fedora Unified Network Controller ,主要用在Radhat, Fedora,OpenSuse,Centos系列系统上由一个server管理任意台服务器的工具,建立了Master-Slaves 主从SSL证书管控体系，可以将证书自动分发到所有受控服务.func直接发送远程命令或者远程获取数据,但是只适用于一些常用功能的模块的操作,实现其它功能需要自己写Python API,个人认为没有使用比较适当的”for do done”循环程序效果明确和方便.
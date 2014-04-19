---
layout: post
title: 在Mac下安装使用Vagrant
category: 工具
tags: [Mac, Vagrant]
keywords: Mac,Vagrant
description: 
---

> Vagrant是一款用来构建虚拟开发环境的工具，它其实算是一个跨平台的虚拟机管理工具。

## 安装

### 安装Vagrant
Vagrant的旧版本是可以通过gem来安装的，但是由于依赖实在太多，官方放弃了这种安装方式，建议下载官方安装包来安装。

下载地址在[http://www.vagrantup.com/downloads](http://www.vagrantup.com/downloads)。下载好pkg包后，点击安装即可。

### 安装Virtualbox
Vagrant依赖现有的虚拟机软件来管理虚拟机，如Virtualbox, Vmware Fusion, Parallel Desktop等，其中最方便的是VirtualBox，所以我选择了Virtualbox。

下载地址在[https://www.virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads)。同样下载好后直接安装。

## 使用

### 下载启动Box
在Vagrant中，box是一种打包好的镜像，通过这个镜像，可以生成相应的虚拟机。box可以通过[官方网站](http://www.vagrantbox.es/)下载，也可以自己制作，在团队内分享。

官方的Box可以在创建时自动下载。例如以下步骤

    cd ~/Documents/Vagrant/Ubuntu  # 进入一个vagrant虚拟机目录，一个目录管理一个虚拟机
    vagrant init hashicorp/precise32 # 创建一个ubuntu的虚拟机
    vagrant up # 启动这个虚拟机

通过这个步骤，vagrant会去box列表中找`hashicorp/precise32`这个镜像，如果没有就去官方下载。Box被保存在`~/.vagrant`下。通过命令

    vagrant box list 

可以查看已经下载的box。如果想以这个box再建立一个虚拟机，只要再创建一个目录，例如`~/Documents/Vagrant/Ubuntu32`，然后执行

    vagrant init hashicorp/precise32

即可。

### 操作虚拟机
操作虚拟机时，必须进入刚刚建立的目录中去，这个目录中必须含有`init`命令建立的Vagrantfile文件。常用命令有

    $ vagrant init  # 初始化
    $ vagrant up  # 启动虚拟机
    $ vagrant halt  # 关闭虚拟机
    $ vagrant reload  # 重启虚拟机
    $ vagrant ssh  # SSH 至虚拟机
    $ vagrant status  # 查看虚拟机运行状态
    $ vagrant destroy  # 销毁当前虚拟机

### 共享文件夹
通过Vagrant建立的虚拟机和Mac共享文件非常容易，虚拟机中`/vagrant`目录会映射到我们本地虚拟机目录中。例如

    cd ~/Documents/Vagrant/Ubuntu
    vagrant up
    vagrant ssh
    cd /vagrant
    ls

这个时候，我们会看到，这里显示的文件和`~/Documents/Vagrant/Ubuntu`下是一样的。

### 共享Box
如果只有上述功能的话，那么Vagrant的作用就不是那么`杀手级`了。通过命令

    vagrant package

可以将一个虚拟机打包成Box，供别人使用。别人只要用打包的box来创建一个虚拟机即可，例如

    vagrant box add myubuntu ~/Documents/Vagrant/Ubunutu/ubunut.box

## 参考

1. [Vagrant Docs](http://docs.vagrantup.com/v2/)
2. [使用 Vagrant 打造跨平台开发环境](http://blog.segmentfault.com/fenbox/1190000000264347)
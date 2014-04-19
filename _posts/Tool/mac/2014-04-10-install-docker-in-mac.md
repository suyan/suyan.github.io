---
layout: post
title: 在Mac下安装使用Docker
category: 工具
tags: [Mac, Docker]
keywords: Mac,Docker
description: 
---

## 安装
Docker暂时并不支持原生的Mac系统，所以Mac下的Docker实际上是依赖一个很小的linux虚拟机来实现的。

### 安装Virtualbox
Vagrant依赖现有的虚拟机软件来管理虚拟机，如Virtualbox, Vmware Fusion, Parallel Desktop等，其中最方便的是VirtualBox，所以我选择了Virtualbox。

下载地址在[https://www.virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads)。下载好后直接安装。

### 安装Boot2Docker
[Boot2Docker](https://github.com/boot2docker/boot2docker)是帮助控制虚拟机中Docker的工具，它会下载一个安装好docker的虚拟机，并控制其实现docker功能。

在mac下安装boot2docker只要执行

    brew install boot2docker

即可。

### 安装docker client
要想在mac下直接执行docker命令，需要安装一个适合mac的docker client，安装方法如下

    # Get the docker client file
    DIR=$(mktemp -d ${TMPDIR:-/tmp}/dockerdl.XXXXXXX) && \
    curl -f -o $DIR/ld.tgz https://get.docker.io/builds/Darwin/x86_64/docker-latest.tgz && \
    gunzip $DIR/ld.tgz && \
    tar xvf $DIR/ld.tar -C $DIR/ && \
    cp $DIR/usr/local/bin/docker ./docker

    # Set the environment variable for the docker daemon
    export DOCKER_HOST=tcp://127.0.0.1:4243

    # Copy the executable file
    sudo cp docker /usr/local/bin/

这样就有一个docker命令了

## 使用
使用docker安装需要先启动boot2docker虚拟机

    # Initiate the VM
    boot2docker init

    # Run the VM (the docker daemon)
    boot2docker up

    # To see all available commands:
    boot2docker

之后就可以使用docker命令了
    
    docker version

## 参考

1. [How To Install Docker On Mac OS X](http://docs.docker.io/en/latest/installation/mac/)
2. [boot2docker](https://github.com/boot2docker/boot2docker)
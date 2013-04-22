---
layout: post
title: 在虚拟机单机部署OpenStack
category: 技术
tags: OpenStack
description: 现在使用的是在Mac下的Vmware Fusion，其他平台基本过程应该都差不多
---

## 安装过程
### 安装Ubuntu
我手头有的是Ubuntu Server 12.10 32位版，就直接用了，默认安装即可，配置的时候很简单，如下

- 内存:1G
- 硬盘:20G
- 处理器:2
- 网络:NAT

装好以后登陆，执行以下命令

    sudo passwd root                   #设置root密码
    su                                 #以root登陆
    apt-get update                     #更新源
    apt-get install openssh-server     #确保安装了ssh
    apt-get install openssh-client     #确保安装了ssh
    apt-get install git                #安装git

### 利用devstack安装配置OpenStack
参考[devstack官网](http://devstack.org)
#### 下载devstack

    git clone https://github.com/openstack-dev/devstack.git

#### 配置devstack
虽然说可以直接默认运行了，但是配置一下总是比较放心。

进入devstack文件夹，创建一个localrc文件

    FLOATING_RANGE=192.168.0.224/27
    FIXED_RANGE=10.0.0.0/24
    FIXED_NETWORK_SIZE=256
    FLAT_INTERFACE=eth0
    ADMIN_PASSWORD=123qwe
    MYSQL_PASSWORD=123qwe
    RABBIT_PASSWORD=123qwe
    SERVICE_PASSWORD=123qwe
    enable_service ceilometer-acompute,ceilometer-acentral,ceilometer-collector,ceilometer-api
    SERVICE_TOKEN=123qwe

这里FLOATING_RANGE根据自己虚拟机的IP修改，因为我虚拟机IP为192.168.91.128，所以我希望公网为我自己机器所在的环境

FIXED_RANGE是指虚拟机刚刚创建时分IP的范围

我因为装了32位的ubuntu，所以下载镜像的时候也得是32位的，修改方法，备份一下stackrc文件，然后修改原来的文件中所有镜像名"x86_64"位"i386"，否则装完不能运行

#### 运行devstack
  
    ./stack.sh

等待安装完成即可
#### 使用OpenStack创建虚拟机

安装完成后创建虚拟机一切都正常，如果想要分配floating_ip，在安全组部分开放tcp和icmp端口，方法可以参考[这里](http://docs.openstack.org/trunk/openstack-compute/admin/content/enabling-ping-and-ssh-on-vms.html)

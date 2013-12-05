---
layout: post
title: 在虚拟机单机部署OpenStack Grizzly
category: 技术
tags: OpenStack
description: 安装openstack的基本组件，包括quantum、swift
---

## 安装过程
### 安装Ubuntu
我手头有的是Ubuntu Server 12.04 64位版，就直接用了，默认安装即可，配置的时候很简单，如下

- 内存:1G
- 硬盘:20G
- 处理器:2
- 网络:NAT

装好以后登陆，执行以下命令

    sudo passwd root                   #设置root密码
    su                                 #以root登陆
    apt-get update                     #更新源
    apt-get install git                #安装git

### 利用devstack安装配置OpenStack
参考[devstack官网](http://devstack.org)
#### 下载devstack

    git clone https://github.com/openstack-dev/devstack.git

#### 配置devstack
进入devstack文件夹，创建一个localrc文件

    # 基本配置
    FLOATING_RANGE=192.168.0.224/27
    FIXED_RANGE=10.0.0.0/24
    NETWORK_GATEWAY=10.0.0.1
    FIXED_NETWORK_SIZE=256
    FLAT_INTERFACE=eth0

    ADMIN_PASSWORD=123qwe
    MYSQL_PASSWORD=123qwe
    RABBIT_PASSWORD=123qwe
    SERVICE_PASSWORD=123qwe
    SERVICE_TOKEN=123qwe
    # 启用ceilometer
    enable_service ceilometer-acompute
    enable_service ceilometer-acentral
    enable_service ceilometer-collector
    enable_service ceilometer-api
    # 启用quantum
    disable_service n-net
    enable_service q-svc
    enable_service q-agt
    enable_service q-dhcp
    enable_service q-l3
    enable_service q-meta
    enable_service quantum
    # 启用swift
    enable_service swift
    SWIFT_HASH=66a3d6b56c1f479c8b4e70ab5c2000f5
    SWIFT_REPLICAS=1
    SWIFT_DATA_DIR=$DEST/data
    # 启用负载均衡
    enable_service sysstat
    enable_service q-lbaas
    # 日志文件
    LOGFILE=$DEST/logs/stack.sh.log
    VERBOSE=True
    LOG_COLOR=False
    SCREEN_LOGDIR=$DEST/logs/screen

如果使用32位的ubuntu，所以下载镜像的时候也得是32位的，修改方法，备份一下stackrc文件，然后修改原来的文件中所有镜像名"x86_64"位"i386"，否则装完不能运行

如果想选择固定版本号，可以类似

    GLANCE_BRANCH=stable/essex
    HORIZON_BRANCH=stable/essex
    KEYSTONE_BRANCH=stable/essex
    NOVA_BRANCH=stable/essex
    QUANTUM_BRANCH=stable/essex
    SWIFT_BRANCH=1.4.8

#### 运行devstack

    ./stack.sh

安装过程中会创建一个stack账户，这个账户安装最后好像会有一些问题，所以可以在它创建完成后手动切换过去

    sudo passwd stack
    su stack

如果之后无法执行`nova list`等命令，可以使用下面命令来导入环境变量

    export SERVICE_TOKEN=123qwe
    export OS_TENANT_NAME=demo
    export OS_USERNAME=demo
    export OS_PASSWORD=123qwe
    export OS_AUTH_URL=http://localhost:5000/v2.0/
    export SERVICE_ENDPOINT=http://localhost:35357/v2.0


#### 使用OpenStack创建虚拟机

安装完成后创建虚拟机一切都正常，如果想要分配floating_ip，在安全组部分开放tcp和icmp端口，方法可以参考[这里](http://docs.openstack.org/trunk/openstack-compute/admin/content/enabling-ping-and-ssh-on-vms.html)

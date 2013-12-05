---
layout: post
title: 部署Ceilometer到已有环境中
category: 技术
tags: OpenStack
keywords: 部署,Ceilometer,OpenStack
description: Multihost的OpenStack环境基本稳定，应该把Ceilometer也部署上去了，前后折腾了几次，总算部署完成
---

## 安装必要组件

首先要把必备组件安装好，因为OpenStack Grizzly是基于Ubuntu包安装的，所以Ceilometer也依赖这种方式

OpenStack具体Grizzly搭建方式参考[OpenStack Grizzly Multihost部署文档](/2013/05/13/openstack-grizzly-multihost-deployment-doc.html)

### 所有节点

所有节点都必须安装以下两个包，它们是Ceilometer的基础依赖

    apt-get install python-ceilometer 
    apt-get install ceilometer-common

### 控制节点

首先将MongoDB安装在控制节点，方便数据存取

    apt-get install mongodb

控制节点需要安装Collector和Api服务

    apt-get install ceilometer-api
    apt-get install ceilometer-collector

另外把Agent Central也装在控制节点

    apt-get install ceilometer-agent-central

最后还有Ceilometer的Client部分，用来执行CLI命令

    apt-get install python-ceilometerclient

### 计算节点

计算节点只需要再安装Agent Compute即可

    apt-get install ceilometer-agent-compute

## Ceilometer配置

安装过程相对简单，但是如何获取监控数据以及如何进行存取呢？

首先得对OpenStack进行配置，让它们将Ceilometer所需数据通过notification发送到消息队列中，然后再对Ceilometer进行设定，实现各个服务之间的正常通信

### Glance配置

我的环境中使用的是rabbit，所以修改glance-api.conf配置:

    notifier_strategy = rabbit

### Cinder配置

修改cinder.conf配置：

    notification_driver=cinder.openstack.common.notifier.rabbit_notifier
    control_exchange=cinder

### Nova配置

修改nova.conf配置：

    instance_usage_audit=True
    instance_usage_audit_period=hour
    notify_on_state_change=vm_and_task_state
    notification_driver=nova.openstack.common.notifier.rpc_notifier
    notification_driver=ceilometer.compute.nova_notifier

### Keystone配置

创建ceilometer的server

    keystone service-create --name=ceilometer \
                            --type=metering \
                            --description="Ceilometer Service"

创建一个ceilometer的endpoint

    keystone endpoint-create --region RegionOne \
                             --service_id $CEILOMETER_SERVICE \
                             --publicurl "http://$SERVICE_HOST:8777/" \
                             --adminurl "http://$SERVICE_HOST:8777/" \
                             --internalurl "http://$SERVICE_HOST:8777/"

### Ceilometer配置

修改ceilometer.conf的配置

    debug=true
    verbose=true
    auth_strategy=noauth
    rabbit_host=$CONTROLLER_HOST
    database_connection=mongodb://localhost:27017/ceilometer
    os_username=$ADMIN_USERNAME
    os_tenant_name=$TENANT_NAME
    os_password=$ADMIN_PASSWORD
    os_auth_url=http://${CONTROLLER_HOS}:5000/v2.0/

## 重启服务

### 控制节点

重启三个服务

    service ceilometer-agent-central restart
    service ceilometer-api restart
    service ceilometer-collector restart

### 计算节点

重启服务

    service ceilometer-agent-compute restart

## 总结

整个过程安装比较顺利，但是配置的时候可能会出现通信问题，这个时候好好研究研究文档是正事。

这个配置仅限于测试环境，对于生产环境安装和配置都根据情况来改变
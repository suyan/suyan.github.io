---
layout: post
title: Ceilometer的命令行使用
category: 技术
tags: [OpenStack , Ceilometer]
description: Ceilometer项目当前是做了CLI接口的，但是在文档中并没有写出来，好在ceilometerclient并不是很复杂，读一读代码就可以了解具体的使用方式了
---

官方文档位置[这里](http://docs.openstack.org/developer/ceilometer/)

全部接口可以根据阅读以下代码文件来获取
    
    ceilometerclient.shell.py  //一级命令
    ceilometerclient.v1.shell.py   //v1二级命令
    ceilometerclient.v2.shell.py   //v2二级命令

我下面只列出我自己用的v2命令

## 常用一级命令
  
首先配置环境变量，下面几个基本是必须的，也可以通过配置项传入
    
    OS_USERNAME
    OS_PASSWORD
    OS_TENANT_NAME
    OS_AUTH_URL
    CEILOMETER_API_VERSION   //默认为1，测试不可用……，需要--ceilometer-api-version参数来控制

常用的命令

    ceilometer    //查看帮助和二级命令

> 现在经测试，非admin用户无法使用v2接口，原因是v1和v2的acl.py文件并不相同，如果不是admin用户v2会直接抛出异常，这个也可以通过修改policy.py代码来控制

## 二级命令

二级命令可以查看收集器搜集的数据，官方说H版本会弃用v1版本接口，所以推荐使用v2接口，相应参数及-q选项可以查看代码，再fields变量中有定义

    ceilometer --ceilometer-api-version 2 meter-list   //列举所有测量值
    ceilometer --ceilometer-api-version 2 meter-list -q resource_id=XXX  //列举某一实例测量值

    ceilometer --ceilometer-api-version 2 sample-list -m cpu -q resource_id=XXX    //列举某一实例的cpu采样数据

    ceilometer --ceilometer-api-version 2 statistics -m cpu     //列举实例的统计数据
  
    ceilometer --ceilometer-api-version 2 resource-list  //列举所有实例列表


    



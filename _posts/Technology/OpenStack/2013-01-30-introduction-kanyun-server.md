---
layout: post
title: kanyun server服务
category: 技术
tags: OpenStack
description: kanyun中server服务主要运行在控制节点，用来处理来自计算节点worker的数据
---

## 数据接收和存储

数据接收使用

    msg_type, report = socket.recv_multipart()

获得数据类型和内容，然后再使用

    plugins[msg_type](app=app, db=db, data=data)

调用相应的函数，处理数据

从MYSQL数据库中获得相应实例的uuid，作为cassandra的key，即每一row存储一个虚拟机数据

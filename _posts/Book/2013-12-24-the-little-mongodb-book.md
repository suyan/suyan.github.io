---
layout: book
title: The little mongodb book
status: reading
category: 读书
tags: 
keywords: mongodb
author: Karl Seguin
publisher: github
language: English
link: https://github.com/karlseguin/the-little-mongodb-book/blob/master/en/mongodb.markdown
cover: https://raw.github.com/justinyhuang/the-little-mongodb-book-cn/master/title.png
description: 
---

> 这本书非常之简洁，读起来非常易懂，其实这还归功于MongoDB的简洁。NoSQL与MySQL最大的区别在于它是为一些特定的场景设计的，如MongoDB、Redis、Cassandra等。MongoDB是其中更加通用的一个方案，从MySQL往MongoDB转，几乎不需要太大变化。

## 准备
在Mac下安装mongo最简单的方式就是

    brew install mongodb #安装mongo
    mongod --fork #后台运行mongo

## 基础
了解MongoDB先要基本概念开始：

- 数据库(database)：类似于MySQL的数据库
- 集合(collection)：数据库里可以有多个集合，类似于MySQL中的表table
- 文档(document)：集合中可以有多个文档，类似于MySQL中的行row
- 域(field)：文档中可以有多个域，类似于MySQL中的column
- 索引(index)：同MySQL中的索引
- 游标(cursor)：每次检索数据的返回值

在测试Mongo时可以直接在命令行执行Mongo的shell命令，它建立在javascript之上。如：

    mongo #启动shell
    help #查看帮助
    show dbs; #显示所有数据库
    db.help() #查看db命令帮助
    db.help #查看db.help函数实现方式

接下来可以尝试一下数据库的操作了
    
    use learn #使用learn数据库，没有则创建
    db.unicorns.insert({name: 'Aurora', gender: 'f', weight: 450}) #插入一个数据
    db.unicorns.find() #查看所有数据

每一个文档在插入时都必须有一个`_id`域，如果没有的话会自动生成，例如上面最后一条命令得到的结果如下

    { "_id" : ObjectId("52b8fdb6a52cdcfee599b045"), "name" : "Aurora", "gender" : "f", "weight" : 450 }

默认情况下`_id`域都会被默认索引，使用命令

    db.system.indexes.find()
    { "v" : 1, "key" : { "_id" : 1 }, "ns" : "learn.unicorns", "name" : "_id_" }

可以看到这里建立了`_id`在`learn.unicorns`中的索引。

MongoDB的一个很重要的特性是`无模式`，即每一个文档不需要拥有完全相同的域，我们再插入一个文档

    db.unicorns.insert({name: 'Leto', gender: 'm', home: 'Arrakeen', worm: false})

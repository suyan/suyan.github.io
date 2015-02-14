---
layout: post
title: 调试和修改OpenStack中的Horizon部分
category: 技术
tags: OpenStack
description: 在OpenStack二次开发中，Horizon肯定是常常要修改的部分，简要说一下我自己调试和修改的方式
---

## 进入调试模式
Horizon在python的django框架上进行开发，所以可以利用django的manage.py来进行调试。

方式：

- 关闭apache
- 进入Horizon目录
- 执行命令manage.py runserver 0.0.0.0:80

这样修改的代码立刻就可以实现，不用每次都重启apache了

## 查看变量方式
再没有使用调试模式时，可能需要使用

    import logging
    logging.info('xxx')

来打日志查看一些变量或者输出，这样显然是比较低效的。推荐的做法是开启调试模式，直接print变量，在终端中直接查看。

另外也可以利用assert命令来查看，因为django本身提供了强大的错误输出界面，再想要查看变量的地方之后，增加

    assert False

即可输出trace错误界面，在界面中查看变量即可

## 经常查看文档
OpenStack的文档越来越完善，在Horizon部分有详细的二次开发文档，具体可以查看[官方文档](http://docs.openstack.org/developer/horizon/)
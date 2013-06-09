---
layout: post
title: 学习Python动态扩展包stevedore
category: Technology
tags: Python
keywords: [Python , Stevedore , OpenStack]
description: 在阅读OpenStack项目Ceilometer代码时，发现其利用stevedore来实现动态扩展，故需要先学习一下stevedore机制。
---

### 1.stevedore作用
Python导入动态代码很容易，例如通过在运行时导入扩展插件来扩展你的应用。许多应用通过`__import__`或importlib实现了这个功能。[stevedore](http://stevedore.readthedocs.org/en/latest/index.html)的功能就是管理扩展的，但是它的实现方式是借助steuptools的entry points（我的[上一篇](2013/06/07/learn-python-setuptools-in-detail.html)有讲entry points功能）。

### 2.创建一个插件
这里以一个格式转换的例子来学习：

    # stevedore/example/base.py
    import abc


    class FormatterBase(object):
        """Base class for example plugin used in the tutoral.
        """

        __metaclass__ = abc.ABCMeta

        def __init__(self, max_width=60):
            self.max_width = max_width

        @abc.abstractmethod
        def format(self, data):
            """Format the data and return unicode text.

            :param data: A dictionary with string keys and simple types as
                         values.
            :type data: dict(str:?)
            :returns: Iterable producing the formatted text.
            """

首先创建一个基类，来作为虚拟基础类，供插件们继承并实现其中方法，
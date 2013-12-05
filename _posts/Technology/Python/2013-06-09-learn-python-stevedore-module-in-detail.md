---
layout: post
title: 学习Python动态扩展包stevedore
category: 技术
tags: Python
keywords: Python,Stevedore,OpenStack
description: 在阅读OpenStack项目Ceilometer代码时，发现其利用stevedore来实现动态扩展，故需要先学习一下stevedore机制。
---

### 1.stevedore作用
Python导入动态代码很容易，例如通过在运行时导入扩展插件来扩展你的应用。许多应用通过`__import__`或importlib实现了这个功能。[stevedore](http://stevedore.readthedocs.org/en/latest/index.html)的功能就是管理扩展的，但是它的实现方式是借助steuptools的entry points（我的[上一篇](/2013/06/07/learn-python-setuptools-in-detail.html)有讲entry points功能）。

### 2.创建一个插件
这里以一个格式转换的例子来学习：

    # stevedore/example/base.py
    import abc
    class FormatterBase(object):
        __metaclass__ = abc.ABCMeta

        def __init__(self, max_width=60):
            self.max_width = max_width

        @abc.abstractmethod
        def format(self, data):
            pass

首先创建一个基类，来作为虚拟基础类，供插件们继承并实现其中方法。这个例子中的关键函数为format，其子类都需要实现这个函数。

有关虚拟基础类的内容在我之前的[一篇](/2013/06/09/learn-python-abc-module.html)博客中也说到。

接下来是实现功能的两个插件类：

    # stevedore/example/simple.py
    from stevedore.example import base
    class Simple(base.FormatterBase):
        def format(self, data):
            for name, value in sorted(data.items()):
                line = '{name} = {value}\n'.format(
                    name=name,
                    value=value,
                )
                yield line

另一个：

    # stevedore/example/fields.py
    import textwrap
    from stevedore.example import base
    class FieldList(base.FormatterBase):
        def format(self, data):
            for name, value in sorted(data.items()):
                full_text = ': {name} : {value}'.format(
                    name=name,
                    value=value,
                )
                wrapped_text = textwrap.fill(
                    full_text,
                    initial_indent='',
                    subsequent_indent='    ',
                    width=self.max_width,
                )
                yield wrapped_text + '\n'

这两个插件以不同的方式对传入的数据进行格式化，并且都实现了format方法，接下来是在`setup.py`中注册插件：

    # stevedore/example/setup.py
    from setuptools import setup, find_packages
    setup(
        ...
        entry_points={
            'stevedore.example.formatter': [
                'simple = stevedore.example.simple:Simple',
                'field = stevedore.example.fields:FieldList',
                'plain = stevedore.example.simple:Simple',
            ],
        },
    )

这个例子可以看到，我们设定了三个接口，simple/field/plain，其他应用或者自身都可以对它们进行调用。如果不用stevedore的话，直接使用`pkg_resources.require()`调用他们，但是stevedore有了一个更好的机制来管理和使用他们

### 3.导入插件
stevedore定义了一系列类来帮助更好的调用上面生成的插件

#### 以Driver方式调用
这种方式经常被使用，即我们有多个方法可以做成一件事，但是我们只用其中一种就够了，通过stevedore的`DriverManager`可以做到，如下：

    # stevedore/example/load_as_driver.py
    from __future__ import print_function
    import argparse
    from stevedore import driver
    if __name__ == '__main__':
        parser = argparse.ArgumentParser()
        parser.add_argument(
            'format',
            nargs='?',
            default='simple',
            help='the output format',
        )
        parser.add_argument(
            '--width',
            default=60,
            type=int,
            help='maximum output width for text',
        )
        parsed_args = parser.parse_args()
        data = {
            'a': 'A',
            'b': 'B',
            'long': 'word ' * 80,
        }
        mgr = driver.DriverManager(
            namespace='stevedore.example.formatter',
            name=parsed_args.format,
            invoke_on_load=True,
            invoke_args=(parsed_args.width,),
        )
        for chunk in mgr.driver.format(data):
            print(chunk, end='')

这里关键的位置在mgr生成部分，首先根据namespace获得相应entry point组，然后根据name调用响应的plugin

例如`python -m stevedore.example.load_as_driver a = A`即以默认的name调用plugin，默认的format为simple。`python -m stevedore.example.load_as_driver field`为调用field的plugin

#### 以Extensions方式调用
另外一种常见的方式是调用多个plugin共同处理一件事情，这可以利用`ExtensionManager`、`NamedExtensionManager`、`EnabledExtensionManger`来实现

    # stevedore/example/load_as_extension.py
    from __future__ import print_function

    import argparse

    from stevedore import extension


    if __name__ == '__main__':
        parser = argparse.ArgumentParser()
        parser.add_argument(
            '--width',
            default=60,
            type=int,
            help='maximum output width for text',
        )
        parsed_args = parser.parse_args()

        data = {
            'a': 'A',
            'b': 'B',
            'long': 'word ' * 80,
        }

        mgr = extension.ExtensionManager(
            namespace='stevedore.example.formatter',
            invoke_on_load=True,
            invoke_args=(parsed_args.width,),
        )

        def format_data(ext, data):
            return (ext.name, ext.obj.format(data))

        results = mgr.map(format_data, data)

        for name, result in results:
            print('Formatter: {0}'.format(name))
            for chunk in result:
                print(chunk, end='')
            print('')

这里ExtensionManger的参数只需要namespace，因为它将使用这个entry point组中的所有插件，并且通过mgr.map()来为每一个plugin传递参数

#### 其他
除了上面提到的几种方式外，还有[其他](http://stevedore.readthedocs.org/en/latest/managers.html)几种可以使用，具体可以自己研究了~
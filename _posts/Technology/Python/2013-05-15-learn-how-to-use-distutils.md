---
layout: post
title: 学习使用python打包工具distutils
category: 技术
tags: Python
description: 本来是要学习distutils2，未来这个才是主流，但是悲催的是Ubuntu12.04 上 Python2.7环境装distutils2竟然不能用，搜了半天也没看到解决办法。只好先学习distutils，以后用到Python3的时候再继续学习吧
---

## 安装和了解distutils
python中自带了distutils，直接用
  
### 使用步骤

- 写一个安装脚本(setup.py)
- (可选)写一个安装配置文件
- 创建一个源码分布
- (可选)创建一个或多个编译过的二进制分布

### 一个简单的例子

    from distutils.core import setup
    setup(name='test',
          version='1.0',
          py_modules=['test'],
          )

### 常见的python术语

- module 组件 Python中可重用代码的基本单位，这里主要介绍纯python组件、扩展组件和包
- pure Python module 纯Python组件 完全由python写成的组件
- extension module 扩展组件 由低级语言(C,C++)等写成的组件
- package 包 一个含有别的组件的组件。通常包含在文件系统的目录下，并且显示声明在`__init__.py`文件中
- root package 根包。 在根目录sys.path下的包

### distutils特有的包

- module distribution 组件分布 一个可以安装的一系列组件的合集
- pure module distribution 纯组件分布 
- non-pure module distribution 不纯组件分布，含有扩展组件
- distribution root 你的源码最高级的目录，即`setup.py`所在目录

## 编写安装脚本

    #!/usr/bin/env python

    from distutils.core import setup

    setup(name='test',
          version='1.0',
          description='test package',
          author='Su Yan',
          author_email='yansu0711@gmail.com',
          url='http://www.yansu.org',
          packages=['test'],
          scripts=['scripts/test.sh']
         )

这个例子包含了一些详细的信息，在packages中可以利用`os.listdir(os.path.join('mydir','subdir'))`等函数添加目录下全部目录。

在packages中包含的目录中，最好有`__init__.py`来声明它是一个包，如果没有，会有异常提醒

scripts这项指，如果你的包有执行文件，可以讲其复制到`/usr/local/bin`下






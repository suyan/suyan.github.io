---
layout: post
title: 交互式编程-IPython
category: 技术
tags: Python
description: python作为一个脚本语言，最大的好处就是非常方便的编译执行过程。而合理利用ipython，更能让想法的实现速度提高一大截
---

## [IPython](http://ipython.org/)简介

IPython最大的特性是它的交互式翻译器。这个系统允许我们以最快的速度测试自己的想法，而不是创建一个文件然后编译执行。

IPython的目标是创建一个交互式计算和探索式计算的全面环境。为了支持这个目标，IPython有两个重要组件：

- 一个增强的交互式python shell
- 一个交互式的并行计算架构

参考：[IPython Introduction](http://ipython.org/ipython-doc/stable/overview.html)

## 安装IPython

ubuntu下直接apt-get install ipython即可，其他可以参考[install ipython](http://ipython.org/ipython-doc/stable/install/install.html)

## 使用IPython

### 自动补全
使用`tab`可以直接对已打出的对象或变量进行补全

### 魔术关键字
魔术关键字以`%`开头，如果`automagic`打开了，则不用输入`%`,否则需要，使用`automagic`可以切换状态

- `env` 显示环境变量
- `ed`或`edit` 编辑一个文件并执行
- `ed -x filename` 编辑文件不执行
- `edit 3:10` 编辑3:10行的指令并执行
- `hist` 显示历史纪录，可以用-n增加行号
- `hist 3:10` 显示3-10行的历史纪录
- `bg function` 把function函数放到后台执行
- `pwd` 当前目录
- `pycat filename` 语法高亮显示一个文件
- `macro name 1:10` 把1:10行的代码设为name宏
- `save filename 1:10` 把1:10行代码保存到文件中
- `time statement` 计算一段代码执行时间
- `timeit statement` 自动选择重复和循环次数计算一段代码执行时间
- `run filename` 执行一个文件，如果希望防止执行的，需要增加`if __name__ == "__main__":`
- `autoindent` 如果启用，粘贴的时候会自动缩进代码
- `reset` 重置所有变量

### Bash命令
使用`!`做前缀可以执行shell命令，还可以用`$`来转换python变量，如下

    for i in range(10):
      s = "dir%s" % i
      !mkdir $s

    for i in !ls:
      print i

另外，如果普通的shell命令有`$`的话，必须增加两个`$$`，如果原来是`echo $PATH`，需要写成`!echo $$PATH`

### 打印对象属性
使用`dir`可以将对象属性打印出来，如

    import os
    dir(os)





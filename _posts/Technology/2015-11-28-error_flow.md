---
layout: post                                   
title: 错误处理
category: tech                                
tags: [error flow]
keywords: error flow
description:  
--- 

## Standard streams

电脑可以抽象成一个 “输入 =》 处理 =》 输出”的模型。在标准输入输出模型里面，定义了 stdin(0), stdout(1) 和 stderr(2)。

对于程序而言，也可以做同样的抽象，如下图。

> [链接](https://en.wikipedia.org/wiki/Standard_streams)

![](http://going1000sblog-image.stor.sinaapp.com/error_flow.002.jpeg)

写程序的人，希望自己的代码行云流水（只处理正确流程）。但是，大家都知道，可以预见、以及未能预见的错误，总是不断出现。所以怎么去处理错误，是值得好好研究的。

## exception or not ?

异常是个有争议的东西。喜欢的人认为它是一个处理错误流程的好方式，不喜欢的人认为它扰乱了程序流程，使得代码难以跟踪。也有一些人觉得异常会影响性能。这个作者认为并不是一个关键因素。

作者本人是比较喜欢使用异常的。原因下面几个：

1. 它将错误流程的处理独立出来，使得代码更简洁
2. 它将错误的处理集中起来，代码更集中
3. 对于层级比较深的代码，它的处理更加方便

然而，凡事都是双面的。exception有它的问题：

1. throw 之后，代码流就无法跟踪了。这可以认为是最大的问题，可以说对调试造成了很大困扰。必须使用ide或则类似工具
2. 在什么地方catch，是一个问题。这一点，其实需要编程者清楚认识错误的种类，哪些是要catch的，在那一层catch？
3. 错误的预先定义。这一点，可以说好，也可以认为不好。不好在于它违反编程流程，要求预设错误种类，而很多错误种类是没有预先想到的。那么更改的时候，就不免会更改到外层catch逻辑。

## 一个错误处理流程

这部分的目的，是给出一些实践方式。因为作者php比较熟练，所以使用php来演示逻辑。

### 1. 最外层的统一 catch, 利用 trace 追踪

1. 这部分很简单，就是将所有代码用 try 裹起来。
2. 正确输出和错误输出分离开——正确输出用return，错误输出用throw。
3. 将error msg和error trace做日志，加上监控。

### 2. 定义基本的exception类，外层分类别catch

1. 定义exception类

		定义 Base_Exception (继承重写 Exception)
		定义 Exception_Db (继承 Base_Exception)
		定义 Exception_Param (继承 Base_Exception)

2. 外层分类别catch

		try {
			// main process
			
		} catch (Exception_Param $param_e) {
			// handle
			
		} catch (Exception_Db $db_e) {
			// handle
			
		} catch (Base_Exception $unkown_e) {
			// unkown error handle	
			
		}

### 3. 错误输出的工厂

1. 直接输出
2. 输出到日志
3. 有效果数据

### 4. 一张流程图

![](http://going1000sblog-image.stor.sinaapp.com/error_flow.003.jpeg)
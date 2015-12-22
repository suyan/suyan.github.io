---
layout: post
title: 关于js中console.log的undefined提示
category: 技术
tags: js,console,undefined
description: 关于js中console.log显示的undefined提示，你有觉得困惑过吗？这里有详解
---

### 问题重现

    -----------------------------------
    console.log(123);
    -----------------------------------
    123                        VM1935:2 
    undefined

### 问题说明

坦白讲对于正在阅读此文的你来说，也许这不算是一个问题，正如，我以前编写js测试的时候因为赶时间，而直接忽略了这个细节。现在我在自学node的过程中，看到这个undefined，刺激着我的神经，始终觉得有BUG，不过瘾，于是，问题来了……

这个到底是什么？要如何才能理解它，最好是不出现它呢？

### 分析原因

In the console you can type a name of a variable (for example try typing window) and it prints info about it. When you run any void function (like console.log) from the console, it also prints out info about the return value, undefined in this case.

### 示例说明

    -----------------------------------
    function tt(){
      var cc=console.log(123);
      return 456;
    }
    -----------------------------------
    undefined
    -----------------------------------
    tt()
    -----------------------------------
    123                        VM1879:3
    456
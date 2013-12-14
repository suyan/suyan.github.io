---
layout: post
title: Linux下多个命令连续执行方法
category: 工具
tags: Linux
keywords: Linux,连续,命令
description: 
---

>有的时候执行一些简单指令的时候总不想分好几次输入，利用以下方法可以方便的一次执行多个命令

### 连续不中断执行
用`;`可以让多个命令连续知行，中间出现错误并不会中断后面命令，如

    mkdir test; mkdir test; rmdir test;

虽然第二条指令会报错，但是不会影响后面的指令，最后test目录不存在

### 出错停止后面指令
用`&&`分割的命令，如果没有错误会一直执行下去，出现错误立即中止，如

    mkdir test && mkdir test && rmdir test

这回在第二个指令处就中止了

### 一次正确即停止
用`||`分割的命令，如果有错误就一直执行下去，直到一次正确立即中止，如

    mkdir test || mkdir test || rmdir test
    mkdir test || mkdir test || rmdir test || mkdir test

第一次执行第一条指令就正确，后面的不执行

第二次执行前两条都错误，直到最后一条才正确，最后一条不再执行
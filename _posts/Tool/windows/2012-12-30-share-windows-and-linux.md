---
layout: post
title: Windows和Linux切换最终解决方案
category: 工具
tags: [Windows , Linux]
description: 如果你也像我一样经常工作于Windows和Linux，那么这篇文章值得一看
---

## 尝试和选择

一台机器使用Windows和Linux一般有以下几个方式：

- Windows和Linux真正的双系统，开机两个引导
- Linux下虚拟Windows（一般是xp）
- Windows下虚拟Linux

除了以上几个，还有一些其他方法，都没啥映像，在此不讨论。

选择两个系统无非是因为工作原因，Linux下开发，Windows下娱乐或者Word等。出现这种矛盾实在是纠结，在尝试过上述三种方案以后，我选择了在Windows下虚拟一个Linux，原因如下：

- 使用Vmware虚拟实在是比Virtual Box好用（主要是功能）
- Windows下的软件体验真的不错，而且是越来越好。虽然Linux下有各种开源软件功能一点都不差，但是你无法逃避的现实就是，用户体验真的不够。
- 双系统经常切换非常麻烦
- Windows系统问题，虚拟出来的真的不好用
- Linux真正需要的，字符界面就够用，所以一般不需要占太大资源

根据这几点，结果就定了，那么Windows下虚拟Linux怎样做最好呢?

## 配置

1. 安装vmware
    安装过程不多说，提醒一点就是，记得在配置中设置，关闭vmware后不关闭运行的虚拟机，原因待会说。
2. 安装ubuntu server 
    我选择了ubuntu server最小化安装，不安装x window，结果就是512内存和1cpu就顺畅运行，做各种开发木有问题
3. 安装securecrt或者putty
    vmware下直接用字符界面很蛋疼，没有全屏，所以使用securecrt来连接linux，这就是为啥第一步关闭vmware后还留下虚拟机。这么做可以让资源尽可能充足应用。
4. 给Linux共享文件
    在字符界面下安装vmtools不是很容易，方法请参考我的另外一篇文章[给Vmware下的Ubuntu Server共享文件](http://yansublog.sinaapp.com/2012/12/17/%e7%bb%99vmware%e4%b8%8b%e7%9a%84ubuntu-server%e5%85%b1%e4%ba%ab%e6%96%87%e4%bb%b6/ "给Vmware下的Ubuntu Server共享文件")。这么做主要是为了在Windows下些代码，在Linux上运行

## 总结

我是个实用主义，怎么顺手怎么来，如果你希望使用Windows下的软件，又无法离开Linux开发（有自己的服务器除外），那么这样的方式挺好。
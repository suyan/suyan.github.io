---
layout: post
title: Centos 常用资源
category: 资源
tags: Centos
keywords: Centos
description: 
---

## 官方资源

  [官方首页](http://www.centos.org) [官方下载](http://www.centos.org/download) [中文论坛](http://cncentos.com/forum.php) [我的软件共享](http://pan.baidu.com/s/1eQzuFGQ)

## 选择理由

- 服务器主流操作系统
- 省资料，反应快
- 原生自带的输入法特别好用，一点不输windows搜狗
- 稳定
- 也许有一天你会发现最好用的桌面系统原来TM的是centos

## 安装

  这个过于简单，我这里就不多说了，我使用的是centos7.1。另外由于个人喜好，我这里选择了gnome的桌面环境（个人对比了KDE，感觉gnome才是centos原生推荐桌面，适配更好）。两点注意：安装的时候记得开启BIOS中的硬件虚拟(模拟)的选项；如果仍然出现黑屏，就在启动项 quite 后加上 acpi=off 的参数。至此，我这里已经完全安装成功了。

## 关于代理

    yum install pptp pptp-setup #安装pptp
    pptpsetup --create test --server ip地址 --username test --password test --start #命令行模式
    yum install NetworkManager-vpnc NetworkManager-pptp NetworkManager-openvpn NetworkManager-openswan #图形界面模式

## 开发软件包

    yum install git git-svn gitk docker #安装好必备开发工具
    service docker start #启动docker
    yum search meld #查找相关软件包
    yum remove meld #卸载指定软件包

## 系统维护

  。。。

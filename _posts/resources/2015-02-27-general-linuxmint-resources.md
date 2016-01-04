---
layout: post
title: LinuxMint 常用资源
category: 资源
tags: LinuxMint
keywords: LinuxMint
description: 
---

## 官方资源

  [官方首页](http://linuxmint.com) [官方下载](http://www.linuxmint.com/download.php) [官方论坛](http://forums.linuxmint.com) [官方博客](http://blog.linuxmint.com) [相关资源](http://www.mintos.org)

## 选择理由

- Linux Mint是功能全面，清爽大方，操作简单，轻巧高效，插件、软件最完善，兼容性好，细节处理好，是全世界优化的最好的ubuntu。

- Windows都比linux冗余庞大，分散注意力的软件繁多，国内流氓软件泛滥，肆意弹窗后台驻留，不利于专注高效学习和生活，特殊需求可通过虚拟机完成。

- Deepin汉化完善，面向普通小白用户，专注于娱乐需求，却又不能尽如人意，很耗资源（影响电脑使用寿命）,无休眠,常内部错误，无法使用一般代理设置。

- ubuntu较为优秀，但占用资源日甚，强制桌面操作习惯改变，专注于平板和智能手机市场，不如LinuxMint好用。

- fredora,centos 没有用做桌面过，据说也不错，资源占用也低，稳定性也不错，没有选择仅仅因为熟悉了debian系操作不想再增加学习成本。

## 常用软件安装包

  [搜狗输入法](http://pinyin.sogou.com/linux/?r=pinyin) [谷歌浏览器](http://www.google.cn/chrome/browser/desktop/index.html) [火狐浏览器](https://ftp.mozilla.org/pub/firefox/releases/latest/linux-x86_64/zh-CN/)  [Chromium](https://download-chromium.appspot.com/) [sublime-text](http://packages.linuxdeepin.com/deepin/pool/non-free/s/sublime-text/)

## 在线软件安装

    sudo add-apt-repository ppa:lainme/pidgin-lwqq && sudo apt-get update && sudo apt-get install pidgin-lwqq #QQ
    sudo apt install virtualbox-nonfree
    sudo sed -i 's/vboxusers:x:124:/vboxusers:x:124:chenlianghong/g' /etc/group #权限设置,把chenlianghong换成你的名字
    sudo apt install terminator #下载一个好用的终端
    sudo apt install backintime-common backintime-gnome #建立系统还原点
    
## 开发软件安装

    sudo apt install remmina #远程管理工具
    sudo apt install docker.io #安装docker
    sudo apt install git git-svn gitk meld #版本控制工具 和 文件对比工具
    sudo apt-get install default-jdk #安装部分软件phpstrom,netbeans等需要,linuxmint自带了

## 网络环境

    #为了避免电信莫名其妙的弹窗以及不可达地址弹出广告页等情况
    sudo pluma /etc/resolv.conf
    #加入如下代码
    nameserver 223.5.5.5 #百度
    nameserver 223.6.6.6 #百度备用
    nameserver 180.76.76.76 #阿里
    nameserver 114.114.114.114 #114

## 修改锁屏背景

    /usr/share/backgrounds/linuxmint/default_background.jpg #软连接为你的图片即可 #如果黑屏注意读权限

## 虚拟机权限问题

    #安装虚拟机扩展，在 “用户和组” 功能中把自己添加到vboxusers组即可
    
## 添加程序到左下角的面板方便点击

    #直接在menu中右键选择添加到面板即可

## 无法满足我的需求

    1、我希望使用的软件都是绿色版本，chrome，sublime
    2、我希望不要有广告打扰，不要有隐私窃取，让我安心的用我花钱买的电脑就好
    3、系统不要太卡，我的电脑长期保持高温不利于我还想多用几年

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

- Windows都比linux冗余庞大，分散注意力的软件繁多，不利于专注高效学习和生活，特殊需求可通过虚拟机完成。

- Deepin汉化完善，面向普通小白用户，专注于娱乐需求，却又不能尽如人意，很耗资源（影响电脑使用寿命）,无休眠,常内部错误，无法使用一般代理设置。

- ubuntu较为优秀，但占用资源日甚，专注于平板和智能手机市场，不如LinuxMint好用。

- fredora,centos 没有用做桌面过，据说也不错，资源占用也低，稳定性也不错，没有选择仅仅因为熟悉了debian系操作不想再增加学习成本。

## 常用软件安装包

  [搜狗输入法](http://pinyin.sogou.com/linux/?r=pinyin) [谷歌浏览器](http://www.google.cn/chrome/browser/desktop/index.html)

## 在线软件安装

    sudo add-apt-repository ppa:lainme/pidgin-lwqq && sudo apt-get update && sudo apt-get install pidgin-lwqq #QQ
    sudo apt install virtualbox-nonfree
    sudo sed -i 's/vboxusers:x:124:/vboxusers:x:124:chenlianghong/g' /etc/group #权限设置,把chenlianghong换成你的名字
    sudo apt install terminator #下载一个好用的终端
    sudo apt install backintime-common backintime-gnome #建立系统还原点
    
## 开发软件安装

    sudo apt install remmina #远程管理工具
    sudo apt install sublime-text #文本编辑器
    sudo apt install -y curl && curl -sSL https://get.docker.com/ | sudo sh #安装docker
    sudo apt install git git-svn gitk meld #版本控制工具 和 文件对比工具
    sudo apt-get install default-jdk #安装部分软件phpstrom,netbeans等需要
    curl -L https://github.com/docker/compose/releases/download/VERSION_NUM/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    docker-compose --version

## 网络环境

    #为了避免电信莫名其妙的弹窗以及不可达地址弹出广告页等情况
    sudo vim /etc/resolv.conf
    #加入如下代码
    nameserver 223.5.5.5 #百度
    nameserver 223.6.6.6 #百度备用
    nameserver 180.76.76.76 #阿里
    nameserver 114.114.114.114 #114

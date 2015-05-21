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

- Linux Mint是功能全面，清爽大方，操作简单，轻巧高效的操作系统。插件、软件最完善，兼容性好，细节处理最好。

- Windows都比linux冗余庞大，分散注意力的软件繁多，不利于专注高效学习和生活，特殊需可通过拟机完成

- Deepin汉化完善，面向普通小白用户，专注于娱乐需求，却又不能尽如人意，经常内部错误。

- ubuntu较为优秀，但占用资源日甚，专注于平板和智能手机市场。

- fredora,centos 没有用做桌面过，据说也不错，资源占用也低，稳定性也不错，没有选择仅仅因为熟悉了debian系操作不想再增加学习成本。

## 常用软件

### 输入法

    sudo apt install ibus-pinyin
    #改变候选次数为10个(最多)，去掉容错选项
    
### 谷歌浏览器
    
    sudo apt install chromium-browser
    
### 浏览器Flash支持

    sudo apt install pepperflashplugin-nonfree
  
### 多媒体解码器

    sudo apt install ubuntu-restricted-extras

### 解压格式支持

    sudo apt install unace p7zip-rar sharutils rar arj lunzip lzip
    
### 下载支持，类IDM

    sudo apt install uget aria2

### 远程连接

    sudo apt install remmina
  
### 最好用的文本编辑器

    sudo apt install sublime-text 

  多语言输入补丁
    
    cd ~/.config/sublime-text-2/Packages
    git clone https://github.com/xgenvn/InputHelper.git
  
  sublime，在输入界面按下 Ctrl + Shift + Z , 会弹出一个小框

### Pidgin的QQ插件，省资源，仅聊天功能

    sudo add-apt-repository ppa:lainme/pidgin-lwqq
    sudo apt-get update
    sudo apt-get install pidgin-lwqq
    sudo apt-get install pidgin #如果没有安装的话
    
### 安装虚拟机

    sudo apt-get install virtualbox-nonfree
    sudo sed -i 's/vboxusers:x:124:/vboxusers:x:124:chenlianghong/g' /etc/group #更多功能权限设置
    #把chenlianghong换成你的名字或者界面操作把自己加入到vboxusers组
    
### 安装docker

    sudo apt-get install -y apparmor curl php5-cli && curl -s https://get.docker.io/ubuntu/ | sudo sh
    
### system config

    sudo sed -i 's/\/home\/chenlianghong:\/bin\/zsh/\/home\/chenlianghong:\/bin\/bash/g' /etc/passwd #maybe
    sudo apt install firefox-locale-zh-hans #firefox language
    

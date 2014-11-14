---
layout: post
title: Linux 常用资源
category: 资源
tags: [Linux , Ubuntu , Deepin]
keywords: Mac
description:
---

## 常用软件

### Alfred

#### Alfred常用Workflow

- [Dash](http://kapeli.com/dash)
- [Dict - Lookup Word](https://github.com/liberize/alfred-dict-workflow)
- [Reminders](http://www.alfredforum.com/topic/917-reminders/)
- [Evernote](http://support.alfredapp.com/evernote)
- [Notes](http://www.alfredforum.com/topic/1009-notes/)

## 常用技巧

### GBK->UTF-8文件编码批量转换命令

有的时候，国内开源项目的代码是GBK编码，他人递过来帮忙调试的也是GBK编码，下面的代码也许可以帮你忙

    iconv -f GBK -t UTF-8 file1 -o file2

如果文件很多怎么办呢？

    find default -type d -exec mkdir -p utf/{} \;
    find default -type f -exec iconv -f GBK -t UTF-8 {} -o utf/{} \;

这两行命令将default目录下的文件由GBK编码转换为UTF-8编码，目录结构不变，转码后的文件保存在utf/default目录下

### 批量给文件夹可执行权限
文件夹需要有执行权限才可列出该文件夹的内容，文件夹下的文件才可读（就算本身有了可读权限）

    find -type d -exec chmod +x {} \;


### 解决lxde搜狗输入法的黑框问题

1、安装xcompmgr 和gedit

    sudo apt-get install xcompmgr

2、设置xcompmgr自动启动

    mkdir ～/.config/autostart
    vim xcompmgr.desktop

3、将如下内容复制到xcompmgr.desktop文件，保存即可

'''[Desktop Entry]
Type=Application
Encodeing=UTF-8
Name="xcompmgr"
Comment=""
Exec="xcompmgr"
hidden=false
NoDisplay=false
Terminal=false
'''


###搭建本地git服务(执行在共享项目的根目录)(退出命令即停止服务)
创建本地git服务

    git daemon --reuseaddr --export-all --verbose --base-path=$PWD/../ $PWD
测试本地git的clone

    git clone git://localhost/PWD.FolderName
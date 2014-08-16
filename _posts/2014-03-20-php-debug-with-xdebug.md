---
layout: post
title: 用Xdebug和Sublime调试PHP代码
category: 工具
tags: PHP
keywords: Xdebug,Sublime,PHP
description: 
---

> xdebug是php调试的好帮手，sublime是php编写的好帮手。这里只说如何配置，默认读者会用sublime和xdebug

## 安装xdebug
在mac下非常方便：

    brew install php55-xdebug

然后进行配置，在`/usr/local/etc/php/5.5/conf.d/ext-xdebug.ini`中添加

    xdebug.remote_enable=1
    xdebug.remote_handler=dbgp
    xdebug.remote_host=127.0.0.1
    xdebug.remote_port=9000
    xdebug.remote_log="/var/log/xdebug/xdebug.log"

重启apache

    sudo apachectl restart

## 配置sublime
要调试某一个项目，首先得把这个项目在sublime下保存成一个project

    sublime->project->save project as ...

然后用[package control](https://sublime.wbond.net/installation)安装`xdebug client`

接下来配置项目

    sublime->project->edit poject

配置文件类似以下内容：

    {
        "folders":
        [
            {
                "follow_symlinks": true,
                "path": "."
            }
        ],
        "settings": {
            "xdebug": {
                 "url": "http://my.local.website/",
            }
        }
    }

其中url是项目所在url，记得在hosts里头将这个url指向127.0.0.1，还有在apache的virtualhost里将其指向项目根目录

这样就OK了，准备开启调试吧

## 开启调试
开启调试方式也比较简单，在想要加断点的地方右键

    xdebug->Add/Remove breakpoint

这样项目在运行到本行的时候就会停止下来

然后开始调试，在菜单栏选择

    tools->xdebug->start debugging(launch browser)

sublime会自动打开浏览器，进入配置时写的网站链接，进行调试

调试中所用的功能可以在调试文件中右键查看之

## 可能问题

### 无法跟踪断点
这可能是xdebug端口被占用，按Ctrl+`或者菜单栏View->show Console查看错误信息，有可能是xdebug端口已经被占用的缘故。

在sublime xdebug中关闭调试，或者重启sublime可以解决这个问题。

## 参考
1. [Debugging with Xdebug and Sublime Text 3](http://www.sitepoint.com/debugging-xdebug-sublime-text-3/)




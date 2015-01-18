---
layout: post                                   
title: 网页截图解决方案之CutyCapt         	   
category: web snapshot                                 
tags: [snapshot]
keywords: snapshot
description:
---

## 一、Target

1. 对给定的网页截图 

2. 支持flash

3. 可以水平扩展

## 二、Background

### qt

*什么是qt?*

> Qt is a cross-platform application and UI framework for developers

[官网](http://qt-project.org/), 它的开发语言是C++，不过也有其他第三方库，可以在github上找，比如[php-qt library](https://github.com/vjandrea/php-qt)

### xvfb

*什么是xvfb?*

> Xvfb or X virtual framebuffer is a display server implementing the X11 display server protocol. In contrast to other display servers Xvfb performs all graphical operations in memory without showing any screen output. From the point of view of the client, it acts exactly like any other X display server, serving requests and sending events and errors as appropriate. However, no output is shown. This virtual server does not require the computer it is running on to even have a screen or any input device. Only a network layer is necessary. Unlike a real display server, Xvfb does not support modern X11 extensions like Compositing, Randr or GLX. Xdummy is a newer alternative which supports these extensions as well as providing the same functionality as Xvfb.

更加详细，[wiki页面](http://en.wikipedia.org/wiki/Xvfb)

### cutycapt

*什么是cutycapt?*

> CutyCapt is a small cross-platform command-line utility to capture WebKit's rendering of a web page into a variety of vector and bitmap formats, including SVG, PDF, PS, PNG, JPEG, TIFF, GIF, and BMP

[官网](http://cutycapt.sourceforge.net/)

## 三、环境搭建

### dependance

1. xvfb

        sudo apt-get install xvfb

3. 安装cutycapt

        官网：http://cutycapt.sourceforge.net/

	    % sudo apt-get install subversion libqt4-webkit libqt4-dev g++
	    % svn co svn://svn.code.sf.net/p/cutycapt/code/ cutycapt
	    % cd cutycapt/CutyCapt
	    % qmake
	    % make
	    % ./CutyCapt --url=http://www.example.org --out=example.png

4. install chinese font lib

        sudo apt-get install language-pack-zh-hans-base
        sudo apt-get install language-pack-en-base

5.  install flash support

        sudo apt-get install flashplugin-nonfree

6. test

        xvfb-run --server-args="-screen 0, 1024x680x24" ./CutyCapt --plugins=on --url=http://shanghai.anjuke.com/ --out=/home/going1000/Desktop/anjuke_1.png


7. multi instance

        xvfb-run -a --server-args="-screen 0, 1024x680x24 -noreset" ./CutyCapt --plugins=on --url=http://shanghai.anjuke.com/ --out=/home/going1000/Desktop/anjuke_1.png

## 四、水平扩展策略

1. 使用mq的方式来支持水平扩张。使用初始化的方式将需要截图的网页放入mq。

2. 使用nfs来存放截图结果。实现文件独立。





---
layout: post
title: 在 Centos7/RHEL7 下搭建 SS Server
category: 工具
tags: Tools
keywords: 科学上网,工具,SS
---

身为一个在校大学生，平时查个资料啊，上个Google啊，总会看到一个东西
![](https://i.imgur.com/WgUZDUv.png)
都懂哈

## 接下来，我就要教你们如何能上Google（搭建一个SS服务器） ##
1. 首先，要有一个服务器（必须是境外的！！！别问我境内的行不行，除非你想进墙）。Server配置不用很好，单核 + 500M RAM就可以完美搭建。不知道从哪弄Server的可以email我，我给你说几个好用的，这里就不说了，白打他们广告还没钱，哼。
2. 保证Server的系统是干净的，连接上Server。
3. 初次登陆，例行操作：
    ```bash
    sudo yum update
    ```
4. 安装两个必要的东西:
    ```bash
    sudo yum install screen
    sudo yum install wget
    ```
    screen是一个很好用的东西，后面就知道了
    wget是下载包用的
5. 
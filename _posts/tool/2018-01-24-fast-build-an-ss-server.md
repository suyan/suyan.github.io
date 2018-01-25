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
5. 运行：
    ```bash
    screen -S ss
    ```
    此时，你会进入一个新的视图，这个视图可以在你意外断开连接的时候重新打开，相当方便
6. 输入：
    ```bash
    sudo wget -N --no-check-certificate https://raw.githubusercontent.com/mmmwhy/ss-panel-and-ss-py-mu/master/ss-panel_node.sh && chmod +x ss-panel_node.sh && bash ss-panel_node.sh
    ```
    这个命令就是下载ss-panel和ss-py-mu的。ss-panel是ss的面板，是一个网页，对外提供服务的，也可以管理整个ss。ss-py-mu是后台，负责提供ss服务的。整个网站基于LNMP。
7. 然后，你就能看见这个：

	![](https://i.imgur.com/5G5ZZGK.png)

    输入数字 1
8. 然后等待安装完成就行了。这个过程的速度取决于VPS的性能，因为会编译安装LNMP。
9. 安装完成后，打开网页，输入你的ip，就可以打开ss面板了。默认的一个用户是91vps，密码是91vps。进入之后可以自己新开一个账号。
10. 剩下的就是在PC和手机上下载一个ss客户端，然后就能用了。
11. 完美！

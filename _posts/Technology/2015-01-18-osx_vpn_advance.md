---
layout: post                                   
title: mac下一步步设置vpn以及原理        	   
category: mac                                 
tags: [mac vpn]
keywords: vpn
description: mac下一步步设置vpn以及原理  
---

之前写过一篇文章 《[在mac下设置vpn以及连接外网](/2015/01/18/osx_vpn.html)》 ，发现还是有些地方不够完整，这篇文章在补全它的同时，希望从原理部分能有些介绍，让读者可以在遇到特殊情况的时候自己debug。

> 注：最近遇到个问题，就是自己的网段和vpn网段冲突情况。如我们公司的主要网段为192.168.1，这时候，就应该使本地局域网尽量不要和它冲突。可以改为 192.168.0 或则其他网段。

## 一、原理

当我们上网的时候，经历了什么步骤。
比如，我们要访问 www.baidu.com 这个域名，步骤如下

1. 通过dns将 www.baidu.com 转换为 ip 
2. 通过 route table 决定出口
3. 得到结果
    
在osx下面，我们使用nslookup来查看访问一个域名时候的使用的dns。用traceroute工具来查看详细路由信息，用netstat来查看本机的路由表。

nslookup 例子：

    going1000@osx ppp $ nslookup www.baidu.com
    Server:    192.168.1.1
    Address:    192.168.1.1#53
 
    Non-authoritative answer:
    www.baidu.com    canonical name = www.a.shifen.com.
    Name:    www.a.shifen.com
    Address: 115.239.211.110
    Name:    www.a.shifen.com
    Address: 115.239.210.27

traceroute 例子：

    going1000@osx ppp $ traceroute www.163.com
    traceroute: Warning: www.163.com has multiple addresses; using 101.227.66.158
    traceroute to 163.xdwscache.glb0.lxdns.com (101.227.66.158), 64 hops max, 52 byte packets
     1 192.168.0.1 (192.168.0.1) 303.570 ms 58.269 ms 161.238 ms
     2 192.168.1.1 (192.168.1.1) 28.019 ms 23.551 ms 33.749 ms
     3 1.244.79.218.broad.xw.sh.dynamic.163data.com.cn (218.79.244.1) 19.224 ms 15.921 ms 13.544 ms
     4 124.74.12.169 (124.74.12.169) 228.705 ms 244.191 ms 197.058 ms
     5 124.74.215.217 (124.74.215.217) 252.492 ms 237.622 ms 446.333 ms
     6 61.152.80.2 (61.152.80.2) 340.711 ms 284.042 ms 214.222 ms
     7 * 124.74.233.98 (124.74.233.98) 759.646 ms *
     8 101.227.66.2 (101.227.66.2) 761.930 ms 607.199 ms *
     9 101.227.66.6 (101.227.66.6) 201.392 ms
    101.227.66.158 (101.227.66.158) 115.748 ms
    101.227.66.6 (101.227.66.6) 1020.250 ms

netstat 例子：

    going1000@osx ppp $ netstat -nr
    Routing tables
 
    Internet:
    Destination Gateway Flags Refs Use Netif Expire
    default 192.168.0.1 UGSc 13 66 en0
    127 127.0.0.1 UCS 0 0 lo0
    127.0.0.1 127.0.0.1 UH 129 688863 lo0

## 二、vpn的概念

通俗地讲，vpn就是重新定制了路由转发规则。将ip包通过vpn服务器作转发。这个概念和proxy是不是很类似？只是vpn的目的是提供访问内网的方式而已。

## 三、怎么设置vpn？

通过上面的一些解释，我们可以了解到，设置vpn会有两个步骤：

1. 添加vpn基本信息

    ![](http://going1000sblog-image.stor.sinaapp.com/add_vpn.png)

2. 设置dns

    ![](http://going1000sblog-image.stor.sinaapp.com/set_vpn_dns.png)

    比如我的公司的内部dns服务器是192.168.1.98

3. 设置所有包通过vpn

    ![](http://going1000sblog-image.stor.sinaapp.com/set_vpn.png)

4. 这时候，看看内网是不是可以用了

        going1000@osx ppp $ netstat -nr
        Routing tables
 
        Internet:
        Destination Gateway Flags Refs Use Netif Expire
        default 180.166.126.91 UGSc 186 3 ppp0
        default 192.168.0.1 UGScI 10 0 en0
        127 127.0.0.1 UCS 0 0 lo0
        192.168.189 ppp0 USc 0 0 ppp0

    dns信息

        going1000@osx ppp $ nslookup db.kfs.dev.anjuke.com
        Server:    192.168.1.98
        Address:    192.168.1.98#53
 
        Name:    db.kfs.dev.anjuke.com
        Address: 192.168.1.167

5. 但是问题来了，上不了外网

## 四、优化设置，使得连接vpn同时能够上外网

我们依旧和上面一样，一步步来

1. 添加vpn基本信息

    如上
    
2. 设置dns

    如上

3. 设置route table

    添加一条路由转发规则

        sudo route add 192.0.0.0 -interface ppp0

    这个时候，内网ip是不是可以ping通了？但是现在也有问题，你突然发现之前能解析的内网域名没法接解析了
    
4. 再次设置dns

    域名无法解析，一定是dns出了问题，用nslookup看看：

        going1000@osx ppp $ nslookup db.kfs.dev.anjuke.com
        Server:    192.168.0.1
        Address:    192.168.0.1#53
 
        Non-authoritative answer:
        Name:    db.kfs.dev.anjuke.com
        Address: 180.168.41.175

    果然没有使用到dns服务器，原因很简单，因为上面1设置dns服务器只是针对于vpn连接，只有一种情况会生效：route table default 是vpn的时候。（这里多说一句，在mac里，有两种方式可以达到这种效果：        1）vpn选项中选择 "send all traffic over vpn"; 2）service order中，vpn优先级高于wi-fi，这两种设置达到的效果是一样的）知道了这个原因，就简单了，让我们再次设置vpn。图形化方式直接效仿1就好了，这里直接使用命令:

        sudo networksetup -setdnsservers Wi-Fi 192.168.1.98
    
    再看看dns对不对？

## 五、启动vpn的时候自动设置脚本

按照上面一步步走，是相当没效率的，事实上，在知道了原理之后，我们可以使用一些脚本来实现（添加路由规则、添加内网dns）

#### ip-up

    #!/bin/sh
    export PATH="/sbin:/usr/sbin:/usr/bin"
    networksetup -setdnsservers Wi-Fi 192.168.1.98
    dscacheutil -flushcache
    route add -net 192.0.0.0 -interface ppp0

#### ip-down

    #!/bin/sh
    export PATH="/sbin:/usr/sbin:/usr/bin"
    route delete 192.0.0.0
    route delete 10.0.0.0
    networksetup -setdnsservers Wi-Fi empty
    dscacheutil -flushcache

上面的 ip-up、ip-down 是对应 ppp 协议的。将它们放到 /etc/ppp/ 下面，设置为可执行，在vpn开启和关闭会分别调用。
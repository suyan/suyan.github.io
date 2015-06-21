---
layout: post                                   
title: 怎么样追踪网络状态
category: network                                 
tags: [network]
keywords: network
description:  
---

## 访问过程

### 访问域名：

> 访问 www.baidu.com => dns 服务器解析 ip => 访问目标服务器指定端口 => 接收结果

### 访问ip:

> 访问目标服务器指定端口 => 接收结果

## 关键点

相比直接访问ip的服务（更简单的可以认为是一个客户端，比如游戏），访问域名多了一层域名转换为ip的操作，这里就涉及到了dns服务器。

### dns 服务器

当想要了解dns服务器的使用情况，就可以用dig或者nslookup。

#### dig 命令	

		dig www.baidu.com
		
		result:
		
		; <<>> DiG 9.8.3-P1 <<>> www.baidu.com
		;; global options: +cmd
		;; Got answer:
		;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 17928
		;; flags: qr; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

		;; QUESTION SECTION:
		;www.baidu.com.			IN	A

		;; ANSWER SECTION:
		www.baidu.com.		90	IN	A	115.239.210.27

		;; Query time: 7 msec
		;; SERVER: 192.168.0.1#53(192.168.0.1)
		;; WHEN: Sun Jun 21 18:07:21 2015
		;; MSG SIZE  rcvd: 47

#### nslookup 命令

		nslookup www.baidu.com

		result:
		
		Server:		192.168.0.1
		Address:	192.168.0.1#53

		Non-authoritative answer:
		Name:	www.baidu.com
		Address: 115.239.210.27

#### nslookup 和 dig 的区别

> dig uses the OS resolver libraries. nslookup uses is own internal ones.
>
> That is why ISC has been trying to get people to stop using nslookup for some time now. It causes confusion.

具体区别：[链接](http://unix.stackexchange.com/questions/93808/dig-vs-nslookup)


### ip 路由

#### traceroute 命令

		traceroute www.baidu.com
		
		result:

		traceroute to www.baidu.com (115.239.211.112), 64 hops max, 52 byte packets
		 1  broadcom.home (192.168.1.1)  3.711 ms  20.582 ms  2.439 ms
		 2  1.244.79.218.broad.xw.sh.dynamic.163data.com.cn (218.79.244.1)  5.666 ms  11.499 ms  4.777 ms
		 3  1.244.79.218.broad.xw.sh.dynamic.163data.com.cn (218.79.244.1)  5.553 ms  5.073 ms  6.881 ms
		 4  124.74.12.169 (124.74.12.169)  10.230 ms  4.781 ms  7.916 ms
		 5  124.74.215.225 (124.74.215.225)  4.984 ms  5.607 ms  4.250 ms
		 6  61.152.86.6 (61.152.86.6)  8.878 ms
		    61.152.86.2 (61.152.86.2)  6.869 ms
		    101.95.120.74 (101.95.120.74)  7.159 ms
		 7  202.97.68.42 (202.97.68.42)  8.499 ms
		    202.97.68.130 (202.97.68.130)  8.605 ms
		    202.97.68.142 (202.97.68.142)  9.064 ms
		 8  61.164.31.178 (61.164.31.178)  7.207 ms  8.641 ms
		    61.164.13.150 (61.164.13.150)  22.457 ms
		 9  115.233.23.202 (115.233.23.202)  9.513 ms  10.111 ms
		    115.233.23.194 (115.233.23.194)  7.215 ms
		10  115.239.209.10 (115.239.209.10)  10.664 ms  10.027 ms
		    115.239.209.26 (115.239.209.26)  9.850 ms
		11  *


### 网络延时

#### ping 命令

		ping www.baidu.com

		result:
		
		PING www.baidu.com (115.239.211.112): 56 data bytes
		64 bytes from 115.239.211.112: icmp_seq=0 ttl=53 time=11.615 ms
		64 bytes from 115.239.211.112: icmp_seq=1 ttl=53 time=17.961 ms
		64 bytes from 115.239.211.112: icmp_seq=2 ttl=53 time=8.919 ms

#### 合理的ping值

一般而言，150ms 之下的ping值都是可以接受的，一旦到了200ms之上，可能路由器或则modem有问题了（当然，外部网络堵塞的原因这里不多说）。

> There are two normal factors that significantly influence the latency of a consumer device (like a cable modem, dsl modem or dial-up modem).

> 1. The latency of the connecting device. For a cable modem, this can normally be between 5 and 40 ms. For a DSL modem this is normally 10 to 70ms. For a dial-up modem, this is normally anywhere from 100 to 220ms. For a cellular link, this can be from 200 to 600 ms. For a T1, this is normally 0 to 10 ms.
2. The distance the data is traveling. Data travels at (very roughly) 120,000 miles (or 192,000 kilometers) per second, or 120 miles (192 km) per ms (millisecond) over a network connection. With traceroute, we have to send the data there and back again, so roughly 1 ms of latency is added for every 60 miles (96km, although with the level of accuracy we're using here, we should say '100km') of distance between you and the target.

查看原文：[链接](https://www.pingman.com/kb/42)

## 其他

### 服务可访问性

#### 服务的概念

##### port & socket & service

简而言之

1. port 是网卡的虚拟识别号，用于区分网络链接。
2. socket 是ip 和 port 的绑定
3. app 如果绑定到 sockect ，就可以提供service

#### telnet 命令

telnet 用于检查某ip的某端口是否对测试者开放，便是服务的可访问性。当然，在软件层面，还可以对访问者要求权限认证，但这是另外一个话题。

		telnet 115.239.211.112 80
		
		result:
		
		Trying 115.239.211.112...
		Connected to 115.239.211.112.
		Escape character is '^]'.
		



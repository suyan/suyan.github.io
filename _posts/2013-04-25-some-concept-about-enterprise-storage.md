---
layout: post
title: 几种企业的存储系统
category: 技术
tags: Concept
description: 今天在看对象存储时涉及到几个企业常用的存储系统，在此大概罗列一下，以后完善
---

## 几种存储系统

### [直接连接存储(Direct Attached Storage)](http://baike.baidu.com/view/120932.htm#2)

DAS是企业最早采用的在线型存储堆，基本原理即终端和服务器构成LAN，由服务器进行存储，终端连接外网，保证了存储的安全性。但是在多个服务器之间共享存储就显得非常复杂。

![DAS](http://yansu-uploads.stor.sinaapp.com/imgs/das.jpg)

### [网络附加存储(Network Attached Storage,NAS)](http://zh.wikipedia.org/wiki/%E7%B6%B2%E8%B7%AF%E5%84%B2%E5%AD%98%E8%A8%AD%E5%82%99)

NAS和DAS不同的地方是把存储服务器直接连接到网络中去，可以提供不同网络对其进行存储。

![NAS](http://yansu-uploads.stor.sinaapp.com/imgs/nas.jpg)

参考

- [NAS简介](http://blog.csdn.net/baodunqiao/article/details/4260630)
- [DAS,NAS,SAN对比][1]

[1]: http://www2.yvtc.gov.tw/training/net/%E7%B6%B2%E8%B7%AF%E8%A6%8F%E5%8A%83%E4%BD%9C%E6%A5%AD/%E7%95%B0%E5%9C%B0%E5%82%99%E6%8F%B4/DAS%20&%20NAS%20&%20SAN(1).htm

### [储存区域网络(Storage Attachment Network,SAN)](http://baike.baidu.com/view/120921.htm#sub6204565)

SAN是将许多存储装置

![SAN](http://yansu-uploads.stor.sinaapp.com/imgs/san.gif)

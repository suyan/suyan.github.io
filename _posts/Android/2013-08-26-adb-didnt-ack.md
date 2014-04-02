---
layout: post
title: ADB server didn't ACK 解决方法
category: Android
tags: ADB@Android
keywords: ADB ACK
description: 
from: http://blog.csdn.net/xiaanming/article/details/9401981
---

在eclipse ADT下真机调试时，如果报如下错误：
```
* daemon not running. starting it now * 
ADB server didn't ACK 
* failed to start daemon * 
```
一般情况下是5037端口被占用了。
##解决办法
###1.查看占用端口的线程PID
在CMD下输入
```netstat -ano|findstr "5037" ```

![查看占用端口的现成PID](/public/upload/android/adb-didt-ack-1.jpg)

最后一列即为线程PID
###2.通过PID查看线程
输入```tasklist|findstr "pid"```

![通过PID查看线程](/public/upload/android/adb-didt-ack-2.jpg)

如图可知是另一个adb实例，可以杀掉
###3.杀掉线程
输入 ```taskkill /F /PID "pid"```杀掉线程
如果能确定线程肯定可以被杀掉，可以跳过第二步，直接杀掉线程
---
layout: post
title: Python 常用资源
category: 资源
tags: Python
keywords: Python
description: 
---

## 常用代码

### 遍历对象
    for key in a.__dict__:
        print key,':',a.__dict__[key]

### 调试方法
    assert False   //引发异常，观察错误界面
    import logging
    logging.info('')  //写日志

### 获得当前时间
    #时间戳
    time.time()
    #日期时间
    time.ctime()
    #iso时间
    datetime.fromtimestamp(time.time()).isoformat()
    #固定格式
    time.strftime('%Y-%m-%d',time.localtime(time.time()))
### 日期到时间戳
    dateC=datetime.datetime(2010,6,6,8,14,59)
    timestamp=time.mktime(dateC.timetuple())
### 时间戳到日期
    ltime=time.localtime(1237515355.0)
    timeStr=time.strftime("%Y-%m-%d %H:%M:%S", ltime)
### 之后的包从绝对位置导入
    from __future__ import absolute_import


---
layout: post
title: JavaScript 常用资源
category: 资源
tags: JavaScript
keywords: JavaScript
description: 
---

## 常用代码

### 字符串截取
    substr(start [, length ])
    返回一个从指定位置开始的指定长度的子字符串
    substring(start, end)
    返回位于 String 对象中指定位置的子字符串。


### 页面跳转
    window.navigate("top.jsp");
    window.history.back(-1);
    window.location.href="login.jsp?backurl="+window.location.href; 
    self.location='top.htm';
    top.location='xx.jsp';
    
### 加载完成
    window.onload 
    必须等页面内包括图片的所有元素加载完成后才能执行。
    不能同时编写多个，只执行一个
    $(document).ready()
    是DOM结构绘制完毕后就可以执行
    可以编写多个
    简写$(function(){});
    $(window).load()等同与window.onload

### 刷新页面
    history.go(0) 
    location.reload() 
    location=location 
    location.assign(location) 
    document.execCommand('Refresh') 
    window.navigate(location) 
    location.replace(location) 
    document.URL=location.href 

### json转化和解析

    JSON.parse("{a:'111',b:'ccc'}");  //解析
    eval("("+"{{ cpu_data }}"+")"); //解析

### 时间转换

    var day1 = parseInt(new Date().valueOf()/1000); //获得当前时间时间戳
    day2 = new Date(day1*1000);
    alert(day2.getFullYear()+"-"+(day2.getMonth()+1)+"-"+day2.getDate()+" "+day2.getHours()+":"+day2.getMinutes()+":"+day2.getSeconds())
    d = new Date();
    s = d.getFullYear() + "-";
    s += ("0"+(d.getMonth()+1)).slice(-2) + "-";
    s += ("0"+d.getDate()).slice(-2) + " ";
    s += ("0"+d.getHours()).slice(-2) + ":";
    s += ("0"+d.getMinutes()).slice(-2) + ":";
    s += ("0"+d.getSeconds()).slice(-2) + ".";
    s += ("00"+d.getMilliseconds()).slice(-3);

### URI编码转换

    var a="':'";
    en = encodeURI(a);    //编码
    a = decodeURI(en);    //解码

### HTML编码转换

    function htmlEncode(value){
      return $('<div/>').text(value).html();
    }

    function htmlDecode(value){
      return $('<div/>').html(value).text();
    }

---
layout: post
title: JS中防止浏览器屏蔽window.open
category: 技术
tags: JavaScript
description: JS中防止浏览器屏蔽window.open
---

有的时候我们需要一些弹出窗来作为临时信息显示，在js代码中直接使用

    window.open(url,“_blank”,option);
 

即可实现跳转，而且还可以传递一些参数。

但是有个问题是，很多浏览器不支持代码触发上述代码，这个问题在平常使用中显得很不方便，尤其是我们经常用ajax返回值来触发一个新页面。

为了防止被屏蔽，可以有两种方式解决。
1、在用户点击事件中增加监听程序

    <button onclick=“test()”>点击</button>
    <script type=“text/javascript”>
    var is_finished=false;
    function test(){
    $.get(“/”,function(){
    is_finished=true;
    });
    test2();
    }
    function test2(){
    if(is_finished){
    window.open(“http://www.baidu.com”,“_blank”);
    }else{
    setTimeout(test2,1000);
    }
    }
    </script>

2、在点击后先打开空白页，之后再修改地址

    <button onclick=“test()”>点击</button>
    <script type=“text/javascript”>
    function test(){
    var frame=window.open(“about:blank”,“_blank”);
    $.get(“/”,function(){
    frame.location=“http://www.baidu.com”;
    });
    }
    </script>
---
layout: post
title: java中URL编码
category: Java
tags: IDE@Java
keywords: eclipse shortcut
description: http协议处理请求中文的url编码
from: http://haiyang08101.iteye.com/blog/1490759

---
在近在做项目的过程中，由于客户那边服务器上提供的有很多中文结构目录。请求要的地址不能正常运行显示出来。下面来分享一下我对http协议处理请求中文的url编码。 
{% highlight java %}
ItemData item =new ItemData();
String str;		
try {
    str = java.net.URLEncoder.encode(item.getLink(),"GBK");
    /*这个item.getLink()是得到请求的具体网络路径， 而下面replaceAll函数是在String里面转译字符，这个是对网络路径上用GBK转码（/）后斜杠用%2F来表示，冒号（：）用%3A来表示 ，加号（+）用%20来表示，加号是java中特殊符号，所以用正则表达式双斜杠（//）。下面这个转码的意思是指在取用GBK转码后，GBK把斜杠和冒号，加号等特殊符号都给转译了，所以才要做此操作。我这是正对解析视频文件而做的，大部分的只需上面写到的str=java.net.URLEncoder.encode(item.getLink(),"GBK");就可以*/\
    str = str.replaceAll("%2F","/");
    str = str.replaceAll("%3A",":");
    str = str.replaceAll("\\+","%20");
    System.out.println("-----URL:"+str);
} catch (UnsupportedEncodingException e) {
    // TODO Auto-generated catch block
		e.printStackTrace();
}
{% endhighlight %}
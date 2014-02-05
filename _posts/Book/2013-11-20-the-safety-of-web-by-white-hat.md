---
layout: book
title: 白帽子讲Web安全
status: reading
category: 读书
tags: Safety
keywords: Web,Book,Safety,WhiteHat
author: 吴翰清
publisher: 电子工业出版社
language: 中文
link: http://book.douban.com/subject/10546925/
cover: /public/upload/book/the-safety-of-web-by-white-hat.jpg
description: 
---

## 第1章 我的安全世界观
看完就忘了...等整本书读完再来看吧.

## 第2章 浏览器安全
浏览器本身会有一些安全策略, 主要的浏览器安全策略有:

### 同源策略
**同源策略限制了来自不同源的"document"或脚本, 对当前"document"读取或设置某些属性.**

源的限制因素主要为: **host**, **子域名**, **端口**和**协议**. 只有这四个因素都相同的源, 认为是同源.

能够跨不同源加载资源的标签有`script`, `img`, `iframe`, `link`. 这些元素有个共同点就是都含有`src`属性, 通过设置这个属性, 实际上是发起了一个GET请求来获得属性所标注的资源.

### 浏览器沙箱
沙箱泛指资源隔离类模块. 沙箱的设计目的是让不可信代码运行在特定环境中, 限制不可信代码访问隔离区之外的资源. 想要访问隔离区之外的资源必须经过严格的安全检查.

### 恶意网站拦截
恶意网站拦截是通过一个恶意网站黑名单来提醒用户网站含有恶意代码或者本身就是钓鱼网站. 或者通过EVSSL来增加一个可信网站列表, 算是网站白名单.

## 第3章 跨站脚本攻击(XSS)
XSS是跨站脚本攻击的简写, 英文全称是Cross Site Script. 通常指通过"HTML注入"篡改网页, 插入了恶意的脚本, 从而在用户浏览网站时, 控制用户浏览器的攻击.

### XSS简介
#### 反射型XSS
在编写服务器端代码时, 如果对用户输入的参数不加过滤而直接输出, 就会出现XSS漏洞.

```php
<?php 
header("X-XSS-Protection: 0"); //chrome自动检查xss，用这个head将其关掉测试
$input = $_GET['param'];
echo "<div>$input</div>";
?>
```

那么当访问这个页面时, 如果输入的参数是js代码, 就会在浏览器中直接运行这段代码. 
    
    http://localhost/test.php?param=<script>alert(/xss/)</script>

这种XSS仅仅将用.户输入的数据“反射”给浏览器, 因此想要利用这种XSS必须诱使用户去点击一个链接 通过这种方式来诱使用户所在网页执行黑客准备好的JS代码或者脚本. 反射型XSS也叫非持久型XSS. 

#### 存储型XSS
存储型XSS会把用户的数据存放在服务器端, 因此这种XSS具有较强稳定性.

例如黑客将恶意JS代码写入一篇博客中, 所有浏览这篇博客的用户都将执行这些恶意代码. 存储型XSS也叫持久性XSS.

#### DOM Based XSS
通过修改DOM节点形成的XSS，称为DOM Based XSS。

如下面例子：

```html
<script>
function test(){
    var str = document.getElementById('text').value;
    document.getElementById('t').innerHTML = "<a href='" + str + "'>testLink</a>";
}
</script>
<div id="t"></div>
<input type="text" id="text" value="" />
<input type="button" id="s" value="write" onclick="test()" />
```

这个例子在按钮按下会修改div中的内容。如果我们将输入写成

    ' onclick=alert(/xss/) //

那么在按钮按下以后就会形成这样一个div标签

    <a href='' onclick=alert(/xss/) //'>testLink</a>

这个时候生成的链接是有危害的。

另外也可以闭合标签，并插入一段新的标签。这里将输入写成

    '><img src=# onerror=alert(/xss2/) /><'

生成的div中内容为：

    <a href=''><img src=# onerror=alert(/xss2/) /><'' >testLink</a>

这里直接在点击按钮时即执行alert

### XSS攻击进阶



## 安全类名词
- 挂马: 在一个网站中通过`script`或`iframe`等标签加载一个恶意网址





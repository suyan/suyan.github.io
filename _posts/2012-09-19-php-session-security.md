---
layout: post
title: PHP操作Session的原理及提升安全性时的一个问题
category: 技术
tags: PHP
description: PHP操作Session的原理及提升安全性时的一个问题
---

### Session和Cookie基本介绍

相同点：两者都是保存用户的临时信息，以方便用户和网站之间的交互

不同点：Session保存在服务器端，只有服务器端才可查看和修改。服务器端通过客户端在cookie中携带的session_id来获得保存在服务器端的用户数据。Cookie保存在客户端，服务端和客户端都可以对其进行修改。

### Session的工作原理

首先测试如下一段代码

    <?php
    session_start();//开启session
    echo ‘Session id:’.session_id().‘<br>’;//显示此次交互的session_id
    ?>

页面显示结果为

    Session id:ihrk96384qjvvsqmce0dlkla04

即使不停刷新页面，依然不变，说明服务器端是可以识别出客户端，那么它是如何做到的呢？

我们可以查看一下他们的第一次HTTP交互(先清空一次cookie和缓存再测试)

    Request Header:
    GET /phptest/test2.php HTTP/1.1
    Host: localhost
    Cookie:
    Response Header:
    Set-Cookie: PHPSESSID=sastrf9cikeij6meoe3055brq3; path=/
 

为了说明问题，我只取要用到的信息，从请求头可以看到，这个时候客户端没有给服务端传Cookie内容。而返回的头信息中，服务端指明了set-cookie要设置一个PHPSESSID的内容，保存在”/”目录下。

来看第二次交互：

    Request Header:
    GET /phptest/test2.php HTTP/1.1
    Host: localhost
    Cookie:PHPSESSID=sastrf9cikeij6meoe3055brq3
    Response Header:
    Set-Cookie:
 

这一次结果显示服务器端没有再要求写Cookie，而客户端主动上传了上次获得的PHPSESSID值，也就是这种机制，使服务端”认识”了客户端。只要服务端没有要求再次写session，则以后的交互将一直以此session_id作为客户端的身份标志。

### 服务器端修改Session_id

当然session_id不是永久不变的，当我们清空过一次Cookie以后就发现以前登录了的网站都得重新登陆。再次登陆的时候，我们又会以新的session_id来进行重新确认身份。（注：还有别的方式可以传递session_id值，例如query string等）。

其实从上一个例子中我们就可以看到，服务器端修改session_id其实是通过重写一次cookie来实现的，这次重写发生在一次请求完成以后，即传回的HTTP头中说明的。

为了防止Session劫持，我们可能需要通过每次请求都更改session_id来确保用户是本人登录的。在php中，可以使用以下方式：

    <?php
    session_start();//开启session
            echo ‘Old Session id:’.session_id().‘<br>’;
    session_regenerate_id(true);//重置session_id，并使原session无效
            echo ‘New Session id:’.session_id().‘<br>’;
        ?>
页面显示结果为：

    Old Session id:mqk5sfudpu9ikgp49vc825ggo6
    New Session id:mrck9n85v190reupsni4ob6lo5

可见session_id在使用了session_regenerate_id()以后发生了变化，变化写入方式同第二点介绍的，服务器端在返回的HTTP头中加入Set-Cookie。

### session_regenerate_id()的一个问题

在实际操作中，session_id的保存位置可以通过

    session_set_cookie_params()

来修改，如下：

    <?php
    session_set_cookie_params(0,‘/’,‘testdomain’);
    session_start();//开启session
            echo ‘Old Session id:’.session_id().‘<br>’;
    session_regenerate_id(true);//重置session_id，并使原session无效
            echo ‘New Session id:’.session_id().‘<br>’;
    ?>

在这种方式下，session_id的默认domain被修改，但是session_regenerate_id()是不识别的。这不知道算不算php的一个bug，为了解决这个问题，我们必须使用手动方式重置session保存，修改代码如下：

    <?php
    session_set_cookie_params(0,‘/’,‘testdomain’);
    session_start();//开启session
            echo ‘Old Session id:’.session_id().‘<br>’;
    session_regenerate_id(true);//重置session_id，并使原session无效
            echo ‘New Session id:’.session_id().‘<br>’;
    setcookie(session_name(),session_id(),0,‘/’,‘testdomain’);//手动更新session_id
    ?>
    
这样一来就可以每次交互更新session_id了……虽然有些复杂，但是经测试可行。

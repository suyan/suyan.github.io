---
layout: post
title: WSGI学习
category: 技术
tags: Python
description: 对我来说，一个东西真正掌握的表现方式是亲手试过，而且可以给别人讲清楚，这篇是我对WSGI的理解 
---

## WSGI(Web Server Gateway Interface)
WSGI是WEB服务网关接口的缩写，是为Python语言定义的Web服务器和Web应用程序之间一种简单而通用的接口。它没有具体的实现，更像是一个标准协议，具体可以去[PEP333](http://www.python.org/dev/peps/pep-0333/)了解。

简单说来，它是一个连接用户应用和Web服务器的桥梁，有点类似Apache的CGI。

## 简单例子
下面是来自PEP333的一个简单例子

    def simple_app(environ, start_response):
        """Simplest possible application object"""
        status = '200 OK'
        response_headers = [('Content-type','text/plain')]
        start_response(status, response_headers)
        return ['Hello world!n']

我们可以看出，这个例子里就是输出了一个基本Web页面的body和header。其中environ就是把环境变量啥的一起丢进来，而start_response就像rpc一样负责响应这次请求。接下来看一下能运行的代码：

    from wsgiref.simple_server import make_server

    def my_app(environ, start_response):
        """a simple wsgi application"""
        status = '200 OK'
        response_headers = [('Content-type', 'text/plain')]
        start_response(status, response_headers)
        return ["hello world"]

    httpd = make_server('', 8000, my_app)
    print "Serving on port 8000..."
    httpd.serve_forever()

访问localhost:8000即可看到hello world显示了出来，这就是一个wsgi的简单例子了




---
layout: post
title: 给Git或者APT设置goagent代理
category: 工具
tags: Git
description: 最近使用git从github上clone代码，总是失败，奔溃了快。还有ubuntu连apt-get update都执行不了，有的时候都装不了git，就快骂娘了。可惜在这样一个环境下，只能靠自己搞定了，设置代理是比较好的方式
---

## 安装goagent
这个教程网上很多，放狗一搜即可。

不过网上goagent教程里讲的大部分是给浏览器用的。其实goagent是监听了本地的8087端口，其实任何程序都可以利用这个端口，只要设置好即可。

## 设置git代理
直接在终端输入

    export https_proxy="127.0.0.1:8087"
    export http_proxy="127.0.0.1:8087"
    git config --global http.sslVerify false

这样`git clone`就是走代理了，其实这个设置完以后apt-get的操作也是通过代理的了

## 设置apt-get代理
上面的方法也可以直接使apt代理，如果不想设置环境变量，可以使用下面命令

    sudo apt-get -o Acquire::http::proxy="http://127.0.0.1:8087/" update


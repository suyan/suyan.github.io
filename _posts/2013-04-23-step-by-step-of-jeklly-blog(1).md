---
layout: post
title: 一步一步在GitHub上搭建自己的Jekyll博客(1)--了解环境
category: 工具
tags: [Jekyll , GitHub]
description: 搭建一个基于GitHub和Jekyll的博客，首先要做的是了解这样一个博客环境
---

## 简单介绍

### GitHub
GitHub不用多说，应该大家都知道，托管库的，上[GitHub官网](www.github.com)一看就知道

### Jekyll
Jekyll是一个简单的用来生成静态页面的工具，不光能生成博客。[项目位置](https://github.com/mojombo/jekyll)，[项目Wiki](https://github.com/mojombo/jekyll/wiki)

### 为什么是它们俩
GitHub托管项目是不提供服务端语言和数据库的，但是它支持静态页面的访问的，所以需要用Jekyll来将博客弄成静态的。

基于这两者搭建的博客基本步骤

- 写[Markdown](http://wowubuntu.com/markdown/)或html页面
- 按照一定的目录整理
- 用`git push`提交到GitHub上，生成博客。

整个过程几乎没有多余的步骤，对于经常用键盘的人来说，再好不过了

## 本地环境
我搭建本地环境主要是为了开发用，因为开发阶段总不能一直push push来看效果吧。怎么搭建一个jekyll的本地环境网上资料很多，就不赘述了，[官网传送门](https://github.com/mojombo/jekyll/wiki/Install)
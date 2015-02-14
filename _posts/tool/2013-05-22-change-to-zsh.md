---
layout: post
title: 从Bash切换到Zsh
category: 工具
tags: Mac
description: Zsh在使用一段时间以后，确实是不错，这个过程逐渐完善吧
---

## 安装Zsh
我在mac下，使用`port install zsh`就好了，因为mac自带的Zsh比较老，然后使用`chsh -s /opt/local/bin/zsh`搞定

## 安装Zsh配置文件
克隆配置
    
    git clone git://github.com/sjl/oh-my-zsh.git ~/.oh-my-zsh

移动到根目录

    cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc

## 使用Zsh
[使用Zsh的九个理由](http://lostjs.com/2012/09/27/zsh/)写了Zsh最令人激动的理由

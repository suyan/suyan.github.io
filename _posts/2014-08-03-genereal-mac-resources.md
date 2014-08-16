---
layout: post
title: Mac 常用资源
category: 资源
tags: Mac
keywords: Mac
description: 
---

### 开启关闭dashboard

关闭

    defaults write com.apple.dashboard mcx-disabled -boolean YES
    killall Dock

开启

    defaults write com.apple.dashboard mcx-disabled -boolean NO
    killall Dock

### 设置iterm中option为alt(meta)键

![option-to-meta](http://yansu-uploads.stor.sinaapp.com/original/a7604cae82872d62bdc6122da7f38037.png)

### 删除dropbox冲突文件

    find . -type f -name "* conflicted *" -exec rm -f {} \;
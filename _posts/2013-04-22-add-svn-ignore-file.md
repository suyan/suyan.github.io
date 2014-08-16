---
layout: post
title: 给SVN控制的项目添加忽略文件/文件夹
category: 工具
tags: SVN
description: 因为使用SAE，所以有些项目用SVN来控制，使用时难免有些临时文件生成，每次提交时都得先删除临时文件再提交，设置一下忽略目录就可以方便很多
---

忽略目录其实有些像建立一个文件夹，但却不放入版本控制。如果不加入版本控制又会在`svn status`命令中显示出来，很不方便，所以可以设置本文件夹属性，让它既加入版本控制，又忽略其变化

### 未加入控制的文件夹

    svn propset svn:ignore 'test' .
    svn update
    svn commit -m "add a ignore dir"

### 已经加入版本控制的文件夹

    svn export test test_bak
    svn rm test
    svn commit -m "delete test"
    mv test_bak test
    svn propset svn:ignore 'test' .
    svn update
    svn commit -m "add a ignore dir"

如果想要忽略一个目录下多个文件夹的话，需要有一点点技巧，如下

    svn propset svn:ignore 'test
        test1
        test2' .

即每一个文件夹要单独另起一行
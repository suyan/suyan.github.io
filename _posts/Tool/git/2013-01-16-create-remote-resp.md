---
layout: post
title: git创建远程库
category: 工具
tags: Git
description: git创建远程库
---

# git创建远程库

>git中一般使用 git init 创建的库不允许同一分支多个work tree直接提交，如果这么做有可能会出现以下问题：

>remote: error: refusing to update checked out branch: refs/heads/master

>要解决这个问题可以有以下四种方式

## 创建共享库（推荐）

    # 创建共享库(bare)
    $ mkdir /git/repo.git && cd /git/repo.git && git init --bare

    # 本地库
    $ mkdir ~/repo && cd ~/repo && git init
    # 创建一个文件
    $ vi foo
    # 增加新增文件到库管理
    $ git add .
    # 提交
    $ git commit
    # 增加共享库位置
    $ git remote add origin file:///git/repo.git
    # 提交更改
    $ git push origin master

## 不工作在同一库下（推荐）

    # 创建库
    $ mkdir /git/repo  && cd /git/repo && git init
    # 创建一个文件
    $ vi foo
    # 增加新增文件到库管理
    $ git add .
    # 提交
    $ git commit 
    # 新建一个分支
    $ git branch test

    # 本地库
    $ git clone file:///git/repo && cd repo
    # 切换到分支test
    $ git checkout test
    # 修改文件
    $ echo "foo">foo
    # 提交
    $ git commit 
    # 增加远程库位置
    $ git remote add origin flie:///git/repo
    # 提交更改
    $ git push origin test

## 忽略冲突1
修改远程库.git/config添加下面代码

    [receive]
        denyCurrentBranch = ignore

这种方式不能直接显示在结果的work tree上，如果要显示，需要使用

    git reset --hard才能看到

## 忽略冲突2
在远程库上

    git config -bool core.bare true
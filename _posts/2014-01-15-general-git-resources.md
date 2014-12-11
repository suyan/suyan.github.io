---
layout: post
title: Git 常用资源
category: 资源
tags: Git
keywords: Git
description:
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

    $ mkdir /git/repo  && cd /git/repo && git init # 创建库
    $ vi foo # 创建一个文件
    $ git add . # 增加新增文件到库管理
    $ git commit # 提交
    $ git branch test # 新建一个分支

    $ git clone file:///git/repo && cd repo # 本地库
    $ git checkout test # 切换到分支test
    $ echo "foo">foo # 修改文件
    $ git commit # 提交
    $ git remote add origin flie:///git/repo # 增加远程库位置
    $ git push origin test # 提交更改

## 忽略冲突1
修改远程库.git/config添加下面代码

    [receive]
        denyCurrentBranch = ignore

这种方式不能直接显示在结果的work tree上，如果要显示，需要使用

    git reset --hard才能看到

## 忽略冲突2
在远程库上

    git config -bool core.bare true


## Git常用操作

### 查看历史

    git log --pretty=oneline filename // 一行显示
    git show xxxx // 查看某次修改

### 创建分支

    git branch develop // 只创建分支
    git checkout -b master develop // 创建并切换到 develop 分支

### 合并分支

    git checkout master // 切换到主分支
    git merge --no-ff develop // 把 develop 合并到 master 分支，no-ff 选项的作用是保留原分支记录
    git rebase develop // 合并分支
    git branch -d develop // 删除 develop 分支

### 标签功能

    git tag // 显示所有标签
    git tag -l 'v1.4.2.*' // 显示 1.4.2 开头标签
    git tag v1.3 // 简单打标签
    git tag -a v1.2 9fceb02 // 后期加注标签
    git tag -a v1.4 -m 'my version 1.4' // 增加标签并注释， -a 为 annotated 缩写
    git show v1.4 // 查看某一标签详情
    git push origin v1.5 // 分享某个标签
    git push origin --tags // 分享所有标签

### 回滚操作
    reset --hard v0.1
    reflog
    reset --hard v0.2

### 取消某个文件的修改
    git checkout -- <filename>

### 删除文件
    git rm <filename>               #直接删除文件
    git rm --cached <filename>      #删除文件暂存状态

### 查看文件更新
    git diff              #查看未暂存的文件更新
    git diff --cached     #查看已暂存文件的更新

### 克隆远程分支
    git branch -r
    git checkout origin/android


## Git小技巧

### 指定目录以当前状态为最新状态

    git add -A path/to/your/folder


### git-svn 相关用法

    git-svn clone your_svn_repository   #克隆svn仓库地址
    git add/commit                      #将本地修改提交到本地git库
    git-svn rebase                      #获取中心svn repository的更新，建议定期使用
    git-svn dcommit                     #将本地git库的修改同步到中心svn库
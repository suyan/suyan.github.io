---
layout: post
title: Git 常用资源
category: 资源
tags: Git
keywords: Git
description: 
---

## Git常用操作

### 打标签

### 回滚操作
    reset --hard v0.1
    reflog
    reset --hard v0.2

### 取消某个文件的修改
    git checkout -- <filename>

### 删除文件
    git rm <filename>   直接删除文件
    git rm --cached <filename>    删除文件暂存状态

### 移动文件
    git mv <sourcefile> <destfile>

### 查看文件更新
    git diff              查看未暂存的文件更新 
    git diff --cached     查看已暂存文件的更新 

### 克隆远程分支
    git branch -r
    git checkout origin/android
    
---
layout: post
title: Git 常用资源
category: 资源
tags: Git
keywords: Git
description: 
---

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
    
## Git设置

Git的全局设置在`~/.gitconfig`中，单独设置在`project/.git/config`下。

忽略设置全局在`~/.gitignore_global`中，单独设置在`project/.gitignore`下。

### 设置 commit 的用户和邮箱

```
[user]
    name = xxx
    email = xxx@xxx.com
```
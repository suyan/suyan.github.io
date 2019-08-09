---
layout: post                                   
title: git初级使用 --- 概念和命令             	   
category: Tech
tags: [git]
keywords: git
description: 
---

# git初级使用 --- 概念和命令

## 一、基本概念

### 1. Commit & Snapshot & Hash

commit 为 git 的操作单元。

* commit 记录了版本变动的信息
* 每个 commit 都会生成一个 snapshot
* 每个 snapshot 都以 唯一的 hash 表示
* hash 的生成基于文件夹以及文件夹下地文件信息
* commit 的数据结构是 有向无环图


> [拓展阅读](http://eagain.net/articles/git-for-computer-scientists/)


### 2. Branch & Pointer

* Branch 是指向某个 commit 的 Pointer
* 可以有N个Pointer，所以可以有N个Branch

> [拓展阅读](http://git-scm.com/book/en/v1/Git-Branching-What-a-Branch-Is)

### 3. Repository

* 所有代码以及git对象的存放集合
* .git/ 文件夹

## 二、Repository 内操作

### 命令

#### 1. Repository

	// init at local
	git init
	// clone from remote (protocal: ftp / ssh)
    git clone


#### 2. Branch

	git branch
	
	git branch new-branch
	
	git branch -h
	
#### 3. Commit

	git add .
	
	git commit -m -a ‘message’
	

### file 状态迁移

![](http://going1000sblog-image.stor.sinaapp.com/lifecycle.png)

###  Merge vs Rebase 

merge 和 rebase 是两种不同的合并方式。merge 的log是有分叉的，合并后的commit的父亲是合并的多个分支的commit。rebase 则是将修改移动到最后，将log合并为一条。

merge 的缺点是 log 可能很乱。rebase的缺点是丢失了拉出，合并入分支的时间节点。

merge

![](http://going1000sblog-image.stor.sinaapp.com/merge-p1.png)

rebase

![](http://going1000sblog-image.stor.sinaapp.com/rebase-p1.png)

> 拓展： fast forward => 
> Instead of re-creating the commits in css and adding them to the history of master, Git reuses the existing snapshots and simply moves the tip of master to match the tip of css. This kind of merge is called a fast-forward merge, since Git is “fast-forwarding” through the new commits in the css branch.

> 拓展： merge 和 rebase 对 hash 的影响 => 不是 fast forward 模式，则会穿件新的 snapshot


### 冲突处理

1. 命令

		git add 

### 回退修改

1. 单文件

		git checkout filename

2. 版本回退

		git reset hash

3. 回退单个 commit (创建个revert修改)

		git revert hash


## 三、Repository 间操作

作为一个DCVS，git的远程 Repository 和本地是一样的。所以将 Repository 间操作单独拿出来。

### 命令

1. fetch
	
	Download objects and refs from another repository

		// usage: git fetch [<options>] [<repository> [<refspec>...]]
	
		// eg.
		git fetch origin master:master
		

2. pull = fetch + merge (rebase)

	Fetch from and integrate with another repository or a local branch
	
	Incorporates changes from a remote repository into the current branch. In its default mode, git pull is shorthand for git fetch followed by git merge FETCH_HEAD.
	
		// git pull [-n | --no-stat] [--[no-]commit] [--[no-]squash] [--[no-]ff] [--[no-]rebase|--rebase=preserve] [-s strategy]... [<fetch-options>] <repo> <head>...
		// eg.
		git pull origin master

3. push

	Update remote refs along with associated objects
		
		// usage: git push [<options>] [<repository> [<refspec>...]]
		
		// eg.
		git push origin master:master
		

4. clone

	Clone a repository into a new directory
	
## 四、Deploy 流程

### part1 开发流程

1. 在deploy根据项目创建分支

        git fetch dev-source remote-project-pmt-x:local-project-pmt-x

2. 开发 ……
        
        git add ……
        git commit ……
        

3. 开发完成，推送到 dev-source 等待测试

        git push dev-souce local-project-pmt-x:remote-project-pmt-x

4. 测试完毕，rebase production-source mater，如果有冲突，解决冲突

        git fetch production-source mater
        git rebase FETCH
        
5. rebase 结束，push 到 dev-source 等待合并
 
### part2 deploy流程

1. 得到最新的branch分支，并rebase最新的master

        git fetch dev-source remote-project-pmt-x:local-project-pmt-x
        git checkout master
        git pull —rebase
        git checkout local-project-pmt-x
        git rebase master

2. checkout 到 master，merge rebase

        git checkout master
        git merge —no-ff local-project-pmt-x

### 解释

production master 线只作 merge 操作，但是它的目标branch都是先 rebase 过master的，所以新的部分一定是单线的，merge的话最多只会有一条分支。如此就是的log如rebase一般清晰的同时，也适当保留了“每个版本”的拉出和回来的点。

这是种针对公司发布版本的优化，并没法像是原生的mergelog那么详细。

====================================================
### Reference:


> git document: http://git-scm.com/doc

> Git for Computer Scientists: http://eagain.net/articles/git-for-computer-scientists/

> Ry’s Git Tutorial: http://rypress.com/tutorials/git/





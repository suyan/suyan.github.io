---
layout: post
title: Vim学习与积累
category: 技术
tags: Vim学习
keywords: Vim学习
description: 
---
接触过Vim很多次了，目前一直在服务器中编写和调试，用Vim更多了，心想借此机会积累更多Vim习惯，于是便诞生了此文。
[以下学习和积累以代码形式记录，会不断补充，秉承学习完全从需求中来的原则]

    #当前状态
    #会基本命令，已经从网上找到主流配置（不含任何插件）

    #复制3行代码 3yy
    #分屏打开新文件 split /path/file.name  (split水平/vsplit垂直/sp水平/vsp垂直)
    #分屏中互相切换 <C-w> +  hjkl(方向)
    #批量打开文件时的水平分屏 vim /path/file1 /path/file2 -o2
    #批量打开文件时的垂直分屏 vim /path/file1 /path/file2 -O2
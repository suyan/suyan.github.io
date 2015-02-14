---
layout: post
title: Shell 常用资源
category: 资源
tags: Shell
keywords: Shell
description: 
---


## 常用指令

### 文本内容搜索

    grep aaa * 

### 文件夹操作

    查看文件夹大小   du -h --max-depth=1 /home/ys
    查看驱动器空间   df -h 

### 压缩命令

    tar zxvf aaa.tar.gz
    tar zcvf aaa.tar.gz aaa

### 登陆到其他用户

    login

### 查看端口的占用

    lsof -i:8087  查看8087端口的使用

### 批量杀死进程

    ps -aux|grep name|grep -v grep|cut -c 9-15|xargs kill -9

### 查看当前时间

    date       时间
    date +%s   时间戳
    date -d "2010-07-20 10:25:30" +%s  指定时间时间戳
    date -d "@1279592730"    时间戳转时间
    date -d "1970-01-01 14781 days" "+%Y/%m/%d %H:%M:%S" 

### 查看进程内存使用情况

    top -d 1 -p pid [,pid ...]
    pmap pid 
    ps aux|grep process_name
    查看/proc/process_id/文件夹下的status文件

### 查看Linux内核版本或发布版本

    lsb_release -a
    uname -a

### 一句话实现一个HTTP服务，把当前文件夹作为根目录

    python -m SimpleHTTPServer

### 查看本地网络服务活动状态

    lsof -i

### 查看自己的外网ip

    curl ifconfig.me

### 下载整个网站

    wget --random-wait -r -p -e robots=off -U mozilla http://www.example.com

### 后台运行一段不中止的程序，并可随时查看它的状态

    screen -d -m -S some_ name ping my_router

### 查看进程执行的时间 

    ps -A -opid,stime,etime,args | grep python

### 创建守护进程

    nohup python /var/www/a.py &

### 查看当前文件夹下文件（文件夹）大小

    du -h --max-depth=1 .

### 查看所有磁盘大小

    df -h

### 诊断网络

    mtr 
    ping
    traceroute
    dig

### 列出本机监听的端口号

    netstat –tlnp
    netstat -anop

### 在远程机器上运行一段脚本

    ssh user@server bash < /path/to/local/script.sh

### 端口扫描

    nc -z -v -n 127.0.0.1 20-100

### 负载测试，30秒内向Google发起20个并发连接

    siege -c20 www.google.co.uk -b -t30s
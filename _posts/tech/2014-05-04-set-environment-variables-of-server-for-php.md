---
layout: post
title: 为PHP设置服务器(Apache/Nginx)环境变量
category: 技术
tags: [PHP, Nginx, Apache]
keywords: PHP,Apache,Nginx,环境变量,服务器
description: 
---

> 设置环境变量常见的地方为区分开发环境/生产环境，或者定义一些数据库的帐号密码

## 设置Apache环境变量

### 指令
设置当前环境变量为`DEV`

    SetEnv RUNTIME_ENVIROMENT DEV

数据库帐号密码

    SetEnv MYSQL_USERNAME root
    SetEnv MYSQL_PASSWORD root

### 配置文件格式

    <VirtualHost *:80>
        ServerAdmin admin@admin.com
        DocumentRoot "/var/www/"
        ServerName localhost
        SetEnv RUNTIME_ENVIROMENT DEV
        SetEnv MYSQL_USERNAME root
        SetEnv MYSQL_PASSWORD root
        ErrorLog "logs/error.log"
        CustomLog "logs/access.log" common
    </VirtualHost>

## 设置Nginx环境变量

### 指令
设置当前环境变量为`DEV`

    fastcgi_param RUNTIME_ENVIROMENT 'DEV'

数据库帐号密码

    fastcgi_param MYSQL_USERNAME 'root'
    fastcgi_param MYSQL_PASSWORD 'root'

### 配置文件格式
在fastcgi_params文件中配置

    fastcgi_param RUNTIME_ENVIROMENT 'DEV';
    fastcgi_param MYSQL_USERNAME 'root';
    fastcgi_param MYSQL_PASSWORD 'root';   

在nginx.conf中配置

    server {
        listen   80; 
        root /var/www;
        index index.php;
        server_name localhost;
        location /
        {   
             index index.php;
        }   
          
        location ~ .*\.(php|php5)?$ {
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_index index.php;
            include fastcgi_params;
        }   
    }

## 为PHP脚本设置环境变量

### 为当前用户临时设置

临时设置只需要执行

    export KEY=VALUE

### 为当前用户永久设置

在`~/.bashrc`（不同系统各有不同）中写

### 为所有用户（不包括root）设置

创建文件`/etc/profile.d/test.sh`，写入

    KEY=VALUE

### 为所有用户（包括root）设置

在`/etc/environment`中写入

    KEY=VALUE

*注意，这个文件的生效时间是用户登录时，所以对于root来说，需要重启机器*

### 在Supervisor中设置

有的时候PHP脚本是用Supervisor来控制的，所以记得设置supervisor配置中的environment项

## 在PHP中调用服务器环境变量

在PHP中有两个调用方式：

    $env = getenv('RUNTIME_ENVIROMENT');

还有超全局变量方式：

    $env = $_SERVER['RUNTIME_ENVIROMENT'];

## 参考
1. [apache和nginx设置环境变量的方法](http://hi.baidu.com/epplera/item/9e41798601f6da7f850fab71)
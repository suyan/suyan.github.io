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

## 在PHP中调用服务器环境变量
在PHP中有两个调用方式：

    $env = getenv('RUNTIME_ENVIROMENT');

还有超全局变量方式：

    $env = $_SERVER['RUNTIME_ENVIROMENT'];

## 参考
1. [apache和nginx设置环境变量的方法](http://hi.baidu.com/epplera/item/9e41798601f6da7f850fab71)
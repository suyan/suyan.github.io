---
layout: post
title: MySQL常用资源
category: 资源
tags: MySQL
keywords: MySQL
description: 
---

## 常用命令

### 登录数据库
    
    mysql -h localhost -uroot -p

### 导出数据库
    
    mysqldump -uroot -p db > db.sql

### 导入数据库
    
    mysql -uroot -p db < db.sql
    // or
    mysql -uroot -p db -e "source /path/to/db.sql"

### 开启远程登录
    
    grant all privileges on ss.* to 'root'@'%' indentified by 'passoword' with grant option;
    // or 
    update user set Host="%" and User="root"
    // 注意%是不包含localhost的
    flush privileges;
    
### 创建用户
    
    CREATE USER 'test'@'localhost' IDENTIFIED BY 'password';
    grant all privileges on *.* to test@'localhost' identified by 'test';
    
### 创建表
    
    CREATE SCHEMA testdb DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;

### 赋予数据库权限

    GRANT ALL ON testdb.* TO 'test'@'localhost';


---
layout: post
title: Apache常用资源
category: 资源
tags: Apache
keywords: Apache
description: 
---

## 常用命令

### 安装
    
    sudo apt update
    sudo apt install apache2

### 建站
    
    sudo mkdir -p /var/www/test.domain.com
    sudo chmod -R 755 /var/www/

### 虚拟主机
    
    cd /etc/apache2/sites-available/
    sudo cp 000-default.conf test.domain.com.conf
    sudo vi test.domain.com.conf

参考如下配置文件

    <VirtualHost *:80>
        ServerAdmin test@domain.com
        DocumentRoot \WebRoot\domain
        ServerName test.domain.com
        ServerAlias test1.domain.com test2.domain.com
        ErrorLog "logs/test.domain.com.error.log"
        CustomLog "logs/test.domain.com.access.log" common
        <Directory \WebRoot\domain>
            Options FollowSymLinks
            AllowOverride None
            Order deny,allow
            Allow from all
            DirectoryIndex index.php index.html default.php
        </Directory>
    </VirtualHost>

测试配置

    sudo apache2ctl configtest #测试
    sudo /etc/init.d/apache2 -k restart #重启

开启虚拟主机

    sudo a2dissite 000-default.conf #禁用原先默认配置
    sudo a2ensite test.domain.com.conf #启用自己的新配置
    sudo a2ensite test2.domain.com.conf #还可以启用另一个配置
    sudo service apache2 restart #重启服务

### 开启rewrite重写
需要将配置中的<code>AllowOverride None</code>改写成<code>AllowOverride All</code>
然后编写 .htaccess文件在网站根目录，如WordPress的例子
    
    # BEGIN WordPress
    <IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.php$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.php [L]
    </IfModule>
    # END WordPress
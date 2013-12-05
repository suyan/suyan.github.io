---
layout: post
title: 安装MySQL和MongoDB的WEB管理界面
category: 工具
tags: [Linux , MySQL , MongoDB]
keywords: Linux,MySQL,MongoDB
description: 在服务器上操作mysql和mongo时，还是有个界面比较直观，对自己的手好一点
---
## MySQL管理界面
这个没多少选择，大部分人都安装的是phpmyadmin，而且简单方便，在ubuntu下，只要

    apt-get install phpmyadmin

设置也不需要，只要在安装过程中输入mysql密码即可，访问`http://localhost/phpmyadmin`即可

## MongoDB管理界面
MongoDB的工具还比较多，没有一个能够统一全部工具的，不过推荐使用RockMongo，这个工具确实速度很快，而且很顺手，支持中文

到[RockMongo](http://rockmongo.com/wiki/introduction?lang=zh_cn)下载安装包

如果Apache有根目录，移动到根目录下，否则自己建立一个`/etc/apache2/conf.d/rockmongo.conf`，写入

    Alias /rockmongo /var/www/rockmongo
    <Directory /var/www/rockmongo>
        Options FollowSymLinks
        DirectoryIndex index.php
    </Directory>

然后要安装php-mongo模块

    apt-get install php5-mongo

修改php配置文件

    echo "extension=mongo.so" >> /etc/php5/apache2/php.ini

然后访问`http://localhost/rockmongo`即可，帐号密码都是admin
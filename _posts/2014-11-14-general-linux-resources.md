---
layout: post
title: Linux 常用资源
category: 资源
tags: [Linux , Ubuntu , Deepin]
keywords: Linux
description: Linux 常用资源[持续更新]
---

## 常用软件

### 系统必备

    sudo apt-get install -y firefox firefox-locale-zh-hans sublime-text meld gawk

### 开发必备

    # 安装 docker
    sudo apt-get install -y apparmor # aufs-tools cgroup-lite ruby
    curl -s https://get.docker.io/ubuntu/ | sudo sh
    # sudo docker run -i -t -p 80:80 -p 3306:3306 -p 5672:5672 -p 15672:15672 -v /media/lee/DATA/www/docker.ubuntu/run.sh:/run.sh -v /media/lee/DATA/www/docker.ubuntu/.bashrc:/root/.bashrc lianghonglamp9 /bin/bash
    # sudo docker run -i -t -p 80:80 -p 3306:3306 -p 5672:5672 -p 15672:15672 -v /path/to/your/app:/app username/my-lamp-app -v /path/to/your/.bashrc:/root/.bashrc username/my-lamp-app /bin/bash
    # ^C + z 可以使程序后台执行
    #安装 mysql 数据库 修改端口3306为3309
    sudo apt-get install -y install mysql-client mysql-server
    sed -i -e"s/^bind-address\s*=\s*127.0.0.1/bind-address = 0.0.0.0/" /etc/mysql/my.cnf
    sed -i -e"s/^port\s*=\s*3309/port = 3309/" /etc/mysql/my.cnf #你也可以不要这一句# casper
    git clone git://github.com/n1k0/casperjs.git
    cd casperjs
    ln -sf `pwd`/bin/casperjs /usr/local/bin/casperjs
    #nodejs 和 npm 安装
    curl -sL https://deb.nodesource.com/setup | sudo bash -
    sudo apt-get install -y nodejs
    #风格检查
    sudo npm install -g jscs
    sudo npm install -g jshint
    sudo npm install -g coffeelint
    #coffeelint -f ~/coffeelint.json <coffee-file>
    sudo npm install -g csslint
    #csslint --ignore=adjoining-classes,text-indent,import,ids --format=compact <css-file>


## 常用技巧

### GBK->UTF-8文件编码批量转换命令

有的时候，国内开源项目的代码是GBK编码，他人递过来帮忙调试的也是GBK编码，下面的代码也许可以帮你忙

    iconv -f GBK -t UTF-8 file1 -o file2

如果文件很多怎么办呢？

    find default -type d -exec mkdir -p utf/{} \;
    find default -type f -exec iconv -f GBK -t UTF-8 {} -o utf/{} \;

这两行命令将default目录下的文件由GBK编码转换为UTF-8编码，目录结构不变，转码后的文件保存在utf/default目录下

### 批量给文件夹可执行权限
文件夹需要有执行权限才可列出该文件夹的内容，文件夹下的文件才可读（就算本身有了可读权限）

    find -type d -exec chmod +x {} \;


### 解决lxde搜狗输入法的黑框问题

1、安装xcompmgr 和gedit

    sudo apt-get install xcompmgr

2、设置xcompmgr自动启动

    mkdir ～/.config/autostart
    vim xcompmgr.desktop

3、将如下内容复制到xcompmgr.desktop文件，保存即可

    [Desktop Entry]
    Type=Application
    Encodeing=UTF-8
    Name="xcompmgr"
    Comment=""
    Exec="xcompmgr"
    hidden=false
    NoDisplay=false
    Terminal=false



###搭建本地git服务(执行在共享项目的根目录)(退出命令即停止服务)
创建本地git服务

    git daemon --reuseaddr --export-all --verbose --base-path=$PWD/../ $PWD

测试本地git的clone

    git clone git://localhost/PWD.FolderName


###网站调试中的小技巧

    $ php app.php | grep "on line"
    PHP Parse error:  syntax error, unexpected '@', expecting ')' in /path/to/your/webApp/test/discuz/relanguage_old_translated/lang_admincp_msg.php on line 172
    PHP Stack trace:
    PHP   1. {main}() /path/to/your/webApp/app.php:0
    PHP   2. TransDiffTool\Translation\TranslationLoader->loadMessages() /path/to/your/webApp/app.php:46
    PHP   3. Symfony\Component\Translation\Loader\PhpFileLoader->load() /path/to/your/webApp/vendor/symfony/translation-extra/TransDiffTool/Translation/TranslationLoader.php:34

运行过程中报出了以上错误(这不是标准输出)，几乎无法调试，索性删除掉这些文件，但是文件又很多，怎么办？下面的第一个命令就可以帮到你

    rm $(php app.php 2>&1 | sed -rn 's/(.*) in (.*) on(.*)/ \2/p') -v
    #将异常输出转到标准输出并按照匹配规则切割出指定内容(这里是文件路径)并执行删除,同时显示出删除文件的路径
    ls -AR $PWD/. | grep lang_setting
    #查找出当前路径下(包括子目录)中，文件名包含有 lang_setting的所有文件
    rm $(find . -name *lang_convert* | grep relanguage)
    #查找出当前目录下，文件名包含有lang_convert，同时路径种还包含有 relanguage 的文件，并删除


###将当前目录下的所有目录打包成tar.gz文件

    ls -F | grep '/$' | awk -F '/'  '{print $1".tar.gz"}''{print $1"/"}' | xargs -n2 tar czvf
    ls -F | grep '/$' | awk -F '/'  '{print strftime("%Y%m%d_%H%M%S").$1".tar.gz"}''{print $1"/"}' | xargs -n2 tar czvf


###将git目录下被批量删除的index.htm批量checkout掉

    git status | grep "删除" | grep "htm" | awk '{print $2}' | xargs git checkout

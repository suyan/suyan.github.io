---
layout: post
title: Docker 常用资源
category: 资源
tags: Docker
keywords: Docker
description: Docker 学习笔记
---

## 安装docker

    sudo apt-get install -y curl && curl -s https://get.docker.io/ubuntu/ | sudo sh #apparmor
    
## 常用命令示例

    sudo service docker start
    sudo docker pull ubuntu:14.04
    sudo docker run -t -i ubuntu /bin/bash #交互
    sudo docker images
    sudo docker commit -m 'Added json gem' -a 'Docker Newbee' 0b2616b0e5a8 ouruser/sinatra:v2 #提交更新后的副本
    sudo docker run -t -i ouruser/sinatra:v2 /bin/bash #版本
    sudo docker push ouruser/sinatra
    docker run
    sudo docker run ubuntu:14.04 /bin/echo 'Hello world'
    sudo docker run -d ubuntu:14.04 /bin/sh -c "while true; do echo hello world; sleep 1; done" #后台以守护
    docker ps -a #可查看容器
    docker restart #命令会将一个运行态的容器终止,然后再重新启动它。
    sudo docker export 7691a814370e > ubuntu.tar #导出
    sudo docker import http://example.com/exampleimage.tgz example/imagerepo #导入快照
    docker logs -f <容器名orID>

## 个人常用实例收藏

    sudo docker ps -a
    sudo docker rm `sudo docker ps --no-trunc -aq`
    docker pull leehom/lamp:latest #拉取镜像
    docker run --name redmine -p 9003:80 -p 9023:22 -d -v /var/redmine/files:/redmine/files -v /var/redmine/mysql:/var/lib/mysql sameersbn/redmine
    #运行一个新容器，同时为它命名、端口映射、文件夹映射。以redmine镜像为例
    docker run -i -t --name sonar -d -link mmysql:db   tpires/sonar-server sonar
    #容器连接到mmysql容器，并将mmysql容器重命名为db。这样，sonar容器就可以使用db的相关的环境变量了。
    sudo docker run -i -t -p 80:80 -p 3306:3306 -p 5672:5672 -p 15672:15672 lianghonglamp10 /bin/bash
    sudo docker export 2850b4037110 > ubuntu.lamp.composer.rabbitmq.2014110415.tar
    sudo docker run -i -t -p 80:80 -p 3306:3306 -p 5672:5672 -p 15672:15672 -v /media/lee/DATA/www/docker.ubuntu/run.sh:/run.sh -v /media/lee/DATA/www/docker.ubuntu/.bashrc:/.bashrc lianghonglamp10 /bin/bash
    docker save busybox-1 > /home/save.tar
    docker load < /home/save.tar
    docker exec -it [container-id] bash # other tty
    sudo docker cp 7bb0e258aefe:/etc/debian_version .#拷贝容器中的一个文件到本地
    sudo docker run --rm -i -t -p 80:80 -p 3306:3306 -v ~/WORK/home.chenlianghong:/home/chenlianghong -v ~/WORK/app:/app -v ~/WORK/mysqldb:/var/lib/mysql -e MYSQL_PASS="admin" leehom/lamp
    
    docker run --name monodb -d tutum/monodb && \
    docker run --name rabbitmq -p 5672:5672 -p 15672:15672 -e RABBITMQ_PASS="rabbitmqpassword" -d tutum/rabbitmq && docker run -i -t -p 80:80 -p 3306:3306 -v /Users:/app -v /Users/home.chenlianghong:/home/chenlianghong -v /Users/mysqldb:/var/lib/mysql -e MYSQL_PASS="admin" --name wetrip --link redis:redis --link rabbitmq:rabbitmq leehom/lamp
    docker start redis && docker start rabbitmq && docker start wetrip && docker exec -it wetrip bash
    
    //boot2docker 可以共享的目录如下
    Users 挂载到 /Users
    /Users 挂载到 /Users
    c/Users 挂载到 /c/Users
    /c/Users 挂载到 /c/Users

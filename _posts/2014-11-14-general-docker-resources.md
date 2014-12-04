---
layout: post
title: Docker 常用资源
category: 资源
tags: Docker
keywords: Docker
description: Docker 学习笔记
---

## 安装docker
    sudo apt-get update
    sudo apt-get install -y docker.io
    sudo ln -sf /usr/bin/docker.io /usr/local/bin/docker
    sudo sed -i '$acomplete -F _docker docker' /etc/bash_completion.d/docker.io

## 通过docker源安装可以保证最新版本
    sudo apt-get install apt-transport-https
    sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 36A1D7869245C8950F966E92D8576A8BA8
    sudo bash -c "echo deb https://get.docker.io/ubuntu docker main > /etc/apt/sources.list.d/docker.list"
    sudo apt-get update
    sudo apt-get install lxc-docker

## 启动docker服务
    sudo service docker start


## 使用镜像
### 获取镜像
    sudo docker pull ubuntu:14.04

### 创建一个容器，让其中运行bash应用
    sudo docker run -t -i ubuntu:14.04 /bin/bash
    #[14.04为TAG标记，不指定，默认为latest]

### 列出本地所有镜像

    sudo docker images

### 修改镜像

    #1，启动
    sudo docker run -t -i training/sinatra /bin/bash
    #2，记住容器ID[0b2616b0e5a8]，添加json和gem
    gem install json
    #3，退出
    exit
    #4，提交更新后的副本
    sudo docker commit -m 'Added json gem' -a 'Docker Newbee' 0b2616b0e5a8 ouruser/sinatra:v2
    #[m]提交说明信息
    #[a]指定更新的用户信息

最后指定目标镜像的仓库名和tag信息
创建成功后会返回镜像ID
可以通过docker images检查新镜像

### 修改已完成，使用新镜像来启动容器
sudo docker run -t -i ouruser/sinatra:v2 /bin/bash


## 创建镜像
### 新建目录和Dockerfile文件
    mkdir sinatra
    cd sinatra
    touch Dockerfile

### 编写完成Dockerfile

【注意：Dockerfile 中每一条指令都创建镜像的一层】
Dockerfile 基本的语法是
使用 # 来注释
FROM 指令告诉 Docker 使用哪个镜像作为基础
接着是维护者的信息
RUN 开头的指令会在创建中运行,比如安装一个软件包,在这里使用 apt-get 来安装了一些软件

### 使用docker build来生成镜像
    sudo docker build -t="ouruser/sinatra:v2" .

### 使用新镜像来启动容器
    sudo docker run -t -i ouruser/sinatra:v2 /bin/bash
    #[还可以用docker tag 命令来修改镜像的标签]
    sudo docker tag tdb4f8471261 ouruser/sinatra:devel
    sudo docker images ouruser/sinatra
    #[可以列出该镜像名的所有镜像，标签会形成对比]

### 从本地文件系统导入一个镜像
    sudo cat ubuntu-14.04-x86_64-minimal.tar.gz |docker import - ubuntu:14.04

### 查看新导入的镜像
    docker images

### 上传镜像
    sudo docker push ouruser/sinatra



### 创建镜像
    docker build [选项] 路径
将读取指定路径下的dockerfile文件并发送到docker服务端
[建议放置dockerfile的目录为空目录，或通过.dockerignore文件忽略路径下的目录和文件]

## 新建并启动容器
    docker run
    sudo docker run ubuntu:14.04 /bin/echo 'Hello world'

## 允许交互的容器
    sudo docker run -t -i ubuntu:14.04 /bin/bash
    # -t 选项让Docker分配一个伪终端(pseudo-tty)并绑定到容器的标准输入上
    # -i 则让容器的标准输入保持打开

## 启动已终止容器
    docker start

## Docker 容器在后台以守护态(Daemonized)形式运行
    sudo docker run -d ubuntu:14.04 /bin/sh -c "while true; do echo hello world; sleep 1; done"


## 终止容器
    docker stop

## 启动了一个终端的容器

    docker ps -a #可查看容器
    docker restart #命令会将一个运行态的容器终止,然后再重新启动它。
用户通过 exit 命令或 Ctrl+d 来退出终端时,所创建的容器立刻终止

## 导出容器
    sudo docker export 7691a814370e > ubuntu.tar

## 导入容器快照
    sudo docker import http://example.com/exampleimage.tgz example/imagerepo

[网络地址和本地地址均可]
既可以使用 docker load 来导入镜像存储文件到本地镜像库,也可以使用 docker import 来导入一个容器快照到本地镜像库。
区别在于容器快照文件将丢弃所有的历史记录和元数据信息(即仅保存容器当时的快照状态),而镜像存储文件将保存完整记录,体积也要大
从容器快照文件导入时可以重新指定标签等元数据信息

## 删除容器

    sudo docker rm -f trusting_newton

## 查看容器的root用户密码

    docker logs <容器名orID> 2>&1 | grep '^User: ' | tail -n1

docker容器启动时的root用户的密码是随机分配的。所以，通过这种方式就可以得到redmine容器的root用户的密码了。


## 查看容器日志

    docker logs -f <容器名orID>

## 个人常用实例收藏
    sudo docker ps -a
    sudo docker rm `sudo docker ps --no-trunc -aq`
    sudo docker images
    docker pull leehom/lamp:latest #拉取镜像
    docker run --name redmine -p 9003:80 -p 9023:22 -d -v /var/redmine/files:/redmine/files -v /var/redmine/mysql:/var/lib/mysql sameersbn/redmine
    #运行一个新容器，同时为它命名、端口映射、文件夹映射。以redmine镜像为例
    docker run -i -t --name sonar -d -link mmysql:db   tpires/sonar-server sonar
    #容器连接到mmysql容器，并将mmysql容器重命名为db。这样，sonar容器就可以使用db的相关的环境变量了。
    sudo docker run -i -t -p 80:80 -p 3306:3306 -p 5672:5672 -p 15672:15672 lianghonglamp10 /bin/bash
    sudo docker export 2850b4037110 > ubuntu.lamp.composer.rabbitmq.2014110415.tar
    sudo docker run -i -t -p 80:80 -p 3306:3306 -p 5672:5672 -p 15672:15672 -v /media/lee/DATA/www/docker.ubuntu/run.sh:/run.sh -v /media/lee/DATA/www/docker.ubuntu/.bashrc:/.bashrc lianghonglamp10 /bin/bash

    #镜像迁移
    docker save busybox-1 > /home/save.tar
    docker load < /home/save.tar
    sudo docker cp 7bb0e258aefe:/etc/debian_version .#拷贝容器中的一个文件到本地
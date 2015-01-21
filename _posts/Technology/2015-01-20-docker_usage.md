---
layout: post                                   
title: docker usage        	   
category: technology                                
tags: [docker,笔记]
keywords: dockerfile
description:
---

## container

### docker run 

#### 单次运行

    docker run ubuntu:14.04 /bin/echo 'Hello world'

#### 守护进程

    
    
### docker ps

    docker ps -a

### docker logs

    docker logs -f image_name
    

### docker stop

    docker stop image_name



## images

### docker images

    docker images
    docker rmi image_name:version

### docker search

    docker search keyword

### docker pull 

    docker pull image_name

### docker commit

    docker commit -m ‘comment’ -a ’author’ image_id image_name:version 

## Dockerfile


## Practice (going1k/lnmp)

#### dockerfile

#### build dockerfile
    
    cd $(dockerfile pwd)
    docker build -t going1k/lnmp:v1 . 

#### image info

1. ubuntu
2. 9bd07e480c5b

#### install list

1. telnet
2. openssh-server


#### create contianer command 

    docker run --name lnmp -v /Users/going1000/development:/var/www:rw -p 80:80 -p 2200:22 -d g1k_lnmp:v1.1 /sbin/my_init --enable-insecure-key

## question 

1. osx mounting volumnes 

    > 只能 mount 非系统目录



## Reference

    > http://viget.com/extend/how-to-use-docker-on-os-x-the-missing-guide

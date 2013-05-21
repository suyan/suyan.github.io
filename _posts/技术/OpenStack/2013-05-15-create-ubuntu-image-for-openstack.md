---
layout: post
title: 给OpenStack创建Ubuntu镜像
category: 技术
tags: OpenStack
description: 接着WinXP和Win7，接下来才做Ubuntu镜像~
---

## 创建Ubuntu镜像

### 创建一个img文件
  
    kvm-img create -f raw ubuntu.img 10G

### 启动安装程序
    
    sudo kvm -m 512 -cdrom ubuntu-12.04-server-amd64.iso -drive file=ubuntu.img -boot d -nographic -vnc :0

### 接入继续安装步骤

我是在ubuntu下完成的，安装一个vncview即可
    
    vncview localhost:5900

这里的端口号根据上一步 -vnc :0 推移，如果是-vnc :1则是5901端口

### 安装过程
  
在分区那里不能有swap分区，手动只设一个分区，挂载`/`根目录

### 装完以后重新开启虚拟机

    sudo kvm -m 512 -drive file=ubuntu.img -boot c -nographic -vnc :0

### 删除下面文件，避免增加除了eth0之外的网卡

    sudo rm -rf /etc/udev/rules.d/70-persistent-net.rules

### 如果制作前使用的是raw格式，想换成qcow2格式

    qemu-img convert -f raw -O qcow2 ./ubuntu.img ./ubuntu.qcow2

## 上传Ubuntu镜像
openstack的命令以[最新文档](http://docs.openstack.org/trunk/openstack-compute/admin/content/creating-a-windows-image.html)为标准，网上博客难免有过时的

    glance image-create --name="ubuntu" --is-public=true --container-format=ovf --disk-format=qcow2 < ubuntu.qcow2

### 在openstack中打开端口（TCP 3389）
另外几个常用端口

- TCP 22 (ssh)
- ICMP -1 (ping)
- TCP 3306 (mysql)

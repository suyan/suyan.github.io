---
layout: post
title: 给OpenStack创建Windows XP镜像
category: 技术
tags: OpenStack
description: 以前在虚拟机里头测试，没法新建镜像，现在给笔记本装了个环境，做个xp镜像先
---

## 创建windows镜像

### 创建一个img文件
  
    kvm-img create -f raw windowsxp.img 10G

### 下载virtio驱动
    
    wget http://alt.fedoraproject.org/pub/alt/virtio-win/archives/virtio-win-0.1-59/virtio-win-0.1-59.iso
    wget http://www.linuxwind.org/download/virtio-win-1.1.16.vfd

### 启动安装程序
    
    sudo kvm -m 1024 -cdrom windowsxp.iso -drive file=windowsxp.img,if=virtio,boot=on -fda virtio-win-1.1.16.vfd -boot d -nographic -vnc :0

### 接入继续安装步骤

我是在ubuntu下完成的，安装一个vncview即可
    
    vncview localhost:5900

### 装完以后别急，因为木有网卡驱动，使用下面方式

    sudo kvm -m 1024 -cdrom virtio-win-0.1-59.iso -drive file=windowsxp.img,if=virtio,boot=on -net nic,model=virtio -boot d -nographic -net user -usb -usbdevice tablet -vnc :0

进入虚拟机以后，安装网卡驱动，然后驱动从CD-ROM中搜索即可

### 有定制需求的时候，可以再次打开，命令如下

    sudo kvm -m 1024 -drive file=windowsxp.img,if=virtio,boot=on -net nic,model=virtio -boot d -nographic -vnc :0

## 上传windows镜像
openstack的命令以[最新文档](http://docs.openstack.org/trunk/openstack-compute/admin/content/creating-a-windows-image.html)为标准，网上博客难免有过时的

    glance image-create --name="My WinServer" --is-public=true --container-format=ovf --disk-format=raw < windowsserver.img

## 远程桌面连接

### 开启xp远程桌面
- 先关闭防火墙，在控制面板里头关
- 在控制面板里头创建一个新用户，一定要设密码。
- 计算机-》属性-》远程-》远程桌面-》允许用户远程连接
- 检查一下服务开了没有：Remote Desktop Help Session Manager和Terminal Services

### 在openstack中打开端口（TCP 3389）
另外几个常用端口

- TCP 22 (ssh)
- ICMP -1 (ping)
- TCP 3306 (mysql)
- TCP 3389 (远程桌面)

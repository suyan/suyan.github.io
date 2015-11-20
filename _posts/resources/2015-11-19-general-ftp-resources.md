---
layout: post
title: FTP常用资源
category: 资源
tags: FTP
keywords: FTP
description: 
---

## 常用命令

### 安装
    
    sudo apt update
    sudo apt install vsftpd

### 配置/etc/vsftpd.conf

    listen=YES #我们是高使用率FTP服务，所以不使用xinetd来进行管理，所以这里常开监听
    anonymous_enable=NO #禁止匿名访问
    local_enable=YES #接受本地用户
    local_root=/wetrip/ftp #设置固定访问目录
    write_enable=YES #允许上传
    dirmessage_enable=YES
    use_localtime=YES
    xferlog_enable=YES
    connect_from_port_20=YES
    chroot_local_user=YES #用户只能访问限制的目录
    secure_chroot_dir=/var/run/vsftpd/empty
    pam_service_name=ftp #如果是vsvtpd会出现503错误
    rsa_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem
    rsa_private_key_file=/etc/ssl/private/ssl-cert-snakeoil.key
    allow_writeable_chroot=YES

### 添加ftp用户
    
    sudo useradd -d /home/ftp -M ftpuser
    sudo passwd ftpuser

### 调整文件夹权限
避免“500 OOPS: vsftpd: refusing to run with writable root inside chroot()”错误

    sudo chmod a-w /home/ftp
    sudo mkdir /home/ftp/data

### 更多
请参考[Vsftpd](http://wiki.ubuntu.org.cn/Vsftpd)
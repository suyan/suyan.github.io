---
layout: post
title: Linux下开启Libvirtd的tcp监控
category: 工具
tags: Linux
description: 在开发OpenStack时，涉及到远程操作Libvirt，这个时候必须打开远程TCP端口才能正常操作
---

使用virsh连接到别的服务器时，使用的是tcp连接

    virsh -c qemu+tcp://host/system

如果目标服务器没有开启libvirtd的tcp端口监听时，会出现

    error: unable to connect to server at 'host:16509': Connection refused
    error: failed to connect to the hypervisor

## ubuntu下解决方法

    sed -i 's/#listen_tls = 0/listen_tls = 0/g' /etc/libvirt/libvirtd.conf
    sed -i 's/#listen_tcp = 1/listen_tcp = 1/g' /etc/libvirt/libvirtd.conf
    sed -i 's/#auth_tcp = "sasl"/auth_tcp = "none"/g' /etc/libvirt/libvirtd.conf

    vi /etc/default/libvirt-bin
    修改为libvirt_opts = "-d -l"  
    增加-l监听tcp

    service libvirt-bin restart

## centos下解决方法

    sed -i 's/#listen_tls = 0/listen_tls = 0/g' /etc/libvirt/libvirtd.conf
    sed -i 's/#listen_tcp = 1/listen_tcp = 1/g' /etc/libvirt/libvirtd.conf
    sed -i 's/#auth_tcp = "sasl"/auth_tcp = "none"/g' /etc/libvirt/libvirtd.conf
    sed -i 's/#LIBVIRTD_ARGS="--listen"/LIBVIRTD_ARGS="--listen"/g' /etc/sysconfig/libvirtd

    service libvirtd restart
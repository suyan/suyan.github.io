---
layout: post
title: MySQL远程访问
category: 工具
tags: MySQL
description: 做开发的时候一直要ssh到服务器，然后再命令行敲各种mysql命令实在是太蛋疼了，有navicat这么好的工具干嘛不用~但是Linux默认情况下数据库是不支持远程访问，所以可以用一下方式增加可访问权限
---

## 增加可访问权限

    格式：grant 权限 on 数据库名.表名 to 用户@登录主机 identified by "用户密码";
    grant select,update,insert,delete on *.* to root@192.168.1.12 identified by "root";

    grant all privileges  on *.* to root@'%' identified by "root";

这样就给账号密码都是root的用户再每一台计算机上登录的权限，其中"%"就是所有的意思

如果这个不行的话直接将%改为你的ip即可

## 开放3306端口

mysql使用的是3306端口，为了防止防火墙将其关闭，可以使用下面方式

    在linux下要开启防火墙 打开3306 端口
    编辑这个文件vim /etc/sysconfig/iptables
    输入
    -A RH-Firewall-1-INPUT -m state --state NEW -m tcp -p tcp --dport 3306 -j ACCEPT
    保存后输入service iptables restart 重启防火墙

上面这个方法是别人说的，但是我没有试成功

    /etc/rc.d/init.d/iptables stop

直接关闭防火墙……这个实在有点直接，但是绝对好使

## MySQL自身设置
在Ubuntu下执行上述步骤还是不能访问，这个时候修改/etc/mysql/my.conf文件，注释掉下面这句：

    bind-address = 127.0.0.1
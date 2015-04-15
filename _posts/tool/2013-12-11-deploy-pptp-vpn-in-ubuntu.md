---
layout: post
title: 在ubuntu下搭建pptp vpn服务器
category: 工具
tags: Linux
keywords: Linux,pptp,vpn
---

>最近弄了digitalocean的vps，研究了一下搭建一个vpn自己用，因为有些系统代理goagent还是搞不定。但是事实证明digitalocean线路还是很不稳，基本上没啥帮助=0=

## pptp配置

### 安装pptp
用ubuntu就是安装东西快

    sudo apt-get -y update
    sudo apt-get -y install pptpd

### 修改配置脚本
配置一下dns

    cat >/etc/ppp/options.pptpd <<END
    name pptpd
    refuse-pap
    refuse-chap
    refuse-mschap
    require-mschap-v2
    require-mppe-128
    ms-dns 8.8.8.8
    ms-dns 8.8.4.4
    proxyarp
    lock
    nobsdcomp 
    novj
    novjccomp
    nologfd
    END

说明

- name pptpd（pptpd服务名，可以随便填写。）
- refuse-pap（拒绝pap身份认证模式。）
- refuse-chap（拒绝chap身份认证模式。）
- refuse-mschap（拒绝mschap身份认证模式。）
- require-mschap-v2（在端点进行连接握手时需要使用微软的 mschap-v2 进行自身验证。）
- require-mppe-128（MPPE 模块使用 128 位加密。）
- ms-dns 8.8.8.8 (ppp 为 Windows 客户端提供 DNS 服务器 IP 地址。)
- proxyarp (建立 ARP 代理键值。)
- nodefaultroute（不替换默认路由）
- debug（开启调试模式，相关信息记录在 /var/logs/message 中。）
- lock（锁定客户端 PTY 设备文件。）
- nobsdcomp (禁用 BSD 压缩模式。)

还有ip

    cat > /etc/pptpd.conf <<END
    option /etc/ppp/options.pptpd
    logwtmp
    localip 192.168.2.1
    remoteip 192.168.2.10-100
    END

## 增加路由转发
### ipv4转发
    
    cat >> /etc/sysctl.conf <<END
    net.ipv4.ip_forward=1
    END
    sysctl -p

### 修改iptables

备份当前iptables

    iptables-save > /etc/iptables.down.rules

修改iptable NAT转发

    iptables -t nat -A POSTROUTING -s 192.168.2.0/24 -o eth0 -j MASQUERADE

设置MTU

    iptables -I FORWARD -s 192.168.2.0/24 -p tcp --syn -i ppp+ -j TCPMSS --set-mss 1300

保存新iptables

    iptables-save > /etc/iptables.up.rules

重启后继续有效

    cat >>/etc/ppp/pptpd-options<<EOF
    pre-up iptables-restore < /etc/iptables.up.rules
    post-down iptables-restore < /etc/iptables.down.rules
    EOF

### 增加用户

增加帐号密码都是test的用户

    cat >/etc/ppp/chap-secrets <<END
    test pptpd test *
    END

### 重启服务

    /etc/init.d/pptpd restart
    netstat -lntp

## 自动脚本

    wget -c https://github.com/suyan/scripts/raw/master/Setup/pptp.sh

## 问题

### logwtmp.so 版本问题

如果链接中断，并且出现下面问题：

    Plugin /usr/lib/pptpd/pptpd-logwtmp.so is for pppd version 2.4.5, this is 2.4.6

在 `/etc/pptpd.conf` 文件中把 `logwtmp` 删掉就好了。

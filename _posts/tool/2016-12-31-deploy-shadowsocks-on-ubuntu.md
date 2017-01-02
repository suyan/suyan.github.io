---
layout: post
title: 在 Ubuntu 下部署 Shadowsocks
category: 工具
tags: Tools
keywords: 科学上网,工具,VPN,Shadowsocks
---

回国以后先试了部署 L2TP VPN（[在 Ubuntu 下部署 L2TP VPN](/2016/12/30/deploy-l2tp-on-ubuntu.html)），结果发现 VPN 稳定性还是略差，经常掉线。其实对于一般的浏览网页需求，Shadowsocks 就足够了，所以就有了此文。

## 服务端

我的环境是 Linode Tokyo + Ubuntu 14.04

这里依然提供一个一键脚本，[Shadowsocks Python版一键安装脚本](https://teddysun.com/342.html)。

想手动配置的往下看。

### 安装 Shadowsocks

```bash
apt-get update
apt-get install python-pip
pip install shadowsocks
```

### 配置 Shadowsocks

下面的password那儿自己修改一下

```bash
MYIP=`/sbin/ifconfig -a|grep inet|grep -v 127.0.0.1|grep -v inet6|awk '{print $2}'|tr -d "addr:"`

cat >/etc/shadowsocks.json<<EOF
{
    "server":"$MYIP",
    "server_port":8989,
    "local_address": "127.0.0.1",
    "local_port":1080,
    "password":"test",
    "timeout":300,
    "method":"aes-256-cfb",
    "fast_open": false
}
EOF
```

### 启动 Shadowsocks

```bash
ssserver -c /etc/shadowsocks.json -d start
```

## 客户端

客户端的话可以直接去[官网查看](https://shadowsocks.org/en/download/clients.html)，我之前使用的是 [ShadowsocksX-NG](https://github.com/shadowsocks/ShadowsocksX-NG/releases)，但是我发现这里我自己设置了代理网站后总是不能立刻生效。

所以现在改到了[SpechtLite](https://github.com/zhuhaow/SpechtLite)，根据[这篇文章](http://www.jianshu.com/p/663a898aa01a)可以非常方便配置。iOS下的客户端的话，推荐 [Wingy](https://itunes.apple.com/cn/app/wingy-proxy-for-http-s-socks5/id1178584911?mt=8)，设置也非常简单。

这里提一下最近很火的 Surge，这个软件确实是神器一枚，使用起来非常方便。只是它暂时功能还有限，感觉并不值当前的价格，如果未来提供像 Charles 一样强大的功能的话，即使不用来科学上网，也是很值得入手的应用之一。不过据说还在开发中，所以之后可以考虑入手一枚。



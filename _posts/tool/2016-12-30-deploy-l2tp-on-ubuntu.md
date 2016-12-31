---
layout: post
title: 在 Ubuntu 下部署 L2TP VPN
category: 工具
tags: Tools
keywords: 科学上网,工具,VPN,L2TP
---

回国之后为了正常上网，还是得部署一个 VPN 自用。之前写过[在ubuntu下搭建pptp vpn服务器](/2013/12/11/deploy-pptp-vpn-in-ubuntu.html)，本来准备直接拿来用的，结果发现 MacOS Sierra 竟然不支持 PPTP 了 T_T 只好重新选择一个方式，这篇主要讲如何部署 L2TP VPN 在 Ubuntu 下，以及如何通过 Mac 连接上去。

## 服务端

我的环境是 Linode Tokyo + Ubuntu 14.04

如果不像自己配置，这里有一键脚本，非常方便。[setup-simple-ipsec-l2tp-vpn](https://github.com/philpl/setup-simple-ipsec-l2tp-vpn).

```bash
wget https://raw.github.com/philpl/setup-simple-ipsec-l2tp-vpn/master/setup.sh
sudo sh setup.sh
```

如果喜欢手动安装，可以往下看。我在root下执行的，所以没有加sudo，如果不是root用户记得加上。

### 安装必备软件

```bash
apt-get update
apt install software-properties-common
add-apt-repository ppa:openswan/ppa
apt-get update
apt-get install openswan xl2tpd ppp lsof
```

### 配置IP转发

#### 更新IP转发

```bash
echo "net.ipv4.ip_forward = 1" |  tee -a /etc/sysctl.conf
echo "net.ipv4.conf.all.accept_redirects = 0" |  tee -a /etc/sysctl.conf
echo "net.ipv4.conf.all.send_redirects = 0" |  tee -a /etc/sysctl.conf
echo "net.ipv4.conf.default.rp_filter = 0" |  tee -a /etc/sysctl.conf
echo "net.ipv4.conf.default.accept_source_route = 0" |  tee -a /etc/sysctl.conf
echo "net.ipv4.conf.default.send_redirects = 0" |  tee -a /etc/sysctl.conf
echo "net.ipv4.icmp_ignore_bogus_error_responses = 1" |  tee -a /etc/sysctl.conf
for vpn in /proc/sys/net/ipv4/conf/*; do echo 0 > $vpn/accept_redirects; echo 0 > $vpn/send_redirects; done
```

#### 设置IP table

```bash
MYIP=`/sbin/ifconfig -a|grep inet|grep -v 127.0.0.1|grep -v inet6|awk '{print $2}'|tr -d "addr:"`
iptables -t nat -A POSTROUTING -j SNAT --to-source $MYIP -o eth0
```

### 配置IPSEC

#### IPSEC 基本设置
```bash
MYIP=`/sbin/ifconfig -a|grep inet|grep -v 127.0.0.1|grep -v inet6|awk '{print $2}'|tr -d "addr:"`

cat >/etc/ipsec.conf<<EOF
version 2 # conforms to second version of ipsec.conf specification

config setup
    dumpdir=/var/run/pluto/
    #in what directory should things started by setup (notably the Pluto daemon) be allowed to dump core?

    nat_traversal=yes
    #whether to accept/offer to support NAT (NAPT, also known as "IP Masqurade") workaround for IPsec

    virtual_private=%v4:10.0.0.0/8,%v4:192.168.0.0/16,%v4:172.16.0.0/12,%v6:fd00::/8,%v6:fe80::/10
    #contains the networks that are allowed as subnet= for the remote client. In other words, the address ranges that may live behind a NAT router through which a client connects.

    protostack=netkey
    #decide which protocol stack is going to be used.

    force_keepalive=yes
    keep_alive=60
    # Send a keep-alive packet every 60 seconds.

conn L2TP-PSK-noNAT
    authby=secret
    #shared secret. Use rsasig for certificates.

    pfs=no
    #Disable pfs

    auto=add
    #the ipsec tunnel should be started and routes created when the ipsec daemon itself starts.

    keyingtries=3
    #Only negotiate a conn. 3 times.

    ikelifetime=8h
    keylife=1h

    ike=aes256-sha1,aes128-sha1,3des-sha1
    phase2alg=aes256-sha1,aes128-sha1,3des-sha1
    # https://lists.openswan.org/pipermail/users/2014-April/022947.html
    # specifies the phase 1 encryption scheme, the hashing algorithm, and the diffie-hellman group. The modp1024 is for Diffie-Hellman 2. Why 'modp' instead of dh? DH2 is a 1028 bit encryption algorithm that modulo's a prime number, e.g. modp1028. See RFC 5114 for details or the wiki page on diffie hellmann, if interested.

    type=transport
    #because we use l2tp as tunnel protocol

    left=$MYIP
    #fill in server IP above

    leftprotoport=17/1701
    right=%any
    rightprotoport=17/%any

    dpddelay=10
    # Dead Peer Dectection (RFC 3706) keepalives delay
    dpdtimeout=20
    #  length of time (in seconds) we will idle without hearing either an R_U_THERE poll from our peer, or an R_U_THERE_ACK reply.
    dpdaction=clear
    # When a DPD enabled peer is declared dead, what action should be taken. clear means the eroute and SA with both be cleared.
EOF
```

#### IPSEC密码

下面的 sharedpassword 可以改，但是得自己记住，因为之后连接的时候会用到。

```bash
MYIP=`/sbin/ifconfig -a|grep inet|grep -v 127.0.0.1|grep -v inet6|awk '{print $2}'|tr -d "addr:"`

cat >/etc/ipsec.secrets<<EOF
$MYIP %any: PSK "sharedpassword"
EOF

service ipsec restart
```

#### 验证IPSEC

```bash
ipsec verify
```

结果应该如下

```bash
Checking if IPsec got installed and started correctly:

Version check and ipsec on-path                   	[OK]
Openswan U2.6.42/K3.16.7-x86_64-linode49 (netkey)
See `ipsec --copyright' for copyright information.
Checking for IPsec support in kernel              	[OK]
 NETKEY: Testing XFRM related proc values
         ICMP default/send_redirects              	[OK]
         ICMP default/accept_redirects            	[OK]
         XFRM larval drop                         	[OK]
Hardware random device check                      	[N/A]
Two or more interfaces found, checking IP forwarding	[OK]
Checking rp_filter                                	[ENABLED]
 /proc/sys/net/ipv4/conf/all/rp_filter            	[ENABLED]
Checking that pluto is running                    	[OK]
 Pluto listening for IKE on udp 500               	[OK]
 Pluto listening for IKE on tcp 500               	[NOT IMPLEMENTED]
 Pluto listening for IKE/NAT-T on udp 4500        	[OK]
 Pluto listening for IKE/NAT-T on tcp 4500        	[NOT IMPLEMENTED]
 Pluto listening for IKE on tcp 10000 (cisco)     	[NOT IMPLEMENTED]
Checking NAT and MASQUERADEing                    	[TEST INCOMPLETE]
Checking 'ip' command                             	[OK]
Checking 'iptables' command                       	[OK]
```

### 配置xl2tpd

```bash
cat >/etc/xl2tpd/xl2tpd.conf<<EOF
[global]
ipsec saref = yes
saref refinfo = 30

;debug avp = yes
;debug network = yes
;debug state = yes
;debug tunnel = yes

[lns default]
ip range = 172.16.1.30-172.16.1.100
local ip = 172.16.1.1
refuse pap = yes
require authentication = yes
;ppp debug = yes
pppoptfile = /etc/ppp/options.xl2tpd
length bit = yes
EOF
```

### 配置PPP

#### 基本设置

```bash
cat >/etc/ppp/options.xl2tpd<<EOF
require-mschap-v2
ms-dns 8.8.8.8
ms-dns 8.8.4.4
auth
mtu 1000
mru 1000
crtscts
hide-password
modem
name l2tpd
proxyarp
lcp-echo-interval 0
lcp-echo-failure 0
EOF
```

#### 添加用户

记得更改账户名和密码 client 和 secret，用来连接vpn的时候使用

```bash
cat >/etc/ppp/chap-secrets<<EOF
# Secrets for authentication using CHAP
# client       server  secret       IP addresses
test          l2tpd   test            *
EOF
```

### 重启服务

```bash
service ipsec restart
/etc/init.d/xl2tpd restart
```

## 客户端

### Mac

打开 系统设置 -> 网络 点击左下角➕然后选择 VPN，Type选择 L2TP over IPSec。

- Server Address: 服务器ip
- Account name: 前面设置的client名

点开认证设定

- Password: 之前设置的secret
- Shared Secret: 之前设置的sharedpassword

别忘了在高级那里选择，所有流量都通过此网络转发。

## 参考

[l2tp ipsec in linode](http://tacy.github.io/blog/2014/12/24/L2tp-ipsec-in-linode/)


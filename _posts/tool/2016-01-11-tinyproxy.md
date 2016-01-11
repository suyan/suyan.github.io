Title: 利用 Tinyproxy 搭建 HTTP(S) 代理
Date: 2013-12-09 20:50
Author: toy
Category: Apps
Slug: tinyproxy

在天朝每月总有那么几天访问网站不够顺畅，你懂的。虽然  
可以使用 [Google Translate][g] 来应个急，但并非 100%  
有效，比如最近我在访问 wireshark.org 时就遇到了问题。  

好在我们还能搭建 HTTP(S) 代理。目前市面上有许多 HTTP(S) 代理  
软件可以选择，我们将使用 [Tinyproxy][t]。我们选择 Tinyproxy，  
是因为它足够简单、小巧，且无需过多的配置。

#### 安装 Tinyproxy

在 Debian 中，通过执行以下指令可以安装 Tinyproxy：

apt-get install tinyproxy

#### 配置 Tinyproxy

Tinyproxy 的配置文件默认位于 `/etc/tinyproxy.conf`。在此，你  
可以配置其使用的端口号（默认是 8888）、超时、允许的最大客户  
端等等。如果你希望在任意位置都能访问代理服务器，那么可以将  
默认的 `Allow` 行注释掉。

注意更新配置后，需要 reload 服务才会生效。另外，如果开了 iptables  
防火墙的话，需要添加如下规则：

iptables -I INPUT -p tcp --dport 8888 -j ACCEPT

#### 浏览器设置

以 Firefox 为例，在“首选项 > 高级 > 网络 > 设置”中，选择“  
手动代理配置”，接着在“HTTP 代理”中填入服务器 IP，“端口”中  
填入 8888，再确定就可以了。

[g]:
http://toy.linuxtoy.org/2013/11/13/proxy-web-page-with-google-translate.html  
[t]: https://banu.com/tinyproxy/

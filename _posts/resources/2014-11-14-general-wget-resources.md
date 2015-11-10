---
layout: post
title: Wget 常用资源
category: 资源
tags: [Linux , Wget]
keywords: Linux
description: wget学习笔记
---

## 实例

### 监听网页更新

    content="$(wget --secure-protocol=TLSv1 --timeout=3 -t 1 -q -O - http://wh.ganji.com/fang1/jiangxia/p1/)"
    if [-z "$content"];then
      echo  "Internet Connection Error."
      exit
    fi
    str="$(echo "$content"|grep ">\[转让\]"|sed 's#.*\(\[转让\].[^<]*\)<.*#\1#')"
    echo "$str"

### 下载一个网站的目录

    wget -U “Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1)” -r -p -k -np -Pmydir -nc -o down.log http://www.yourdomain.com/yourdir/index.html

### 下载整个网站

    wget -U “Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1)” -r -p -k -nc -o down.log http://www.yourdomain.com/index.html

    -U 修改agent，伪装成IE货firefox等
    -r 递归；对于HTTP主机，wget首先下载URL指定的文件，然后（如果该文件是一个HTML文档的话）递归下载该文件所引用（超级连接）的所有文件（递归深度由参数-l指定）。对FTP主机，该参数意味着要下载URL指定的目录中的所有文件，递归方法与HTTP主机类似。
    -c 指定断点续传功能。实际上，wget默认具有断点续传功能，只有当你使用别的ftp工具下载了某一文件的一部分，并希望wget接着完成此工作的时候，才需要指定此参数。
    -nc 不下载已经存在的文件
    -np 表示不跟随链接，只下载指定目录及子目录里的东西；
    -p 下载页面显示所需的所有文件。比如页面中包含了图片，但是图片并不在/yourdir目录中，而在/images目录下，有此参数，图片依然会被正常下载。
    -k 修复下载文件中的绝对连接为相对连接，这样方便本地阅读。

### 其它

    wget -nd -P ./nikon -l 1 -A.jpg -r -e robots=off -H -D img.somedomain.com http://www.somedomain.com/reviews/sample_images

    wget -t0 -c -nH -x -np -b -m -P /home/sunny/NOD32view/  http://downloads1.somedomain.com/bases/ -o wget.log

    wget -w1 -r -e robots=off -H -m http://somedomain.com -o ~/wget.log

    wget -r -e robots=off -k -np -N http://blog.somedomain.com/manual/shell -o manual.wget.log

## WGET 手册
    用法： wget [选项]... [URL]...
    长选项所必须的参数在使用短选项时也是必须的。
### 启动：
      -V,  --version           显示 Wget 的版本信息并退出。
      -h,  --help              打印此帮助。
      -b,  --background        启动后转入后台。
      -e,  --execute=COMMAND   运行一个“.wgetrc”风格的命令。

### 日志和输入文件：
      -o,  --output-file=FILE    将日志信息写入 FILE。
      -a,  --append-output=FILE  将信息添加至 FILE。
      -d,  --debug               打印大量调试信息。
      -q,  --quiet               安静模式 (无信息输出)。
      -v,  --verbose             详尽的输出 (此为默认值)。
      -nv, --no-verbose          关闭详尽输出，但不进入安静模式。
      -i,  --input-file=FILE     下载本地或外部 FILE 中的 URLs。
      -F,  --force-html          把输入文件当成 HTML 文件。
      -B,  --base=URL            解析与 URL 相关的
                                 HTML 输入文件 (由 -i -F 选项指定)。
           --config=FILE         Specify config file to use.

### 下载：
      -t,  --tries=NUMBER            设置重试次数为 NUMBER (0 代表无限制)。
           --retry-connrefused       即使拒绝连接也是重试。
      -O,  --output-document=FILE    将文档写入 FILE。
      -nc, --no-clobber              skip downloads that would download to
                                     existing files (overwriting them).
      -c,  --continue                断点续传下载文件。
           --progress=TYPE           选择进度条类型。
      -N,  --timestamping            只获取比本地文件新的文件。
      --no-use-server-timestamps     不用服务器上的时间戳来设置本地文件。
      -S,  --server-response         打印服务器响应。
           --spider                  不下载任何文件。
      -T,  --timeout=SECONDS         将所有超时设为 SECONDS 秒。
           --dns-timeout=SECS        设置 DNS 查寻超时为 SECS 秒。
           --connect-timeout=SECS    设置连接超时为 SECS 秒。
           --read-timeout=SECS       设置读取超时为 SECS 秒。
      -w,  --wait=SECONDS            等待间隔为 SECONDS 秒。
           --waitretry=SECONDS       在获取文件的重试期间等待 1..SECONDS 秒。
           --random-wait             获取多个文件时，每次随机等待间隔
                                     0.5*WAIT...1.5*WAIT 秒。
           --no-proxy                禁止使用代理。
      -Q,  --quota=NUMBER            设置获取配额为 NUMBER 字节。
           --bind-address=ADDRESS    绑定至本地主机上的 ADDRESS (主机名或是 IP)。
           --limit-rate=RATE         限制下载速率为 RATE。
           --no-dns-cache            关闭 DNS 查寻缓存。
           --restrict-file-names=OS  限定文件名中的字符为 OS 允许的字符。
           --ignore-case             匹配文件/目录时忽略大小写。
      -4,  --inet4-only              仅连接至 IPv4 地址。
      -6,  --inet6-only              仅连接至 IPv6 地址。
           --prefer-family=FAMILY    首先连接至指定协议的地址
                                     FAMILY 为 IPv6，IPv4 或是 none。
           --user=USER               将 ftp 和 http 的用户名均设置为 USER。
           --password=PASS           将 ftp 和 http 的密码均设置为 PASS。
           --ask-password            提示输入密码。
           --no-iri                  关闭 IRI 支持。
           --local-encoding=ENC      IRI (国际化资源标识符) 使用 ENC 作为本地编码。
           --remote-encoding=ENC     使用 ENC 作为默认远程编码。
           --unlink                  remove file before clobber.

### 目录：
      -nd, --no-directories           不创建目录。
      -x,  --force-directories        强制创建目录。
      -nH, --no-host-directories      不要创建主目录。
           --protocol-directories     在目录中使用协议名称。
      -P,  --directory-prefix=PREFIX  以 PREFIX/... 保存文件
           --cut-dirs=NUMBER          忽略远程目录中 NUMBER 个目录层。

### HTTP 选项：
           --http-user=USER        设置 http 用户名为 USER。
           --http-password=PASS    设置 http 密码为 PASS。
           --no-cache              不在服务器上缓存数据。
           --default-page=NAME     改变默认页
                                   (默认页通常是“index.html”)。
      -E,  --adjust-extension      以合适的扩展名保存 HTML/CSS 文档。
           --ignore-length         忽略头部的‘Content-Length’区域。
           --header=STRING         在头部插入 STRING。
           --max-redirect          每页所允许的最大重定向。
           --proxy-user=USER       使用 USER 作为代理用户名。
           --proxy-password=PASS   使用 PASS 作为代理密码。
           --referer=URL           在 HTTP 请求头包含‘Referer: URL’。
           --save-headers          将 HTTP 头保存至文件。
      -U,  --user-agent=AGENT      标识为 AGENT 而不是 Wget/VERSION。
           --no-http-keep-alive    禁用 HTTP keep-alive (永久连接)。
           --no-cookies            不使用 cookies。
           --load-cookies=FILE     会话开始前从 FILE 中载入 cookies。
           --save-cookies=FILE     会话结束后保存 cookies 至 FILE。
           --keep-session-cookies  载入并保存会话 (非永久) cookies。
           --post-data=STRING      使用 POST 方式；把 STRING 作为数据发送。
           --post-file=FILE        使用 POST 方式；发送 FILE 内容。
           --content-disposition   当选中本地文件名时
                                   允许 Content-Disposition 头部 (尚在实验)。
           --auth-no-challenge     发送不含服务器询问的首次等待
                                   的基本 HTTP 验证信息。

### HTTPS (SSL/TLS) 选项：
       --secure-protocol=PR     选择安全协议，可以是 auto、SSLv2、
                                SSLv3 或是 TLSv1 中的一个。
       --no-check-certificate   不要验证服务器的证书。
       --certificate=FILE       客户端证书文件。
       --certificate-type=TYPE  客户端证书类型，PEM 或 DER。
       --private-key=FILE       私钥文件。
       --private-key-type=TYPE  私钥文件类型，PEM 或 DER。
       --ca-certificate=FILE    带有一组 CA 认证的文件。
       --ca-directory=DIR       保存 CA 认证的哈希列表的目录。
       --random-file=FILE       带有生成 SSL PRNG 的随机数据的文件。
       --egd-file=FILE          用于命名带有随机数据的 EGD 套接字的文件。

### FTP 选项：
       --ftp-user=USER         设置 ftp 用户名为 USER。
       --ftp-password=PASS     设置 ftp 密码为 PASS。
       --no-remove-listing     不要删除‘.listing’文件。
       --no-glob               不在 FTP 文件名中使用通配符展开。
       --no-passive-ftp        禁用“passive”传输模式。
       --retr-symlinks         递归目录时，获取链接的文件 (而非目录)。

### 递归下载：
      -r,  --recursive          指定递归下载。
      -l,  --level=NUMBER       最大递归深度 (inf 或 0 代表无限制，即全部下载)。
           --delete-after       下载完成后删除本地文件。
      -k,  --convert-links      让下载得到的 HTML 或 CSS 中的链接指向本地文件。
      -K,  --backup-converted   在转换文件 X 前先将它备份为 X.orig。
      -m,  --mirror             -N -r -l inf --no-remove-listing 的缩写形式。
      -p,  --page-requisites    下载所有用于显示 HTML 页面的图片之类的元素。
           --strict-comments    用严格方式 (SGML) 处理 HTML 注释。

### 递归接受/拒绝：
      -A,  --accept=LIST               逗号分隔的可接受的扩展名列表。
      -R,  --reject=LIST               逗号分隔的要拒绝的扩展名列表。
      -D,  --domains=LIST              逗号分隔的可接受的域列表。
           --exclude-domains=LIST      逗号分隔的要拒绝的域列表。
           --follow-ftp                跟踪 HTML 文档中的 FTP 链接。
           --follow-tags=LIST          逗号分隔的跟踪的 HTML 标识列表。
           --ignore-tags=LIST          逗号分隔的忽略的 HTML 标识列表。
      -H,  --span-hosts                递归时转向外部主机。
      -L,  --relative                  只跟踪有关系的链接。
      -I,  --include-directories=LIST  允许目录的列表。
      --trust-server-names             use the name specified by the redirection
                                       url last component.
      -X,  --exclude-directories=LIST  排除目录的列表。
      -np, --no-parent                 不追溯至父目录。
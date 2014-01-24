---
layout: post
title: Apache 日志文件格式及简单处理
category: 技术
tags: Apache
keywords: Apache,Log,日志,格式,处理,分析,Format
description: 
---

> Apache对于所有经手的访问日志，都会记录在access_log中，对这个文件分析，可以了解很多服务器情况。例如访问来源，访问资源等

## 日志格式
根据[Apache文档][1]，可以看到我们可以通过设置`LogFormat`来设置Apache记录的日志格式。简单的几种设置格式如下：

    1. Common Log Format (CLF)
    "%h %l %u %t \"%r\" %>s %b"
    2. Common Log Format with Virtual Host
    "%v %h %l %u %t \"%r\" %>s %b"
    3. NCSA extended/combined log format
    "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-agent}i\""
    4. Referer log format
    "%{Referer}i -> %U"
    5. Agent (Browser) log format
    "%{User-agent}i"

这些格式都代表什么意思呢？下面是一个参考表

    %%  百分号(Apache2.0.44或更高的版本)
    %a  远端IP地址
    %A  本机IP地址
    %B  除HTTP头以外传送的字节数
    %b  以CLF格式显示的除HTTP头以外传送的字节数，也就是当没有字节传送时显示’-‘而不是0。
    %{Foobar}C  在请求中传送给服务端的cookieFoobar的内容。
    %D  服务器处理本请求所用时间，以微为单位。
    %{FOOBAR}e  环境变量FOOBAR的值
    %f  文件名
    %h  远端主机
    %H  请求使用的协议
    %{Foobar}i  发送到服务器的请求头Foobar:的内容。
    %l  远端登录名(由identd而来，如果支持的话)，除非IdentityCheck设为”On“，否则将得到一个”-”。
    %m  请求的方法
    %{Foobar}n  来自另一个模块的注解Foobar的内容。
    %{Foobar}o  应答头Foobar:的内容。
    %p  服务器服务于该请求的标准端口。
    %P  为本请求提供服务的子进程的PID。
    %{format}P  服务于该请求的PID或TID(线程ID)，format的取值范围为：pid和tid(2.0.46及以后版本)以及hextid(需要APR1.2.0及以上版本)
    %q  查询字符串(若存在则由一个”?“引导，否则返回空串)
    %r  请求的第一行
    %s  状态。对于内部重定向的请求，这个状态指的是原始请求的状态，
        —%>s则指的是最后请求的状态。
    %t  时间，用普通日志时间格式(标准英语格式)
    %{format}t  时间，用strftime(3)指定的格式表示的时间。(默认情况下按本地化格式)
    %T  处理完请求所花时间，以秒为单位。
    %u  远程用户名(根据验证信息而来；如果返回status(%s)为401，可能是假的)
    %U  请求的URL路径，不包含查询字符串。
    %v  对该请求提供服务的标准ServerName。
    %V  根据UseCanonicalName指令设定的服务器名称。
    %X  请求完成时的连接状态：
        X=  连接在应答完成前中断。
        +=  应答传送完后继续保持连接。
        -=  应答传送完后关闭连接。
    (在1.3以后的版本中，这个指令是%c，但这样就和过去的SSL语法：%{var}c冲突了)
    %I  接收的字节数，包括请求头的数据，并且不能为零。要使用这个指令你必须启用mod_logio模块。
    %O  发送的字节数，包括请求头的数据，并且不能为零。要使用这个指令你必须启用mod_logio模块。

这么多看着就头疼，拿个例子来说明一下，比如

    "%h %l %u %t \"%r\" %>s %b"

这是最常见的日志记录格式，一般也是系统默认的，对应记录下来的日志为：

    61.135.219.2 - - [01/Jan/2014:00:02:02 +0800] "GET /feed/ HTTP/1.0" 200 12306

分解说明一下：

1. 61.135.219.2  访问来源IP
2. '-'  远端登录名(由identd而来，如果支持的话)
3. '-'  远程用户名
4. [01/Jan/2014:00:02:02 +0800] 请求时间，格式为[day/month/year:hour:minute:second zone]
5. "GET /feed/ HTTP/1.0" 请求内容，格式为"%m %U%q %H"，即"请求方法/访问路径/协议"
6. 200 状态码
7. 12306 返回数据大小

## 简单处理
平常不太复杂的日志文件分析和处理直接可以用Shell脚本搞定，下面是几个常用脚本

    1.查看apache的进程数
    ps -aux | grep httpd | wc -l

    2.分析日志查看当天的ip连接数
    cat default-access_log | grep "10/Dec/2010" | awk '{print $2}' | sort | uniq -c | sort -nr

    3.查看指定的ip在当天究竟访问了什么url
    cat default-access_log | grep "10/Dec/2010" | grep "218.19.140.242" | awk '{print $7}' | sort | uniq -c | sort -nr

    4.查看当天访问排行前10的url
    cat default-access_log | grep "10/Dec/2010" | awk '{print $7}' | sort | uniq -c | sort -nr | head -n 10

    5.看到指定的ip究竟干了什么
    cat default-access_log | grep 218.19.140.242 | awk '{print $1"\t"$8}' | sort | uniq -c | sort -nr | less

    6.查看访问次数最多的几个分钟(找到热点)
    awk '{print $4}' default-access_log |cut -c 14-18|sort|uniq -c|sort -nr|head

另外可以对日志进行简单的处理，只保留自己需要的行和列，这个处理我用python写了。例如SAE拿下来的日志

    yansublog.sinaapp.com 61.135.219.2 930269 99 [01/Jan/2014:00:02:02 +0800] yansublog 636 1 "GET /feed/ HTTP/1.0" 304 - "-" "Mozilla/5.0 (compatible;YoudaoFeedFetcher/1.0;http://www.youdao.com/help/reader/faq/topic006/;2 subscribers;)" 61.135.219.2.1388505722221452 yq22

挺多数据，但是其中有不知道干啥用的，为了分析方便，把不知道用处的删掉

    import re

    f_input = open('access_log', 'r')
    f_output = open('access_simple', 'w')

    for line in f_input:
        log = re.findall(r'.* (.*) .* .* (\[.*\]) .* .* .* (\".*\") (.*) (.*) (\".*\") (\".*\") .* .*', line)   
        log = list(log[0])
        log[1:1] = '-'
        log[1:1] = '-'
        f_output.write(' '.join(log)+'\n')

    f_input.close()
    f_output.close()


如果想要对日志进一步分析，也可以安装使用[awstats][2]



[1]: http://httpd.apache.org/docs/mod/mod_log_config.html
[2]: http://awstats.sourceforge.net/
---
layout: post
title: 使用Supervisor来管理你的Laravel队列
category: 技术
tags: [Laravel, PHP]
keywords: Laravel,PHP,Supervisor,Queue
description: 
---

> Laravel官网教程中，并没有提到用它来写CLI应用，即守护进程或者可执行脚本。但是它却提供了更加便捷的队列(Queue)功能。

## Laravel队列
我们在开发应用过程中难免会遇到处理耗时任务的需求，这些任务如果直接在用户的请求中处理，必然会导致页面显示被阻塞。虽然利用fastcgi的一些特性可以先输出页面，后台任务继续执行，但是这样远远不如将任务交给异步队列来处理方便。

### 配置和启动
Laravel队列功能为我们提供了一个便捷的方式去处理这些异步任务，配置一个队列只需要以下几步：

1. 配置`app/config/queue.php`中的`default`配置项为系统中的队列系统，`sync`是直接执行，并不是异步队列。
2. 创建队列处理类，如`SendMail`。类文件位置可以参考我的另一篇文章[在Laravel中使用自己的类库三种方式](/2014/03/20/use-other-libraries-in-laravel.html)
3. 将应用中的一个任务推送到队列`Queue::push('SendMail')`
4. 启动Laravel队列监听器`php artisan queue:listen`或者用`php artisan queue:work`处理队头的一条消息

### Laravel队列并行处理
如果使用过Laravel队列的朋友应该发现，`queue:listen`是线性执行的，即一个任务做完以后才会读取下一条任务。这样并不能满足我们日常的异步耗时任务处理的需求，于是有人建议启动多个`queue:listen`。

    php artisan queue:listen && php artisan queue:listen ...

这样虽然理论上是可行的，因为在异步队列的帮助下，程序并不会出现冲突。但是由于PHP本身对内存处理的缺陷，很难保证一个长期运行在后台的程序不出现内存泄露，例如`queue:listen`这样的死循环程序。因此在正式环境中我们更倾向于使用多个`queue:work`并行执行异步队列中的任务。`queue:work`只是读取队首的一项任务，执行完成后即结束程序，如果没有任务也会结束程序。这个方式类似于PHP对于WEB请求的处理，不会出现内存泄露。

利用Supervisor可以便捷的创建基于`queue:work`的异步队列并行处理。

## Supervisor
[Supervisor](http://supervisord.org/index.html)是一个进程控制系统，由python编写，它提供了大量的功能来实现对进程的管理。

1. 程序的多进程启动，可以配置同时启动的进程数，而不需要一个个启动
2. 程序的退出码，可以根据程序的退出码来判断是否需要自动重启
3. 程序所产生日志的处理
4. 进程初始化的环境，包括目录，用户，umask，关闭进程所需要的信号等等
5. 手动管理进程(开始，启动，重启，查看进程状态)的web界面，和xmlrpc接口

### 安装

    pip install supervisor

### 配置
配置项示例如下，后面我们会详细创建一个独有的Laravel配置

    ; Sample supervisor config file.
    ;
    ; For more information on the config file, please see:
    ; http://supervisord.org/configuration.html
    ;
    ; Note: shell expansion ("~" or "$HOME") is not supported.  Environment
    ; variables can be expanded using this syntax: "%(ENV_HOME)s".
     
    [unix_http_server]          ; supervisord的unix socket服务配置
    file=/tmp/supervisor.sock   ; socket文件的保存目录
    ;chmod=0700                 ; socket的文件权限 (default 0700)
    ;chown=nobody:nogroup       ; socket的拥有者和组名
    ;username=user              ; 默认不需要登陆用户 (open server)
    ;password=123               ; 默认不需要登陆密码 (open server)
     
    ;[inet_http_server]         ; supervisord的tcp服务配置
    ;port=127.0.0.1:9001        ; tcp端口
    ;username=user              ; tcp登陆用户
    ;password=123               ; tcp登陆密码
     
    [supervisord]                ; supervisord的主进程配置
    logfile=/tmp/supervisord.log ; 主要的进程日志配置
    logfile_maxbytes=50MB        ; 最大日志体积，默认50MB
    logfile_backups=10           ; 日志文件备份数目，默认10
    loglevel=info                ; 日志级别，默认info; 还有:debug,warn,trace
    pidfile=/tmp/supervisord.pid ; supervisord的pidfile文件
    nodaemon=false               ; 是否以守护进程的方式启动
    minfds=1024                  ; 最小的有效文件描述符，默认1024
    minprocs=200                 ; 最小的有效进程描述符，默认200
    ;umask=022                   ; 进程文件的umask，默认200
    ;user=chrism                 ; 默认为当前用户，如果为root则必填
    ;identifier=supervisor       ; supervisord的表示符, 默认时'supervisor'
    ;directory=/tmp              ; 默认不cd到当前目录
    ;nocleanup=true              ; 不在启动的时候清除临时文件，默认false
    ;childlogdir=/tmp            ; ('AUTO' child log dir, default $TEMP)
    ;environment=KEY=value       ; 初始键值对传递给进程
    ;strip_ansi=false            ; (strip ansi escape codes in logs; def. false)
     
    ; the below section must remain in the config file for RPC
    ; (supervisorctl/web interface) to work, additional interfaces may be
    ; added by defining them in separate rpcinterface: sections
    [rpcinterface:supervisor]
    supervisor.rpcinterface_factory = supervisor.rpcinterface:make_main_rpcinterface
     
    [supervisorctl]
    serverurl=unix:///tmp/supervisor.sock ; use a unix:// URL  for a unix socket
    ;serverurl=http://127.0.0.1:9001 ; use an http:// url to specify an inet socket
    ;username=chris              ; 如果设置应该与http_username相同
    ;password=123                ; 如果设置应该与http_password相同
    ;prompt=mysupervisor         ; 命令行提示符，默认"supervisor"
    ;history_file=~/.sc_history  ; 命令行历史纪录
     
    ; The below sample program section shows all possible program subsection values,
    ; create one or more 'real' program: sections to be able to control them under
    ; supervisor.
     
    ;[program:theprogramname]
    ;command=/bin/cat              ; 运行的程序 (相对使用PATH路径, 可以使用参数)
    ;process_name=%(program_name)s ; 进程名表达式，默认为%(program_name)s
    ;numprocs=1                    ; 默认启动的进程数目，默认为1
    ;directory=/tmp                ; 在运行前cwd到指定的目录，默认不执行cmd
    ;umask=022                     ; 进程umask，默认None
    ;priority=999                  ; 程序运行的优先级，默认999
    ;autostart=true                ; 默认随supervisord自动启动，默认true
    ;autorestart=unexpected        ; whether/when to restart (default: unexpected)
    ;startsecs=1                   ; number of secs prog must stay running (def. 1)
    ;startretries=3                ; max # of serial start failures (default 3)
    ;exitcodes=0,2                 ; 期望的退出码，默认0,2
    ;stopsignal=QUIT               ; 杀死进程的信号，默认TERM
    ;stopwaitsecs=10               ; max num secs to wait b4 SIGKILL (default 10)
    ;stopasgroup=false             ; 向unix进程组发送停止信号，默认false
    ;killasgroup=false             ; 向unix进程组发送SIGKILL信号，默认false
    ;user=chrism                   ; 为运行程序的unix帐号设置setuid
    ;redirect_stderr=true          ; 将标准错误重定向到标准输出，默认false
    ;stdout_logfile=/a/path        ; 标准输出的文件路径NONE＝none;默认AUTO
    ;stdout_logfile_maxbytes=1MB   ; max # logfile bytes b4 rotation (default 50MB)
    ;stdout_logfile_backups=10     ; # of stdout logfile backups (default 10)
    ;stdout_capture_maxbytes=1MB   ; number of bytes in 'capturemode' (default 0)
    ;stdout_events_enabled=false   ; emit events on stdout writes (default false)
    ;stderr_logfile=/a/path        ; stderr log path, NONE for none; default AUTO
    ;stderr_logfile_maxbytes=1MB   ; max # logfile bytes b4 rotation (default 50MB)
    ;stderr_logfile_backups=10     ; # of stderr logfile backups (default 10)
    ;stderr_capture_maxbytes=1MB   ; number of bytes in 'capturemode' (default 0)
    ;stderr_events_enabled=false   ; emit events on stderr writes (default false)
    ;environment=A=1,B=2           ; process environment additions (def no adds)
    ;serverurl=AUTO                ; override serverurl computation (childutils)
     
    ; The below sample eventlistener section shows all possible
    ; eventlistener subsection values, create one or more 'real'
    ; eventlistener: sections to be able to handle event notifications
    ; sent by supervisor.
     
    ;[eventlistener:theeventlistenername]
    ;command=/bin/eventlistener    ; 运行的程序 (相对使用PATH路径, 可以使用参数)
    ;process_name=%(program_name)s ; 进程名表达式，默认为%(program_name)s
    ;numprocs=1                    ; 默认启动的进程数目，默认为1
    ;events=EVENT                  ; event notif. types to subscribe to (req'd)
    ;buffer_size=10                ; 事件缓冲区队列大小，默认10
    ;directory=/tmp                ; 在运行前cwd到指定的目录，默认不执行cmd
    ;umask=022                     ; 进程umask，默认None
    ;priority=-1                   ; 程序运行的优先级，默认-1
    ;autostart=true                ; 默认随supervisord自动启动，默认true
    ;autorestart=unexpected        ; whether/when to restart (default: unexpected)
    ;startsecs=1                   ; number of secs prog must stay running (def. 1)
    ;startretries=3                ; max # of serial start failures (default 3)
    ;exitcodes=0,2                 ; 期望的退出码，默认0,2
    ;stopsignal=QUIT               ; 杀死进程的信号，默认TERM
    ;stopwaitsecs=10               ; max num secs to wait b4 SIGKILL (default 10)
    ;stopasgroup=false             ; 向unix进程组发送停止信号，默认false
    ;killasgroup=false             ; 向unix进程组发送SIGKILL信号，默认false
    ;user=chrism                   ; setuid to this UNIX account to run the program
    ;redirect_stderr=true          ; redirect proc stderr to stdout (default false)
    ;stdout_logfile=/a/path        ; stdout log path, NONE for none; default AUTO
    ;stdout_logfile_maxbytes=1MB   ; max # logfile bytes b4 rotation (default 50MB)
    ;stdout_logfile_backups=10     ; # of stdout logfile backups (default 10)
    ;stdout_events_enabled=false   ; emit events on stdout writes (default false)
    ;stderr_logfile=/a/path        ; stderr log path, NONE for none; default AUTO
    ;stderr_logfile_maxbytes=1MB   ; max # logfile bytes b4 rotation (default 50MB)
    ;stderr_logfile_backups        ; # of stderr logfile backups (default 10)
    ;stderr_events_enabled=false   ; emit events on stderr writes (default false)
    ;environment=A=1,B=2           ; process environment additions
    ;serverurl=AUTO                ; override serverurl computation (childutils)
     
    ; The below sample group section shows all possible group values,
    ; create one or more 'real' group: sections to create "heterogeneous"
    ; process groups.
     
    ;[group:thegroupname]
    ;programs=progname1,progname2  ; 任何在[program:x]中定义的x
    ;priority=999                  ; 程序运行的优先级，默认999
     
    ; The [include] section can just contain the "files" setting.  This
    ; setting can list multiple files (separated by whitespace or
    ; newlines).  It can also contain wildcards.  The filenames are
    ; interpreted as relative to this file.  Included files *cannot*
    ; include files themselves.
     
    ;[include]
    ;files = relative/directory/*.ini

### Laravel配置
在supervisor的include中，我们可以创建一个`SendMail`项目

    [program:waaQueue]
    command                 = php artisan queue:work
    directory               = /path/to/app
    process_name            = %(program_name)s_%(process_num)s
    numprocs                = 6
    autostart               = true
    autorestart             = true
    stdout_logfile          = /path/to/app/storage/logs/supervisor_waaQueue.log
    stdout_logfile_maxbytes = 10MB
    stderr_logfile          = /path/to/app/storage/logs/supervisor_wqqQueue.log
    stderr_logfile_maxbytes = 10MB

### 启动
1. 首先启动supervisord，执行`supervisord`即可，它会在默认目录下寻找配置文件
2. 运行`supervisorctl help`来查看可使用命令

## 参考
1. [Run multiple queue jobs the same time, with Beanstalk and Supervisor??](http://laravel.io/forum/02-09-2014-run-multiple-queue-jobs-the-same-time-with-beanstalk-and-supervisor)
2. [superivisord configuration](http://supervisord.org/configuration.html#program-x-section-example)
3. [queue:listen not working](https://github.com/laravel/framework/issues/579)
4. [使用supervisord来管理process](http://www.iitshare.com/supervisord-manage-process.html)
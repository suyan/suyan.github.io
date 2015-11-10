---
layout: post
title: 我的linux脚本工具
category: 工具
tags: shell,script
keywords: shell,script
description: 
---


```
#!/bin/bash
# leehom linux V0.1, 2013.01.16
# Copyright (C) 2009 leehom 
 
# 这个程序是个人练习和学习shell脚本，bash脚本而编写的
# 会包含少量实用的功能
#!/bin/bash
 
e(){
    case $1 in
        'red')
            echo -e "\033[31m$2\033[0m"
            ;;
          *)
            echo "$2"
    esac
}
# dequotepath(){ # If drag n drop from nautilus into terminal, the additional single quotes should be removed first.
#     local tmpath="$*"
#     [ "${tmpath#\'}" != "$tmpath" ] && [ "${tmpath%\'}" != "$tmpath" ] && { tmpath="${tmpath#\'}"; tmpath="${tmpath%\'}"; }
#     echo "$tmpath"
# }
# checkbackupdir(){
#     [ "${1#/}" = "$1" ] && { echoredcn "请使用绝对路径"; exit 1; }
#     [ -d "$*" ] || { echoredcn "$* 不存在, 或并非目录"; exit 1; }
#     [ `ls -A "$*" | wc -l` = 0 ] || { echoredcn "$* 不是空目录"; exit 1; }
# }
echousage(){
    echo "===================[ 良宏工作室 v0.2 ]==================================
[说明]
这个程序是个人练习和学习shell脚本，bash脚本而编写的
[用法]
1,备份数据库(back_mysql)
一般选择对应操作的数字即可
----------------------------------------------------------------------
快捷操作：
以备份数据库为例
'lee back_mysql' 或者 'lee 1' 可直接进入到备份数据库功能
后面继续跟上参数 可直接进入备份操作，不用询问输入
例如：'lee back_mysql dongshenghuo' 
其它操作同理。好玩吧！^_^
======================================================================"
}
back_website(){
    echo '将备份网站到 /green/ 目录，请输入您要备份的网站目录名'
    read website
    echo "(高级用户功能)指定其他需要排除的文件/目录, 一行写一个。以空行结束。"
    read ex
    while [ "$ex" != "" ]; do
    ex=`dequotepath "$ex"`
    [ "${ex#/}" = "$ex" ] && { echo "请使用绝对路径"; read ex; continue; }
    [ -e "$ex" ] || { echo "$ex 并不存在"; read ex; continue; }
    ex="${ex#/}"
    echo $ex >> $exclude
    read ex
    done
    lastfix=$(date +%Y%m%d_%H%M%S)
    echo '请输入网站对应的数据库名：[无数据库或不备份 直接回车]'
    read mysql
    if [ "$mysql" != '' ]; then
        echo -e "正在导出数据库到/green/$mysql.$lastfix.sql ..."
        mysqldump -uroot -proot $mysql > /green/$mysql.$lastfix.sql
        #mysql -u用户名 -p 数据库名 < 数据库名.sql
        echo -e "导出数据库 $mysql 完成！"
        echo -e "开始压缩数据库到/var/www/$website/$mysql.$lastfix.sql.7z ..."
        7z a -t7z -r /var/www/$website/$mysql.$lastfix.sql.7z /green/$mysql.$lastfix.sql
        echo "已备份至 /green/$mysql.$lastfix.sql 。"
        echo "压缩为 /green/$mysql.$lastfix.sql.7z"
    fi;
    stime=`date`
    echo -e "正在导出数据库到/green/$mysql.$lastfix.sql ..."
    # tar -cvzpf /green/$website.web.$(date +%Y.%m.%d_%H.%M.%S).tar.gz /green/$website $exclude
    7z a -t7z -r /green/$website.web.$lastfix.7z /var/www/$website $exclude
    echo "已备份至 /green/$website.web.$lastfix.7z 。"
    echo -e "开始于: $stime\n结束于: `date`"
}
fix_hash(){
    sudo apt-get clean
    sudo rm /var/lib/apt/lists/* -vf
    cd /var/lib/apt
    sudo rm -rf lists.old
    sudo mv lists lists.old
 
    # gpg --delete-key --armor 40976EAF437D05B5
    # sudo apt-key del 40976EAF437D05B5
 
    # gpg --keyserver subkeys.pgp.net --recv 40976EAF437D05B5
    # gpg --export --armor xxx | sudo apt-key add -
 
    # gpg --keyserver-options http-proxy --keyserver keyserver.ubuntu.com --recv 0976EAF437D05B5
    # gpg --export --armor 40976EAF437D05B5 | sudo apt-key add -
 
    sudo mkdir -p lists/partial
    sudo apt-get clean
    sudo apt-get update
}
back_home(){
    stime=`date`
    echo '清理系统...'
    sudo apt-get autoclean
    sudo apt-get clean
    # sudo apt-get autoremove --purge
    # 清理个人所有缓存...
    sudo rm -fr ~/.cache/
    # sudo mksquashfs /home/lee /green/home.$(date +%Y%m%d%H%M%S).squashfs
    # chown -R lee:lee
    sudo 7z a -t7z -r /green/home.$(date +%Y%m%d%H%M%S).7z  ~
    echo -e "开始于: $stime\n结束于: `date`"
}
re_home(){
    echo -e "sorry for waitting : `date`"
}
back_sys(){
    sudo lee_resys -b
}
re_sys(){
    echo '完成后是否自动重启？(y/N)'
    read auto_reboot
    sudo lee_resys -r
    [ "$auto_reboot" == "y" ] && sudo reboot
}
clean_kernel(){
    #!/bin/bash
    # 清理ubuntu的老内核
    # by bones7456
    # http://li2z.cn
    CurCore="linux-image-`uname -r`"
    CURRENT="`uname -r | awk -F"-" '{print $1"-"$2}'`"
    HEADERS=""
    IMAGES=""
    for HEADER in `dpkg --get-selections | grep ^linux-headers | \
    grep -vE "(generic|386|virtual)" | awk '{gsub(/linux-headers-/,"",$1);print $1}'`
    do
        if [[ "$CURRENT" < "$HEADER" ]]
        then
            echo "正在运行的内核不是最新的。 $CURRENT < $HEADER"
            exit 1
        else
            [[ "$CURRENT" != "$HEADER" ]] && {
                HEADERS="${HEADERS} linux-headers-${HEADER}"
                IMAGE="`dpkg --get-selections | grep ^linux-image | \
                    grep "${HEADER}" | awk '{print $1}'`"
                IMAGES="${IMAGES} $IMAGE"
            }
        fi
    done
 
    if [[ x"$HEADERS" == x"" ]] ; then
        echo "没有要清理的老内核."
    else
        CMD="sudo apt-get autoremove --purge $HEADERS $IMAGES"
        echo "$CMD"
        if [ "$1" == "-e" ] ; then
            sh -c $CMD
        else
            echo "请确定以上命令是否正确，然后输入 $0 -e 来执行以上命令。"
        fi
    fi
}
clean_sys(){
    echo '清理系统...'
    sudo apt-get autoclean
    sudo apt-get clean
    sudo apt-get autoremove --purge
    # 清理个人所有缓存...
    sudo rm -fr ~/.cache/
    # 清理内核...
        # clean_kernel
        sudo update-grub
        # 清除孤立的库文件
        # sudo deborphan | xargs sudo apt-get -y remove --purge
    #清除所以删除包的残余配置文件
    # sudo dpkg -l |grep ^rc|awk '{print $2}' |tr ["\n"] [" "]|sudo xargs dpkg -P -
    #清理下载的软件包缓存...
    sudo rm -fr /var/cache/apt/archives/*.deb
    sudo rm -fr /var/cache/apt/archives/partial/*.deb
    #清理日志...
    sudo find /var/log -name '*[g|t].[0-9]*.gz' |xargs sudo rm -rf
    sudo find /var/log -name '*log.[0-9]*' |xargs sudo rm -rf
    sudo find /var/log -name 'history.[0-9]*' |xargs sudo rm -rf
    sudo find /var/backups -name '*stat[e|u]s.[0-9]*.gz' |xargs sudo rm -rf
    #清空回收站...
    sudo rm -fr ~/.local/share/Trash/files/
    echo '清理完毕！'
}
stop_work(){
#    service apache2 stop
#    service mysql stop
    sudo /etc/init.d/apache2 stop
    sudo stop mysql
}
start_work(){
#    service apache2 start
#    service mysql start
    sudo /etc/init.d/apache2 start
    sudo start mysql
}
others(){
    echo "批量操作
for i in *.jpg; do convert -resize 30%x30% '$i' 'sm-$i'; done
编译时缺少h文件的自动处理
#sudo auto-apt run ./configure"
}
many_rename(){
echo "重命名
rename     'y/A-Z/a-z/'      *         改小写
rename     's/\.bak$//'      *.bak     去掉结尾的.bak
rename     's/[ ]+/_/g'      *      去掉空格
rename     's/^/hello/'      *        头部添加上hello
rename     's/.html$/.htm/'  *        把.html扩展名修改为.htm
rename     's/$/.zip/'       *        尾部追加.zip后缀
rename     's/.zip$//'       *        去掉.zip后缀"
}
find_files(){
echo "
删除修改时间在30天之前的所有文件
#find . -type f -mtime +30 -mtime -3600 -exec rm {} 
查找guest用户的以avi或者rm结尾的文件并删除掉
#find . -name ‘*.avi’ -o -name ‘*.rm’ -user ‘guest’ -exec rm {} 
查找的不以java和xml结尾,并7天没有使用的文件删除掉
#find . ! -name *.java ! -name ‘*.xml’ -atime +7 -exec rm {} 
#find . -type f -size +10M"
}
 
new_app(){
    echo '请输入网站名:同workspace存在的目录和访问域名(0自定义）'
    read web_name
    if [[ "$web_name" = "0" ]]; then
        echo 'sudo ln -s /green/workspace/webname /var/www/html/dirname '
        read cmdo
        $cmdo
    else
        sudo echo '
127.0.0.1     chen'.$web_name.'com' >> /etc/hosts
        sudo echo '
<VirtualHost *:80>
    ServerAdmin clh021@gmail.com
    DocumentRoot "/var/www/html/'$web_name'"
    ServerName chen.'$web_name'.com
    ErrorLog "/var/log/apache2/chen.'$web_name'.com-error.log"
    CustomLog "/var/log/apache2/chen.'$web_name'.com-error.log" combined
</VirtualHost>' >> /etc/apache2/httpd.conf
        sudo ln -s /green/workspace/$web_name /var/www/html/$webname
    fi
 
}
re_mysql(){
    sudo apt-get autoremove --purge mysql-server-5.0 mysql-server mysql-common
    dpkg -l |grep ^rc|awk '{print $2}' |sudo xargs dpkg -P
    install_lamp
}
install_lamp(){
    sudo apt-get install mysql-server mysql-client apache2 php5 php5-mysql php5-mcrypt php5-curl php5-gd 
#    sudo chmod 777 /etc/php5/apache2/php.ini /etc/apache2/httpd.conf
#    sudo echo 'extension=mysqli.so' >> /etc/php5/apache2/php.ini
#    sudo echo 'ServerName localhost' >> /etc/apache2/httpd.conf
#    sudo /etc/init.d/apache2 restart
}
init_sys(){
#    sudo apt-get install squashfs-tools lupin-casper deborphan
    sudo apt-get autoremove --purge ibus 
    sudo add-apt-repository ppa:fcitx-team/nightly
    sudo apt-get update
    sudo apt-get install fcitx fcitx-config-gtk fcitx-module-cloudpinyin  fcitx-sogoupinyin  im-switch
    sudo im-switch -s fcitx -z default
    install_lamp
}
telnet(){
    # set timeout 2
    # set TERM xterm
    # set SERVER [lindex $argv 0]
    # set USER [lindex $argv 1]
    # set PASSWD [lindex $argv 2]
 
    # if { $argc != 3 } {
    #         send_user "Usage:server username password \n"
    #         send_user $SERVER
    #         exit
    # }
 
    # spawn telnet
    # expect "telnet> "
    # send "open $SERVER\n"
    # expect "ogin:"
    # send "$USER\n"
    # expect "assword:"
    # send "$PASSWD\n"
    # expect "]$"
    # send "ls -ltr\n"
 
    # interact {
    #         timeout 10 {send "exit\n"}
    # }
    echo 'begin telnet'
}
show_menu(){
    echo "
==============[ 良宏工作室 v0.2 ]=================
1,back_home    2,back_sys        3,re_sys
4,new_app      5,stop_work    6,start_work
7,clean_sys    8,many_rename      9,find_files
10,re_mysql  0,init_sys :"
    read class
    if [ "$class" = "" ]; then
        exit 0;
    elif [ "$class" = "0" ]; then
        init_sys;
    elif [ "$class" = "1" ]; then
        back_home;
    elif [ "$class" = "2" ]; then
        back_sys;
    elif [ "$class" = "3" ]; then
        re_sys;
    elif [ "$class" = "4" ]; then
        new_app;
    elif [ "$class" = "5" ]; then
        stop_work;
    elif [ "$class" = "6" ]; then
        start_work;
    elif [ "$class" = "7" ]; then
        clean_sys;
    elif [ "$class" = "8" ]; then
        many_rename;
    elif [ "$class" = "9" ]; then
        find_files;
    elif [ "$class" = "10" ]; then
        re_mysql;
    elif [ "$class" = "11" ]; then
        fix_hash;
    else
        echo '您输入的选项不存在'
    fi
    show_menu;
}
analy_param(){
    case $1 in
      '-h' | '-help' | '--help' )
           echousage
           ;;
      'back_mysql' | 'back_website' | 'back_sys' | 'clean_sys' | 'stop_work' | 'start_work' | 're_website' | 're_sys' | 'ssh_conn' )
           $1
           ;;
      *)
           echo "很抱歉，此脚本目前还不能分析出你的参数指令"
           echousage
    esac
    show_menu;
}
 
# echo -e "\033[32;49;1m [DONE] \033[39;49;0m"
# echo -e "\e[32;49;1m [DONE] \033[39;49;0m"
 
# ready
lang='cn'
today=`date +%Y%m%d%H%M`
version="V2.3, 2013年3月7日"
 
#begin working
if [ "$1" != "" ]; then
    analy_param $1 $2 $3 $4 $5;
else
    show_menu;
fi
```
---
layout: post
title: 在OpenStack中部署kanyun
category: 技术
tags: OpenStack
description: 在OpenStack中部署kanyun
---
<h1>kanyun的部署</h1>

- [1 全部节点配置](#all)
  + [1.1 安装zmq](#all-zmq)
  + [1.2 安装kanyun](#all-kanyun)
- [2 控制节点配置](#controller)
  + [2.1 安装配置cassandra](#controller-cassandra)
  + [2.2 启动和配置kanyun](#controller-kanyun)
- [3 计算节点配置](#compute)
  + [3.1 启动和配置kanyun](#compute-kanyun)

<h2 id="all">1 全部节点</h2>
<h3 id="all-zmq">1.1 安装zmq</h3>
<h4>安装zerozmq(2.2.0)</h4>
1. yum install libtool autoconf automake
2. yum install uuid-devel
3. yum install libuuid-devel
4. wget http://download.zeromq.org/zeromq-2.2.0.tar.gz
5. tar zxvf zeromq-2.2.0.tar.gz & cd zeromq-2.2.0 & ./configure & make install
6. ldconfig

<h4>安装pyzmq</h4>
1. easy_install "pyzmq==2.2.0"
2. 如果出现缺少libzmq.so.1的情况，可能是链接库没有正确配置。
3. sudo /sbin/ldconfig -v | grep libzmq查看是否有所需链接
4. 如果没有libzmq.so.1 -> libzmq.so.1.0.1，则修改/etc/ld.so.conf，在末尾增加/usr/local/lib，然后ldconfig -v | grep libzmq即可
5. 如果出现缺少Python.h，则使用yum install python-devel来安装

<h3 id="all-kanyun">1.2 安装kanyun</h3>
<h4>下载代码</h4>
kanyun原来的代码有bug，而且不能在python2.6环境下使用，下面是我改过的

    cd /opt
    git clone https://github.com/suyan/kanyun.git

修改内容：

- 兼容python2.6和2.7（python2.6需要安装OrderedDict）
- 修改获取内存信息方式和计算cpu使用率方式
- 修复一些bug

<h4>安装</h4>
    python /opt/kanyun/setup.py install
<h4>创建日志目录</h4>
    mkdir /var/log/kanyun
<h4>安装OrderedDict(python2.6)</h4>
    easy_install OrderedDict

<h2 id="controller">2 控制节点</h2>
<h3 id="controller-cassandra">2.1 安装配置cassandra</h3>
<h4>下载Cassandra</h4>
    cd /opt
    wget http://mirror.bit.edu.cn/apache/cassandra/0.8.10/apache-cassandra-0.8.10-bin.tar.gz
<h4>解压</h4>
    tar zxvf apache-cassandra-0.8.10-bin.tar.gz
<h4>运行</h4>
    /opt/apache-cassandra-0.8.10/bin/cassandra
<h4>创建数据库</h4>
通过命令打开数据库

    /opt/apache-cassandra-0.8.10/bin/cassandra-cli -h 127.0.0.1

并执行下面命令

    CREATE keyspace DATA;
    USE DATA;

    CREATE COLUMN family vmnetwork WITH column_type='Super' AND comparator='AsciiType' AND subcomparator='IntegerType' AND default_validation_class='AsciiType';
    CREATE COLUMN family cpu WITH column_type='Super' AND comparator='AsciiType' AND subcomparator='IntegerType' AND default_validation_class='AsciiType';
    CREATE COLUMN family mem_max WITH column_type='Super' AND comparator='AsciiType' AND subcomparator='IntegerType' AND default_validation_class='AsciiType';
    CREATE COLUMN family mem_free WITH column_type='Super' AND comparator='AsciiType' AND subcomparator='IntegerType' AND default_validation_class='AsciiType';
    CREATE COLUMN family nic_incoming WITH column_type='Super' AND comparator='AsciiType' AND subcomparator='IntegerType' AND default_validation_class='AsciiType';
    CREATE COLUMN family nic_outgoing WITH column_type='Super' AND comparator='AsciiType' AND subcomparator='IntegerType' AND default_validation_class='AsciiType';
    CREATE COLUMN family blk_read WITH column_type='Super' AND comparator='AsciiType' AND subcomparator='IntegerType' AND default_validation_class='AsciiType';
    CREATE COLUMN family blk_write WITH column_type='Super' AND comparator='AsciiType' AND subcomparator='IntegerType' AND default_validation_class='AsciiType';

    assume vmnetwork KEYS AS ascii;
    assume cpu KEYS AS ascii;
    assume mem_max KEYS AS ascii;
    assume nic_incoming KEYS AS ascii;
    assume nic_outgoing KEYS AS ascii;
    assume blk_read KEYS AS ascii;
    assume blk_write KEYS AS ascii;
    assume mem_free KEYS AS ascii;       

<h4>安装pycassa支持</h4>
    easy_install pycassa

如果出现*The required version of distribute is not available*

    easy_install -U distribute

<h3 id="controller-kanyun">2.2 启动和配置kanyun</h3>
<h4>配置/etc/kanyun.conf</h4>
- 文件中host需要填写计算节点的ip
- sql_connection填写nova.conf中connection值

配置文件

    [kanyun]
    log: /var/log/kanyun/kanyun.log
    [DEFAULT]
    sql_connection: mysql://nova:novamysqlpassword@controller/nova
    [server]
    host: 172.19.9.1 
    port: 5551
    db_host: 127.0.0.1
    log: /var/log/kanyun/kanyun-server.log
    [api]
    api_host: 172.19.9.1
    api_port: 5552
    db_host: 127.0.0.1
    log: /var/log/kanyun/kanyun-api.log
    [client]
    api_host: 172.19.9.1
    api_port: 5552
    log: /var/log/kanyun/kanyun-client.log 

<h4>启动服务</h4>
    python /opt/kanyun/bin/kanyun-server &
    python /opt/kanyun/bin/kanyun-api &


<h2 id="compute">3 计算节点</h2>
<h3 id="compute-kanyun">3.1 启动和配置kanyun</h3>
<h4>配置/etc/kanyun.conf</h4>
- 文件中api_host需要填写计算节点的ip
- sql_connection填写nova.conf中connection值
- id根据节点编号自己设置
 
配置文件

    [kanyun]
    log: /var/log/kanyun/kanyun.log
    [DEFAULT]
    sql_connection: mysql://nova:novamysqlpassword@controller/nova
    [worker]
    id: worker1
    worker_timeout: 60
    dataserver_host: 172.19.9.1
    dataserver_port: 5551
    log: /var/log/kanyun/kanyun-worker.log
    [client]
    api_host: 172.19.9.1
    api_port: 5552
    log: /var/log/kanyun/kanyun-client.log

<h4>启动服务</h4>
    python /opt/kanyun/bin/kanyun-worker &


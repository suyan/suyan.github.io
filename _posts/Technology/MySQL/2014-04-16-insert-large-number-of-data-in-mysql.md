---
layout: post
title: MySQL大量数据插入各种方法性能分析与比较
category: 技术
tags: MySQL
keywords: MySQL,大量数据,插入,性能
description: 
---

> 不管是日常业务数据处理中，还是数据库的导入导出，都可能遇到需要处理大量数据的插入。插入的方式和数据库引擎都会对插入速度造成影响，这篇文章旨在从理论和实践上对各种方法进行分析和比较，方便以后应用中插入方法的选择。

## 插入分析
MySQL中插入一个记录需要的时间由下列因素组成，其中的数字表示大约比例：

- 连接：（3）
- 发送查询给服务器：（2）
- 分析查询：（2）
- 插入记录：（1x记录大小）
- 插入索引：（1x索引）
- 关闭：（1）

如果我们每插入一条都执行一个SQL语句，那么我们需要执行除了连接和关闭之外的所有步骤N次，这样是非常耗时的，优化的方式有一下几种：

1. 在每个insert语句中写入多行，批量插入
2. 将所有查询语句写入事务中
3. 利用Load Data导入数据

每种方式执行的性能如下。

## Innodb引擎
InnoDB 给 MySQL 提供了具有事务(commit)、回滚(rollback)和崩溃修复能力(crash recovery capabilities)的事务安全(transaction-safe (ACID compliant))型表。InnoDB 提供了行锁(locking on row level)以及外键约束(FOREIGN KEY constraints)。

InnoDB 的设计目标是处理大容量数据库系统，它的 CPU 利用率是其它基于磁盘的关系数据库引擎所不能比的。在技术上，InnoDB 是一套放在 MySQL 后台的完整数据库系统，InnoDB 在主内存中建立其专用的缓冲池用于高速缓冲数据和索引。

### 测试环境
Macbook Air 12mid apache2.2.26 php5.5.10 mysql5.6.16

总数100W条数据

插入完后数据库大小38.6MB（无索引），46.8（有索引）

- 无索引单条插入 总耗时：229s 峰值内存：246KB
- 有索引单条插入 总耗时：242s 峰值内存：246KB
- 无索引批量插入 总耗时：10s 峰值内存：8643KB
- 有索引批量插入 总耗时：16s 峰值内存：8643KB
- 无索引事务插入 总耗时：78s 峰值内存：246KB
- 有索引事务插入 总耗时：82s 峰值内存：246KB
- 无索引Load Data插入 总耗时：12s 峰值内存：246KB
- 有索引Load Data插入 总耗时：11s 峰值内存：246KB

## MyIASM引擎
MyISAM 是MySQL缺省存贮引擎。设计简单，支持全文搜索。

### 测试环境
Macbook Air 12mid apache2.2.26 php5.5.10 mysql5.6.16

总数100W条数据

插入完后数据库大小19.1MB（无索引），38.6（有索引）

- 无索引单条插入 总耗时：82s 峰值内存：246KB
- 有索引单条插入 总耗时：86s 峰值内存：246KB
- 无索引批量插入 总耗时：3s 峰值内存：8643KB
- 有索引批量插入 总耗时：7s 峰值内存：8643KB
- 无索引Load Data插入 总耗时：6s 峰值内存：246KB
- 有索引Load Data插入 总耗时：8s 峰值内存：246KB

## 总结
我测试的数据量不是很大，不过可以大概了解这几种插入方式对于速度的影响，最快的必然是Load Data方式。这种方式相对比较麻烦，因为涉及到了写文件，但是可以兼顾内存和速度。

## 测试代码

```php
<?php
$dsn = 'mysql:host=localhost;dbname=test';
$db = new PDO($dsn,'root','',array(PDO::ATTR_PERSISTENT => true));
//删除上次的插入数据
$db->query('delete from `test`');
//开始计时
$start_time = time();
$sum = 1000000;
// 测试选项
$num = 1;

if ($num == 1){
    // 单条插入
    for($i = 0; $i < $sum; $i++){
        $db->query("insert into `test` (`id`,`name`) values ($i,'tsetssdf')");
    }
} elseif ($num == 2) {
    // 批量插入，为了不超过max_allowed_packet，选择每10万插入一次
    for ($i = 0; $i < $sum; $i++) {
        if ($i == $sum - 1) { //最后一次
            if ($i%100000 == 0){
                $values = "($i, 'testtest')";
                $db->query("insert into `test` (`id`, `name`) values $values");
            } else {
                $values .= ",($i, 'testtest')";
                $db->query("insert into `test` (`id`, `name`) values $values");
            }
            break;
        }
        if ($i%100000 == 0) { //平常只有在这个情况下才插入
            if ($i == 0){
                $values = "($i, 'testtest')";
            } else {
                $db->query("insert into `test` (`id`, `name`) values $values");
                $values = "($i, 'testtest')";
            }
        } else {
            $values .= ",($i, 'testtest')";    
        }
    }
} elseif ($num == 3) {
    // 事务插入
    $db->beginTransaction(); 
    for($i = 0; $i < $sum; $i++){
        $db->query("insert into `test` (`id`,`name`) values ($i,'tsetssdf')");
    }
    $db->commit();
} elseif ($num == 4) {
    // 文件load data
    $filename = dirname(__FILE__).'/test.sql';
    $fp = fopen($filename, 'w');
    for($i = 0; $i < $sum; $i++){
        fputs($fp, "$i,'testtest'\r\n");    
    }
    $db->exec("load data infile '$filename' into table test fields terminated by ','");
}

$end_time = time();
echo "总耗时", ($end_time - $start_time), "秒\n";
echo "峰值内存", round(memory_get_peak_usage()/1000), "KB\n";

?>
```

## 参考
1. [MySQL: InnoDB 还是 MyISAM?](http://coolshell.cn/articles/652.html)
2. [mysql存储引擎：InnoDB和MyISAM的区别与优劣](http://www.ixdba.net/article/2f/2092.html)
3. [MySQL大数据量快速插入方法和语句优化](http://www.uml.org.cn/sjjm/201108293.asp)
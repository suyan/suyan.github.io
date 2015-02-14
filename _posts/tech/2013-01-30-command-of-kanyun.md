---
layout: post
title: kanyun的api-client命令
category: 技术
tags: OpenStack
description: kanyun的api-client命令
---

    uuid:虚拟机的唯一标识，如08e89e41-d2c2-4c5d-ba2a-c0d180942270
    column_family(metric): 'cpu','vmnetwork','mem_max','mem_free','nic_incoming','nic_outgoing','blk_read','blk_write'
    super_column_family:当column_family为vmnetwork,cpu,mem*时为total，其他情况为'vnet0','vda'等
    timestamp: 时间戳，如1357628942
    option:额外选项，用来处理数据，'sum','max','min','avg','sam'
    period:时间间隔    

### 获得某一虚拟机一段时间内某一度量标准记录值

    api-client -get <uuid> <column_family> <super_column_family> <timestamp_from> <timestamp_to>
        api-client -get 08e89e41-d2c2-4c5d-ba2a-c0d180942270 cpu total 1357628942 1357629699

### 获得某一虚拟机一段时间内某一度量标准分析值

    api-client -get <uuid> <column_family> <super_column_family> <option> <period> <timestring_from> <timestring_to>
        api-client 08e89e41-d2c2-4c5d-ba2a-c0d180942270 cpu total sum 5 2013-01-08T02:09:02 2013-01-08T02:21:05

### 显示所有某一度量标准的所有内容

    api-client -l <metric>
        api-client -l cpu

### 时间格式转换

    api-client -t <timestamp>
    api-client -d <timestring>
        api-client -t 1111111111
        api-client -d 2013-01-09T10:10

### 显示帮助

        api-client -h


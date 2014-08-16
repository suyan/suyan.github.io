---
layout: post
title: OpenStack Ceilometer数据存储与API源码解析
category: 技术
tags: OpenStack
keywords: Ceilometer,OpenStack,Source,API
description: OpenStack Ceilometer存储默认使用MongoDB，Collector对它进行写操作，API对它进行读操作
---

### MongoDB的Collections
Ceilometer在MongoDB中共有这么几个Collections

    - user
      - { _id: user id
          source: [ array of source ids reporting for the user ]
          }
    - project
      - { _id: project id
          source: [ array of source ids reporting for the project ]
          }
    - meter
      - the raw incoming data
    - resource
      - the metadata for resources
      - { _id: uuid of resource,
          metadata: metadata dictionaries
          user_id: uuid
          project_id: uuid
          meter: [ array of {counter_name: string, counter_type: string,
                             counter_unit: string} ]
        }

其中meter是采集到的数据，其他的都是固定值

### Collector对数据库的写数据
Collector在接收到采集的数据后，会调用`record_metering_data()`对数据进行写入，相应mongodb的代码在`ceilometer.storage.impl_mongodb`中

    def record_metering_data(self, data):
        self.db.user.update(
            {'_id': data['user_id']},
            {'$addToSet': {'source': data['source'],},},
            upsert=True,
        )
        self.db.project.update(
            {'_id': data['project_id']},
            {'$addToSet': {'source': data['source'],},},
            upsert=True,
        )

        self.db.resource.update(
            {'_id': data['resource_id']},
            {'$set': {'project_id': data['project_id'],
                      'user_id': data['user_id'],
                      'metadata': data['resource_metadata'],
                      'source': data['source'],},
             '$addToSet': {'meter': {'counter_name': data['counter_name'],
                                     'counter_type': data['counter_type'],
                                     'counter_unit': data['counter_unit'],},},
             },
            upsert=True,
        )

        record = copy.copy(data)
        self.db.meter.insert(record)
        return

从上面代码可知，每次存储时都会更新user,project和resource，然后将数据完全写入到meter中，写入后的数据格式如下：

    {
      "counter_name": "disk.write.requests",
      "user_id": "4ff44f4665564b2abcb8e1f1619f2b85",
      "message_signature": "8473976666aecd078a281afed936839b737ceaf4bb63654759d63514bdc9ee03",
      "timestamp": ISODate("2013-05-21T22:33:14.0Z"),
      "resource_id": "b7fc623d-1d4a-4ac7-b96b-78c9d921fa74",
      "resource_metadata": {
        "ramdisk_id": "",
        "display_name": "test",
        "name": "instance-00000001",
        "disk_gb": "",
        "availability_zone": "",
        "kernel_id": "",
        "ephemeral_gb": "",
        "host": "e781ff9ce97dcc328d8826cfb19a20c001b866cb20859653c2f481b1",
        "memory_mb": "",
        "instance_type": "42",
        "vcpus": "",
        "root_gb": "",
        "image_ref": "da04e6dd-4cc7-4594-87d8-60927c07c396",
        "architecture": "",
        "os_type": "",
        "reservation_id": "",
        "image_ref_url": "http:\/\/192.168.0.6:8774\/676730085ab84296a9b4a7d68ee76078\/images\/da04e6dd-4cc7-4594-87d8-60927c07c396"
      },
      "source": "openstack",
      "counter_unit": "request",
      "counter_volume": NumberInt(1366),
      "project_id": "be13e080970d44b280e4843e084bb2b1",
      "message_id": "6cf1d76c-c266-11e2-a987-5eafb2e29593",
      "counter_type": "cumulative"
    }

这是一个disk.write.requests的数据，其中resource_metadata如果无变化的话，没个都会带这些数据，具体原因不详

另外，重要的东西在

- counter_unit 计量单位
- counter_volume 计量数值
- counter_type 计量类型

### 计量内容
在[文档](http://docs.openstack.org/developer/ceilometer/measurements.html)中讲了计量值和其单位

首先是计量类型：

- Cumulative  随时间的累计值（如cpu总时长）
- Gauge  离散项(floating IPs, image uploads)和变化的值 (disk I/O)
- Delta  随时间的变化量（带宽等）

计量单位比较多了，每个都不太一样，这个可以查询文档，如磁盘读写请求的单位为"request"

### API对数据库的读操作
数据存储只是Ceilometer的一小部分，如果合理的利用和分析采集到的数据才比较重要，另外这部分也是暴露出来给开发者的部分

API服务以wsgi service方式运行在后端，Ceilometer有v1和v2两个版本的API，v1会被弃用，这里只讲v2部分

    GET /v2/meters/cpu?q.op=ge&q.op=lt&q.op=eq&q.value=2013-05-19+23%3A00%3A00&q.value=2013-05-20+00%3A00%3A00&q.value=b7fc623d-1d4a-4ac7-b96b-78c9d921fa74&q.field=timestamp&q.field=timestamp&q.field=resource

这是一个我截取下来的请求，首先我们看到一个资源地址

    GET /v2/meters/cpu

根据V2的Controller，我们可以看到是MetersController()对它进行处理的

    class V2Controller(object):
        resources = ResourcesController()
        meters = MetersController()
        alarms = AlarmsController()














---
layout: post
title: Laravel中使用Redis作为队列系统的工作流程
category: 技术
tags: Laravel
keywords: Laravel,Redis,Queue
description: 
---

> 利用Redis可以很方便的实现一个任务队列，但是在Laravel中，Redis的队列总会出现一个任务多次执行的问题。究其原因是它写死了reserved的时长，也就是如果1分钟后任务没有执行完成，那么这个任务就会被重新放回队列。下面是队列的简单使用和执行原理。

## 设置
设置队列使用Redis非常容易，在`app/config/queue.php`中配置

    ...
    'default' => 'redis',
    ...
    'connections' => array(
        ...
        'redis' => array(
            'driver' => 'redis',
            'queue'  => 'waa',
        ),
    ),

即可。

## 使用
使用时不需要多配置，只要写好Queue类和其fire方法，在需要的位置出队即可。具体方法可以看[这里](http://laravel.com/docs/queues#basic-usage)。

    class SendEmail {

        public function fire($job, $data)
        {
            //
            $job->delete();
        }

    }

    Queue::push('SendEmail@send', array('message' => $message));

## 流程
Laravel利用artisan命令来执行出队操作，然后进行任务的执行。方法调用如下：

1. artisan queue:work
2. WorkerCommand:fire()
3. Worker:pop()
4. Worker:getNextJob()
5. RedisQueue:pop()
6. Worker:process()

我遇到的问题就在这里，在`RedisQueue:pop()`方法中，有这样一句：

    $this->redis->zadd($queue.':reserved', $this->getTime() + 60, $job);

这里将当前执行的任务放到另外一个reserved队列中，超时时间是60s。也就是说，如果60s后这个任务没有被删除掉，则任务会重新被放入队列中来。因此，在实际的使用过程中，任务很可能被多次执行。解决的办法是

    class SendEmail {

        public function fire($job, $data)
        {
            $job->delete();
            // job 
        }

    }

即先删除这个任务，再开始执行任务。
---
layout: post
title: 设计模式详解及PHP实现：单例模式
category: 技术
tags: [Pattern, PHP]
keywords: 设计模式,单例模式
description: 
---

> 单例模式也是一种常见的设计模型，我们在不知不觉中早已用过很多次，例如在应用中只生成一次MySQL链接，然后后续的SQL操作全部由此链接完成。

## 单例模式（Singleton pattern）
抽象工厂模式是一种创建型模式，在应用这个模式时，单例对象的类必须保证只有一个实例存在。

实现单例模式的思路是：一个类能返回对象一个引用(永远是同一个)和一个获得该实例的方法（必须是静态方法，通常使用getInstance这个名称）；当我们调用这个方法时，如果类持有的引用不为空就返回这个引用，如果类保持的引用为空就创建该类的实例并将实例的引用赋予该类保持的引用；同时我们还将该类的构造函数定义为私有方法，这样其他处的代码就无法通过调用该类的构造函数来实例化该类的对象，只有通过该类提供的静态方法来得到该类的唯一实例。

## 单例模式中主要角色
Singleton定义一个getInstance操作，允许客户访问它唯一的实例。

这个例子也简单，就像我有6个老婆（快醒醒!），她们在喊"老公"的时候都是指我。不管什么时候，喊老公擦地，做饭，洗衣服都是指同一个人，PHP不编写多线程，所以不存在抢占问题，如果换别的语言编写，一定得考虑到抢占问题！老公是不可以边擦地边做饭的！

## 适用性

- 当类只能有一个实例而且客户可以从一个众所周知的访问点访问它时
- 当这个唯一实例应该是通过子类化可扩展的。并且用户应该无需更改代码就能使用一个扩展的实例时。

## 类图
![singleton pattern](http://yansu-uploads.stor.sinaapp.com/imgs/singleton-pattern-uml.png)

## 实例

```php
<?php 
public class Singleton {
    private static $_instance = NULL;

    // 私有构造方法 
    private function __construct() {}

    public static function getInstance() {
        if (is_null(self::$_instance)) {
            self::$_instance = new Singleton();
        }
        return self::$_instance;
    }

    // 防止克隆实例
    public function __clone(){
        die('Clone is not allowed.' . E_USER_ERROR);
    }
}
?>
```

在此实例中，Singleton禁止了克隆及外部初始化，使得此类只可以通过`getInstance()`方法来获得实例，而这个实例只会在第一次使用时创建，以后每次都获得同一实例。

## 优缺点
### 优点
- 对唯一实例的受控访问
- 缩小命名空间 单例模式是对全局变量的一种改进。它避免了那些存储唯一实例的全局变量污染命名空间
- 允许对操作和表示的精华，单例类可以有子类。而且用这个扩展类的实例来配置一个应用是很容易的。你可以用你所需要的类的实例在运行时刻配置应用。
- 允许可变数目的实例（多例模式）
- 比类操作更灵活

### 缺点
单例模式在多线程的应用场合下必须小心使用。如果当唯一实例尚未创建时，有两个线程同时调用创建方法，那么它们同时没有检测到唯一实例的存在，从而同时各自创建了一个实例，这样就有两个实例被构造出来，从而违反了单例模式中实例唯一的原则。解决这个问题的办法是为指示类是否已经实例化的变量提供一个互斥锁(虽然这样会降低效率)。


## 参考
1. [Wikipedia: 单例模式](http://zh.wikipedia.org/wiki/%E5%8D%95%E4%BE%8B%E6%A8%A1%E5%BC%8F)
2. [Wikipedia: Singleton pattern](http://en.wikipedia.org/wiki/Singleton_pattern)
3. [PHP设计模式笔记：使用PHP实现单例模式](http://www.phppan.com/2010/06/php-design-pattern-6-singleton/)
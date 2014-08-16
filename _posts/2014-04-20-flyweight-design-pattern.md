---
layout: post
title: 设计模式详解及PHP实现：享元模式
category: 技术
tags: [Pattern, PHP]
keywords: 设计模式,享元模式
description: 
---

## 享元模式（Flyweight Pattern）
享元模式是一种结构型模式，它使用共享物件，用来尽可能减少内存使用量以及分享资讯给尽可能多的相似物件；它适合用于当大量物件只是重复因而导致无法令人接受的使用大量内存。通常物件中的部分状态是可以分享。常见做法是把它们放在外部数据结构，当需要使用时再将它们传递给享元。

## 主要角色

- 抽象享元(Flyweight角色：此角色是所有的具体享元类的超类，为这些类规定出需要实现的公共接口。那些需要外蕴状态的操作可以通过调用商业以参数形式传入
- 具体享元(ConcreteFlyweight角色：实现Flyweight接口，并为内部状态（如果有的话）拉回存储空间。ConcreteFlyweight对象必须是可共享的。它所存储的状态必须是内部的
- 不共享的具体享元（UnsharedConcreteFlyweight）角色：并非所有的Flyweight子类都需要被共享。Flyweigth使共享成为可能，但它并不强制共享。
- 享元工厂(FlyweightFactory)角色：负责创建和管理享元角色。本角色必须保证享元对象可能被系统适当地共享
- 客户端(Client)角色：本角色需要维护一个对所有享元对象的引用。本角色需要自行存储所有享元对象的外部状态

## 适用性

- 一个应用程序使用了大量的对象
- 完全由于使用大量的对象，造成很大的存储开销
- 对象的大多数状态都可变为外部状态
- 如果删除对象的外部状态，那么可以用相对较少的共享对象取代很多组对象
- 应用程序不依赖于对象标识。

## 类图

![flyweight pattern](http://yansu-uploads.stor.sinaapp.com/imgs/flyweight-pattern-uml.jpg)

## 实例

```php
<?php
abstract class Flyweight { // 抽象享元角色
    abstract public function operation($state);
}
 
class ConcreteFlyweight extends Flyweight { // 具体享元角色
    private $_intrinsicState = null; 
    public function __construct($state) {
        $this->_intrinsicState = $state;
    }
    public function operation($state) {}
}
 
class UnsharedConcreteFlyweight extends Flyweight { // 不共享的具体享元，客户端直接调用
    private $_intrinsicState = null;
    public function __construct($state) {
        $this->_intrinsicState = $state;
    }
    public function operation($state) {}
}

class FlyweightFactory { // 享元工厂角色 
    private $_flyweights;
    public function __construct() {
        $this->_flyweights = array();
    }
    public function getFlyweigth($state) {
        if (isset($this->_flyweights[$state])) {
            return $this->_flyweights[$state];
        } else {
            return $this->_flyweights[$state] = new ConcreteFlyweight($state);
        }
    }
}
 
// client
$flyweightFactory = new FlyweightFactory();
$flyweight = $flyweightFactory->getFlyweigth('state A');
$flyweight->operation('other state A');

$flyweight = $flyweightFactory->getFlyweigth('state B');
$flyweight->operation('other state B');

// 不共享的对象，单独调用
$uflyweight = new UnsharedConcreteFlyweight('state A');
$uflyweight->operation('other state A');
?>
```

## 优缺点

### 优点

- Flyweight模式可以大幅度地降低内存中对象的数量。

### 缺点

- Flyweight模式使得系统更加复杂
- Flyweigth模式将享元对象的状态外部化，而读取外部状态使得运行时间稍微变长

## 参考
1. [Wikipedia: Flyweight pattern](http://en.wikipedia.org/wiki/Flyweight_pattern)
2. [Wikipedia: 享元模式](http://zh.wikipedia.org/wiki/%E4%BA%AB%E5%85%83%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现享元模式](http://www.phppan.com/2010/08/php-design-pattern-13-flyweight/)
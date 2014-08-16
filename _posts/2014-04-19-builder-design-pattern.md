---
layout: post
title: 设计模式详解及PHP实现：建造者模式
category: 技术
tags: [Pattern, PHP]
keywords: 设计模式,建造者模式
description: 
---

## 建造者模式（Builder pattern）
建造者模式是一种创建型模式，它可以让一个产品的内部表象和和产品的生产过程分离开，从而可以生成具有不同内部表象的产品。

## Builder模式中主要角色

- 抽象建造者(Builder)角色：定义抽象接口，规范产品各个部分的建造，必须包括建造方法和返回方法。
- 具体建造者(Concrete)角色：实现抽象建造者接口。应用程序最终根据此角色中实现的业务逻辑创造产品。
- 导演者(Director)角色：调用具体的建造者角色创造产品。
- 产品(Product)角色：在导演者的指导下所创建的复杂对象。

## 适用性

- 当创建复杂对象的算法应该独立于该对象的组成部分以及它们的装配方式时。
- 当构造过程必须允许被构造的对象有不同的表示时。

## 类图
![builder pattern](http://yansu-uploads.stor.sinaapp.com/imgs/builder-pattern-uml.png)

## 实例

```php
<?php

class Product { // 产品本身
    private $_parts; 
    public function __construct() { $this->_parts = array(); } 
    public function add($part) { return array_push($this->_parts, $part); }
}
 
abstract class Builder { // 建造者抽象类
    public abstract function buildPart1();
    public abstract function buildPart2();
    public abstract function getResult();
}
 
class ConcreteBuilder extends Builder { // 具体建造者
    private $_product;
    public function __construct() { $this->_product = new Product(); }
    public function buildPart1() { $this->_product->add("Part1"); } 
    public function buildPart2() { $this->_product->add("Part2"); }
    public function getResult() { return $this->_product; }
}
 
class Director { 
    public function __construct(Builder $builder) {
        $builder->buildPart1();
        $builder->buildPart2();
    }
}

// client 
$buidler = new ConcreteBuilder();
$director = new Director($buidler);
$product = $buidler->getResult();
?>
```

## 优缺点

### 优点
建造者模式可以很好的将一个对象的实现与相关的“业务”逻辑分离开来，从而可以在不改变事件逻辑的前提下，使增加(或改变)实现变得非常容易。

### 缺点
建造者接口的修改会导致所有执行类的修改。

## 参考
1. [Wikipedia: Bulider pattern](http://en.wikipedia.org/wiki/Builder_pattern)
2. [Wikipedia: 生成器模式](http://zh.wikipedia.org/wiki/%E7%94%9F%E6%88%90%E5%99%A8%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现建造者模式](http://www.phppan.com/2010/05/php-design-pattern-2-builder/)

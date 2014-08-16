---
layout: post
title: 设计模式详解及PHP实现：原型模式
category: 技术
tags: [Pattern, PHP]
keywords: 设计模式,原型模式
description: 
---

## 原型模式（Prototype pattern）
原型模式是一种创建者模式，其特点在于通过“复制”一个已经存在的实例来返回新的实例,而不是新建实例。

## 原型模式中主要角色

-  抽象原型(Prototype)角色：声明一个克隆自己的接口
-  具体原型(Concrete Prototype)角色：实现一个克隆自己的操作

## 适用性

- 当一个系统应该独立于它的产品创建、构成和表示时，要使用Prototype模式
- 当要实例化的类是在运行时刻指定时，例如动态加载
- 为了避免创建一个与产品类层次平等的工厂类层次时；
- 当一个类的实例只能有几个不同状态组合中的一种时。建立相应数目的原型并克隆它们可能比每次用合适的状态手工实例化该类更方便一些

## 类图
![prototype pattern](http://yansu-uploads.stor.sinaapp.com/imgs/prototype-pattern-uml.jpg)

## 实例

```php
<?php

interface Prototype { public function copy(); }
 
class ConcretePrototype implements Prototype{
    private  $_name;
    public function __construct($name) { $this->_name = $name; } 
    public function copy() { return clone $this;}
}
 
class Demo {}
 
// client
 
$demo = new Demo();
$object1 = new ConcretePrototype($demo);
$object2 = $object1->copy();
?>
```

## 优缺点

### 优点
- 可以在运行时刻增加和删除产品
- 可以改变值以指定新对象
- 可以改变结构以指定新对象
- 减少子类的构造
- 用类动态配置应用

### 缺点
Prototype模式的最主要缺点就是每一个类必须配备一个克隆方法。而且这个克隆方法需要对类的功能进行通盘考虑，这对全新的类来说不是很难，但对已有的类进行改造时，不一定是件容易的事。

## 参考
1. [Wikipedia: Prototype pattern](http://en.wikipedia.org/wiki/Prototype_pattern)
2. [Wikipedia: 原型模式](http://zh.wikipedia.org/wiki/%E5%8E%9F%E5%9E%8B%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现原型模式](http://www.phppan.com/2010/06/php-design-pattern-8-prototype/)
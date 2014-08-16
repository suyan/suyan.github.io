---
layout: post
title: 设计模式详解及PHP实现：适配器模式
category: 技术
tags: [Pattern, PHP]
keywords: 设计模式,适配器模式
description: 
---

## 适配器模式（Adapter pattern）
适配器模式是一种结构型模式，它将一个类的接口转接成用户所期待的。一个适配使得因接口不兼容而不能在一起工作的类工作在一起，做法是将类别自己的接口包裹在一个已存在的类中。

## 适配器模式中主要角色

- 目标(Target)角色：定义客户端使用的与特定领域相关的接口，这也就是我们所期待得到的
- 源(Adaptee)角色：需要进行适配的接口
- 适配器(Adapter)角色：对Adaptee的接口与Target接口进行适配；适配器是本模式的核心，适配器把源接口转换成目标接口，此角色为具体类

## 适用性
1、你想使用一个已经存在的类，而它的接口不符合你的需求
2、你想创建一个可以复用的类，该类可以与其他不相关的类或不可预见的类协同工作
3、你想使用一个已经存在的子类，但是不可能对每一个都进行子类化以匹配它们的接口。对象适配器可以适配它的父类接口（仅限于对象适配器）

## 类适配器模式与对象适配器

类适配器：Adapter与Adaptee是继承关系

- 用一个具体的Adapter类和Target进行匹配。结果是当我们想要一个匹配一个类以及所有它的子类时，类Adapter将不能胜任工作
- 使得Adapter可以重定义Adaptee的部分行为，因为Adapter是Adaptee的一个子集
- 仅仅引入一个对象，并不需要额外的指针以间接取得adaptee

对象适配器：Adapter与Adaptee是委托关系

- 允许一个Adapter与多个Adaptee同时工作。Adapter也可以一次给所有的Adaptee添加功能
- 使用重定义Adaptee的行为比较困难

## 类图

### 类适配器
![class adapter pattern](http://yansu-uploads.stor.sinaapp.com/imgs/class-adapter-pattern-uml.jpg)

### 对象适配器
![object adapter pattern](http://yansu-uploads.stor.sinaapp.com/imgs/object-adapter-pattern-uml.jpg)

## 实例

### 类适配器

```php
<?php

interface Target {
    public function sampleMethod1();
    public function sampleMethod2();
}
 
class Adaptee { // 源角色
    public function sampleMethod1() {}
}
 
class Adapter extends Adaptee implements Target { // 适配后角色
    public function sampleMethod2() {} 
}
 
// client
$adapter = new Adapter();
$adapter->sampleMethod1();
$adapter->sampleMethod2(); 

?>
```

### 对象适配器

```php
<?php

interface Target {
    public function sampleMethod1();
    public function sampleMethod2();
}
 
class Adaptee {
    public function sampleMethod1() {}
}
 
class Adapter implements Target {
    private $_adaptee;
    public function __construct(Adaptee $adaptee) {
        $this->_adaptee = $adaptee;
    }
 
    public function sampleMethod1() { $this->_adaptee->sampleMethod1(); }
 
    public function sampleMethod2() {}
}
 
$adaptee = new Adaptee();
$adapter = new Adapter($adaptee);
$adapter->sampleMethod1();
$adapter->sampleMethod2();
?>
```

## 参考
1. [Wikipedia: Adapter pattern](http://en.wikipedia.org/wiki/Adapter_pattern)
2. [Wikipedia: 适配器模式](http://zh.wikipedia.org/wiki/%E9%80%82%E9%85%8D%E5%99%A8%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现适配器模式](http://www.phppan.com/2010/07/php-design-pattern-10-adapter/)
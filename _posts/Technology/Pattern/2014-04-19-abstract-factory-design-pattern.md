---
layout: post
title: 设计模式详解及PHP实现：抽象工厂模式
category: 技术
tags: Pattern
keywords: 设计模式,工厂,抽象工厂模式
description: 
---

> 工厂方法模式的局限在于当要扩展类的时候，必须对工厂类也进行修改。为了解决这一问题，通过抽象工厂模式，可以创建多个工厂类，这样一但需要增加新的功能，直接增加新的工厂类即可。

## 抽象工厂模式（Abstract Factory pattern）
抽象工厂模式是一种创建型模式，它提供了一种方式，可以将一组具有同一主题的单独的工厂封装起来。它的实质是“提供接口，创建一系列相关或独立的对象，而不指定这些对象的具体类”。

具体的工厂决定了创建对象的具体类型，而且工厂就是对象实际创建的地方（比如在C++中，用“new”操作符创建对象）。然而，抽象工厂只返回一个指向创建的对象的抽象引用（或指针）。这样，客户端程序调用抽象工厂引用的方法，由具体工厂完成对象创建，然后客户端程序得到的是抽象产品的引用。如此使客户端代码与对象的创建分离开来。


## 适用性
在以下情况可以考虑使用抽象工厂模式：

- 一个系统要独立于它的产品的创建、组合和表示时。
- 一个系统要由多个产品系列中的一个来配置时。
- 需要强调一系列相关的产品对象的设计以便进行联合使用时。
- 提供一个产品类库，而只想显示它们的接口而不是实现时。

## 类图
![abstract pattern](/public/upload/abstract-pattern-uml.png)

## 实例

```php
<?php
class Button{}
class Border{}
class MacButton extends Button{}
class WinButton extends Button{}
class MacBorder extends Border{}
class WinBorder extends Border{}

interface AbstractFactory {
    public function CreateButton();
    public function CreateBorder();
}

class MacFactory implements AbstractFactory{
    public function CreateButton(){ return new MacButton(); }
    public function CreateBorder(){ return new MacBorder(); }
}
class WinFactory implements AbstractFactory{
    public function CreateButton(){ return new WinButton(); }
    public function CreateBorder(){ return new WinBorder(); }
}
?>
```

在这里例子中，工厂类实现了一组工厂方法。如果要增加新的功能，可以增加新的接口，让新的工厂类实现这个接口即可，而无需修改现有的工厂类。

## 局限性
在产品族中扩展新的产品是很困难的，它需要修改抽象工厂的接口。

## 参考
1. [Wikipedia: 抽象工厂](http://zh.wikipedia.org/wiki/%E6%8A%BD%E8%B1%A1%E5%B7%A5%E5%8E%82%E6%A8%A1%E5%BC%8F)
2. [Wikipedia: Abstract factory pattern](http://en.wikipedia.org/wiki/Abstract_factory_pattern)
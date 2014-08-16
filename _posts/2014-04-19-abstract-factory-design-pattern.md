---
layout: post
title: 设计模式详解及PHP实现：抽象工厂模式
category: 技术
tags: [Pattern, PHP]
keywords: 设计模式,工厂,抽象工厂模式
description: 
---

> 工厂方法模式的局限在于当要扩展类的时候，必须对工厂类也进行修改。为了解决这一问题，通过抽象工厂模式，可以创建多个工厂类，这样一但需要增加新的功能，直接增加新的工厂类即可。

## 抽象工厂模式（Abstract Factory pattern）
抽象工厂模式是一种创建型模式，它提供了一种方式，可以将一组具有同一主题的单独的工厂封装起来。它的实质是“提供接口，创建一系列相关或独立的对象，而不指定这些对象的具体类”。

抽象工厂模式提供一个创建一系统相关或相互依赖对象的接口，而无需指定它们具体的类。

## 抽象工厂模式中主要角色

- 抽象工厂(Abstract Factory)角色：它声明创建抽象产品对象的接口
- 具体工厂(Concrete Factory)角色：实现创建产品对象的操作
- 抽象产品(Abstract Product)角色：声明一类产品的接口
- 具体产品(Concrete Product)角色：实现抽象产品角色所定义的接口

这个和工厂方法模式类似，我们不再只要一个汉堡，可能是4个汉堡2个鸡翅，我们还是对服务员说，服务员属于具体工厂，抽象产品就是麦当劳可卖的食物，具体产品是我们跟服务员要的食物。

## 适用性

- 一个系统要独立于它的产品的创建、组合和表示时。
- 一个系统要由多个产品系列中的一个来配置时。
- 需要强调一系列相关的产品对象的设计以便进行联合使用时。
- 提供一个产品类库，而只想显示它们的接口而不是实现时。

## 类图
![abstract pattern](http://yansu-uploads.stor.sinaapp.com/imgs/abstract-pattern-uml.png)

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

## 优缺点

### 优点
- 分离了具体的类
- 使增加或替换产品族变得容易
- 有利于产品的一致性

### 缺点
难以支持新种类的产品。这是因为AbstractFactory接口确定了可以被创建的产品集合。支持新各类的产品就需要扩展访工厂接口，从而导致AbstractFactory类及其所有子类的改变。


## 参考
1. [Wikipedia: 抽象工厂](http://zh.wikipedia.org/wiki/%E6%8A%BD%E8%B1%A1%E5%B7%A5%E5%8E%82%E6%A8%A1%E5%BC%8F)
2. [Wikipedia: Abstract factory pattern](http://en.wikipedia.org/wiki/Abstract_factory_pattern)
3. [PHP设计模式笔记：使用PHP实现抽象工厂模式](http://www.phppan.com/2010/05/php-design-pattern-3-abstract-factory/)
---
layout: post
title: 设计模式详解及PHP实现：工厂方法模式
category: 技术
tags: [Pattern, PHP]
keywords: 设计模式,工厂,工厂模式
description: 
---

> 工厂方法模式是最常见的一个设计模式，即时是不懂设计模式的人，也会经常写出这样的方法。工厂模式的好处就是做到实现和使用分离，客户端在创建一个类的时候，并不需要关心它的实现方式，这个都交给工厂方法去做了。

## 工厂方法模式（Factory method pattern）
工厂方法模式是一种创建型模式，这种模式使用“工厂”概念来完成对象的创建而不用具体说明这个对象。

在面向对象程序设计中，工厂通常是一个用来创建其他对象的对象。工厂是构造方法的抽象，用来实现不同的分配方案。

## 主要角色

- 抽象产品(Product)角色：具体产品对象共有的父类或者接口。
- 具体产品(Concrete Product)角色：实现抽象产品角色所定义的接口
- 抽象工厂(Creator)角色：它声明了工厂方法，该方法返回Product对象
- 具体工厂(Concrete Creator)：实现抽象工厂接口

工厂方法模式就像我们去麦当劳买汉堡，我们只要找到服务员，让他帮我们拿来汉堡即可。其中具体某个服务员就像具体工厂，他继承了服务员应有的服务。汉堡在到手以前属于抽象产品，而我们拿到的汉堡就属于具体产品。

## 适用性

- 创建对象需要大量重复的代码（例如创建一个MySQL操作类，需要配置很多选项，这些都可以在工厂方法中进行）。
- 创建对象需要访问某些信息，而这些信息不应该包含在复合类中。
- 创建对象的生命周期必须集中管理，以保证在整个程序中具有一致的行为。

## 类图
![factory method](http://yansu-uploads.stor.sinaapp.com/imgs/factory-method-uml.png)

## 实例

### 普通工厂方法
下面的例子是工厂方法模式的应用，我们要创建两种风格的按钮，只需用不同的工厂方法获得相应按钮类即可。

```php
<?php

class Button{/* ...*/}
class WinButton extends Button{/* ...*/}
class MacButton extends Button{/* ...*/}

interface ButtonFactory{
    public function createButton($type);
}

class MyButtonFactory implements ButtonFactory{
    // 实现工厂方法
    public function createButton($type){
        switch($type){
            case 'Mac':
                return new MacButton();
            case 'Win':
                return new WinButton();
        }
    }
}
?>
```

上例中的`createButton()`方法即所谓的工厂方法，它所在的类仅仅是这个方法的载体。工厂方法的核心功能是创建类并返回，这个方法可以产生一个类，也可以产生多种类。这个方法本身的载体也并不局限，将其设置为静态方法也是可以的，这个根据自己的情况而定。

## 优缺点

### 优点
工厂方法模式可以允许系统在不修改工厂角色的情况下引进新产品。

### 缺点
- 重构已经存在的类会破坏客户端代码。
- 如果工厂方法所在类的构造函数为私有，则工厂方法无法继续扩展，或者必须实现工厂方法所在类的全部依赖方法。

## 参考
1. [Wikipedia: Factory method pattern](http://en.wikipedia.org/wiki/Factory_method_pattern)
2. [Wikipedia: 工厂方法模式](http://zh.wikipedia.org/wiki/%E5%B7%A5%E5%8E%82%E6%96%B9%E6%B3%95%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现工厂模式](http://www.phppan.com/2010/07/php-design-pattern-9-factory-method/)
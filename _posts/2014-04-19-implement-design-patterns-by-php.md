---
layout: post
title: 设计模式详解及PHP实现：综述
category: 技术
tags: [Pattern, PHP]
keywords: 设计模式,Pattern,PHP
description: 
---

> 由于工作中需要写一个比较复杂的类库，这个类库需要很高的扩展性、维护性及复用性。为了麻烦现在简单未来，使用设计模式思想来优化类库可以使工作事半功倍，在这里记录一下各种设计模式，总结一下知识，顺便也可以做为自己日后的参考。

## 设计模式（Design Patterns）

> 设计模式（Design pattern）是一套被反复使用、多数人知晓的、经过分类编目的、代码设计经验的总结。使用设计模式是为了可重用代码、让代码更容易被他人理解、保证代码可靠性。   --[百度百科](http://baike.baidu.com/view/66964.htm)

> In software engineering, a design pattern is a general reusable solution to a commonly occurring problem within a given context in software design.   --[Wikipedia](http://en.wikipedia.org/wiki/Software_design_pattern)

在软件开发过程中，一个功能的实现方式多种多样，不同方法的可扩展性、可维护性以及复用性都是不一样的。随着一个人对自己项目代码的要求增加，他会逐渐思考和实践出自己的一套方法或者思想，这种方法或思想决定了他设计出的架构或者编写出的代码的质量优劣。设计模式就属于这样一种经验的积累，是由大量优秀的工程师或者架构师总结和提炼的精华，学习好设计模式等于让我们站在了巨人的肩膀上，从一个高的起点出发，可以避免走很多弯路。

设计模式的使用一定是根据场景来选择的，而且设计模式的实现方式也不是固定的，我们一定要在理解现有设计模式的基础上，根据自己实际的情况不断实践不断理解。就像所谓的《泡妞大全》，读千万遍都不如实践一次来的实际。

如果你对设计模式完全没有感觉，那么去好好写一个类库，或者一个简单的MVC框架，这个过程会让你感觉到自己缺失的部分。

## 分类
在《设计模式：可复用面向对象软件的基础》(Design Patterns: Elements of Reusable Object-Oriented Software) 这本书中，作者把设计模式分了三大类：

### 创建型模式（Creational patterns）
[创建型模式](http://en.wikipedia.org/wiki/Creational_pattern)是为了解决创建对象时候遇到的问题。因为基本的对象创建方式可能会导致设计上的问题，或增加设计的复杂度。创建型模式有两个主导思想：一是将系统使用的具体类封装起来，二是隐藏这些具体类的实例创建和结合方式。

最常见的五种创建型模式如下：

- [工厂方法模式（Factory method pattern）](/2014/04/19/factory-method-design-pattern.html)
- [抽象工厂模式（Abstract factory pattern）](/2014/04/19/abstract-factory-design-pattern.html)
- [单例模式（Singleton pattern）](/2014/04/19/singleton-design-pattern.html)
- [建造者模式（Builder pattern）](/2014/04/19/builder-design-pattern.html)
- [原型模式（Prototype pattern）](/2014/04/20/prototype-design-pattern.html)

### 结构型模式（Structural pattern）
[结构型模式](http://en.wikipedia.org/wiki/Structural_pattern)是通过定义一个简单的方法来实现和了解实体间关系，从而简化设计。

- [适配器模式（Adapter pattern）](/2014/04/20/adapter-design-pattern.html)
- [桥接模式（Bridge pattern）](/2014/04/20/bridge-design-pattern.html)
- [合成模式（Composite pattern）](/2014/04/20/composite-design-pattern.html)
- [装饰器模式（Decorator pattern）](/2014/04/20/decorator-design-pattern.html)
- [门面模式（Facade pattern）](/2014/04/20/facade-design-pattern.html)
- [代理模式（Proxy pattern）](/2014/04/20/proxy-design-pattern.html)
- [享元模式（Flyweight Pattern）](/2014/04/20/flyweight-design-pattern.html)

### 行为型模式（Behavioral pattern）
[行为型模式](http://en.wikipedia.org/wiki/Behavioral_pattern)用来识别对象之间的常用交流模式并加以实现，使得交流变得更加灵活。

- [策略模式（Strategy pattern）](/2014/04/20/strategy-design-pattern.html)
- [模板方法模式（Template method pattern）](/2014/04/20/template-method-design-pattern.html)
- [观察者模式（Observer pattern）](/2014/04/20/observer-design-pattern.html)
- [迭代器模式（Iterator pattern）](/2014/04/21/iterator-design-pattern.html)
- [责任链模式（Chain of responsibility pattern）](/2014/04/21/chain-of-responsibility-design-pattern.html)
- [命令模式（Command pattern）](/2014/04/21/command-design-pattern.html)
- [备忘录模式（Memento pattern）](/2014/04/21/memento-design-pattern.html)
- [状态模式（State pattern）](/2014/04/21/state-design-pattern.html)
- [访问者模式（Visitor pattern）](/2014/04/21/visitor-design-pattern.html)
- [中介者模式（Mediator pattern）](/2014/04/21/mediator-design-pattern.html)
- [解释器模式（Interpreter pattern）](/2014/04/21/interpreter-design-pattern.html)

## 关系
这里有一张各个模式关系图，可以在了解各个模式以后梳理一下

![设计模式](http://yansu-uploads.stor.sinaapp.com/imgs/design-patterns.jpg)

## 参考
1. [Wikipedia: Software design pattern](http://en.wikipedia.org/wiki/Software_design_pattern)
2. [百度百科：设计模式](http://baike.baidu.com/view/66964.htm)
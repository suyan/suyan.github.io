---
layout: post
title: 设计模式详解及PHP实现：策略模式
category: 技术
tags: [Pattern, PHP]
keywords: 设计模式,策略模式
description: 
---

## 策略模式（Strategy pattern）
策略模式是一种行为型模式，它定义一系列的算法，把它们一个个封装起来，并且使它们可相互替换。策略模式可以使算法可独立于使用它的客户而变化。

## 主要角色

- 抽象策略(Strategy）角色：定义所有支持的算法的公共接口。通常是以一个接口或抽象来实现。Context使用这个接口来调用其ConcreteStrategy定义的算法
- 具体策略(ConcreteStrategy)角色：以Strategy接口实现某具体算法
- 环境(Context)角色：持有一个Strategy类的引用，用一个ConcreteStrategy对象来配置

## 适用性

- 许多相关的类仅仅是行为有异。“策略”提供了一种用多个行为中的一个行为来配置一个类的方法
- 需要使用一个算法的不同变体。
- 算法使用客户不应该知道的数据。可使用策略模式以避免暴露复杂的，与算法相关的数据结构
- 一个类定义了多种行为，并且 这些行为在这个类的操作中以多个形式出现。将相关的条件分支移和它们各自的Strategy类中以代替这些条件语句

## 类图

![strategy pattern](http://yansu-uploads.stor.sinaapp.com/imgs/strategy-pattern-uml.jpg)

## 实例

```php
<?php
interface Strategy { // 抽象策略角色，以接口实现
    public function algorithmInterface(); // 算法接口
}

class ConcreteStrategyA implements Strategy { // 具体策略角色A 
    public function algorithmInterface() {}
}

class ConcreteStrategyB implements Strategy { // 具体策略角色B 
    public function algorithmInterface() {}
}

class ConcreteStrategyC implements Strategy { // 具体策略角色C
    public function algorithmInterface() {}
}
 
class Context { // 环境角色
    private $_strategy;
    public function __construct(Strategy $strategy) {
        $this->_strategy = $strategy;
    } 
    public function contextInterface() {
        $this->_strategy->algorithmInterface();
    }
}
 
// client
$strategyA = new ConcreteStrategyA();
$context = new Context($strategyA);
$context->contextInterface();

$strategyB = new ConcreteStrategyB();
$context = new Context($strategyB);
$context->contextInterface();

$strategyC = new ConcreteStrategyC();
$context = new Context($strategyC);
$context->contextInterface();
?>
```

## 优缺点

### 优点

- 策略模式提供了管理相关的算法族的办法
- 策略模式提供了可以替换继承关系的办法 将算封闭在独立的Strategy类中使得你可以独立于其Context改变它
- 使用策略模式可以避免使用多重条件转移语句。

### 缺点

- 客户必须了解所有的策略 这是策略模式一个潜在的缺点
- Strategy和Context之间的通信开销
- 策略模式会造成很多的策略类

## 参考
1. [Wikipedia: Strategy pattern](http://en.wikipedia.org/wiki/Strategy_pattern)
2. [Wikipedia: 策略模式](http://zh.wikipedia.org/wiki/%E7%AD%96%E7%95%A5%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现策略模式](http://www.phppan.com/2010/07/php-design-pattern-12-strategy/)
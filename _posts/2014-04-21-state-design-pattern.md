---
layout: post
title: 设计模式详解及PHP实现：状态模式
category: 技术
tags: [Pattern, PHP]
keywords: 设计模式,状态模式
description: 
---

## 策略模式（Strategy pattern）
状态模式是一种行为型模式，它允许一个对象在其内部状态改变时改变它的行为。对象看起来似乎修改了它的类，状态模式变化的位置在于对象的状态。

## 主要角色

- 抽象状态(State)角色：定义一个接口，用以封装环境对象的一个特定的状态所对应的行为
- 具体状态（ConcreteState)角色：每一个具体状态类都实现了环境（Context）的一个状态所对应的行为
- 环境(Context)角色：定义客户端所感兴趣的接口，并且保留一个具体状态类的实例。这个具体状态类的实例给出此环境对象的现有状态

## 适用性

- 一个对象的行为取决于它的状态，并且它必须在运行时刻根据状态改变它的行为
- 一个操作中含有庞大的多分支的条件语句，且这些分支依赖于该对象的状态。这个状态通常用一个或多个枚举常量表示。通常，有多个操作包含这一相同的条件结构。State模式模式将每一个条件分支放入一个独立的类中。这使得你可以要所对象自身的情况将对象的状态作为一个对象，这一对象可以不依赖于其他对象而独立变化

## 类图

![state pattern](http://yansu-uploads.stor.sinaapp.com/imgs/state-pattern-uml.jpg)

## 实例

```php
<?php
interface State { // 抽象状态角色
    public function handle(Context $context); // 方法示例
}

class ConcreteStateA implements State { // 具体状态角色A
    private static $_instance = null;
    private function __construct() {}
    public static function getInstance() { // 静态工厂方法，返还此类的唯一实例
        if (is_null(self::$_instance)) {
            self::$_instance = new ConcreteStateA();
        }
        return self::$_instance;
    }
 
    public function handle(Context $context) {
        $context->setState(ConcreteStateB::getInstance());
    }
 
}

class ConcreteStateB implements State { // 具体状态角色B
    private static $_instance = null;
    private function __construct() {}
    public static function getInstance() {
        if (is_null(self::$_instance)) {
            self::$_instance = new ConcreteStateB();
        }
        return self::$_instance;
    }
 
    public function handle(Context $context) {
        $context->setState(ConcreteStateA::getInstance());
    }
}

class Context { // 环境角色 
    private $_state;
    public function __construct() { // 默认为stateA
        $this->_state = ConcreteStateA::getInstance();
    }
    public function setState(State $state) {
        $this->_state = $state;
    }
    public function request() {
        $this->_state->handle($this);
    }
}

// client
$context = new Context();
$context->request();
$context->request();
$context->request();
$context->request();
?>
```

## 优缺点

### 优点

- 它将与特定状态相关的行为局部化
- 它使得状态转换显示化
- State对象可被共享

## 参考
1. [Wikipedia: State pattern](http://en.wikipedia.org/wiki/State_pattern)
2. [PHP设计模式笔记：使用PHP实现状态模式](http://www.phppan.com/2010/07/php-design-pattern-11-state/)
---
layout: post
title: 设计模式详解及PHP实现：中介者模式
category: 技术
tags: [Pattern, PHP]
keywords: 设计模式,中介者模式
description: 
---

## 中介者模式（Mediator pattern）
中介者模式是一种行为型模式，它包装了一系列对象相互作用的方式，使得这些对象不必相互明显作用，从而使它们可以松散偶合。当某些对象之间的作用发生改变时，不会立即影响其他的一些对象之间的作用，保证这些作用可以彼此独立的变化。

## 主要角色

- 中介者(Mediator）角色：定义了对象间相互作用的接口
- 具体中介者(ConcreteMediator)角色：实现了中介者定义的接口。
- 具体对象(ConcreteColleague)角色：通过中介者和别的对象进行交互

## 实例

```php
<?php
abstract class Mediator { // 中介者角色
    abstract public function send($message,$colleague); 
} 

abstract class Colleague { // 抽象对象
    private $_mediator = null; 
    public function __construct($mediator) { 
        $this->_mediator = $mediator; 
    } 
    public function send($message) { 
        $this->_mediator->send($message,$this); 
    } 
    abstract public function notify($message); 
} 

class ConcreteMediator extends Mediator { // 具体中介者角色
    private $_colleague1 = null; 
    private $_colleague2 = null; 
    public function send($message,$colleague) { 
        if($colleague == $this->_colleague1) { 
            $this->_colleague1->notify($message); 
        } else { 
            $this->_colleague2->notify($message); 
        } 
    }
    public function set($colleague1,$colleague2) { 
        $this->_colleague1 = $colleague1; 
        $this->_colleague2 = $colleague2; 
    } 
} 

class Colleague1 extends Colleague { // 具体对象角色
    public function notify($message) { } 
} 

class Colleague2 extends Colleague { // 具体对象角色
    public function notify($message) { } 
} 

// client
$objMediator = new ConcreteMediator(); 
$objC1 = new Colleague1($objMediator); 
$objC2 = new Colleague2($objMediator); 
$objMediator->set($objC1,$objC2); 
$objC1->send("to c2 from c1"); 
$objC2->send("to c1 from c2"); 
?>
```

## 参考
1. [Wikipedia: Mediator pattern](http://en.wikipedia.org/wiki/Mediator_pattern)
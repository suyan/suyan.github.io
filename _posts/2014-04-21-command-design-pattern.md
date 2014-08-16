---
layout: post
title: 设计模式详解及PHP实现：命令模式
category: 技术
tags: [Pattern, PHP]
keywords: 设计模式,命令模式
description: 
---

## 命令模式（Command pattern）
命令模式是一种行为型模式，它将一个请求封装为一个对象，从而使用你可用不同的请求对客户进行参数化；对请求排队或记录请求日志，以及支持可撤消的操作。命令模式把发出命令的责任和执行命令的责任分割开，委派给不同的对象。

请求的一方发出请求要求执行一个操作；接收的一方收到请求，并执行操作。命令模式允许请求的一方和接收的一方独立开来，使得请求的一方不必知道接收请求的一方的接口，更不必知道请求是怎么被接收，以及操作是否被执行、何时被执行，以及是怎么被执行的。

## 主要角色

- 命令（Command）角色：声明了一个给所有具体命令类的抽象接口。这是一个抽象角色。
- 具体命令（ConcreteCommand）角色：定义一个接受者和行为之间的弱耦合；实现Execute()方法，负责调用接收考的相应操作。Execute()方法通常叫做执行方法。
- 客户（Client）角色：创建了一个具体命令(ConcreteCommand)对象并确定其接收者。
- 请求者（Invoker）角色：负责调用命令对象执行请求，相关的方法叫做行动方法。
- 接收者（Receiver）角色：负责具体实施和执行一个请求。任何一个类都可以成为接收者，实施和执行请求的方法叫做行动方法。

## 适用性

- 抽象出待执行的动作以参数化对象。Command模式是回调机制的一个面向对象的替代品。
- 在不同的时刻指定、排列和执行请求。
- 支持取消操作。
- 支持修改日志。
- 用构建在原语操作上的高层操作构造一个系统。Command模式提供了对事务进行建模的方法。Command有一个公共的接口，使得你可以用同一种方式调用所有的事务。同时使用该模式也易于添加新事务以扩展系统。

## 类图

![command pattern](http://yansu-uploads.stor.sinaapp.com/imgs/command-pattern-uml.jpg)

## 实例

```php
<?php
interface Command { // 命令角色
    public function execute(); // 执行方法
}

class ConcreteCommand implements Command { // 具体命令方法 
    private $_receiver; 
    public function __construct(Receiver $receiver) {
        $this->_receiver = $receiver;
    }
    public function execute() {
        $this->_receiver->action();
    }
}

class Receiver { // 接收者角色
    private $_name;
    public function __construct($name) {
        $this->_name = $name;
    }
    public function action() { }
}

class Invoker { // 请求者角色
    private $_command; 
    public function __construct(Command $command) {
        $this->_command = $command;
    }
    public function action() {
        $this->_command->execute();
    }
}
 
$receiver = new Receiver('hello world');
$command = new ConcreteCommand($receiver);
$invoker = new Invoker($command);
$invoker->action();
?>
```

## 优缺点

### 优点

- 命令模式把请求一个操作的对象与知道怎么执行一个操作的对象分离开。
- 命令类与其他任何别的类一样，可以修改和推广。
- 可以把命令对象聚合在一起，合成为合成命令。
- 可以很容易的加入新的命令类。

### 缺点

- 可能会导致某些系统有过多的具体命令类。

## 参考
1. [Wikipedia: Command pattern](http://en.wikipedia.org/wiki/Command_pattern)
2. [Wikipedia: 命令模式](http://zh.wikipedia.org/wiki/%E5%91%BD%E4%BB%A4%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现命令模式](http://www.phppan.com/2010/08/php-design-pattern-15-comman/)
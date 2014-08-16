---
layout: post
title: 设计模式详解及PHP实现：观察着模式
category: 技术
tags: [Pattern, PHP]
keywords: 设计模式,观察者模式
description: 
---

## 观察者模式（Observer pattern）
观察者模式是一种行为型模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并被自动更新。

又称为发布-订阅（Publish-Subscribe）模式、模型-视图（Model-View）模式、源-监听（Source-Listener）模式、或从属者(Dependents)模式

## 主要角色

- 抽象主题（Subject）角色：主题角色将所有对观察者对象的引用保存在一个集合中，每个主题可以有任意多个观察者。抽象主题提供了增加和删除观察者对象的接口。
- 抽象观察者（Observer）角色：为所有的具体观察者定义一个接口，在观察的主题发生改变时更新自己。
- 具体主题（ConcreteSubject）角色：存储相关状态到具体观察者对象，当具体主题的内部状态改变时，给所有登记过的观察者发出通知。具体主题角色通常用一个具体子类实现。
- 具体观察者（ConcretedObserver）角色：存储一个具体主题对象，存储相关状态，实现抽象观察者角色所要求的更新接口，以使得其自身状态和主题的状态保持一致。

## 适用性

- 当一个抽象模型有两个方面，其中一个方面依赖于另一个方面。
- 当对一个对象的改变需要同时改变其它对象，而不知道具体有多少个对象待改变。
- 当一个对象必须通知其它对象，而它又不能假定其它对象是谁。换句话说，你不希望这些对象是紧密耦合的。

## 类图

![observer pattern](http://yansu-uploads.stor.sinaapp.com/imgs/observer-pattern-uml.jpg)

## 实例

```php
<?php
interface Subject { // 抽象主题角色
    public function attach(Observer $observer); // 增加一个新的观察者对象
    public function detach(Observer $observer); // 删除一个已注册过的观察者对象
    public function notifyObservers(); // 通知所有注册过的观察者对象
}

class ConcreteSubject implements Subject { // 具体主题角色
    private $_observers; 
    public function __construct() { $this->_observers = array(); }
    public function attach(Observer $observer) {
        return array_push($this->_observers, $observer);
    }
    public function detach(Observer $observer) {
        $index = array_search($observer, $this->_observers);
        if ($index === FALSE || ! array_key_exists($index, $this->_observers)) {
            return FALSE;
        } 
        unset($this->_observers[$index]);
        return TRUE;
    }
    public function notifyObservers() {
        if (!is_array($this->_observers)) { return FALSE; } 
        foreach ($this->_observers as $observer) { 
            $observer->update(); 
        } 
        return TRUE;
    }
 
}

interface Observer { // 抽象观察者角色
    public function update(); // 更新方法
}
 
class ConcreteObserver implements Observer {
    private $_name; 
    public function __construct($name) { $this->_name = $name; }
    public function update() {}
}
 
$subject = new ConcreteSubject();

/* 添加第一个观察者 */
$observer1 = new ConcreteObserver('Mac');
$subject->attach($observer1);
$subject->notifyObservers(); // 主题变化，通知观察者

/* 添加第二个观察者 */
$observer2 = new ConcreteObserver('Win');
$subject->attach($observer2);
$subject->notifyObservers();

$subject->detach($observer1);
$subject->notifyObservers();
?>
```

## 优缺点

### 优点

- 观察者和主题之间的耦合度较小。
- 支持广播通信。

### 缺点

- 由于观察者并不知道其它观察者的存在，它可能对改变目标的最终代价一无所知。这可能会引起意外的更新。

## 参考
1. [Wikipedia: Observer pattern](http://en.wikipedia.org/wiki/Observer_pattern)
2. [Wikipedia: 观察者模式](http://zh.wikipedia.org/wiki/%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现观察者模式](http://www.phppan.com/2010/09/php-design-pattern-17-observer/)
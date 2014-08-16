---
layout: post
title: 设计模式详解及PHP实现：装饰器模式
category: 技术
tags: [Pattern, PHP]
keywords: 设计模式,装饰器模式
description: 
---

## 装饰器模式（Decorator pattern）
装饰器模式是一种结构型模式，它动态的给一个对象添加一些额外的职责。就增加功能来说，Decorator模式相比生成子类更为灵活【GOF95】
装饰模式是以对客户透明的方式动态地给一个对象附加上更多的职责。这也就是说，客户端并不会觉得对象在装饰前和装饰后有什么不同。装饰模式可以在不使用创造更多子类的情况下，将对象的功能加以扩展。

## 主要角色

- 抽象构件(Component)角色：定义一个对象接口，以规范准备接收附加职责的对象，从而可以给这些对象动态地添加职责。
- 具体构件(Concrete Component)角色：定义一个将要接收附加职责的类。
- 装饰(Decorator)角色：持有一个指向Component对象的指针，并定义一个与Component接口一致的接口。
- 具体装饰(Concrete Decorator)角色：负责给构件对象增加附加的职责。

## 适用性

- 在不影响其他对象的情况下，以动态、透明的方式给单个对象添加职责。
- 处理那些可以撤消的职责，即需要动态的给一个对象添加功能并且这些功能是可以动态的撤消的。
- 当不能彩生成子类的方法进行扩充时。一种情况是，可能有大量独立的扩展，为支持每一种组合将产生大量的子类，使得子类数目呈爆炸性增长。另一种情况可能是因为类定义被隐藏，或类定义不能用于生成子类。

## 类图

![decorator pattern](http://yansu-uploads.stor.sinaapp.com/imgs/decorator-pattern-uml.jpg)

## 实例

```php
<?php
interface Component {
    public function operation();
}
 
abstract class Decorator implements Component{ // 装饰角色 
    protected  $_component;
    public function __construct(Component $component) {
        $this->_component = $component;
    }
    public function operation() {
        $this->_component->operation();
    }
}
 
class ConcreteDecoratorA extends Decorator { // 具体装饰类A
    public function __construct(Component $component) {
        parent::__construct($component);
    } 
    public function operation() {
        parent::operation();    //  调用装饰类的操作
        $this->addedOperationA();   //  新增加的操作
    }
    public function addedOperationA() {}
}

class ConcreteDecoratorB extends Decorator { // 具体装饰类B
    public function __construct(Component $component) {
        parent::__construct($component);
    } 
    public function operation() {
        parent::operation();
        $this->addedOperationB();
    }
    public function addedOperationB() {}
}
 
class ConcreteComponent implements Component{ 
    public function operation() {} 
}
 
// clients
$component = new ConcreteComponent();
$decoratorA = new ConcreteDecoratorA($component);
$decoratorB = new ConcreteDecoratorB($decoratorA);

$decoratorA->operation();
$decoratorB->operation();
?>
```

## 优缺点

### 优点
- 比静态继承更灵活；
- 避免在层次结构高层的类有太多的特征

### 缺点
- 使用装饰模式会产生比使用继承关系更多的对象。并且这些对象看上去都很想像，从而使得查错变得困难。

## 参考
1. [Wikipedia: Decorator pattern](http://en.wikipedia.org/wiki/Decorator_pattern)
2. [Wikipedia: 修饰模式](http://zh.wikipedia.org/wiki/%E4%BF%AE%E9%A5%B0%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现装饰模式](http://www.phppan.com/2010/06/php-design-pattern-4-decorator/)
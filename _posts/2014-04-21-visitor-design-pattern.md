---
layout: post
title: 设计模式详解及PHP实现：访问者模式
category: 技术
tags: [Pattern, PHP]
keywords: 设计模式,访问者模式
description: 
---

## 访问者模式（Visitor pattern）
访问者模式是一种行为型模式，访问者表示一个作用于某对象结构中各元素的操作。它可以在不修改各元素类的前提下定义作用于这些元素的新操作，即动态的增加具体访问者角色。

访问者模式利用了双重分派。先将访问者传入元素对象的Accept方法中，然后元素对象再将自己传入访问者，之后访问者执行元素的相应方法。

## 主要角色

- 抽象访问者角色(Visitor)：为该对象结构(ObjectStructure)中的每一个具体元素提供一个访问操作接口。该操作接口的名字和参数标识了 要访问的具体元素角色。这样访问者就可以通过该元素角色的特定接口直接访问它。
- 具体访问者角色(ConcreteVisitor)：实现抽象访问者角色接口中针对各个具体元素角色声明的操作。
- 抽象节点（Node）角色：该接口定义一个accept操作接受具体的访问者。
- 具体节点（Node）角色：实现抽象节点角色中的accept操作。
- 对象结构角色(ObjectStructure)：这是使用访问者模式必备的角色。它要具备以下特征：能枚举它的元素；可以提供一个高层的接口以允许该访问者访问它的元素；可以是一个复合（组合模式）或是一个集合，如一个列表或一个无序集合(在PHP中我们使用数组代替，因为PHP中的数组本来就是一个可以放置任何类型数据的集合)

## 适用性

- 访问者模式多用在聚集类型多样的情况下。在普通的形式下必须判断每个元素是属于什么类型然后进行相应的操作，从而诞生出冗长的条件转移语句。而访问者模式则可以比较好的解决这个问题。对每个元素统一调用$element->accept($vistor)即可。
- 访问者模式多用于被访问的类结构比较稳定的情况下，即不会随便添加子类。访问者模式允许被访问结构添加新的方法。

## 类图

![visitor pattern](http://yansu-uploads.stor.sinaapp.com/imgs/visitor-pattern-uml.jpg)

## 实例

```php
<?php
interface Visitor { // 抽象访问者角色
    public function visitConcreteElementA(ConcreteElementA $elementA);
    public function visitConcreteElementB(concreteElementB $elementB);
}
 
interface Element { // 抽象节点角色
    public function accept(Visitor $visitor);
}
 
class ConcreteVisitor1 implements Visitor { // 具体的访问者1
    public function visitConcreteElementA(ConcreteElementA $elementA) {}
    public function visitConcreteElementB(ConcreteElementB $elementB) {}
}

class ConcreteVisitor2 implements Visitor { // 具体的访问者2
    public function visitConcreteElementA(ConcreteElementA $elementA) {}
    public function visitConcreteElementB(ConcreteElementB $elementB) {}
}

class ConcreteElementA implements Element { // 具体元素A
    private $_name;
    public function __construct($name) { $this->_name = $name; } 
    public function getName() { return $this->_name; }
    public function accept(Visitor $visitor) { // 接受访问者调用它针对该元素的新方法
        $visitor->visitConcreteElementA($this);
    }
}

class ConcreteElementB implements Element { // 具体元素B
    private $_name; 
    public function __construct($name) { $this->_name = $name;}
    public function getName() { return $this->_name; }
    public function accept(Visitor $visitor) { // 接受访问者调用它针对该元素的新方法
        $visitor->visitConcreteElementB($this);
    }
}

class ObjectStructure { // 对象结构 即元素的集合
    private $_collection; 
    public function __construct() { $this->_collection = array(); } 
    public function attach(Element $element) {
        return array_push($this->_collection, $element);
    }
    public function detach(Element $element) {
        $index = array_search($element, $this->_collection);
        if ($index !== FALSE) {
            unset($this->_collection[$index]);
        }
        return $index;
    }
    public function accept(Visitor $visitor) {
        foreach ($this->_collection as $element) {
            $element->accept($visitor);
        }
    }
}

// client
$elementA = new ConcreteElementA("ElementA");
$elementB = new ConcreteElementB("ElementB");
$elementA2 = new ConcreteElementB("ElementA2");
$visitor1 = new ConcreteVisitor1();
$visitor2 = new ConcreteVisitor2();

$os = new ObjectStructure();
$os->attach($elementA);
$os->attach($elementB);
$os->attach($elementA2);
$os->detach($elementA);
$os->accept($visitor1);
$os->accept($visitor2);
?>
```

## 优缺点

### 优点

- 访问者模式使得增加新的操作变得很容易。使用访问者模式可以在不用修改具体元素类的情况下增加新的操作。它主要是通过元素类的accept方法来接受一个新的visitor对象来实现的。如果一些操作依赖于一个复杂的结构对象的话，那么一般而言，增加新的操作会很复杂。而使用访问者模式，增加新的操作就意味着增加一个新的访问者类，因此，变得很容易。
- 访问者模式将有关的行为集中到一个访问者对象中，而不是分散到一个个的节点类中。
- 访问者模式可以跨过几个类的等级结构访问属于不同的等级结构的成员类。迭代子只能访问属于同一个类型等级结构的成员对象，而不能访问属于不同等级结构的对象。访问者模式可以做到这一点。
- 积累状态。每一个单独的访问者对象都集中了相关的行为，从而也就可以在访问的过程中将执行操作的状态积累在自己内部，而不是分散到很多的节点对象中。这是有益于系统维护的优点。

### 缺点

- 增加新的节点类变得很困难。每增加一个新的节点都意味着要在抽象访问者角色中增加一个新的抽象操作，并在每一个具体访问者类中增加相应的具体操作。
- 破坏封装。访问者模式要求访问者对象访问并调用每一个节点对象的操作，这隐含了一个对所有节点对象的要求：它们必须暴露一些自己的操作和内部状态。不然，访问者的访问就变得没有意义。由于访问者对象自己会积累访问操作所需的状态，从而使这些状态不再存储在节点对象中，这也是破坏封装的。

## 参考
1. [Wikipedia: Visitor pattern](http://en.wikipedia.org/wiki/Visitor_pattern)
2. [Wikipedia: 访问者模式](http://zh.wikipedia.org/wiki/%E8%AE%BF%E9%97%AE%E8%80%85%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现访问者模式](http://www.phppan.com/2010/05/php-design-pattern-1-visitor/)
---
layout: post
title: 设计模式详解及PHP实现：桥接模式
category: 技术
tags: [Pattern, PHP]
keywords: 设计模式,桥接模式
description: 
---

## 桥接模式（Bridge pattern）
桥接模式是一种结构型模式，它是软件设计模式中最复杂的模式之一，它把事物对象和其具体行为、具体特征分离开来，使它们可以各自独立的变化。事物对象仅是一个抽象的概念。如“圆形”、“三角形”归于抽象的“形状”之下，而“画圆”、“画三角”归于实现行为的“画图”类之下，然后由“形状”调用“画图”。

## 主要角色

- 抽象化(Abstraction)角色：定义抽象类的接口并保存一个对实现化对象的引用。
- 修正抽象化(Refined Abstraction)角色：扩展抽象化角色，改变和修正父类对抽象化的定义。
- 实现化(Implementor)角色：定义实现类的接口，不给出具体的实现。此接口不一定和抽象化角色的接口定义相同，实际上，这两个接口可以完全不同。实现化角色应当只给出底层操作，而抽象化角色应当只给出基于底层操作的更高一层的操作。
- 具体实现化(Concrete Implementor)角色：实现实现化角色接口并定义它的具体实现。

## 适用性
- 如果一个系统需要在构件的抽象化和具体化角色之间增加更多的灵活性，避免在两个层次之间建立静态的联系。
- 设计要求实现化角色的任何改变不应当影响客户端，或者说实现化角色的改变对客户端是完全透明的。
- 一个构件有多于一个的抽象化角色和实现化角色，并且系统需要它们之间进行动态的耦合。
- 虽然在系统中使用继承是没有问题的，但是由于抽象化角色和具体化角色需要独立变化，设计要求需要独立管理这两者。

## 类图

![bridge pattern](http://yansu-uploads.stor.sinaapp.com/imgs/bridge-pattern-uml.jpg)

## 实例

```php
<?php
abstract class Abstraction { // 抽象化角色，抽象化给出的定义，并保存一个对实现化对象的引用。    
    protected $imp; // 对实现化对象的引用
    public function operation() {
        $this->imp->operationImp();
    }
}
 
class RefinedAbstraction extends Abstraction { // 修正抽象化角色, 扩展抽象化角色，改变和修正父类对抽象化的定义。
     public function __construct(Implementor $imp) {
        $this->imp = $imp;
    }
    public function operation() { $this->imp->operationImp(); }
}
 
abstract class Implementor { // 实现化角色, 给出实现化角色的接口，但不给出具体的实现。
    abstract public function operationImp();
}
 
class ConcreteImplementorA extends Implementor { // 具体化角色A
    public function operationImp() {}
}
 
class ConcreteImplementorB extends Implementor { // 具体化角色B
    public function operationImp() {}
}
 
// client
$abstraction = new RefinedAbstraction(new ConcreteImplementorA());
$abstraction->operation();

$abstraction = new RefinedAbstraction(new ConcreteImplementorB());
$abstraction->operation();
?>
```

## 优点
- 分离接口及其实现部分, 将Abstraction与Implementor分享有助于降低对实现部分编译时刻的依赖性, 接口与实现分享有助于分层，从而产生更好的结构化系统
- 提高可扩充性
- 实现细节对客户透明。

## 参考
1. [Wikipedia: Bridge pattern](http://en.wikipedia.org/wiki/Bridge_pattern)
2. [Wikipedia: 桥接模式](http://zh.wikipedia.org/wiki/%E6%A9%8B%E6%8E%A5%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现桥接模式](http://www.phppan.com/2010/06/php-design-pattern-5-bridge/)
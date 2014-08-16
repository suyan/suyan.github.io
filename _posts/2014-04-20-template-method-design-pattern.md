---
layout: post
title: 设计模式详解及PHP实现：模板方法模式
category: 技术
tags: [Pattern, PHP]
keywords: 设计模式,模板方法模式
description: 
---

## 模板方法模式（Template method pattern）
模板方法模式模式是一种行为型模式，它定义一个操作中的算法的骨架，而将一些步骤延迟到子类中。Template Method 使得子类可以在不改变一个算法的结构的情况下重定义该算法的某些特定的步骤。

## 主要角色

### 抽象模板(AbstractClass)角色
定义一个或多个抽象方法让子类实现。这些抽象方法叫做基本操作，它们是顶级逻辑的组成部分。

定义一个模板方法。这个模板方法一般是一个具体方法，它给出顶级逻辑的骨架，而逻辑的组成步骤在对应的抽象操作中，这些操作将会推迟到子类中实现。同时，顶层逻辑也可以调用具体的实现方法

#### 具体模板(ConcrteClass)角色
实现父类的一个或多个抽象方法，作为顶层逻辑的组成而存在。

每个抽象模板可以有多个具体模板与之对应，而每个具体模板有其自己对抽象方法（也就是顶层逻辑的组成部分）的实现，从而使得顶层逻辑的实现各不相同。

## 适用性

- 一次性实现一个算法的不变的部分，并将可变的行为留给子类来实现。
- 各子类中公共的行为应被提取出来并集中到一个公共父类中以避免代码重复。
- 控制子类扩展。

## 类图

![template method pattern](http://yansu-uploads.stor.sinaapp.com/imgs/template-method-pattern-uml.jpg)

## 实例

```php
<?php
abstract class AbstractClass { // 抽象模板角色
    public function templateMethod() { // 模板方法 调用基本方法组装顶层逻辑
        $this->primitiveOperation1();
        $this->primitiveOperation2();
    }
    abstract protected function primitiveOperation1(); // 基本方法
    abstract protected function primitiveOperation2();
}

class ConcreteClass extends AbstractClass { // 具体模板角色
    protected function primitiveOperation1() {}
    protected function primitiveOperation2(){}
 
}
 
$class = new ConcreteClass();
$class->templateMethod();
?>
```

## 参考
1. [Wikipedia: Template method pattern](http://en.wikipedia.org/wiki/Template_method_pattern)
2. [Wikipedia: 模板方法模式](http://zh.wikipedia.org/wiki/%E6%A8%A1%E6%9D%BF%E6%96%B9%E6%B3%95%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现模板方法模式](http://www.phppan.com/2010/09/php-design-pattern-16-template-method/)
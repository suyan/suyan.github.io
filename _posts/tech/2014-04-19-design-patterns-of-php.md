---
layout: post
title: 设计模式详解及PHP实现
category: 技术
tags: [Pattern, PHP]
keywords: 设计模式,Pattern,PHP,建造者模式,单例模式,适配器模式,桥接模式,组合模式,装饰器模式,门面模式,享元模式,观察者模式,备忘录模式,中介者模式,迭代器模式,解释器模式,策略模式,命令模式,代理模式,原型模式,状态模式,访问者模式,模板方法模式,责任链模式,抽象工厂模式,工厂模式
---

> 由于工作中需要写一个比较复杂的类库，这个类库需要很高的扩展性、维护性及复用性。为了麻烦现在简单未来，使用设计模式思想来优化类库可以使工作事半功倍，在这里记录一下各种设计模式，总结一下知识，顺便也可以做为自己日后的参考。

## 设计模式（Design Patterns）

> 设计模式（Design pattern）是一套被反复使用、多数人知晓的、经过分类编目的、代码设计经验的总结。使用设计模式是为了可重用代码、让代码更容易被他人理解、保证代码可靠性。   --[百度百科](http://baike.baidu.com/view/66964.htm)

> In software engineering, a design pattern is a general reusable solution to a commonly occurring problem within a given context in software design.   --[Wikipedia](http://en.wikipedia.org/wiki/Software_design_pattern)

在软件开发过程中，一个功能的实现方式多种多样，不同方法的可扩展性、可维护性以及复用性都是不一样的。随着一个人对自己项目代码的要求增加，他会逐渐思考和实践出自己的一套方法或者思想，这种方法或思想决定了他设计出的架构或者编写出的代码的质量优劣。设计模式就属于这样一种经验的积累，是由大量优秀的工程师或者架构师总结和提炼的精华，学习好设计模式等于让我们站在了巨人的肩膀上，从一个高的起点出发，可以避免走很多弯路。

设计模式的使用一定是根据场景来选择的，而且设计模式的实现方式也不是固定的，我们一定要在理解现有设计模式的基础上，根据自己实际的情况不断实践不断理解。就像所谓的《泡妞大全》，读千万遍都不如实践一次来的实际。

如果你对设计模式完全没有感觉，那么去好好写一个类库，或者一个简单的MVC框架，这个过程会让你感觉到自己缺失的部分。

### 分类
在《设计模式：可复用面向对象软件的基础》(Design Patterns: Elements of Reusable Object-Oriented Software) 这本书中，作者把设计模式分了三大类：

#### 创建型模式（Creational patterns）
[创建型模式](http://en.wikipedia.org/wiki/Creational_pattern)是为了解决创建对象时候遇到的问题。因为基本的对象创建方式可能会导致设计上的问题，或增加设计的复杂度。创建型模式有两个主导思想：一是将系统使用的具体类封装起来，二是隐藏这些具体类的实例创建和结合方式。

最常见的五种创建型模式如下：

- 工厂方法模式（Factory method pattern)
- 抽象工厂模式（Abstract factory pattern)
- 单例模式（Singleton pattern）
- 建造者模式（Builder pattern）
- 原型模式（Prototype pattern）

#### 结构型模式（Structural pattern）
[结构型模式](http://en.wikipedia.org/wiki/Structural_pattern)是通过定义一个简单的方法来实现和了解实体间关系，从而简化设计。

- 适配器模式（Adapter pattern）
- 桥接模式（Bridge pattern）
- 合成模式（Composite pattern）
- 装饰器模式（Decorator pattern）
- 门面模式（Facade pattern）
- 代理模式（Proxy pattern）
- 享元模式（Flyweight Pattern）

#### 行为型模式（Behavioral pattern）
[行为型模式](http://en.wikipedia.org/wiki/Behavioral_pattern)用来识别对象之间的常用交流模式并加以实现，使得交流变得更加灵活。

- 策略模式（Strategy pattern）
- 模板方法模式（Template method pattern）
- 观察者模式（Observer pattern）
- 迭代器模式（Iterator pattern）
- 责任链模式（Chain of responsibility pattern）
- 命令模式（Command pattern）
- 备忘录模式（Memento pattern）
- 状态模式（State pattern）
- 访问者模式（Visitor pattern）
- 中介者模式（Mediator pattern）
- 解释器模式（Interpreter pattern）

### 关系
这里有一张各个模式关系图，可以在了解各个模式以后梳理一下

![设计模式](http://7u2ho6.com1.z0.glb.clouddn.com/tech-design-patterns.jpg)

### 参考
1. [Wikipedia: Software design pattern](http://en.wikipedia.org/wiki/Software_design_pattern)
2. [百度百科：设计模式](http://baike.baidu.com/view/66964.htm)


## 建造者模式（Builder pattern）
建造者模式是一种创建型模式，它可以让一个产品的内部表象和和产品的生产过程分离开，从而可以生成具有不同内部表象的产品。

### Builder模式中主要角色

- 抽象建造者(Builder)角色：定义抽象接口，规范产品各个部分的建造，必须包括建造方法和返回方法。
- 具体建造者(Concrete)角色：实现抽象建造者接口。应用程序最终根据此角色中实现的业务逻辑创造产品。
- 导演者(Director)角色：调用具体的建造者角色创造产品。
- 产品(Product)角色：在导演者的指导下所创建的复杂对象。

### 适用性

- 当创建复杂对象的算法应该独立于该对象的组成部分以及它们的装配方式时。
- 当构造过程必须允许被构造的对象有不同的表示时。

### 类图
![builder pattern](http://7u2ho6.com1.z0.glb.clouddn.com/tech-builder-pattern-uml.png)

### 实例

```php
<?php

class Product { // 产品本身
    private $_parts; 
    public function __construct() { $this->_parts = array(); } 
    public function add($part) { return array_push($this->_parts, $part); }
}
 
abstract class Builder { // 建造者抽象类
    public abstract function buildPart1();
    public abstract function buildPart2();
    public abstract function getResult();
}
 
class ConcreteBuilder extends Builder { // 具体建造者
    private $_product;
    public function __construct() { $this->_product = new Product(); }
    public function buildPart1() { $this->_product->add("Part1"); } 
    public function buildPart2() { $this->_product->add("Part2"); }
    public function getResult() { return $this->_product; }
}
 
class Director { 
    public function __construct(Builder $builder) {
        $builder->buildPart1();
        $builder->buildPart2();
    }
}

// client 
$buidler = new ConcreteBuilder();
$director = new Director($buidler);
$product = $buidler->getResult();
?>
```

### 优缺点

#### 优点
建造者模式可以很好的将一个对象的实现与相关的“业务”逻辑分离开来，从而可以在不改变事件逻辑的前提下，使增加(或改变)实现变得非常容易。

#### 缺点
建造者接口的修改会导致所有执行类的修改。

### 参考
1. [Wikipedia: Bulider pattern](http://en.wikipedia.org/wiki/Builder_pattern)
2. [Wikipedia: 生成器模式](http://zh.wikipedia.org/wiki/%E7%94%9F%E6%88%90%E5%99%A8%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现建造者模式](http://www.phppan.com/2010/05/php-design-pattern-2-builder/)


## 单例模式（Singleton pattern）
抽象工厂模式是一种创建型模式，在应用这个模式时，单例对象的类必须保证只有一个实例存在。

实现单例模式的思路是：一个类能返回对象一个引用(永远是同一个)和一个获得该实例的方法（必须是静态方法，通常使用getInstance这个名称）；当我们调用这个方法时，如果类持有的引用不为空就返回这个引用，如果类保持的引用为空就创建该类的实例并将实例的引用赋予该类保持的引用；同时我们还将该类的构造函数定义为私有方法，这样其他处的代码就无法通过调用该类的构造函数来实例化该类的对象，只有通过该类提供的静态方法来得到该类的唯一实例。

### 单例模式中主要角色
Singleton定义一个getInstance操作，允许客户访问它唯一的实例。

这个例子也简单，就像我有6个老婆（快醒醒!），她们在喊"老公"的时候都是指我。不管什么时候，喊老公擦地，做饭，洗衣服都是指同一个人，PHP不编写多线程，所以不存在抢占问题，如果换别的语言编写，一定得考虑到抢占问题！老公是不可以边擦地边做饭的！

### 适用性

- 当类只能有一个实例而且客户可以从一个众所周知的访问点访问它时
- 当这个唯一实例应该是通过子类化可扩展的。并且用户应该无需更改代码就能使用一个扩展的实例时。

### 类图
![singleton pattern](http://7u2ho6.com1.z0.glb.clouddn.com/tech-singleton-pattern-uml.png)

### 实例

```php
<?php 
public class Singleton {
    private static $_instance = NULL;

    // 私有构造方法 
    private function __construct() {}

    public static function getInstance() {
        if (is_null(self::$_instance)) {
            self::$_instance = new Singleton();
        }
        return self::$_instance;
    }

    // 防止克隆实例
    public function __clone(){
        die('Clone is not allowed.' . E_USER_ERROR);
    }
}
?>
```

在此实例中，Singleton禁止了克隆及外部初始化，使得此类只可以通过`getInstance()`方法来获得实例，而这个实例只会在第一次使用时创建，以后每次都获得同一实例。

### 优缺点
#### 优点
- 对唯一实例的受控访问
- 缩小命名空间 单例模式是对全局变量的一种改进。它避免了那些存储唯一实例的全局变量污染命名空间
- 允许对操作和表示的精华，单例类可以有子类。而且用这个扩展类的实例来配置一个应用是很容易的。你可以用你所需要的类的实例在运行时刻配置应用。
- 允许可变数目的实例（多例模式）
- 比类操作更灵活

#### 缺点
单例模式在多线程的应用场合下必须小心使用。如果当唯一实例尚未创建时，有两个线程同时调用创建方法，那么它们同时没有检测到唯一实例的存在，从而同时各自创建了一个实例，这样就有两个实例被构造出来，从而违反了单例模式中实例唯一的原则。解决这个问题的办法是为指示类是否已经实例化的变量提供一个互斥锁(虽然这样会降低效率)。


### 参考
1. [Wikipedia: 单例模式](http://zh.wikipedia.org/wiki/%E5%8D%95%E4%BE%8B%E6%A8%A1%E5%BC%8F)
2. [Wikipedia: Singleton pattern](http://en.wikipedia.org/wiki/Singleton_pattern)
3. [PHP设计模式笔记：使用PHP实现单例模式](http://www.phppan.com/2010/06/php-design-pattern-6-singleton/)

## 适配器模式（Adapter pattern）
适配器模式是一种结构型模式，它将一个类的接口转接成用户所期待的。一个适配使得因接口不兼容而不能在一起工作的类工作在一起，做法是将类别自己的接口包裹在一个已存在的类中。

### 适配器模式中主要角色

- 目标(Target)角色：定义客户端使用的与特定领域相关的接口，这也就是我们所期待得到的
- 源(Adaptee)角色：需要进行适配的接口
- 适配器(Adapter)角色：对Adaptee的接口与Target接口进行适配；适配器是本模式的核心，适配器把源接口转换成目标接口，此角色为具体类

### 适用性
1、你想使用一个已经存在的类，而它的接口不符合你的需求
2、你想创建一个可以复用的类，该类可以与其他不相关的类或不可预见的类协同工作
3、你想使用一个已经存在的子类，但是不可能对每一个都进行子类化以匹配它们的接口。对象适配器可以适配它的父类接口（仅限于对象适配器）

### 类适配器模式与对象适配器

类适配器：Adapter与Adaptee是继承关系

- 用一个具体的Adapter类和Target进行匹配。结果是当我们想要一个匹配一个类以及所有它的子类时，类Adapter将不能胜任工作
- 使得Adapter可以重定义Adaptee的部分行为，因为Adapter是Adaptee的一个子集
- 仅仅引入一个对象，并不需要额外的指针以间接取得adaptee

对象适配器：Adapter与Adaptee是委托关系

- 允许一个Adapter与多个Adaptee同时工作。Adapter也可以一次给所有的Adaptee添加功能
- 使用重定义Adaptee的行为比较困难

### 类图

#### 类适配器
![class adapter pattern](http://7u2ho6.com1.z0.glb.clouddn.com/tech-class-adapter-pattern-uml.jpg)

#### 对象适配器
![object adapter pattern](http://7u2ho6.com1.z0.glb.clouddn.com/tech-object-adapter-pattern-uml.jpg)

### 实例

#### 类适配器

```php
<?php

interface Target {
    public function sampleMethod1();
    public function sampleMethod2();
}
 
class Adaptee { // 源角色
    public function sampleMethod1() {}
}
 
class Adapter extends Adaptee implements Target { // 适配后角色
    public function sampleMethod2() {} 
}
 
// client
$adapter = new Adapter();
$adapter->sampleMethod1();
$adapter->sampleMethod2(); 

?>
```

#### 对象适配器

```php
<?php

interface Target {
    public function sampleMethod1();
    public function sampleMethod2();
}
 
class Adaptee {
    public function sampleMethod1() {}
}
 
class Adapter implements Target {
    private $_adaptee;
    public function __construct(Adaptee $adaptee) {
        $this->_adaptee = $adaptee;
    }
 
    public function sampleMethod1() { $this->_adaptee->sampleMethod1(); }
 
    public function sampleMethod2() {}
}
 
$adaptee = new Adaptee();
$adapter = new Adapter($adaptee);
$adapter->sampleMethod1();
$adapter->sampleMethod2();
?>
```

### 参考
1. [Wikipedia: Adapter pattern](http://en.wikipedia.org/wiki/Adapter_pattern)
2. [Wikipedia: 适配器模式](http://zh.wikipedia.org/wiki/%E9%80%82%E9%85%8D%E5%99%A8%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现适配器模式](http://www.phppan.com/2010/07/php-design-pattern-10-adapter/)

## 桥接模式（Bridge pattern）
桥接模式是一种结构型模式，它是软件设计模式中最复杂的模式之一，它把事物对象和其具体行为、具体特征分离开来，使它们可以各自独立的变化。事物对象仅是一个抽象的概念。如“圆形”、“三角形”归于抽象的“形状”之下，而“画圆”、“画三角”归于实现行为的“画图”类之下，然后由“形状”调用“画图”。

### 主要角色

- 抽象化(Abstraction)角色：定义抽象类的接口并保存一个对实现化对象的引用。
- 修正抽象化(Refined Abstraction)角色：扩展抽象化角色，改变和修正父类对抽象化的定义。
- 实现化(Implementor)角色：定义实现类的接口，不给出具体的实现。此接口不一定和抽象化角色的接口定义相同，实际上，这两个接口可以完全不同。实现化角色应当只给出底层操作，而抽象化角色应当只给出基于底层操作的更高一层的操作。
- 具体实现化(Concrete Implementor)角色：实现实现化角色接口并定义它的具体实现。

### 适用性
- 如果一个系统需要在构件的抽象化和具体化角色之间增加更多的灵活性，避免在两个层次之间建立静态的联系。
- 设计要求实现化角色的任何改变不应当影响客户端，或者说实现化角色的改变对客户端是完全透明的。
- 一个构件有多于一个的抽象化角色和实现化角色，并且系统需要它们之间进行动态的耦合。
- 虽然在系统中使用继承是没有问题的，但是由于抽象化角色和具体化角色需要独立变化，设计要求需要独立管理这两者。

### 类图

![bridge pattern](http://7u2ho6.com1.z0.glb.clouddn.com/tech-bridge-pattern-uml.jpg)

### 实例

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

### 优点
- 分离接口及其实现部分, 将Abstraction与Implementor分享有助于降低对实现部分编译时刻的依赖性, 接口与实现分享有助于分层，从而产生更好的结构化系统
- 提高可扩充性
- 实现细节对客户透明。

### 参考
1. [Wikipedia: Bridge pattern](http://en.wikipedia.org/wiki/Bridge_pattern)
2. [Wikipedia: 桥接模式](http://zh.wikipedia.org/wiki/%E6%A9%8B%E6%8E%A5%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现桥接模式](http://www.phppan.com/2010/06/php-design-pattern-5-bridge/)

## 合成模式（Composite pattern）
合成模式是一种结构型模式，它将对象组合成树形结构以表示”部分-整体”的层次结构。Composite使用户对单个对象和组合对象的使用具有一致性。
Composite变化的是一个对象的结构和组成。

### 主要角色

- 抽象组件(Component)角色：抽象角色，给参加组合的对象规定一个接口。在适当的情况下，实现所有类共有接口的缺省行为。声明一个接口用于访问和管理Component的子组件
- 树叶组件(Leaf)角色：在组合中表示叶节点对象，叶节点没有子节点。在组合中定义图元对象的行为。
- 树枝组件(Composite)角色：存储子部件。定义有子部件的那些部件的行为。在Component接口中实现与子部件有关的操作。
- 客户端(Client)：通过Component接口操纵组合部件的对象

### 适用性

- 你想表示对象的部分-整体层次结构。
- 你希望用户忽略组合对象和单个对象的不同，用户将统一地使用组合结构中的所有对象。

### 类图

#### 安全式合成模式

![safe composite pattern](http://7u2ho6.com1.z0.glb.clouddn.com/tech-safe-composite-pattern-uml.jpg)

#### 透明式合成模式

![transparent composite pattern](http://7u2ho6.com1.z0.glb.clouddn.com/tech-transparent-composite-pattern-uml.jpg)

### 实例

#### 安全式合成模式

在Composite类里面声明所有的用来管理子类对象的方法。这样的做法是安全的。因为树叶类型的对象根本就没有管理子类的方法，因此，如果客户端对树叶类对象使用这些方法时，程序会在编译时期出错。编译通不过，就不会出现运行时期错误。这样的缺点是不够透明，因为树叶类和合成类将具有不同的接口。

```php
<?php
interface Component {
    public function getComposite(); //返回自己的实例
    public function operation();
}
 
class Composite implements Component { // 树枝组件角色
    private $_composites;
    public function __construct() { $this->_composites = array(); }
    public function getComposite() { return $this; }
     public function operation() {
         foreach ($this->_composites as $composite) {
            $composite->operation();
        }
     }
 
    public function add(Component $component) {  //聚集管理方法 添加一个子对象
        $this->_composites[] = $component;
    }
 
    public function remove(Component $component) { // 聚集管理方法 删除一个子对象
        foreach ($this->_composites as $key => $row) {
            if ($component == $row) { unset($this->_composites[$key]); return TRUE; }
        } 
        return FALSE;
    }

    public function getChild() { // 聚集管理方法 返回所有的子对象
       return $this->_composites;
    }
 
}
 
class Leaf implements Component {
    private $_name; 
    public function __construct($name) { $this->_name = $name; }
    public function operation() {}
    public function getComposite() {return null;}
}
 
// client
$leaf1 = new Leaf('first');
$leaf2 = new Leaf('second');

$composite = new Composite();
$composite->add($leaf1);
$composite->add($leaf2);
$composite->operation();

$composite->remove($leaf2);
$composite->operation();
?>
```

#### 透明式合成模式
在Composite类里面声明所有的用来管理子类对象的方法。这样做的是好处是所有的组件类都有相同的接口。在客户端看来，树叶类和合成类对象的区别起码在接口层次上消失了，客户端可以同等的对待所有的对象。这就是透明形式的合成模式，缺点就是不够安全，因为树叶类对象和合成类对象在本质上是有区别的。树叶类对象不可能有下一个层次的对象，因此调用其添加或删除方法就没有意义了，这在编译期间是不会出错的，而只会在运行时期才会出错。

```php
<?php
interface Component { // 抽象组件角色
    public function getComposite(); // 返回自己的实例
    public function operation(); // 示例方法
    public function add(Component $component); // 聚集管理方法,添加一个子对象
    public function remove(Component $component); // 聚集管理方法 删除一个子对象
    public function getChild(); // 聚集管理方法 返回所有的子对象
}
 
class Composite implements Component { // 树枝组件角色
    private $_composites;
    public function __construct() { $this->_composites = array(); } 
    public function getComposite() { return $this; }
    public function operation() { // 示例方法，调用各个子对象的operation方法
        foreach ($this->_composites as $composite) {
            $composite->operation();
        }
    }
    public function add(Component $component) { // 聚集管理方法 添加一个子对象
        $this->_composites[] = $component;
    }
    public function remove(Component $component) { // 聚集管理方法 删除一个子对象
        foreach ($this->_composites as $key => $row) {
            if ($component == $row) { unset($this->_composites[$key]); return TRUE; }
        } 
        return FALSE;
    }
    public function getChild() { // 聚集管理方法 返回所有的子对象
       return $this->_composites;
    }
 
}
 
class Leaf implements Component {
    private $_name;
    public function __construct($name) {$this->_name = $name;}
    public function operation() {}
    public function getComposite() { return null; }
    public function add(Component $component) { return FALSE; }
    public function remove(Component $component) { return FALSE; }
    public function getChild() { return null; }
}
 
// client 
$leaf1 = new Leaf('first');
$leaf2 = new Leaf('second');

$composite = new Composite();
$composite->add($leaf1);
$composite->add($leaf2);
$composite->operation();

$composite->remove($leaf2);
$composite->operation();
?>
```

### 优缺点
#### 优点

- 简化客户代码
- 使得更容易增加新类型的组件

#### 缺点

- 使你的设计变得更加一般化，容易增加组件也会产生一些问题，那就是很难限制组合中的组件

### 参考
1. [Wikipedia: Composite pattern](http://en.wikipedia.org/wiki/Composite_pattern)
2. [PHP设计模式笔记：使用PHP实现合成模式](http://www.phppan.com/2010/08/php-design-pattern-14-composite/)

## 装饰器模式（Decorator pattern）
装饰器模式是一种结构型模式，它动态的给一个对象添加一些额外的职责。就增加功能来说，Decorator模式相比生成子类更为灵活【GOF95】
装饰模式是以对客户透明的方式动态地给一个对象附加上更多的职责。这也就是说，客户端并不会觉得对象在装饰前和装饰后有什么不同。装饰模式可以在不使用创造更多子类的情况下，将对象的功能加以扩展。

### 主要角色

- 抽象构件(Component)角色：定义一个对象接口，以规范准备接收附加职责的对象，从而可以给这些对象动态地添加职责。
- 具体构件(Concrete Component)角色：定义一个将要接收附加职责的类。
- 装饰(Decorator)角色：持有一个指向Component对象的指针，并定义一个与Component接口一致的接口。
- 具体装饰(Concrete Decorator)角色：负责给构件对象增加附加的职责。

### 适用性

- 在不影响其他对象的情况下，以动态、透明的方式给单个对象添加职责。
- 处理那些可以撤消的职责，即需要动态的给一个对象添加功能并且这些功能是可以动态的撤消的。
- 当不能彩生成子类的方法进行扩充时。一种情况是，可能有大量独立的扩展，为支持每一种组合将产生大量的子类，使得子类数目呈爆炸性增长。另一种情况可能是因为类定义被隐藏，或类定义不能用于生成子类。

### 类图

![decorator pattern](http://7u2ho6.com1.z0.glb.clouddn.com/tech-decorator-pattern-uml.jpg)

### 实例

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

### 优缺点

#### 优点
- 比静态继承更灵活；
- 避免在层次结构高层的类有太多的特征

#### 缺点
- 使用装饰模式会产生比使用继承关系更多的对象。并且这些对象看上去都很想像，从而使得查错变得困难。

### 参考
1. [Wikipedia: Decorator pattern](http://en.wikipedia.org/wiki/Decorator_pattern)
2. [Wikipedia: 修饰模式](http://zh.wikipedia.org/wiki/%E4%BF%AE%E9%A5%B0%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现装饰模式](http://www.phppan.com/2010/06/php-design-pattern-4-decorator/)

## 门面模式（Facade pattern）
门面模式是一种结构型模式，它为子系统中的一组接口提供一个一致的界面，Facade模式定义了一个高层次的接口，使得子系统更加容易使用。

### 主要角色

#### 门面(Facade)角色

- 此角色将被客户端调用
- 知道哪些子系统负责处理请求
- 将用户的请求指派给适当的子系统

#### 子系统(subsystem)角色

- 实现子系统的功能
- 处理由Facade对象指派的任务
- 没有Facade的相关信息，可以被客户端直接调用
- 可以同时有一个或多个子系统，每个子系统都不是一个单独的类，而一个类的集合。每个子系统都可以被客户端直接调用，或者被门面角色调用。子系统并知道门面模式的存在，对于子系统而言，门面仅仅是另一个客户端。

### 适用性

- 为一些复杂的子系统提供一组接口
- 提高子系统的独立性
- 在层次化结构中，可以使用门面模式定义系统的每一层的接口

### 类图

![facade pattern](http://7u2ho6.com1.z0.glb.clouddn.com/tech-facade-pattern-uml.jpg)

### 实例

```php
<?php
class Camera {
    public function turnOn() {}
    public function turnOff() {}
    public function rotate($degrees) {}
}
 
class Light {
    public function turnOn() {}
    public function turnOff() {}
    public function changeBulb() {}
}
 
class Sensor {
    public function activate() {}
    public function deactivate() {}
    public function trigger() {}
}
 
class Alarm {
    public function activate() {}
    public function deactivate() {}
    public function ring() {}
    public function stopRing() {}
}
 
class SecurityFacade {
    private $_camera1, $_camera2;
    private $_light1, $_light2, $_light3;
    private $_sensor;
    private $_alarm;
 
    public function __construct() {
        $this->_camera1 = new Camera();
        $this->_camera2 = new Camera();
 
        $this->_light1 = new Light();
        $this->_light2 = new Light();
        $this->_light3 = new Light();
 
        $this->_sensor = new Sensor();
        $this->_alarm = new Alarm();
    }
 
    public function activate() {
        $this->_camera1->turnOn();
        $this->_camera2->turnOn();
 
        $this->_light1->turnOn();
        $this->_light2->turnOn();
        $this->_light3->turnOn();
 
        $this->_sensor->activate();
        $this->_alarm->activate();
    }
 
    public  function deactivate() {
        $this->_camera1->turnOff();
        $this->_camera2->turnOff();
 
        $this->_light1->turnOff();
        $this->_light2->turnOff();
        $this->_light3->turnOff();
 
        $this->_sensor->deactivate();
        $this->_alarm->deactivate();
    }
}
 
 
//client 
$security = new SecurityFacade();
$security->activate();
?>
```

### 优缺点

#### 优点

- 它对客户屏蔽了子系统组件，因而减少了客户处理的对象的数目并使得子系统使用起来更加方便
- 实现了子系统与客户之间的松耦合关系
- 如果应用需要，它并不限制它们使用子系统类。因此可以在系统易用性与能用性之间加以选择

### 参考
1. [Wikipedia: Facade pattern](http://en.wikipedia.org/wiki/Facade_pattern)
2. [Wikipedia: 外观模式](http://zh.wikipedia.org/wiki/%E5%A4%96%E8%A7%80%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现门面模式](http://www.phppan.com/2010/06/php-design-pattern-7-facade/)

## 享元模式（Flyweight Pattern）
享元模式是一种结构型模式，它使用共享物件，用来尽可能减少内存使用量以及分享资讯给尽可能多的相似物件；它适合用于当大量物件只是重复因而导致无法令人接受的使用大量内存。通常物件中的部分状态是可以分享。常见做法是把它们放在外部数据结构，当需要使用时再将它们传递给享元。

### 主要角色

- 抽象享元(Flyweight角色：此角色是所有的具体享元类的超类，为这些类规定出需要实现的公共接口。那些需要外蕴状态的操作可以通过调用商业以参数形式传入
- 具体享元(ConcreteFlyweight角色：实现Flyweight接口，并为内部状态（如果有的话）拉回存储空间。ConcreteFlyweight对象必须是可共享的。它所存储的状态必须是内部的
- 不共享的具体享元（UnsharedConcreteFlyweight）角色：并非所有的Flyweight子类都需要被共享。Flyweigth使共享成为可能，但它并不强制共享。
- 享元工厂(FlyweightFactory)角色：负责创建和管理享元角色。本角色必须保证享元对象可能被系统适当地共享
- 客户端(Client)角色：本角色需要维护一个对所有享元对象的引用。本角色需要自行存储所有享元对象的外部状态

### 适用性

- 一个应用程序使用了大量的对象
- 完全由于使用大量的对象，造成很大的存储开销
- 对象的大多数状态都可变为外部状态
- 如果删除对象的外部状态，那么可以用相对较少的共享对象取代很多组对象
- 应用程序不依赖于对象标识。

### 类图

![flyweight pattern](http://7u2ho6.com1.z0.glb.clouddn.com/tech-flyweight-pattern-uml.jpg)

### 实例

```php
<?php
abstract class Flyweight { // 抽象享元角色
    abstract public function operation($state);
}
 
class ConcreteFlyweight extends Flyweight { // 具体享元角色
    private $_intrinsicState = null; 
    public function __construct($state) {
        $this->_intrinsicState = $state;
    }
    public function operation($state) {}
}
 
class UnsharedConcreteFlyweight extends Flyweight { // 不共享的具体享元，客户端直接调用
    private $_intrinsicState = null;
    public function __construct($state) {
        $this->_intrinsicState = $state;
    }
    public function operation($state) {}
}

class FlyweightFactory { // 享元工厂角色 
    private $_flyweights;
    public function __construct() {
        $this->_flyweights = array();
    }
    public function getFlyweigth($state) {
        if (isset($this->_flyweights[$state])) {
            return $this->_flyweights[$state];
        } else {
            return $this->_flyweights[$state] = new ConcreteFlyweight($state);
        }
    }
}
 
// client
$flyweightFactory = new FlyweightFactory();
$flyweight = $flyweightFactory->getFlyweigth('state A');
$flyweight->operation('other state A');

$flyweight = $flyweightFactory->getFlyweigth('state B');
$flyweight->operation('other state B');

// 不共享的对象，单独调用
$uflyweight = new UnsharedConcreteFlyweight('state A');
$uflyweight->operation('other state A');
?>
```

### 优缺点

#### 优点

- Flyweight模式可以大幅度地降低内存中对象的数量。

#### 缺点

- Flyweight模式使得系统更加复杂
- Flyweigth模式将享元对象的状态外部化，而读取外部状态使得运行时间稍微变长

### 参考
1. [Wikipedia: Flyweight pattern](http://en.wikipedia.org/wiki/Flyweight_pattern)
2. [Wikipedia: 享元模式](http://zh.wikipedia.org/wiki/%E4%BA%AB%E5%85%83%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现享元模式](http://www.phppan.com/2010/08/php-design-pattern-13-flyweight/)

## 观察者模式（Observer pattern）
观察者模式是一种行为型模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并被自动更新。

又称为发布-订阅（Publish-Subscribe）模式、模型-视图（Model-View）模式、源-监听（Source-Listener）模式、或从属者(Dependents)模式

### 主要角色

- 抽象主题（Subject）角色：主题角色将所有对观察者对象的引用保存在一个集合中，每个主题可以有任意多个观察者。抽象主题提供了增加和删除观察者对象的接口。
- 抽象观察者（Observer）角色：为所有的具体观察者定义一个接口，在观察的主题发生改变时更新自己。
- 具体主题（ConcreteSubject）角色：存储相关状态到具体观察者对象，当具体主题的内部状态改变时，给所有登记过的观察者发出通知。具体主题角色通常用一个具体子类实现。
- 具体观察者（ConcretedObserver）角色：存储一个具体主题对象，存储相关状态，实现抽象观察者角色所要求的更新接口，以使得其自身状态和主题的状态保持一致。

### 适用性

- 当一个抽象模型有两个方面，其中一个方面依赖于另一个方面。
- 当对一个对象的改变需要同时改变其它对象，而不知道具体有多少个对象待改变。
- 当一个对象必须通知其它对象，而它又不能假定其它对象是谁。换句话说，你不希望这些对象是紧密耦合的。

### 类图

![observer pattern](http://7u2ho6.com1.z0.glb.clouddn.com/tech-observer-pattern-uml.jpg)

### 实例

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

### 优缺点

#### 优点

- 观察者和主题之间的耦合度较小。
- 支持广播通信。

#### 缺点

- 由于观察者并不知道其它观察者的存在，它可能对改变目标的最终代价一无所知。这可能会引起意外的更新。

### 参考
1. [Wikipedia: Observer pattern](http://en.wikipedia.org/wiki/Observer_pattern)
2. [Wikipedia: 观察者模式](http://zh.wikipedia.org/wiki/%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现观察者模式](http://www.phppan.com/2010/09/php-design-pattern-17-observer/)

## 原型模式（Prototype pattern）
原型模式是一种创建者模式，其特点在于通过“复制”一个已经存在的实例来返回新的实例,而不是新建实例。

### 原型模式中主要角色

-  抽象原型(Prototype)角色：声明一个克隆自己的接口
-  具体原型(Concrete Prototype)角色：实现一个克隆自己的操作

### 适用性

- 当一个系统应该独立于它的产品创建、构成和表示时，要使用Prototype模式
- 当要实例化的类是在运行时刻指定时，例如动态加载
- 为了避免创建一个与产品类层次平等的工厂类层次时；
- 当一个类的实例只能有几个不同状态组合中的一种时。建立相应数目的原型并克隆它们可能比每次用合适的状态手工实例化该类更方便一些

### 类图
![prototype pattern](http://7u2ho6.com1.z0.glb.clouddn.com/tech-prototype-pattern-uml.jpg)

### 实例

```php
<?php

interface Prototype { public function copy(); }
 
class ConcretePrototype implements Prototype{
    private  $_name;
    public function __construct($name) { $this->_name = $name; } 
    public function copy() { return clone $this;}
}
 
class Demo {}
 
// client
 
$demo = new Demo();
$object1 = new ConcretePrototype($demo);
$object2 = $object1->copy();
?>
```

### 优缺点

#### 优点
- 可以在运行时刻增加和删除产品
- 可以改变值以指定新对象
- 可以改变结构以指定新对象
- 减少子类的构造
- 用类动态配置应用

#### 缺点
Prototype模式的最主要缺点就是每一个类必须配备一个克隆方法。而且这个克隆方法需要对类的功能进行通盘考虑，这对全新的类来说不是很难，但对已有的类进行改造时，不一定是件容易的事。

### 参考
1. [Wikipedia: Prototype pattern](http://en.wikipedia.org/wiki/Prototype_pattern)
2. [Wikipedia: 原型模式](http://zh.wikipedia.org/wiki/%E5%8E%9F%E5%9E%8B%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现原型模式](http://www.phppan.com/2010/06/php-design-pattern-8-prototype/)

## 代理模式（Proxy pattern）
代理模式是一种结构型模式，它可以为其他对象提供一种代理以控制对这个对象的访问。

### 主要角色

- 抽象主题角色(Subject)：它的作用是统一接口。此角色定义了真实主题角色和代理主题角色共用的接口，这样就可以在使用真实主题角色的地方使用代理主题角色。
- 真实主题角色(RealSubject)：隐藏在代理角色后面的真实对象。
- 代理主题角色(ProxySubject)：它的作用是代理真实主题，在其内部保留了对真实主题角色的引用。它与真实主题角色都继承自抽象主题角色，保持接口的统一。它可以控制对真实主题的存取，并可能负责创建和删除真实对象。代理角色并不是简单的转发，通常在将调用传递给真实对象之前或之后执行某些操作，当然你也可以只是简单的转发。 与适配器模式相比：适配器模式是为了改变对象的接口，而代理模式并不能改变所代理对象的接口。

### 适用性

- 为一些复杂的子系统提供一组接口
- 提高子系统的独立性
- 在层次化结构中，可以使用门面模式定义系统的每一层的接口

### 类图

![proxy pattern](http://7u2ho6.com1.z0.glb.clouddn.com/tech-proxy-pattern-uml.png)

### 实例

```php
<?php
abstract class Subject { // 抽象主题角色
    abstract public function action();
}

class RealSubject extends Subject { // 真实主题角色
    public function __construct() {}
    public function action() {}
}

class ProxySubject extends Subject { // 代理主题角色
    private $_real_subject = NULL;
    public function __construct() {}

    public function action() {
        $this->_beforeAction();
        if (is_null($this->_real_subject)) {
            $this->_real_subject = new RealSubject();
        }
        $this->_real_subject->action();
        $this->_afterAction();
    }
    private function _beforeAction() {}
    private function _afterAction() {}
}

// client
$subject = new ProxySubject();
$subject->action();
?>
```

### 参考
1. [Wikipedia: Proxy pattern](http://en.wikipedia.org/wiki/Proxy_pattern)
2. [Wikipedia: 代理模式](http://zh.wikipedia.org/wiki/%E4%BB%A3%E7%90%86%E6%A8%A1%E5%BC%8F)
3. [代理模式(Proxy)和PHP的反射功能](http://www.phppan.com/2011/10/php-design-pattern-proxy-and-reflection/)

## 策略模式（Strategy pattern）
策略模式是一种行为型模式，它定义一系列的算法，把它们一个个封装起来，并且使它们可相互替换。策略模式可以使算法可独立于使用它的客户而变化。

### 主要角色

- 抽象策略(Strategy）角色：定义所有支持的算法的公共接口。通常是以一个接口或抽象来实现。Context使用这个接口来调用其ConcreteStrategy定义的算法
- 具体策略(ConcreteStrategy)角色：以Strategy接口实现某具体算法
- 环境(Context)角色：持有一个Strategy类的引用，用一个ConcreteStrategy对象来配置

### 适用性

- 许多相关的类仅仅是行为有异。“策略”提供了一种用多个行为中的一个行为来配置一个类的方法
- 需要使用一个算法的不同变体。
- 算法使用客户不应该知道的数据。可使用策略模式以避免暴露复杂的，与算法相关的数据结构
- 一个类定义了多种行为，并且 这些行为在这个类的操作中以多个形式出现。将相关的条件分支移和它们各自的Strategy类中以代替这些条件语句

### 类图

![strategy pattern](http://7u2ho6.com1.z0.glb.clouddn.com/tech-strategy-pattern-uml.jpg)

### 实例

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

### 优缺点

#### 优点

- 策略模式提供了管理相关的算法族的办法
- 策略模式提供了可以替换继承关系的办法 将算封闭在独立的Strategy类中使得你可以独立于其Context改变它
- 使用策略模式可以避免使用多重条件转移语句。

#### 缺点

- 客户必须了解所有的策略 这是策略模式一个潜在的缺点
- Strategy和Context之间的通信开销
- 策略模式会造成很多的策略类

### 参考
1. [Wikipedia: Strategy pattern](http://en.wikipedia.org/wiki/Strategy_pattern)
2. [Wikipedia: 策略模式](http://zh.wikipedia.org/wiki/%E7%AD%96%E7%95%A5%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现策略模式](http://www.phppan.com/2010/07/php-design-pattern-12-strategy/)

## 命令模式（Command pattern）
命令模式是一种行为型模式，它将一个请求封装为一个对象，从而使用你可用不同的请求对客户进行参数化；对请求排队或记录请求日志，以及支持可撤消的操作。命令模式把发出命令的责任和执行命令的责任分割开，委派给不同的对象。

请求的一方发出请求要求执行一个操作；接收的一方收到请求，并执行操作。命令模式允许请求的一方和接收的一方独立开来，使得请求的一方不必知道接收请求的一方的接口，更不必知道请求是怎么被接收，以及操作是否被执行、何时被执行，以及是怎么被执行的。

### 主要角色

- 命令（Command）角色：声明了一个给所有具体命令类的抽象接口。这是一个抽象角色。
- 具体命令（ConcreteCommand）角色：定义一个接受者和行为之间的弱耦合；实现Execute()方法，负责调用接收考的相应操作。Execute()方法通常叫做执行方法。
- 客户（Client）角色：创建了一个具体命令(ConcreteCommand)对象并确定其接收者。
- 请求者（Invoker）角色：负责调用命令对象执行请求，相关的方法叫做行动方法。
- 接收者（Receiver）角色：负责具体实施和执行一个请求。任何一个类都可以成为接收者，实施和执行请求的方法叫做行动方法。

### 适用性

- 抽象出待执行的动作以参数化对象。Command模式是回调机制的一个面向对象的替代品。
- 在不同的时刻指定、排列和执行请求。
- 支持取消操作。
- 支持修改日志。
- 用构建在原语操作上的高层操作构造一个系统。Command模式提供了对事务进行建模的方法。Command有一个公共的接口，使得你可以用同一种方式调用所有的事务。同时使用该模式也易于添加新事务以扩展系统。

### 类图

![command pattern](http://7u2ho6.com1.z0.glb.clouddn.com/tech-command-pattern-uml.jpg)

### 实例

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

### 优缺点

#### 优点

- 命令模式把请求一个操作的对象与知道怎么执行一个操作的对象分离开。
- 命令类与其他任何别的类一样，可以修改和推广。
- 可以把命令对象聚合在一起，合成为合成命令。
- 可以很容易的加入新的命令类。

#### 缺点

- 可能会导致某些系统有过多的具体命令类。

### 参考
1. [Wikipedia: Command pattern](http://en.wikipedia.org/wiki/Command_pattern)
2. [Wikipedia: 命令模式](http://zh.wikipedia.org/wiki/%E5%91%BD%E4%BB%A4%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现命令模式](http://www.phppan.com/2010/08/php-design-pattern-15-comman/)

## 解释器模式（Interpreter pattern）
解释器模式是一种行为型模式，它给定一个语言, 定义它的文法的一种表示，并定义一个解释器, 该解释器使用该表示来解释语言中的句子。

### 类图

![interpreter pattern](http://7u2ho6.com1.z0.glb.clouddn.com/tech-interpreter-pattern-uml.jpg)

### 实例

```php
<?php
class Expression { 
    function interpreter($str) { 
        return $str; 
    } 
} 

class ExpressionNum extends Expression { 
    function interpreter($str) { 
        switch($str) { 
            case "0": return "零"; 
            case "1": return "一"; 
            case "2": return "二"; 
            case "3": return "三"; 
            case "4": return "四"; 
            case "5": return "五"; 
            case "6": return "六"; 
            case "7": return "七"; 
            case "8": return "八"; 
            case "9": return "九"; 
        } 
    } 
} 

class ExpressionCharater extends Expression { 
    function interpreter($str) { 
        return strtoupper($str); 
    } 
} 

class Interpreter { 
    function execute($string) { 
        $expression = null; 
        for($i = 0;$i<strlen($string);$i++) { 
            $temp = $string[$i]; 
            switch(true) { 
                case is_numeric($temp): $expression = new ExpressionNum(); break; 
                default: $expression = new ExpressionCharater(); 
            } 
            echo $expression->interpreter($temp); 
        } 
    } 
} 

//client
$obj = new Interpreter(); 
$obj->execute("12345abc"); 
?>
```

### 参考
1. [Wikipedia: Strategy pattern](http://en.wikipedia.org/wiki/Strategy_pattern)
2. [php设计模式 Interpreter(解释器模式)](http://www.jb51.net/article/27484.htm)

## 迭代器模式（Iterator pattern）
迭代器模式是一种行为型模式，它是一种最简单也最常见的设计模式。它可以让使用者透过特定的接口巡访容器中的每一个元素而不用了解底层的实作。

### 适用性

- 在希望利用语言本身的遍历函数便利自定义结构时，例如PHP中的foreach函数

### 实例

```php
<?php
class sample implements Iterator {
    private $_items ;
 
    public function __construct(&$data) {
        $this->_items = $data;
    }
    public function current() {
        return current($this->_items);
    }
 
    public function next() {
        next($this->_items);   
    }
 
    public function key() {
        return key($this->_items);
    }
 
    public function rewind() {
        reset($this->_items);
    }
 
    public function valid() {                                                                              
        return ($this->current() !== FALSE);
    }
}
 
// client
$data = array(1, 2, 3, 4, 5);
$sa = new sample($data);
foreach ($sa AS $key => $row) {
    echo $key, ' ', $row, '<br />';
}
?>
```

### 参考
1. [Wikipedia: Iterator pattern](http://en.wikipedia.org/wiki/Iterator_pattern)
2. [PHP中迭代器的简单实现及Yii框架中的迭代器实现](http://www.phppan.com/2010/04/php-iterator-and-yii-cmapiterator/)

## 中介者模式（Mediator pattern）
中介者模式是一种行为型模式，它包装了一系列对象相互作用的方式，使得这些对象不必相互明显作用，从而使它们可以松散偶合。当某些对象之间的作用发生改变时，不会立即影响其他的一些对象之间的作用，保证这些作用可以彼此独立的变化。

### 主要角色

- 中介者(Mediator）角色：定义了对象间相互作用的接口
- 具体中介者(ConcreteMediator)角色：实现了中介者定义的接口。
- 具体对象(ConcreteColleague)角色：通过中介者和别的对象进行交互

### 实例

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

### 参考
1. [Wikipedia: Mediator pattern](http://en.wikipedia.org/wiki/Mediator_pattern)

## 备忘录模式（Memento pattern）
备忘录模式是一种行为型模式，它在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态。这样可以在以后把该对象的状态恢复到之前保存的状态。

### 主要角色

- 备忘录(Memento)角色：存储发起人(Originator)对象的内部状态，而发起人根据需要决定备忘录存储发起人的哪些内部状态。备忘录可以保护其内容不被发起人(Originator)对象之外的任何对象所读取。
- 发起人(Originator)角色：创建一个含有当前的内部状态的备忘录对象，使用备忘录对象存储其内部状态
- 负责人(Caretaker)角色：负责保存备忘录对象，不检查备忘录对象的内容

### 适用性

- 必须保存一个对象在某一个时刻的（部分）状态，这样以后需要时它才能恢复到先前的状态。
- 如果一个用接口来让其它对象直接得到这些状态，将会暴露对象的实现细节并破坏对象的封装性。

### 类图

![memento pattern](http://7u2ho6.com1.z0.glb.clouddn.com/tech-memento-pattern-uml.jpg)

### 实例

```php
<?php
class Originator { // 发起人(Originator)角色
    private $_state;
    public function __construct() {
        $this->_state = '';
    }
    public function createMemento() { // 创建备忘录
        return new Memento($this->_state);
    }
    public function restoreMemento(Memento $memento) { // 将发起人恢复到备忘录对象记录的状态上
        $this->_state = $memento->getState();
    }
    public function setState($state) { $this->_state = $state; } 
    public function getState() { return $this->_state; }
    public function showState() {}
 
}

class Memento { // 备忘录(Memento)角色 
    private $_state;
    public function __construct($state) {
        $this->setState($state);
    }
    public function getState() { return $this->_state; } 
    public function setState($state) { $this->_state = $state;}
}

class Caretaker { // 负责人(Caretaker)角色 
    private $_memento;
    public function getMemento() { return $this->_memento; } 
    public function setMemento(Memento $memento) { $this->_memento = $memento; }
}
 
// client
/* 创建目标对象 */
$org = new Originator();
$org->setState('open');
$org->showState();

/* 创建备忘 */
$memento = $org->createMemento();

/* 通过Caretaker保存此备忘 */
$caretaker = new Caretaker();
$caretaker->setMemento($memento);

/* 改变目标对象的状态 */
$org->setState('close');
$org->showState();

/* 还原操作 */
$org->restoreMemento($caretaker->getMemento());
$org->showState();
?>
```

### 优缺点

#### 优点

- 有时一些发起人对象的内部信息必须保存在发起人对象以外的地方，但是必须要由发起人对象自己读取。
- 简化了发起人(Originator)类。发起人(Originator)不再需要管理和保存其内部状态的一个个版本，客户端可以自行管理它们所需要的这些状态的版本
- 当发起人角色的状态改变的时候，有可能这个状态无效，这时候就可以使用暂时存储起来的备忘录将状态复原。

#### 缺点

- 如果发起人角色的状态需要完整地存储到备忘录对象中，那么在资源消耗上面备忘录对象会很昂贵。
- 当负责人角色将一个备忘录存储起来的时候，负责人可能并不知道这个状态会占用多大的存储空间，从而无法提醒用户一个操作是否会很昂贵。
- 当发起人角色的状态改变的时候，有可能这个状态无效。

### 参考
1. [Wikipedia: Memento pattern](http://en.wikipedia.org/wiki/Memento_pattern)
2. [PHP设计模式笔记：使用PHP实现备忘录模式](http://www.phppan.com/2010/10/php-design-pattern-18-memento/)

## 访问者模式（Visitor pattern）
访问者模式是一种行为型模式，访问者表示一个作用于某对象结构中各元素的操作。它可以在不修改各元素类的前提下定义作用于这些元素的新操作，即动态的增加具体访问者角色。

访问者模式利用了双重分派。先将访问者传入元素对象的Accept方法中，然后元素对象再将自己传入访问者，之后访问者执行元素的相应方法。

### 主要角色

- 抽象访问者角色(Visitor)：为该对象结构(ObjectStructure)中的每一个具体元素提供一个访问操作接口。该操作接口的名字和参数标识了 要访问的具体元素角色。这样访问者就可以通过该元素角色的特定接口直接访问它。
- 具体访问者角色(ConcreteVisitor)：实现抽象访问者角色接口中针对各个具体元素角色声明的操作。
- 抽象节点（Node）角色：该接口定义一个accept操作接受具体的访问者。
- 具体节点（Node）角色：实现抽象节点角色中的accept操作。
- 对象结构角色(ObjectStructure)：这是使用访问者模式必备的角色。它要具备以下特征：能枚举它的元素；可以提供一个高层的接口以允许该访问者访问它的元素；可以是一个复合（组合模式）或是一个集合，如一个列表或一个无序集合(在PHP中我们使用数组代替，因为PHP中的数组本来就是一个可以放置任何类型数据的集合)

### 适用性

- 访问者模式多用在聚集类型多样的情况下。在普通的形式下必须判断每个元素是属于什么类型然后进行相应的操作，从而诞生出冗长的条件转移语句。而访问者模式则可以比较好的解决这个问题。对每个元素统一调用$element->accept($vistor)即可。
- 访问者模式多用于被访问的类结构比较稳定的情况下，即不会随便添加子类。访问者模式允许被访问结构添加新的方法。

### 类图

![visitor pattern](http://7u2ho6.com1.z0.glb.clouddn.com/tech-visitor-pattern-uml.jpg)

### 实例

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

### 优缺点

#### 优点

- 访问者模式使得增加新的操作变得很容易。使用访问者模式可以在不用修改具体元素类的情况下增加新的操作。它主要是通过元素类的accept方法来接受一个新的visitor对象来实现的。如果一些操作依赖于一个复杂的结构对象的话，那么一般而言，增加新的操作会很复杂。而使用访问者模式，增加新的操作就意味着增加一个新的访问者类，因此，变得很容易。
- 访问者模式将有关的行为集中到一个访问者对象中，而不是分散到一个个的节点类中。
- 访问者模式可以跨过几个类的等级结构访问属于不同的等级结构的成员类。迭代子只能访问属于同一个类型等级结构的成员对象，而不能访问属于不同等级结构的对象。访问者模式可以做到这一点。
- 积累状态。每一个单独的访问者对象都集中了相关的行为，从而也就可以在访问的过程中将执行操作的状态积累在自己内部，而不是分散到很多的节点对象中。这是有益于系统维护的优点。

#### 缺点

- 增加新的节点类变得很困难。每增加一个新的节点都意味着要在抽象访问者角色中增加一个新的抽象操作，并在每一个具体访问者类中增加相应的具体操作。
- 破坏封装。访问者模式要求访问者对象访问并调用每一个节点对象的操作，这隐含了一个对所有节点对象的要求：它们必须暴露一些自己的操作和内部状态。不然，访问者的访问就变得没有意义。由于访问者对象自己会积累访问操作所需的状态，从而使这些状态不再存储在节点对象中，这也是破坏封装的。

### 参考
1. [Wikipedia: Visitor pattern](http://en.wikipedia.org/wiki/Visitor_pattern)
2. [Wikipedia: 访问者模式](http://zh.wikipedia.org/wiki/%E8%AE%BF%E9%97%AE%E8%80%85%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现访问者模式](http://www.phppan.com/2010/05/php-design-pattern-1-visitor/)

## 策略模式（Strategy pattern）
状态模式是一种行为型模式，它允许一个对象在其内部状态改变时改变它的行为。对象看起来似乎修改了它的类，状态模式变化的位置在于对象的状态。

### 主要角色

- 抽象状态(State)角色：定义一个接口，用以封装环境对象的一个特定的状态所对应的行为
- 具体状态（ConcreteState)角色：每一个具体状态类都实现了环境（Context）的一个状态所对应的行为
- 环境(Context)角色：定义客户端所感兴趣的接口，并且保留一个具体状态类的实例。这个具体状态类的实例给出此环境对象的现有状态

### 适用性

- 一个对象的行为取决于它的状态，并且它必须在运行时刻根据状态改变它的行为
- 一个操作中含有庞大的多分支的条件语句，且这些分支依赖于该对象的状态。这个状态通常用一个或多个枚举常量表示。通常，有多个操作包含这一相同的条件结构。State模式模式将每一个条件分支放入一个独立的类中。这使得你可以要所对象自身的情况将对象的状态作为一个对象，这一对象可以不依赖于其他对象而独立变化

### 类图

![state pattern](http://7u2ho6.com1.z0.glb.clouddn.com/tech-state-pattern-uml.jpg)

### 实例

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

### 优缺点

#### 优点

- 它将与特定状态相关的行为局部化
- 它使得状态转换显示化
- State对象可被共享

### 参考
1. [Wikipedia: State pattern](http://en.wikipedia.org/wiki/State_pattern)
2. [PHP设计模式笔记：使用PHP实现状态模式](http://www.phppan.com/2010/07/php-design-pattern-11-state/)

## 抽象工厂模式（Abstract Factory pattern）
抽象工厂模式是一种创建型模式，它提供了一种方式，可以将一组具有同一主题的单独的工厂封装起来。它的实质是“提供接口，创建一系列相关或独立的对象，而不指定这些对象的具体类”。

抽象工厂模式提供一个创建一系统相关或相互依赖对象的接口，而无需指定它们具体的类。

### 抽象工厂模式中主要角色

- 抽象工厂(Abstract Factory)角色：它声明创建抽象产品对象的接口
- 具体工厂(Concrete Factory)角色：实现创建产品对象的操作
- 抽象产品(Abstract Product)角色：声明一类产品的接口
- 具体产品(Concrete Product)角色：实现抽象产品角色所定义的接口

这个和工厂方法模式类似，我们不再只要一个汉堡，可能是4个汉堡2个鸡翅，我们还是对服务员说，服务员属于具体工厂，抽象产品就是麦当劳可卖的食物，具体产品是我们跟服务员要的食物。

### 适用性

- 一个系统要独立于它的产品的创建、组合和表示时。
- 一个系统要由多个产品系列中的一个来配置时。
- 需要强调一系列相关的产品对象的设计以便进行联合使用时。
- 提供一个产品类库，而只想显示它们的接口而不是实现时。

### 类图
![abstract pattern](http://7u2ho6.com1.z0.glb.clouddn.com/tech-abstract-pattern-uml.png)

### 实例

```php
<?php
class Button{}
class Border{}
class MacButton extends Button{}
class WinButton extends Button{}
class MacBorder extends Border{}
class WinBorder extends Border{}

interface AbstractFactory {
    public function CreateButton();
    public function CreateBorder();
}

class MacFactory implements AbstractFactory{
    public function CreateButton(){ return new MacButton(); }
    public function CreateBorder(){ return new MacBorder(); }
}
class WinFactory implements AbstractFactory{
    public function CreateButton(){ return new WinButton(); }
    public function CreateBorder(){ return new WinBorder(); }
}
?>
```

在这里例子中，工厂类实现了一组工厂方法。如果要增加新的功能，可以增加新的接口，让新的工厂类实现这个接口即可，而无需修改现有的工厂类。

### 优缺点

#### 优点
- 分离了具体的类
- 使增加或替换产品族变得容易
- 有利于产品的一致性

#### 缺点
难以支持新种类的产品。这是因为AbstractFactory接口确定了可以被创建的产品集合。支持新各类的产品就需要扩展访工厂接口，从而导致AbstractFactory类及其所有子类的改变。


### 参考
1. [Wikipedia: 抽象工厂](http://zh.wikipedia.org/wiki/%E6%8A%BD%E8%B1%A1%E5%B7%A5%E5%8E%82%E6%A8%A1%E5%BC%8F)
2. [Wikipedia: Abstract factory pattern](http://en.wikipedia.org/wiki/Abstract_factory_pattern)
3. [PHP设计模式笔记：使用PHP实现抽象工厂模式](http://www.phppan.com/2010/05/php-design-pattern-3-abstract-factory/)

## 工厂方法模式（Factory method pattern）
工厂方法模式是一种创建型模式，这种模式使用“工厂”概念来完成对象的创建而不用具体说明这个对象。

在面向对象程序设计中，工厂通常是一个用来创建其他对象的对象。工厂是构造方法的抽象，用来实现不同的分配方案。

### 主要角色

- 抽象产品(Product)角色：具体产品对象共有的父类或者接口。
- 具体产品(Concrete Product)角色：实现抽象产品角色所定义的接口
- 抽象工厂(Creator)角色：它声明了工厂方法，该方法返回Product对象
- 具体工厂(Concrete Creator)：实现抽象工厂接口

工厂方法模式就像我们去麦当劳买汉堡，我们只要找到服务员，让他帮我们拿来汉堡即可。其中具体某个服务员就像具体工厂，他继承了服务员应有的服务。汉堡在到手以前属于抽象产品，而我们拿到的汉堡就属于具体产品。

### 适用性

- 创建对象需要大量重复的代码（例如创建一个MySQL操作类，需要配置很多选项，这些都可以在工厂方法中进行）。
- 创建对象需要访问某些信息，而这些信息不应该包含在复合类中。
- 创建对象的生命周期必须集中管理，以保证在整个程序中具有一致的行为。

### 类图
![factory method](http://7u2ho6.com1.z0.glb.clouddn.com/tech-factory-method-uml.png)

### 实例

#### 普通工厂方法
下面的例子是工厂方法模式的应用，我们要创建两种风格的按钮，只需用不同的工厂方法获得相应按钮类即可。

```php
<?php

class Button{/* ...*/}
class WinButton extends Button{/* ...*/}
class MacButton extends Button{/* ...*/}

interface ButtonFactory{
    public function createButton($type);
}

class MyButtonFactory implements ButtonFactory{
    // 实现工厂方法
    public function createButton($type){
        switch($type){
            case 'Mac':
                return new MacButton();
            case 'Win':
                return new WinButton();
        }
    }
}
?>
```

上例中的`createButton()`方法即所谓的工厂方法，它所在的类仅仅是这个方法的载体。工厂方法的核心功能是创建类并返回，这个方法可以产生一个类，也可以产生多种类。这个方法本身的载体也并不局限，将其设置为静态方法也是可以的，这个根据自己的情况而定。

### 优缺点

#### 优点
工厂方法模式可以允许系统在不修改工厂角色的情况下引进新产品。

#### 缺点
- 重构已经存在的类会破坏客户端代码。
- 如果工厂方法所在类的构造函数为私有，则工厂方法无法继续扩展，或者必须实现工厂方法所在类的全部依赖方法。

### 参考
1. [Wikipedia: Factory method pattern](http://en.wikipedia.org/wiki/Factory_method_pattern)
2. [Wikipedia: 工厂方法模式](http://zh.wikipedia.org/wiki/%E5%B7%A5%E5%8E%82%E6%96%B9%E6%B3%95%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现工厂模式](http://www.phppan.com/2010/07/php-design-pattern-9-factory-method/)

## 模板方法模式（Template method pattern）
模板方法模式模式是一种行为型模式，它定义一个操作中的算法的骨架，而将一些步骤延迟到子类中。Template Method 使得子类可以在不改变一个算法的结构的情况下重定义该算法的某些特定的步骤。

### 主要角色

#### 抽象模板(AbstractClass)角色
定义一个或多个抽象方法让子类实现。这些抽象方法叫做基本操作，它们是顶级逻辑的组成部分。

定义一个模板方法。这个模板方法一般是一个具体方法，它给出顶级逻辑的骨架，而逻辑的组成步骤在对应的抽象操作中，这些操作将会推迟到子类中实现。同时，顶层逻辑也可以调用具体的实现方法

##### 具体模板(ConcrteClass)角色
实现父类的一个或多个抽象方法，作为顶层逻辑的组成而存在。

每个抽象模板可以有多个具体模板与之对应，而每个具体模板有其自己对抽象方法（也就是顶层逻辑的组成部分）的实现，从而使得顶层逻辑的实现各不相同。

### 适用性

- 一次性实现一个算法的不变的部分，并将可变的行为留给子类来实现。
- 各子类中公共的行为应被提取出来并集中到一个公共父类中以避免代码重复。
- 控制子类扩展。

### 类图

![template method pattern](http://7u2ho6.com1.z0.glb.clouddn.com/tech-template-method-pattern-uml.jpg)

### 实例

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

### 参考
1. [Wikipedia: Template method pattern](http://en.wikipedia.org/wiki/Template_method_pattern)
2. [Wikipedia: 模板方法模式](http://zh.wikipedia.org/wiki/%E6%A8%A1%E6%9D%BF%E6%96%B9%E6%B3%95%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现模板方法模式](http://www.phppan.com/2010/09/php-design-pattern-16-template-method/)

## 责任链模式（Chain of responsibility pattern）
责任链模式是一种行为型模式，它包含了一些命令对象和一系列的处理对象。每一个处理对象决定它能处理哪些命令对象，它也知道如何将它不能处理的命令对象传递给该链中的下一个处理对象。该模式还描述了往该处理链的末尾添加新的处理对象的方法。

### 主要角色

- 抽象责任(Responsibility）角色：定义所有责任支持的公共方法。
- 具体责任(Concrete Responsibility)角色：以抽象责任接口实现的具体责任
- 责任链(Chain of responsibility)角色：设定责任的调用规则

### 实例

```php
<?php
abstract class Responsibility { // 抽象责任角色
    protected $next; // 下一个责任角色
 
    public function setNext(Responsibility $l) {
        $this->next = $l;
        return $this;
    }
    abstract public function operate(); // 操作方法
}
 
class ResponsibilityA extends Responsibility {
    public function __construct() {}
    public function operate(){
        if (false == is_null($this->next)) {
            $this->next->operate();
        }
    };
}

class ResponsibilityB extends Responsibility {
    public function __construct() {}
    public function operate(){
        if (false == is_null($this->next)) {
            $this->next->operate();
        }
    };
}
 
$res_a = new ResponsibilityA();
$res_b = new ResponsibilityB();
$res_a->setNext($res_b);
?>
```

### 参考
1. [Wikipedia: Chain-of-responsibility pattern](http://en.wikipedia.org/wiki/Chain_of_responsibility_pattern)
2. [Wikipedia: 责任链模式](http://zh.wikipedia.org/wiki/%E8%B4%A3%E4%BB%BB%E9%93%BE%E6%A8%A1%E5%BC%8F)
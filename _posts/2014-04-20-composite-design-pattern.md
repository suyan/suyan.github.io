---
layout: post
title: 设计模式详解及PHP实现：合成模式
category: 技术
tags: [Pattern, PHP]
keywords: 设计模式,组合模式
description: 
---

## 合成模式（Composite pattern）
合成模式是一种结构型模式，它将对象组合成树形结构以表示”部分-整体”的层次结构。Composite使用户对单个对象和组合对象的使用具有一致性。
Composite变化的是一个对象的结构和组成。

## 主要角色

- 抽象组件(Component)角色：抽象角色，给参加组合的对象规定一个接口。在适当的情况下，实现所有类共有接口的缺省行为。声明一个接口用于访问和管理Component的子组件
- 树叶组件(Leaf)角色：在组合中表示叶节点对象，叶节点没有子节点。在组合中定义图元对象的行为。
- 树枝组件(Composite)角色：存储子部件。定义有子部件的那些部件的行为。在Component接口中实现与子部件有关的操作。
- 客户端(Client)：通过Component接口操纵组合部件的对象

## 适用性

- 你想表示对象的部分-整体层次结构。
- 你希望用户忽略组合对象和单个对象的不同，用户将统一地使用组合结构中的所有对象。

## 类图

### 安全式合成模式

![safe composite pattern](http://yansu-uploads.stor.sinaapp.com/imgs/safe-composite-pattern-uml.jpg)

### 透明式合成模式

![transparent composite pattern](http://yansu-uploads.stor.sinaapp.com/imgs/transparent-composite-pattern-uml.jpg)

## 实例

### 安全式合成模式

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

### 透明式合成模式
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

## 优缺点
### 优点

- 简化客户代码
- 使得更容易增加新类型的组件

### 缺点

- 使你的设计变得更加一般化，容易增加组件也会产生一些问题，那就是很难限制组合中的组件

## 参考
1. [Wikipedia: Composite pattern](http://en.wikipedia.org/wiki/Composite_pattern)
2. [PHP设计模式笔记：使用PHP实现合成模式](http://www.phppan.com/2010/08/php-design-pattern-14-composite/)
---
layout: post
title: 设计模式详解及PHP实现：门面模式
category: 技术
tags: [Pattern, PHP]
keywords: 设计模式,门面模式
description: 
---

## 门面模式（Facade pattern）
门面模式是一种结构型模式，它为子系统中的一组接口提供一个一致的界面，Facade模式定义了一个高层次的接口，使得子系统更加容易使用。

## 主要角色

### 门面(Facade)角色

- 此角色将被客户端调用
- 知道哪些子系统负责处理请求
- 将用户的请求指派给适当的子系统

### 子系统(subsystem)角色

- 实现子系统的功能
- 处理由Facade对象指派的任务
- 没有Facade的相关信息，可以被客户端直接调用
- 可以同时有一个或多个子系统，每个子系统都不是一个单独的类，而一个类的集合。每个子系统都可以被客户端直接调用，或者被门面角色调用。子系统并知道门面模式的存在，对于子系统而言，门面仅仅是另一个客户端。

## 适用性

- 为一些复杂的子系统提供一组接口
- 提高子系统的独立性
- 在层次化结构中，可以使用门面模式定义系统的每一层的接口

## 类图

![facade pattern](http://yansu-uploads.stor.sinaapp.com/imgs/facade-pattern-uml.jpg)

## 实例

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

## 优缺点

### 优点

- 它对客户屏蔽了子系统组件，因而减少了客户处理的对象的数目并使得子系统使用起来更加方便
- 实现了子系统与客户之间的松耦合关系
- 如果应用需要，它并不限制它们使用子系统类。因此可以在系统易用性与能用性之间加以选择

## 参考
1. [Wikipedia: Facade pattern](http://en.wikipedia.org/wiki/Facade_pattern)
2. [Wikipedia: 外观模式](http://zh.wikipedia.org/wiki/%E5%A4%96%E8%A7%80%E6%A8%A1%E5%BC%8F)
3. [PHP设计模式笔记：使用PHP实现门面模式](http://www.phppan.com/2010/06/php-design-pattern-7-facade/)
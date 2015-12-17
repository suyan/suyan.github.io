---
layout: post
title: AngularJS 常用资源
category: 资源
tags: AngularJS
keywords: AngularJS
description: 
---

# 官方资源

- [官方首页](https://angularjs.org)
- [项目地址](https://github.com/angular/angular.js)
- [中文社区](http://www.angularjs.cn)
- [中文教程](http://www.runoob.com/angularjs/angularjs-tutorial.html)

# 简单介绍

AngularJS 是一个 JavaScript 框架，是一个以 JavaScript 编写的库。可通过 <code>< script ></code> 标签添加到 HTML 页面。通过 指令 扩展了 HTML，通过 表达式 绑定数据到 HTML。

    <script src="http://apps.bdimg.com/libs/angular.js/1.3.9/angular.min.js"></script>


# 总结归纳

## 功能
- AngularJS 把应用程序数据绑定到 HTML 元素。
- AngularJS 可以克隆和重复 HTML 元素。
- AngularJS 可以隐藏和显示 HTML 元素。
- AngularJS 可以在 HTML 元素"背后"添加代码。
- AngularJS 支持输入验证。

## 指令
ng-app    指令定义一个 AngularJS 应用程序。
ng-controller 定义控制器。
ng-model  指令把元素值（比如输入域的值）绑定到应用程序。
ng-bind   指令把应用程序数据绑定到 HTML 视图。
ng-init   指令初始化 AngularJS 应用程序变量。

## 特点
- AngularJS 表达式写在双大括号内：{{ expression }}。
- AngularJS 表达式把数据绑定到 HTML，这与 ng-bind 指令有异曲同工之妙。
- AngularJS 将在表达式书写的位置"输出"数据。
- AngularJS 表达式 很像 JavaScript 表达式：它们可以包含文字、运算符和变量。
实例 {{ 5 + 5 }} 或 {{ firstName + " " + lastName }}

# 示例
## 创建一个简单的包含模块和控制器的应用
  
    <div ng-app="myApp" ng-controller="myCtrl">
    名: <input type="text" ng-model="firstName"><br>
    姓: <input type="text" ng-model="lastName"><br>
    <br>
    姓名: {{firstName + " " + lastName}}
    </div>
    <script>
    var app = angular.module('myApp', []);
    app.controller('myCtrl', function($scope) {
        $scope.firstName= "John";
        $scope.lastName= "Doe";
    });
    </script>

## 表达式的示例
### 数字

AngularJS 数字就像 JavaScript 数字：

    <div ng-app="" ng-init="quantity=1;cost=5">
    <p>总价： {{ quantity * cost }}</p>
    </div>

使用 ng-bind 的相同实例：

    <div ng-app="" ng-init="quantity=1;cost=5">
    <p>总价： <span ng-bind="quantity * cost"></span></p>
    </div>

使用 ng-init 不是很常见。介绍控制器时会有一个更好的初始化数据的方式。

### 字符串
AngularJS 字符串就像 JavaScript 字符串：

    <div ng-app="" ng-init="firstName='John';lastName='Doe'">
    <p>姓名： {{ firstName + " " + lastName }}</p>
    </div>

使用 ng-bind 的相同实例：

    <div ng-app="" ng-init="firstName='John';lastName='Doe'">
    <p>姓名： <span ng-bind="firstName + ' ' + lastName"></span></p>
    </div>

### 对象
AngularJS 对象就像 JavaScript 对象：

    <div ng-app="" ng-init="person={firstName:'John',lastName:'Doe'}">
    <p>姓为 {{ person.lastName }}</p>
    </div>

使用 ng-bind 的相同实例：

    <div ng-app="" ng-init="person={firstName:'John',lastName:'Doe'}">
    <p>姓为 <span ng-bind="person.lastName"></span></p>
    </div>

### 数组
AngularJS 数组就像 JavaScript 数组：

    <div ng-app="" ng-init="points=[1,15,19,2,40]">
    <p>第三个值为 {{ points[2] }}</p>
    </div>

使用 ng-bind 的相同实例：

    <div ng-app="" ng-init="points=[1,15,19,2,40]">
    <p>第三个值为 <span ng-bind="points[2]"></span></p>
    </div>

### 表达式的总结
对比 JavaScript 表达式
相同点：可以包含字母，操作符，变量。
不同点：
1、AngularJS 表达式可以写在 HTML 中。
2、AngularJS 表达式不支持条件判断，循环及异常。
3、AngularJS 表达式支持过滤器。


## 指令的示例
ng-app 指令初始化一个 AngularJS 应用程序。定义了 AngularJS 应用程序的 根元素。在网页加载完毕时会自动引导（自动初始化）应用程序。
ng-init 指令初始化应用程序数据。为 AngularJS 应用程序定义了 初始值。通常情况下，不使用 ng-init。而使用一个控制器或模块来代替它。
ng-model 指令把元素值（比如输入域的值）绑定到应用程序。 绑定 HTML 元素 到应用程序数据。
一个网页可以包含多个运行在不同元素中的 AngularJS 应用程序。也可以：
1、为应用程序数据提供类型验证（number、email、required）。
2、为应用程序数据提供状态（invalid、dirty、touched、error）。
3、为 HTML 元素提供 CSS 类。
4、绑定 HTML 元素到 HTML 表单。
ng-repeat 指令对于集合中（数组中）的每个项会 克隆一次 HTML 元素。

### 数据绑定

    <div ng-app="" ng-init="quantity=1;price=5">
    <h2>价格计算器</h2>
    数量： <input type="number"  ng-model="quantity">
    价格： <input type="number" ng-model="price">
    <p><b>总价：</b> {{ quantity * price }}</p>
    </div>

### 重复 HTML 元素

    <div ng-app="" ng-init="names=['Jani','Hege','Kai']">
      <p>使用 ng-repeat 来循环数组</p>
      <ul>
        <li ng-repeat="x in names">
          {{ x }}
        </li>
      </ul>
    <div>

    <div ng-app="" ng-init="names=[
    {name:'Jani',country:'Norway'},
    {name:'Hege',country:'Sweden'},
    {name:'Kai',country:'Denmark'}]">
    <p>循环对象：</p>
    <ul>
      <li ng-repeat="x  in names">
        {{ x.name + ', ' + x.country }}
      </li>
    </ul>
    </div>


## 控制器的示例
控制器 控制 AngularJS 应用程序的数据。是常规的 JavaScript 对象。
使用 ng-controller 指令定义了应用程序控制器。
控制器是 JavaScript 对象，由标准的 JavaScript 对象的构造函数 创建。

    <div ng-app="myApp" ng-controller="myCtrl">
    姓: <input type="text" ng-model="firstName"><br>
    名: <input type="text" ng-model="lastName"><br>
    <br>
    姓名: {{firstName + " " + lastName}}
    </div>
    <script>
    var app = angular.module('myApp', []);
    app.controller('myCtrl', function($scope) {
        $scope.firstName = "John";
        $scope.lastName = "Doe";
    });
    </script>

AngularJS 应用程序由 ng-app 定义。应用程序在 <div> 内运行。
ng-controller="myCtrl" 属性是一个 AngularJS 指令。用于定义一个控制器。
myCtrl 函数是一个 JavaScript 函数。
AngularJS 使用$scope 对象来调用控制器。
在 AngularJS 中， $scope 是一个应用象(属于应用变量和函数)。
控制器的 $scope （相当于作用域、控制范围）用来保存AngularJS Model(模型)的对象。
控制器在作用域中创建了两个属性 (firstName 和 lastName)。
ng-model 指令绑定输入域到控制器的属性（firstName 和 lastName）。

从此刻这一节起，请参考示例页面去查看代码示例，后面将不再列出


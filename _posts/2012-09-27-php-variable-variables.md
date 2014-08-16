---
layout: post
title: PHP可变变量
category: 技术
tags: PHP
description: PHP可变变量
---

### 什么叫可变变量

不知道大家在使用php的时候是否遇到这样一种情况，即想将一个变量的内容作为另一个变量的名称。在php中，这个需求可以通过可变变量（Variable variables）来实现。

可变变量的一般形式为：

    $var=“foo”;
    $$var=1;
 

在这里， 其实等同于向将var展开，然后再以它的值作为真正的变量名

    $foo=1;

### 可变变量妙用
#### 类的动态实例化

    $var=“foo”;
    $a=new $foo;

#### 循环定义变量

    for($i=0;$i<10;$i++){
    ${aa.$i}=“a”;
    }

#### 动态调用方法

    class test_class{
      var $func=‘display_UK’;
      function display_UK(){
        echo “Hello”;
      }
      function display_FR(){
        echo “Bonjour”;
      }
      function display(){
        $this->{$this->func}();
      }
    }
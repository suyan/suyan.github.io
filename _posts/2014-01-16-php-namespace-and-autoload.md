---
layout: post
title: PHP命名空间及自动加载
category: 技术
tags: PHP
keywords: PHP,命名空间,自动加载
description: 
---

## 命名空间
什么是[命名空间][1]呢？

> 命名空间（英语：Namespace）表示标识符（identifier）的可见范围。一个标识符可在多个命名空间中定义，它在不同命名空间中的含义是互不相干的。这样，在一个新的命名空间中可定义任何标识符，它们不会与任何已有的标识符发生冲突，因为已有的定义都处于其它命名空间中。

简单说来命名空间是为了解决不同库在同一个环境下使用时出现的命名冲突。例如我自己有一个函数名叫A，但是系统已经有一个A函数了，那就会出现冲突。

## PHP中的命名空间
PHP从5.3版本开始引入了命名空间，之后许多现有PHP类库以及框架都开始支持它。那么PHP的命名空间怎么用呢？

### 定义命名空间
下面是一个定义命名空间的例子

    <?php    
    //file a.php
    namespace A;
    
    const test = 'Atest'; 
    
    function test() { 
        return __FUNCTION__; 
    }
    
    class Test{
        public function __construct(){
            return __METHOD__;
        }
    }
    ?>
    
上面例子中就是一个典型的命名空间定义方法，只有`const`, `function`, `class`受命名空间的约束。

### 使用命名空间
使用命名空间的方式如下：

    <?php 
    namespace B;
    use A;
    
    const test = 'Btest';
    function test() { 
        return __FUNCTION__; 
    }
    
    class Test{
        public function __construct(){
            return __METHOD__;
        }
    }
    
    include "a.php";//必须包含A命名空间的文件
    
    // 完全限定
    // `\B\test`从绝对位置查找输出，如果是全局函数则`\test`
    echo \B\test;   //输出Btest
    
    // 限定名称  
    // 这里已经通过`use A`申明了在这个文件可以通过`\A\...`使用A命名空间的函数
    echo A\test;    //输出Atest
    
    // 非限定名称
    // 非限定名称的函数`test`会从当前命名控件查找，即B
    echo test;      //输出Btest
    
    // namespace关键字代表当前命名空间
    echo namespace/test;
    ?>

首先要注意的是命名空间只起申明作用，也就是在使用了命名空间的时候依然得把这个命名空间申明的那个文件包含进来。在使用中可以通过`__NAMESPACE__`来查看当前命名空间。

更多内容可以查看[PHP官方文档][2]

## 自动加载
每个文件既要申明命名控件又要手动`include`是非常不智能的事情，所以在自己的PHP系统或者框架中可以使用自动加载技术，让系统自己去找

最简单的方式是利用函数`__autoload`函数，但是这个函数只能在非命名控件下定义，也就是全局情况下：

    function __autoload($class) {
      $dir = './';
      set_include_path(get_include_path().PATH_SEPARATOR.$ids_dir);
      $class = str_replace('\\', '/', $class) . '.php'; 
      require_once($class);
}

如果在已经有了命名空间的类中，可以使用函数`spl_autoload_register`来注册一个类中的方法来代替`__autoload`

[1]: http://zh.wikipedia.org/wiki/%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4
[2]: http://www.php.net/manual/zh/language.namespaces.basics.php


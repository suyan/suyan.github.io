---
layout: post
title: 设计模式详解及PHP实现：解释器模式
category: 技术
tags: [Pattern, PHP]
keywords: 设计模式,解释器模式
description: 
---

## 解释器模式（Interpreter pattern）
解释器模式是一种行为型模式，它给定一个语言, 定义它的文法的一种表示，并定义一个解释器, 该解释器使用该表示来解释语言中的句子。

## 类图

![interpreter pattern](http://yansu-uploads.stor.sinaapp.com/imgs/interpreter-pattern-uml.jpg)

## 实例

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

## 参考
1. [Wikipedia: Strategy pattern](http://en.wikipedia.org/wiki/Strategy_pattern)
2. [php设计模式 Interpreter(解释器模式)](http://www.jb51.net/article/27484.htm)
---
layout: post
title: JavaScript变量作用域
category: 技术
tags: JavaScript
description: 转载学习
---
>转载自:[http://www.cnblogs.com/rainman/archive/2009/04/28/1445687.html](http://www.cnblogs.com/rainman/archive/2009/04/28/1445687.html),略改

- JavaScript的变量作用域是基于其特有的作用域链
- JavaScript没有块级作用域
- 函数中声明的变量在整个函数中都有定义

## 1.JavaScript的作用域链

    var rain = 1;
    function rainman(){
      var man = 2;
      funciton inner(){
        var innerVar = 4;
        alert(rain);
      }
      inner();
    }
    rainman();

在alert(rain);这句代码，JavaScript首先在inner函数中检查，否则则在rainman中查找，这段代码在rainmain()中没有定义，则最终查找的是全局变量中的rain。

作用域链：JavaScript需要查找一个变量时，首先查找作用域链第一个对象，如果第一个对象没有定义，则顺序向后查找。

## 2.函数体内部，局部变量的优先级比同名的全局变量高

    var rain = 1;
    function check(){
      var rain = 100;
      alert(rain);
    }
    check();    //100 
    alert(rain);  //1

## 3.JavaScript没有快级作用域

    function rainmain(){
      //rainman 函数体内存在三个局部变量 i j k 
      var i = 0;
      if(1){
        var j = 0;
        for(var k=0;k<3;k++)
          alert(k);  //0,1,2
        alert(k);  // 3
      }
      alert(j);  //0
    }

i,j,k的作用域是相同的，他们在rainmain中是全局的

## 4.函数中声明的变量在整个函数中都有定义

    function rain(){
      var x = 1;
      function man(){
        x = 100;
      }
      man();    //调用man
      alert(x);  //这里会弹出100
    }
    rain();   //调用rain

上面代码说明，变量x在整个rain体内都可以使用，并可以重新幅值。但是会有以下情况产生:

    var x = 1;
    function rain(){
      alert(x);   //undefined
      var x = '3';
      alert(x);   //3
    }

是由于rain定义了x，它会隐藏同名全局变量x。由于alert时还未定义，所以undefined

## 5.未使用var关键字定义的变量都是全局变量

    function rain(){
      x = 100;
    }
    rain();
    alert(x);  //100

## 6.全局变量都是window对象的属性

    var x = 100;
    alert(window.x); //100


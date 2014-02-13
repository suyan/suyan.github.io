---
layout: post
title: 基于CSS3实现尖角面包屑
category: 技术
tags: CSS
keywords: CSS,尖角,面包屑,导航
description: 
---

> 尖角面包屑导航应该算是比较常见的导航之一，尤其是在做流程引导的时候。为了做一个比较好看的导航，一般都会做成尖角的，而且还会有渐变色，这就是稍微麻烦点的地方了，下面是这个导航的一个实现原理

## 尖角实现
尖角的实现利用了CSS的before和after特性，以及无内容情况下border的特性，先来看看他们的介绍

### 伪元素before和after
before和after分别在一个元素前和后添加内容，使用方法如下：

    a:before, a:after {
        content: "123";
    }

这段的意思就是在a标签前后都增加了123文本，利用这个特性，可以给一个按钮前后都增加尖角了。

### 利用border实现尖角
border有一个特点，就是当元素内容是空的时候，border会占据内容的空间，效果点[这里](http://codepen.io/suyan0830/pen/roAtK)查看。

HTML代码：

```html
<div class="bor"></div>
```

CSS代码：

```css
.bor{
  width:0px;
  height:0px;
  border: solid;
  border-width: 20px 20px 20px 20px;
  border-color: red yellow green black; 
}
```

那么只要让before和after都变成这个样子，利用位置定位将这两部分分别移到相应位置，然后调整border某一边是透明就好了。

### 调整border透明
如果导航是纯色的，那么直接将before和after作为尖角即可，因为border可以设置纯色。但是如果想要给导航设置颜色渐变，那就只能通过设置导航来实现，border不能设置渐变色。这个时候只能通过将border设置的和背景色一致，遮挡导航主体部分来实现尖角特点。
    
## 最终效果
效果点[这里](http://codepen.io/suyan0830/pen/uqHCD)查看。

HTML代码：

```html
<div class="breadcrumbs">
  <div class="bread current"><a href="">test</a></div>
  <div class="bread"><a href="">test2</a></div>
</div>
```

CSS代码：

```css
body{
  background:#D7D7D7;
}
.breadcrumbs{
  padding-left:40px;
  padding-top:7px;
}
.bread,.bread:hover{
  font-size:14px;
  display:inline;
  float:left;
  width:200px;
  background-color: #ddd;
  padding: 4px 10px 2px 0px;
  margin-right:40px;
  position: relative;
}
.bread{
  background-image: linear-gradient(to top, #F0F0F0, #F2F2F2);
}
.bread:hover{
  background-image: linear-gradient(to top, #EBE470, #F3F3EF); 
}
.current{
  background-image: linear-gradient(to top, #EBE470, #F3F3EF);
}
.bread > a{
  text-decoration: none;
  padding: 10px 10px 10px 40px;
}
.bread:hover > a{
  text-decoration: none;
  padding: 10px 10px 10px 40px;
}
.bread:before,.bread:after{
  content:"";
  border:solid;
  position: absolute;
  top:0px;
  border-width: 13px;
}
.bread:before{
  left:0px;
  border-color: transparent transparent transparent #D7D7D7;
}
.bread:after{
  right:0px;
  border-color: #D7D7D7 #D7D7D7 #D7D7D7 transparent;
}
```


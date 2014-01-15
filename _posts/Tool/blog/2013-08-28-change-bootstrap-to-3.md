---
layout: post
title: 更新前端框架到Bootstrap3
category: 工具
tags: Blog
keywords: Bootstrap
description: Bootstrap3正式版出来几天了，考虑更新完全没影响，就抽空升级一下
---

Bootstrap3出来大概有几天时间了，据说他们宣称这个版本是移动优先，而且还把控件给排扁了。

前几天稍微看了一下他们的[新文档](http://getbootstrap.com)，感觉确实变化挺多，但是对于熟悉第二版的开发这者来说，稍微看一下基本就了解了。这个框架使用的人真的是奇多，正式版刚发布的那天就有人提醒我，我github上头一个基于Bootstrap的自动提醒控件应该升级成v3的了，而且还给我发来了代码，这效率……

这个博客当初是决定了以后常用的，所以代码和文件布置的还算合理，从v2升级到v3基本不费什么功夫。就是换一下css和js，改改class的事情。总共时间1个小时吧，加上写这个总结，接下来说说主要关心修改什么内容。

### 1.bootstrap文件更新

看一下新的bootstrap文件

    .
    ├── css
    │   ├── bootstrap.css
    │   └── bootstrap.min.css
    ├── fonts
    │   ├── glyphicons-halflings-regular.eot
    │   ├── glyphicons-halflings-regular.svg
    │   ├── glyphicons-halflings-regular.ttf
    │   └── glyphicons-halflings-regular.woff
    └── js
        ├── bootstrap.js
        └── bootstrap.min.js

css和js还是老样子，只要覆盖原来的就行了，这里关键说一下fonts里头的东西。

以前版本里面，图标都是真的图片做成的，他们都被集合在之前的glyphicon-halflings.png里头，用哪个根据图片位置相对显示哪个。这种方式导致的问题就是在分辨率变法的时候，图片要么失真要么显示有问题，尤其是retina屏下头。

这个问题在v2阶段就有解决办法，只不过不是官方发布的，而是由[Font Awesome](http://fortawesome.github.io/Font-Awesome/)提供了基于字体的图标，这样形成的图标是矢量图，可以面对各种各样的分辨率。我找到一个对它进行分析的文章，链接[在此](http://www.cnblogs.com/zhengenru2008/archive/2013/04/12/3016659.html)。

现在v3版本里面也有了类似的解决方案，对我来说用原来的就行，没有影响。

### 2.网格布局修改

网格布局由原来的`span`变成了现在超级难看的`col-xx-xx`，而且看起来不那么简约时尚国际范了。不过稍微细读一下文档会发现，这种略微复杂的控制方式，反而对响应式布局的控制变得非常精细，妈妈再也不用担心分辨率改了以后还得修改css文件了！

通过`<div class="col-xs-12 col-md-8">`类似这样的并列方式，就可以控制不同分辨率下控件的现实形式。对我来说没啥作用，因为默认的布局方式就够用了，直接把`span`都换成`col-md`，搞定！

这里我用md是因为我这个博客页面不是很丰富，太宽不好看，而且我还把bootstrap.css下1200那个最大值给调成了2000。也就是说，你想看到col-lg的布局，得屏幕分辨率达到2000xXXX以上了……

### 3.控件修改

这里大概用了一些简单的控件，比如右边的affix，以及顶上的navbar，还有下面的pagination，还有分类页面的collapse。变化仅仅是改了一下class的名字，逐个击破就好了

### 4.一些想法

Bootstrap的出现，一定程度上统一了前端杂乱的氛围，简化了开发流程，降低了开发难度，简直就是老少皆宜。对于不是做前端，却要偶尔写前端的孩纸，指明了一条道路。对于做前端的开发者来说，又有了一个较为标准化的学习对象，可以加快学习速度，少走一些弯路。

现在阅读字体和风格都不怎么舒服，待优化，下次再弄吧。






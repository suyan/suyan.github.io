---
layout: post
title: HTML中meta标签viewpoint的作用
category: 技术
tags: HTML
description: 在写此博客程序布局时，响应式布局一直不好使，各种调试总算找到原因在于没有写meta viewpoint标签，在此做一个总结，以免以后出问题
---

## debug过程
1.在web上浏览的时候，响应式布局是好用的，放大缩小页面都可以实现页面变更，但是在手机上调试的时候死活不能用

2.因为css中@media是根据window的宽度来控制css的，所以我尝试输出了一下在window变更的时候window的width，结果发现PC上使用时一切正常，而手机上输出的一直是980。

原因很简单，手机上的浏览器是全屏的，我手机实际宽度是320像素，而我手机分辨率是980宽度，所以手机上打出来的是980而不是320

3.增加

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

以后发现手机window的width变为320了，即预期效果

##  viewpoint说明

- width 控制viewpoint的宽度，可以是固定值，也可以是device-width，即设备的宽度
- height 高度
- initial-scale 控制初始化缩放比例，1.0表示不可以缩放
- maximum-scale 最大缩放比例
- minimum-scale 最小缩放比例

可见如果不定义viewpoint的话，页面宽度以屏幕分辨率为基准，而设置以后可以根据设备宽度来调整页面，达到适配终端大小的效果

## 参考

[Using the viewport meta tag to control layout on mobile browsers](https://developer.mozilla.org/en-US/docs/Mobile/Viewport_meta_tag)
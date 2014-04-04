---
layout: post
title: 探究Android中浏览器UA的生成策略
category: Android
tags: Other@Android
keywords: android ua user-agent
description: 
from: http://cnetwei.iteye.com/blog/1030257
---
Android系统中内置了浏览器应用/system/app/ Browser.apk，默认它生成User Agent 的策略如下：
以Android2.3为例，其 具体逻辑在：android.webkit.WebSettings.getCurrentUserAgent() 方法中。

```
Mozilla/5.0 (Linux; U; Android $(VERSION) ; $(LOCALE) ; $(MODEL) Build/$(BUILD) ) AppleWebKit/533.1 (KHTML, like
Gecko) Version/4.0 Mobile Safari/533.1
```

上面的$表达式会被求值

```
VERSION：android.os.Build.VERSION.RELEASE (ro.build.version.release)
MODEL：android.os.Build.MODEL (ro.product.model)
BUILD：android.os.Build.ID (ro.build.id)
LOCALE：当前设备中的语言设置，动态变化
```

除Locale之外，其余几个都是Android系统属性，这些属性的初始值通常都定义在```build\tools\buildinfo.sh```文件中，要覆盖它们，需要向device\HW_X\P_XX\system.prop文件中添加新值。
 
但需要注意的是，一些以```ro.```开始的属性是只读属性 因此无法覆盖，修改其值 的 正确方法是，从源头，例如： ```ro.product.model``` 属性 在```buildinfo.sh```文件中的定义如下：
```echo "ro.product.model=$PRODUCT_MODEL"```
那么，我们就需要找到PRODUCT_MODEL内部变量的定义，修改它，或者覆盖它。
针对 PRODUCT_MODEL变量而言，我们可以在 ```device\HW_X\P_XX\P_XX.mk```文件中覆盖它，例如：
```PRODUCT_MODEL := S41IA```
---
layout: post
title: libiomp5md.dll 已初始化错误
category: Python,Conda,ERROR
tags: Python,Conda,ERROR
keywords: Python,ERROR
---

# libiomp5md.dll 已初始化报错

在conda环境中，如果安装了torch，在运行程序的时候有一定几率会碰到下面的错误

[![cwOOJK.png](https://z3.ax1x.com/2021/04/11/cwOOJK.png)](https://imgtu.com/i/cwOOJK)

这是因为在同一个conda环境中的Lib和Library两个目录中同时存在 libiomp5md.dll 文件

[![cwjJ4P.png](https://z3.ax1x.com/2021/04/11/cwjJ4P.png)](https://imgtu.com/i/cwjJ4P)

## 解决方法有两种

1、在代码中加入下面两行即可

```python
import os
os.environ['KMP_DUPLICATE_LIB_OK']='True'
```

但是这种方法只是解决了报错，引发错误的原因还在

2、移除Library中的 libiomp5md.dll 文件，将该文件重命名为 libiomp5md.dll.backup 即可，Lib目录下的 libiomp5md.dll 文件不做改动

[![cwvman.png](https://z3.ax1x.com/2021/04/11/cwvman.png)](https://imgtu.com/i/cwvman)
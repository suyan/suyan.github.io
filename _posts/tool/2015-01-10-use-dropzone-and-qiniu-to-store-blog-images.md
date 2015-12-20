---
layout: post
title: 使用Dropzone和七牛云存储来优化博客图床
category: 工具
tags: Blog
keywords: Dropzone,Qiniu,七牛,图床,博客
description: 
---

> 2015.12.20更新
> - 此次更新用Python替代了Ruby，不需要再自己安装qiniu的ruby包，我已经集成在bundle里面
> - 增加了一个pngpaste在包里，这样直接点击action会把剪切板内的图片上传 (已测试系统截图，QQ截图以及Monosnap)，原来的点击打开七牛官网功能在剪切版没有图片时生效
> - 增加了图片重名检查

> 之前我在用SAE的Storage作为博客图床，但是令我非常不爽的是没有一个很好的上传和获得公共链接的方法。现在总算用Dropzone和七牛把这个问题解决了，下面是我上传图片和获得URL的操作，方法再往下看。

![七牛操作流](http://7u2ho6.com1.z0.glb.clouddn.com/tool-qiniu-workflow.gif)

## 设置七牛帐号

> [七牛](http://www.qiniu.com)是国内口碑不错的一个云存储为主的公司。它的特点应该就在图片存储上，有非常方便的上传SDK和图片处理流，用来作为博客图床非常合适，而且价格不贵，每月有免费的10G流量。

1. 去七牛注册帐号

    刚刚创建的帐号是测试帐号，完成个人认证就可以成为标准帐号，获得10G的存储空间和各10G的上传下载流量。

    ![标准帐号](http://7u2ho6.com1.z0.glb.clouddn.com/tool-qiniu-normal-account.png)

2. 创建一个空间

    创建空间也比较容易，记得选择公开空间。
    
    ![创建空间](http://7u2ho6.com1.z0.glb.clouddn.com/tool-qiniu-create-bucket.png)
    
## 设置Dropzone

> [Dropzone](https://aptonic.com/dropzone3/)是我很早就非常喜欢的一个软件。它通过拖拽的方式，增强了文件的处理流程。一直懒得给它开发插件，没想到七牛的SDK如此好用，所以今天折腾了一下搞定了。

1. 下载软件

    这个软件可以在App Store上直接购买，但是买到的是功能受限的，它不能操作外部文件。不过没有关系，再从官网上下载非沙箱版本，然后覆盖掉Application文件夹下的即可。
    
2. 安装Qiniu插件

    我把这个插件放到了[Github](https://github.com/suyan/scripts/tree/master/Dropzone%20Action)上，戳[这里](https://github.com/suyan/scripts/blob/master/Dropzone%20Action/Qiniu.dzbundle.zip?raw=true)下载。
    
3. 安装插件

    下载后的是一个zip包，把这个包解压以后双击安装即可。

4. 启用插件

    从增加列表中选择我们安装好的七牛插件。

    ![启用插件](http://7u2ho6.com1.z0.glb.clouddn.com/tool-use-bundle.png)
    
    然后填写配置：
    
    - server: 七牛上的空间名
    - username: 七牛的access_key
    - password: 七牛的secret_key    
    - remote path(可选): 本地同步图片的目录，如果你希望本地也存一份图片，选一个地址即可
    - root url: 七牛的公共链接根目录
    
    ![access key](http://7u2ho6.com1.z0.glb.clouddn.com/tool-qiniu-access-key.png)

    ![root url](http://7u2ho6.com1.z0.glb.clouddn.com/tool-qiniu-root-url.png)

## 其他建议

利用Dropzone还有很多可利用的技巧，例如增加一个ImageOptim应用来压缩图片，然后再进行上传。

对于临时图片，可以直接上传到Imgur获得链接。


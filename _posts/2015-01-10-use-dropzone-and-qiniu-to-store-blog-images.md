---
layout: post
title: 使用Dropzone和七牛云存储来优化博客图床
category: 技术
tags: Blog
keywords: Dropzone,Qiniu,七牛,图床,博客
description: 
---
> 之前我在用SAE的Storage作为博客图床，但是令我非常不爽的是没有一个很好的上传和获得公共链接的方法。现在总算用Dropzone和七牛把这个问题解决了，下面是我上传图片和获得URL的操作，方法再往下看。

![七牛操作流](http://7u2ho6.com1.z0.glb.clouddn.com/2015-01-10-qiniu-workflow.gif)

## 设置七牛帐号

> [七牛](http://www.qiniu.com)应该是国内口碑不错的一个云存储为主的公司。它的特点应该就在图片存储上，有非常方便的上传SDK和图片处理流，用来作为博客图床非常合适，而且价格不贵，还有每月免费的10G流量。

1. 去七牛注册帐号

    刚刚创建的帐号是测试帐号，完成个人认证就可以成为标准帐号，获得10G的存储空间和各10G的上传下载流量。

    ![标准帐号](http://7u2ho6.com1.z0.glb.clouddn.com/2014-01-09-qiniu-normal-account.png)

2. 创建一个空间

    创建空间也比较容易，记得选择公开空间。
    
    ![创建空间](http://7u2ho6.com1.z0.glb.clouddn.com/2014-01-09-qiniu-create-bucket.png)
    
## 设置Dropzone

> [Dropzone](https://aptonic.com/dropzone3/)是我很早就非常喜欢的一个软件。它通过拖拽的方式，增强了文件的处理流程。

1. 下载软件

    这个软件可以在App Store上直接购买，但是买到的是功能受限的，它不能操作外部文件。不过没有关系，再从官网上下载非沙箱版本，然后覆盖掉Application文件夹下的即可。
    
2. 安装Qiniu插件

    我把这个插件放到了[Github](https://github.com/suyan/scripts/tree/master/Dropzone%20Action)上，戳[这里](https://github.com/suyan/scripts/blob/master/Dropzone%20Action/Qiniu.dzbundle.zip?raw=true)下载。
    
3. 安装插件

    下载后的是一个zip包，把这个包解压以后双击安装即可。
    
4. 启用插件

    ![启用插件](http://7u2ho6.com1.z0.glb.clouddn.com/2015-01-10-use-bundle.png)
    
    ![access key](http://7u2ho6.com1.z0.glb.clouddn.com/2015-01-10-qiniu-access-key.png)

    ![root url](http://7u2ho6.com1.z0.glb.clouddn.com/2015-01-10-qiniu-root-url.png)
    
    还有一个remote path的选项，这个是用来设置是否在本地同步一份图片。比如我希望在上传七牛的同时在我的Dropbox中备份一份，那么在这里填写Dropzone文件夹位置（如：/Users/user/Dropbox/xxx）即可。

## 其他建议

利用Dropzone还有很多可利用的技巧，例如增加一个ImageOptim应用来压缩图片，然后再进行上传。

对于临时图片，可以直接上传到Imgur获得链接。
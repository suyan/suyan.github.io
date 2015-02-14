---
layout: post
title: OpenStack Horizon 中文本地化
category: 技术
tags: OpenStack
description: Horizon上的中文翻译不是非常完善，因为名词并没有官方的翻译标准，自己根据自己的实际情况翻译比较好
---

### 1.安装组件

    apt-get install gettext

### 2.重新生成po文件

    cd /usr/local/lib/python2.7/dist-packages/horizon/

使用django自带

    django-admin.py makemessages -l zh_CN
    django-admin.py compilemessages  

手动在zn_CN文件夹中生成
  
    find . -type f \( -name '*.py' \)  -print > list
    xgettext --files-from=list -d django -o django.po --from-code=UTF-8
    msgfmt --statistics --verbose -o django.mo django.po 

### 3.修改po文件
修改`/usr/local/lib/python2.7/dist-packages/horizon/local/zh_CN/LN_MESSAGES/django.po`

    msgid "Welcome to my site."
    msgstr "欢迎光临"

其中msgid 是要转换的字符串，存在于程序源码中，所以不要更改。msgstr是基于特定语言的对msgid 的解释，初始为空，开发者需要对msgstr做相应更改

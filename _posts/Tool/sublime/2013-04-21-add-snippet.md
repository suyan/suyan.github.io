---
layout: post
title: 给sublime增加snippet
category: 工具
tags: Sublime
description: 总有时候有一些不是很大的代码段需要重复输入，利用sublime中的snippet可以方便很多
---

### 创建
点击菜单栏Tools ==> New Snippet打开一个snippet模板文件

- `<content><![CDATA[  ]]]></content>`部分是片段输入内容

- `<tabTrigger>p</tabTrigger>`部分是触发此片段的字符，此处为`p`触发

- `<scope>text.html</scope>`部分是此片段可用范围，此处为html文件中可用

完整例子：

    <snippet>
    <content><![CDATA[
    <p>
      $1
    </p>
    ]]></content>
    <tabTrigger>p</tabTrigger>
    <scope>text.html</scope>
    </snippet>  

### 保存

最后保存文件为.sublime-snippet格式，保存在用户配置目录下

    Mac OS X:/Users/yourname/Library/Application Support/Sublime Text 2/Packages/User

另外，`<scope>source.css</scope>`是css文件可用

### 参考
[参考](http://www.granneman.com/webdev/editors/sublime-text/top-features-of-sublime-text/quickly-insert-text-and-code-with-sublime-text-snippets/)
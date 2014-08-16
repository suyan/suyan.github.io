---
layout: post
title: jQuery 常用资源
category: 资源
tags: jQuery
keywords: jQuery
description: 
---

## 官方资源

- [官方首页](http://jquery.com/)
- [官方插件](http://plugins.jquery.com/)

## 下拉框扩展

- [Select 2](http://ivaynberg.github.io/select2/)

  功能强大的下拉列表插件，基本包含了所有可能的需求……

- [OptionTree](http://kotowicz.net/jquery-option-tree/demo/demo.html)

  联动下拉列表插件，可以动态生成下拉列表，而且支持ajax获取数据

## 常用代码

### 禁用a的链接

    href="return false;"或href="javascript;"
    $().live('click',function(e){
      e.preventDefault();
      });

### 清空file的内容
  
    var cfile = $('#id').clone();
    $('#id').replaceWith(cfile);

### jquery.form.js 和 jquery.validate.js配合使用
    这两个脚本搭配在表单验证和提交是非常的好用,顺便增加了对bootstrap表单的支持
    $("#page_form").validate({
      highlight: function(element) {
        $(element).closest('.control-group').removeClass('success').addClass('error');
      },
      success: function(element) {
        element.text('OK!').addClass('valid').closest('.control-group').removeClass('error').addClass('success');
      },
      submitHandler:function(form) {
        $(form).ajaxSubmit(options);
    }});

### 选择父节点
    使用$(this)来将dom对象转为jquery对象
    $(this).parents('tr');

### 多重操作
    $(this).parents('tr').remove();
    因为jquery函数返回jquery节点
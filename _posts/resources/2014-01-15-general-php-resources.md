---
layout: post
title: PHP 常用资源
category: 资源
tags: PHP
keywords: PHP
description: 
---

## 常用资源

### 常用扩展

1. [phpDocumentor](http://www.phpdoc.org)
2. [PHPUnit](https://phpunit.de)
3. [Guzzle](https://github.com/guzzle/guzzle)

### 好文
1. [PHP之道](http://wulijun.github.io/php-the-right-way/)
2. [Cookie/Session机制详解](http://blog.csdn.net/fangaoxin/article/details/6952954)

### 优秀的类库
1. [PHP中文分词: 自动打标签功能](http://jingwentian.com/t-145)

### 判断是否为空
```
+--------------+-----------+---------+-----------+---------+--------+
| 真值表        | gettype() | empty() | is_null() | isset() | (bool) |
+--------------+-----------+---------+-----------+---------+--------+
| $x = ""      | string    | true    | false     | true    | false  |
| $x=null      | NULL      | true    | true      | false   | false  |
| var $x       | NULL      | true    | true      | false   | false  |
| $x = array() | array     | true    | false     | true    | false  |
| $x = false   | boolean   | true    | false     | true    | false  |
| $x = 15      | integer   | false   | false     | true    | true   |
| $x = 1       | integer   | false   | false     | true    | true   |
| $x = 0       | integer   | true    | false     | true    | false  |
| $x = -1      | integer   | false   | false     | true    | true   |
| $x = '15'    | string    | false   | false     | true    | true   |
| $x = '1'     | string    | false   | false     | true    | true   |
| $x = '0'     | string    | true    | false     | true    | false  |
| $x = '-1'    | string    | false   | false     | true    | true   |
| $x = 'foo'   | string    | false   | false     | true    | true   |
| $x = 'true'  | string    | false   | false     | true    | true   |
| $x = 'false' | string    | false   | false     | true    | true   |
+--------------+-----------+---------+-----------+---------+--------+
```

## 常用命令

### 修改phpunit内存限制    

    phpunit -d memory_limit=512M


## PHPStorm 常用快捷键

- Quick Command

    `Command + Shift + A`

- Quick File

    `Command + Shift + O`

- Quick Class

    `Command + O`

- Quick Symbol

    `Command + Option + O`
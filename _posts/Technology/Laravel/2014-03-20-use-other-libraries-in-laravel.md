---
layout: post
title: 在Laravel中使用自己的类库三种方式
category: 技术
tags: [Laravel, PHP]
keywords: Laravel,PHP,Library
description: 
---

> 虽然Composer使得我们可以重用很多现有的类库（例如packagist.org中的），但是我们仍然可能用到一些不兼容composer的包或者类库。另外在某一项目中，我们也可能会创建某一类库，而且可能并没有制作成为composer package 的打算。这个时候我们可以通过以下方式来使用自己的特有类库。


## 增加可直接实例化的类
有些需要直接在项目中使用的类，可以通过以下方式增加到Laravel中

1. 创建类库文件`app/libraries/class/myClass.php`
2. 写入文件内容
    
```php
<?php
class Message {
    public static function display() {

    }
}
?>
```

3. 在`app/start/globals.php`中增加类导入路径

```php
<?php 
ClassLoader::addDirectories(array(

    app_path().'/commands',
    app_path().'/controllers',
    app_path().'/models',
    app_path().'/database/seeds',
    app_path().'/libaries/class', // 在这里增加

));
?>
```

4. 在`composer.json`中增加autoload目录

```js
"autoload": {
    "classmap": [
        "app/commands",
        "app/controllers",
        "app/models",
        "app/database/migrations",
        "app/database/seeds",
        "app/tests/TestCase.php",
        "app/libraries/class"   //在这里增加
    ]
},
```

5. 执行`composer dump-autoload`来创建导入映射
6. 使用自己导入的类直接调用`Message::display()`即可

> 这种方法同样也是增加队列类的方法，很多人不知道Laravel中队列处理类应该放在哪里，其实按照上面的方法，在`app`目录下创建一个`queues`目录，然后让其可以直接实例化即可

## 增加可直接调用的函数
有人喜欢用`v()`来代替`var_dump()`，想要在Laravel中这么做也非常容易

1. 创建一个函数文件`app/libraries/function/helper.php`
2. 写入文件内容

```php
<?php 
function v($msg){
    var_dump($msg);
}
?>
```

3. 把文件增加到composer自动导入列表中

```js
"autoload": {
   "classmap": [
       ...
   ],
   "files": [
       "app/libraries/function/helper.php"
   ],
},
```

或者在项目中显示`require`这个文件。打开`app/start/global.php`，在末尾增加：

    require app_path().'/libraries/function/helper.php';

个人感觉这两种方式都OK，如果想要控制这个文件加载的时间，甚至可以在`filter.php`文件中增加以下内容

    App::before( function( $request ) {
        require( "{$GLOBALS['app']['path.base']}/app/libraries/function/helper.php" );
    });

4. 在项目中直接使用函数`v('hello world')`;

## 增加稍微复杂的类库
有的时候一个类库不仅仅是一个文件那么简单，因此下面的方式更加适合有多个文件多个结构的类库。

1. 创建[psr0](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-0.md)或者[psr4](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-4-autoloader.md)标准的目录结构。

```
libraries
    Myapp
        Search (note directory is capitalized)
            Search.php
            SearchFacade.php
            SearchServiceProvider.php
        AnotherLib
```

`Myapp/Search/Search.php`中`Search`类的命名空间为`Myapp\Search`。

2. 修改composer中autoload

```js
"autoload": {
    "classmap": [
        "app/commands",
        "app/controllers",
        "app/models",
        "app/libraries",
        "app/database/migrations",
        "app/database/seeds",
        "app/tests/TestCase.php"
    ]
    ,
    "psr-0": {
         "Myapp": "app/libraries"
    }
},
```

3. 在项目中使用`new Myapp\Search\Search()`来实例化某一类

## 总结
虽然Laravel没有强制哪种方式最好，但是有一定的标准可以使得项目结构清晰，多人合作开发时省去很多交流成本。

## 参考
1. [Adding new classes or library to laravel 4](http://php-problems.blogspot.com/2013/07/adding-new-classes-or-library-to.html)
2. [How to autoload 'libraries' in laravel 4?](http://stackoverflow.com/questions/17584810/how-to-autoload-libraries-in-laravel-4)
3. [What are the best practices and best places for laravel 4 helpers or basic functions?](http://stackoverflow.com/questions/17088917/what-are-the-best-practices-and-best-places-for-laravel-4-helpers-or-basic-funct)
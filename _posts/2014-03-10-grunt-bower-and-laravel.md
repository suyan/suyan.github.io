---
layout: post
title: 用Laravel+Grunt+Bower管理你的应用
category: 技术
tags: [PHP, Laravel]
keywords: Laravel,PHP,Grunt,Bower
description: 
---

> 每个开发者都应该有自己的工具箱

## 为什么这么选择？
如今开源盛行，从后端的各个类库，到如今前端的jQuery插件，前端框架等，越来越多优秀的组件可以被我们选择应用在现有的项目中。随着开源组件的更新迭代，它们互相之间的依赖也越来越复杂。旧的框架对于新的变化总是显得难以适从，就算为了新的特性改变旧的框架，也会显的略显牵强。于是就会有新的框架和工具，在这个时候凸现出来。

每个项目开始的方向是很重要的，良好的开始可以避免之后的各种问题。下面要说的三个工具，就是现有应用开发的一个良好开端。

### [Laravel](http://laravel.com/)
Laravel是一个非常新的PHP框架，借鉴了很多前辈的优秀特性，以PHP5为起点，引入了[Composer](https://getcomposer.org/)作为包管理工具，号称为WEB艺术家创造的PHP框架。

### [Grunt](http://gruntjs.com/)
基于JavaScript的自动化构建工具，可以将重复的任务，例如压缩（minification），编译，单元测试，linting等自动化。

### [Bower](http://bower.io/)
Web前端开发的包管理工具，解决前端框架间的依赖关系，方便模块化和重用。

## 优势

1. 使用Laravel可以更好的利用最新版PHP的优势，排除了一些历史问题。
2. 利用Composer可以极大减少"轮子"的数量，优秀的包可以去[Packagist](https://packagist.org/)找到，这些包几乎都利用Github来托管，利用Github的issue和request可以辅助提高包的质量。
3. Bower可以帮助统一管理开源前端库，如Bootstrap和jQuery等，同样这些包也在Github上托管。
4. Grunt帮助粘合前后端的开源组件，将合并编译压缩等工作自动化。

## 安装使用

### 前提
有些需要提前安装的组件这里不在赘述，请自行Google。

- Composer
- Node & npm
- Grunt
- Bower

### Laravel
有了Composer后安装一个Laravel项目非常容易

    composer create-project laravel/laravel myproject

安装完成后在`myproject`目录下就生成了laravel的框架结构，入口文件在`public`中。在`myproject`根目录下，有一个`composer.json`文件，这个文件看起来是这样的：

```js
{
    "name": "laravel/laravel",
    "description": "The Laravel Framework.",
    "keywords": ["framework", "laravel"],
    "license": "MIT",
    "require": {
        "laravel/framework": "4.1.*"
    },
    //...
}
```

这个文件可以控制项目的一些依赖关系，我们需要一些组件的时候直接在`require`下添加即可，`composer`会帮我们去查找这个组件所需的依赖包。

接着为了安装前端框架，我们先来创建几个公共目录，在`public`下，创建类似的目录

```
.
|-- assets
|   |-- css
|   |-- fonts
|   `-- js
|-- favicon.ico
|-- index.php
|-- packages
`-- robots.txt
```

这里只有`assets`目录是我新创建的

### Bower
准备好后端框架以后，可以安装前端框架了，例如`Bootstrap`。利用`Bower`安装的前端库是其整个工程，并不是我们需要的个别文件，所以可以讲它们先放在一个位置，之后利用`Grunt`来统一处理。

首先配置一下安装路径，在`myproject`根目录下配置文件`.bowerrc`为

```js
{
  "directory": "public/assets/bower"
}
```

这个文件告诉bower，将下载的包都安装到`public/assets/bower`下。

接着在根目录创建一个`bower`的配置文件`bower.json`为

```js
{
  "name": "myproject"
}
```

接着添加前端库

    bower install bootstrap -S

这个命令将会利用配置文件管理整个库依赖，这个时候再看一下配置文件，bower已经帮助我们自动安装好了`Bootstrap`依赖的包--`jQuery`，同时修改了配置文件

```js
{
  "name": "myproject",
  "dependencies": {
    "bootstrap": "~3.1.1"
  }
}
```

在看一下目标目录，`public/assets`下，生成了一个bower目录，其中包含了`Bootstrap`和`jQuery`。

### Grunt
根据上面的步骤，我们很方便的建立了后端框架和前端框架，但是前端框架在使用的时候直接用`bower`下的文件并不是非常方便，而且还可能会涉及到一些库的合并压缩等步骤。这些问题都可以交给`Grunt`去做.

首先在`myproject`根目录下利用`npm init`初始化一个配置文件。根据提示一步一步填写即可，最后生成的配置文件`package.json`应该如下所示：

```js
{
  "name": "myproject",
  "version": "0.0.1",
  "description": "",
  "main": "Gruntfile.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

有不一样的地方不用担心，尽管修改即可。

接着我们要安装一些Grunt的插件，帮助我们更好的完成所需功能。

    npm install grunt --save-dev
    npm install grunt-contrib-concat --save-dev
    npm install grunt-contrib-less --save-dev
    npm install grunt-contrib-uglify --save-dev
    npm install grunt-contrib-watch --save-dev
    npm install grunt-contrib-copy --save-dev
    npm install grunt-contrib-cssmin --save-dev

这里的每个插件我会在下面的配置中介绍。上面命令中的`--save-dev`选项的作用是将安装的这些包放入配置文件依赖项中，方便以后安装。下面是安装后的配置文件：

```js
{
  "name": "myproject",
  "version": "0.0.1",
  "description": "",
  "main": "Gruntfile.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "grunt": "~0.4.3",
    "grunt-contrib-concat": "~0.3.0",
    "grunt-contrib-less": "~0.10.0",
    "grunt-contrib-uglify": "~0.4.0",
    "grunt-contrib-watch": "~0.5.3",
    "grunt-contrib-cssmin": "~0.9.0"
    "grunt-contrib-copy": "~0.5.0"
  }
}
```

注意在安装后有了一个`node_modules`目录，这个是node项目依赖包的位置，我们一般都在本地进行文件的合并和压缩，所以可以将这个包保留在本地。另外对于`bower`生成的目录，在`Grunt`处理过以后也是可以不上传到正式环境中的。所以修改`.gitignore`文件，将这两个文件夹排除出去：

```
/bootstrap/compiled.php
/vendor
composer.phar
composer.lock
.env.local.php
.env.php
.DS_Store
Thumbs.db
/public/assets/bower
/node_modules
```

接下来就要进行`Grunt`的配置项编写了，我会在配置中加入注释帮助理解。还记得我们刚刚建立的`package.json`配置文件中的入口文件吗？这个文件还不存在，所以我们需要手动建立，在`myproject`下创建`Gruntfile.js`的文件，内容如下：

```js
module.exports = function(grunt) {
  //配置项
  grunt.initConfig({
    //concat插件配置，用来合并多个文件
    concat: {
      //文件间的分隔符
      options: {
        separator: ';',
      },
      //app是一个任务名，可以随意命名
      app: {
        //将进行的合并项
        src: [
          './public/assets/bower/jquery/dist/jquery.js',
          './public/assets/bower/bootstrap/dist/js/bootstrap.js',
        ],
        //合并后放置在
        dest: './public/assets/js/javascript.js',
      },
    },
    //css合并压缩
    cssmin: {
      //任务名
      app: {
        src: [
          './public/assets/bower/bootstrap/dist/css/bootstrap.css',
          './public/assets/css/base.css'
        ],
        dest: './public/assets/css/stylesheet.css'
      }
    },
    //js压缩
    uglify: {
      options: {
        mangle: false //是否混合变量，如果需求的话置为true
      },
      app: {
        files: {
          './public/assets/js/javascript.js': './public/assets/js/javascript.js',
        }
      },
    },
    //移动文件
    copy: {
      app: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: './public/assets/bower/bootstrap/fonts/',
            src: ['**'], 
            dest: './public/assets/fonts/', 
            filter: 'isFile'
          },
        ]
      }
    },
    //监听文件变化，如果文件变化，将重新进行任务
    watch: {
      app: {
        files: [
          './public/assets/bower/jquery/dist/jquery.js',
          './public/assets/bower/bootstrap/dist/js/bootstrap.js',
          './public/assets/bower/bootstrap/dist/css/bootstrap.css',
        ],   
        //文件变化后执行哪些任务
        tasks: ['concat:app','uglify:app','cssmin:app','copy:app'],
        options: {
          livereload: true
        }
      },
    }
  });

  //导入所需的插件
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  //注册两个任务
  grunt.registerTask('watch', ['watch']);
  grunt.registerTask('default', ['concat:app','uglify:app','cssmin:app','copy:app']);
};
```

我们看到，最后注册了两个任务，这两个任务可以从终端中执行，例如：

    grunt watch

可以开启文件监听，当文件变化时执行watch中设定的任务。

如果直接执行`grunt`，则会执行`default`中设定的任务。我们也可以具体指定执行某一单一任务，如

    grunt copy:app

上面则只将`bootstrap/fonts`中的文件拷贝到`public/assets/fonts`中。

对于上述的这些插件，可以在[这里](http://gruntjs.com/plugins)找到，也有详细的用法。

## 总结
每个人都有自己的喜好，我的这种配置可能只抛个砖，希望有更好的方式分享。最后在总结一下这三剑客：

- Laravel利用了最新PHP特性，引入了Composer包管理，解决后端库之间的依赖
- Bower帮助安装和解决前端框架和库的依赖关系
- Grunt帮助粘合前后端的开源组件，并且完成合并和压缩等重复性工作。

下面两篇参考文章各有特色，如果希望了解一下可以点击链接去看。

我在[Github](https://github.com/suyan/Laravel-Bower-Grunt)上建立了这篇博客中所讲的目录结构，想要快速建立一个可使用的工程，只需要以下几部：

    git clone https://github.com/suyan/Laravel-Bower-Grunt.git
    composer install
    bower update
    npm install
    grunt

Enjoy it!


## 参考
1. [How I use Bower and Grunt with my Laravel projects](http://www.terrymatula.com/development/2013/how-i-use-bower-and-grunt-with-my-laravel-projects/)
2. [Using Grunt + Bower with Laravel and Bootstrap](http://blog.elenakolevska.com/using-grunt-with-laravel-and-bootstrap/)
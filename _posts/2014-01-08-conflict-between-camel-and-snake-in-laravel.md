---
layout: post
title: Laravel 关联模型由于名称一致性导致的问题
category: 技术
tags: [PHP, Laravel]
keywords: Laravel,Conflict,Relationship,Model
description: 
---

## 1. 定义关联模型

在Laravel里面，我们可以通过定义以下Model来完成关联查询。

```php
class MyPost extends Eloquent {
    public function myPostInfo () {
        return $this->hasOne('MyPostInfo');
    }
}

class MyPostInfo extends Eloquent {}
```

## 2. 使用关联模型

这里`myPostInfo()`用的是Camel命名规则，但是我们在读取某一个PostInfo的时候可以用Snake规则。如下面代码都是可行的：

```php
$post = MyPost::find(1);
$post_info = $post->myPostInfo; // example 1
$post_info = $post->my_post_info; // example 2
```

Laravel允许上述两种方法，但是没有合理的处理使用两种命名造成的冲突。

## 3. 缓存失效

如果我们同时使用了上述两个例子，就会使其中一个缓存失效。在Model的relations变量中，缓存了已经读取过的关联Model，但是当我们用不同规则的名字去读取的时候，却会使得前一个缓存失效。例如

```php
$post_info = $post->myPostInfo; 
// $post->relations = [‘myPostInfo’ => ..];

$post_info = $post->my_post_info;
// $post->relations = [‘myPostInfo’ => …, ‘my_post_info’ => …];
```

所以如果不希望缓存失效，得在项目中只使用一种命名方法去读取关系模型。Laravel推荐的是Camel Case.

## 4. toArray() 方法失效

如果同时使用了两者，另外一个问题就是导致`Model::toArray()`失效。因为`toArray()`方法首先去`relations`中查找Snake Case命名的关联模型，没有的话才去看Camel Case的。

所以如果用到了`toArray()`方法来转换Model，切忌同时使用两者。

## 5. 容易犯错的位置

最容易犯错的代码是这样的：

```php
MyPost::with(‘myPostInfo’)->get();
```

在使用With去eagerLoad关联模型时，必须使用和定义方法同名的key去读取，那么这样读取出来的方法只能是Camel Case的key。其他地方就只能用

```php
$my_post->myPostInfo;
```

来保证不出问题。
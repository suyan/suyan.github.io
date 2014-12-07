---
layout: post
title: Laravel 核心：控制反转（Inversion of Control）和门面模式（Facade）
category: 技术
tags: [PHP, Laravel]
keywords: Laravel,PHP,IoC,Facade
description: 
---

> 这两个概念对于 Laravel 的使用者来说应该并不陌生，尤其是当你希望扩展或者替换 Laravel 核心库的时候，理解和合理使用它们可以极大提升 Laravel 的战斗力。这里以创建一个自己的 ServiceProvider 为例理解 Inversion of Control 和 Facade 在 Laravel 中的应用。

## 控制反转（Inversion of Control）

### 什么是 IoC
> 控制反转（Inversion of Control，缩写为IoC），是面向对象编程中的一种设计原则，可以用来减低计算机代码之间的耦合度。其中最常见的方式叫做依赖注入（Dependency Injection，简称DI），还有一种方式叫“依赖查找”（Dependency Lookup）。通过控制反转，对象在被创建的时候，由一个调控系统内所有对象的外界实体，将其所依赖的对象的引用传递给它。 — [维基百科](http://zh.wikipedia.org/wiki/控制反转)

简单说来，就是一个类把自己的的控制权交给另外一个对象，类间的依赖由这个对象去解决。依赖注入属于依赖的显示申明，而依赖查找则是通过查找来解决依赖。

### Laravel 中的使用

注入一个类：

```php
App::bind('foo', function($app)
{
    return new FooBar;
});
```

这个例子的意思是创建一个别名为 `foo` 的类，使用时实际实例化的是 `FooBar`。

使用这个类的方法是：

```php
$value = App::make('foo');
```

`$value` 实际上是 `FooBar` 对象。

如果希望使用单例模式来实例化类，那么使用：

```php
App::singleton('foo', function()
{
    return new FooBar;
});
```

这样的话每次实例化后的都是同一个对象。

注入类的更多例子可以看 [Laravel 官网](http://laravel.com/docs/4.2/ioc)

你可能会疑问上面的代码应该写在哪儿呢？答案是你希望他们在哪儿运行就写在哪儿。0 —— 0 知道写哪儿还用来看这种基础文章么！

## 服务提供器 (Service Providers)
为了让依赖注入的代码不至于写乱，Laravel 搞了一个 **服务提供器（Service Provider）**的东西，它将这些依赖聚集在了一块，统一申明和管理，让依赖变得更加容易维护。

### Laravel 中的使用
定义一个服务提供器：

```php
use Illuminate\Support\ServiceProvider;

class FooServiceProvider extends ServiceProvider {

    public function register()
    {
        $this->app->bind('foo', function()
        {
            return new Foo;
        });
    }

}
```

这个代码也不难理解，就是申明一个服务提供器，这个服务提供器有一个 `register` 的方法。这个方法实现了我们上面讲到的依赖注入。

当我们执行下面代码：

```php
App::register('FooServiceProvider');
```

我们就完成一个注入了。但是这个还是得手动写，所以怎么让 Laravel 自己来做这事儿呢？

我们只要在 `app/config/app.php` 中的 `providers` 数组里面增加一行：

```php
'providers' => [
    …
       ‘FooServiceProvider’,
],
```

这样我们就可以使用 `App::make(‘foo’)` 来实例化一个类了。

你不禁要问了，这么写也太难看了吧？莫慌，有办法。

## 门面模式（Facade）
为了让 Laravel 中的核心类使用起来更加方便，Laravel实现了门面模式。

> 外觀模式（Facade pattern），是軟件工程中常用的一種軟件設計模式，它為子系統中的一組接口提供一個統一的高層接口，使得子系統更容易使用。 — [维基百科](http://zh.wikipedia.org/wiki/外觀模式)

### Laravel 中的使用
我们使用的大部分核心类都是基于门面模式实现的。例如：

```php
$value = Cache::get('key');
```

这些静态调用实际上调用的并不是静态方法，而是通过 PHP 的魔术方法 `__callStatic()` 讲请求转到了相应的方法上。

那么如何讲我们前面写的**服务提供器**也这样使用呢？方法很简单，只要这么写：

```php
use Illuminate\Support\Facades\Facade;

class Foo extends Facade {

    protected static function getFacadeAccessor() { return ‘foo’; }

}
```

这样我们就可以通过 `Foo::test()` 来调用我们之前真正的 `FooBar` 类的方法了。

## 别名（Alias）
有时候我们可能将 `Facade` 放在我们扩展库中，它有比较深的命名空间，如：`\Library\MyClass\Foo`。这样导致使用起来并不方便。Laravel 可以用别名来替换掉这么长的名字。

我们只要在 `app/config/app.php` 中 `aliases` 下增加一行即可：

```php
'aliases' => [
    …
    'Foo' => ‘Library\MyClass\Foo’,
],
```

这样它的使用就由 `\Library\MyClass\Foo::test()` 变成 `Foo::test()` 了。

## 总结
所以有了**控制反转（Inversion of Control）**和**门面模式（Facade）**，实际还有 **服务提供器（Service Providers）**和**别名（Alias）**，我们创建自己的类库和扩展 Laravel 都会方便很多。

这里总结一下创建自己类库的方法：

1. 在 `app/library/MyFoo` 下创建类 `MyFoo.php`
2. 在 `app/library/MyFoo/providers` 下创建 `MyFooServiceProvider.php`
3. 在 `app/library/MyFoo/facades` 下创建 `MyFooFacade.php`
4. 在 `app/config/app.php` 中添加 `providers`  和 `aliases`


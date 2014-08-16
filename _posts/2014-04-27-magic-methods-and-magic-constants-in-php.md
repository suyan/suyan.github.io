---
layout: post
title: PHP中的魔术方法和魔术常量简介和使用
category: 技术
tags: PHP
keywords: PHP,魔术方法
description: 
---

> 有些东西如果不是经常使用，很容易忘记，比如魔术方法和魔术常量。

## 魔术方法(Magic methods)
PHP中把以两个下划线`__`开头的方法称为魔术方法，这些方法在PHP中充当了举足轻重的作用。 魔术方法包括：

- `__construct()`，类的构造函数
- `__destruct()`，类的析构函数
- `__call()`，在对象中调用一个不可访问方法时调用
- `__callStatic()`，用静态方式中调用一个不可访问方法时调用
- `__get()`，获得一个类的成员变量时调用
- `__set()`，设置一个类的成员变量时调用
- `__isset()`，当对不可访问属性调用`isset()`或`empty()`时调用
- `__unset()`，当对不可访问属性调用`unset()`时被调用。
- `__sleep()`，执行`serialize()`时，先会调用这个函数
- `__wakeup()`，执行`unserialize()`时，先会调用这个函数
- `__toString()`，类被当成字符串时的回应方法
- `__invoke()`，调用函数的方式调用一个对象时的回应方法
- `__set_state()`，调用`var_export()`导出类时，此静态方法会被调用。
- `__clone()`，当对象复制完成时调用


### `__construct()`和`__destruct()`
构造函数和析构函数应该不陌生，他们在对象创建和消亡时被调用。例如我们需要打开一个文件，在对象创建时打开，对象消亡时关闭

```php
<?php 
class FileRead
{
    protected $handle = NULL;

    function __construct(){
        $this->handle = fopen(...);
    }

    function __destruct(){
        fclose($this->handle);
    }
}
?>
```

这两个方法在继承时可以扩展，例如：

```php
<?php 
class TmpFileRead extends FileRead
{
    function __construct(){
        parent::__construct();
    }

    function __destruct(){
        parent::__destruct();
    }
}
?>
```

### `__call()`和`__callStatic()`
在对象中调用一个不可访问方法时会调用这两个方法，后者为静态方法。这两个方法我们在可变方法（Variable functions）调用中可能会用到。

```php
<?php
class MethodTest 
{
    public function __call ($name, $arguments) {
        echo "Calling object method '$name' ". implode(', ', $arguments). "\n";
    }

    public static function __callStatic ($name, $arguments) {
        echo "Calling static method '$name' ". implode(', ', $arguments). "\n";
    }
}

$obj = new MethodTest;
$obj->runTest('in object context');
MethodTest::runTest('in static context');
?>
```

### `__get()`，`__set()`，`__isset()`和`__unset()`
当get/set一个类的成员变量时调用这两个函数。例如我们将对象变量保存在另外一个数组中，而不是对象本身的成员变量

```php
<?php 
class MethodTest
{
    private $data = array();

    public function __set($name, $value){
        $this->data[$name] = $value;
    }

    public function __get($name){
        if(array_key_exists($name, $this->data))
            return $this->data[$name];
        return NULL;
    }

    public function __isset($name){
        return isset($this->data[$name])
    }

    public function unset($name){
        unset($this->data[$name]);
    }
}
?>
```

### `__sleep()`和`__wakeup()`
当我们在执行`serialize()`和`unserialize()`时，会先调用这两个函数。例如我们在序列化一个对象时，这个对象有一个数据库链接，想要在反序列化中恢复链接状态，则可以通过重构这两个函数来实现链接的恢复。例子如下：

```php
<?php
class Connection 
{
    protected $link;
    private $server, $username, $password, $db;
    
    public function __construct($server, $username, $password, $db)
    {
        $this->server = $server;
        $this->username = $username;
        $this->password = $password;
        $this->db = $db;
        $this->connect();
    }
    
    private function connect()
    {
        $this->link = mysql_connect($this->server, $this->username, $this->password);
        mysql_select_db($this->db, $this->link);
    }
    
    public function __sleep()
    {
        return array('server', 'username', 'password', 'db');
    }
    
    public function __wakeup()
    {
        $this->connect();
    }
}
?>
```

### `__toString()`
对象当成字符串时的回应方法。例如使用`echo $obj;`来输出一个对象

```php
<?php
// Declare a simple class
class TestClass
{
    public function __toString() {
        return 'this is a object';
    }
}

$class = new TestClass();
echo $class;
?>
```

这个方法只能返回字符串，而且不可以在这个方法中抛出异常，否则会出现致命错误。

### `__invoke()`
调用函数的方式调用一个对象时的回应方法。如下

```php
<?php
class CallableClass 
{
    function __invoke() {
        echo 'this is a object';
    }
}
$obj = new CallableClass;
var_dump(is_callable($obj));
?>
```

### `__set_state()`
调用`var_export()`导出类时，此静态方法会被调用。

```php
<?php
class A
{
    public $var1;
    public $var2;

    public static function __set_state ($an_array) {
        $obj = new A;
        $obj->var1 = $an_array['var1'];
        $obj->var2 = $an_array['var2'];
        return $obj;
    }
}

$a = new A;
$a->var1 = 5;
$a->var2 = 'foo';
var_dump(var_export($a));
?>
```

### `__clone()`
当对象复制完成时调用。例如在[设计模式详解及PHP实现：单例模式](http://yansu.org/2014/04/19/sigleton-design-pattern.html)一文中提到的单例模式实现方式，利用这个函数来防止对象被克隆。

```php
<?php 
public class Singleton {
    private static $_instance = NULL;

    // 私有构造方法 
    private function __construct() {}

    public static function getInstance() {
        if (is_null(self::$_instance)) {
            self::$_instance = new Singleton();
        }
        return self::$_instance;
    }

    // 防止克隆实例
    public function __clone(){
        die('Clone is not allowed.' . E_USER_ERROR);
    }
}
?>
```

## 魔术常量(Magic constants)
PHP中的常量大部分都是不变的，但是有8个常量会随着他们所在代码位置的变化而变化，这8个常量被称为魔术常量。

- `__LINE__`，文件中的当前行号
- `__FILE__`，文件的完整路径和文件名
- `__DIR__`，文件所在的目录
- `__FUNCTION__`，函数名称
- `__CLASS__`，类的名称
- `__TRAIT__`，Trait的名字
- `__METHOD__`，类的方法名
- `__NAMESPACE__`，当前命名空间的名称

这些魔术常量常常被用于获得当前环境信息或者记录日志。

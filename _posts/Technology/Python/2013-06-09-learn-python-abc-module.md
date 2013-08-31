---
layout: post
title: 学习Python的ABC模块
category: 技术
tags: Python
keywords: Python ABC module
description: 在学习stevedore时，需要先了解python的abc module
---

### 1.abc模块作用
Python本身不提供抽象类和接口机制，要想实现抽象类，可以借助abc模块。ABC是Abstract Base Class的缩写。

### 2.模块中的类和函数
#### abc.ABCMeta
这是用来生成抽象基础类的元类。由它生成的类可以被直接继承。

    from abc import ABCMeta

    class MyABC:
        __metaclass__ = ABCMeta

    MyABC.register(tuple)

    assert issubclass(tuple, MyABC)
    assert isinstance((), MyABC)

上面这个例子中，首先生成了一个MyABC的抽象基础类，然后再将tuple变成它的虚拟子类。然后通过issubclass或者isinstance都可以判断出tuple是不是出于MyABC类。

另外，也可以通过复写`__subclasshook__(subclass)`来实现相同功能，它必须是classmethod

    class Foo(object):
        def __getitem__(self, index):
            ...
        def __len__(self):
            ...
        def get_iterator(self):
            return iter(self)

    class MyIterable:
        __metaclass__ = ABCMeta

        @abstractmethod
        def __iter__(self):
            while False:
                yield None

        def get_iterator(self):
            return self.__iter__()

        @classmethod
        def __subclasshook__(cls, C):
            if cls is MyIterable:
                if any("__iter__" in B.__dict__ for B in C.__mro__):
                    return True
            return NotImplemented

    MyIterable.register(Foo)

#### abc.abstractmethod(function)
表明抽象方法的生成器

    class C:
        __metaclass__ = ABCMeta
        @abstractmethod
        def my_abstract_method(self, ...):
            ...

#### abc.abstractproperty([fget[,fset[,fdel[,doc]]]])
表明一个抽象属性

    class C:
        __metaclass__ = ABCMeta
        @abstractproperty
        def my_abstract_property(self):
            ...

上例只是只读属性，如果是读写属性，可以如下：

    class C:
        __metaclass__ = ABCMeta
        def getx(self): ...
        def setx(self, value): ...
        x = abstractproperty(getx, setx)
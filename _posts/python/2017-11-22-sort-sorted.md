---
layout: post
title: Python里的sort和sorted
category: Python
tags: Python, sort, sorted
keywords: Python, sort, sorted
---


在学到几个列表操作函数的时候，一直把sort和sorted傻傻分不清。。

 sorted(list_name)
 list_name.sort()

。。。

```
>>>list = [1,4,7,8,5,2,3,6,9]
>>>sorted(list)
[1, 2, 3, 4, 5, 6, 7, 8, 9]
>>>list
[1, 4, 7, 8, 5, 2, 3, 6, 9]
>>> type(sorted(list))
<class 'list'>
```

sorted(list)本身就是个临时新建的列表？

再试试：

```
>>> list = [1,4,7,9,6,3]
>>> sorted(list)
[1, 3, 4, 6, 7, 9]
```

查看下官方help：

```
>>> help(sorted)
Help on built-in function sorted in module builtins:

sorted(iterable, /, *, key=None, reverse=False)
    Return a new list containing all items from the iterable in ascending order.

    A custom key function can be supplied to customize the sort order, and the
    reverse flag can be set to request the result in descending order.
```

对比下sort：

```
>>> help(list.sort)
Help on built-in function sort:

sort(...) method of builtins.list instance
    L.sort(key=None, reverse=False) -> None -- stable sort *IN PLACE*
```

也就是说，sorted() 是个全局函数，function

而list.sort 的 sort() 只是 list 对象的局部（内部）函数，也叫 method() 方法。

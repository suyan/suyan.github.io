---
layout: post
title: python包工具之间的关系
category: 技术
tags: Python
description: Python打包工具之间的区别和关系，有助于在新项目中做好选择，转载自他人
---
从下面部分可以大致了解一下各个工具的由来和区别，推荐[Python打包工具](http://www.ituring.com.cn/article/19090)这篇文章，来自图灵社区的一篇翻译文，很详细的解释了Python打包工具的发展。

下面部分转载自:[Yang Yubo's blog](http://blog.yangyubo.com/2012/07/27/python-packaging/)

---
当前的包管理工具链是 easy_install/pip + distribute/setuptools + distutils, 显得较为混乱。

而将来的工具链组合非常简单：pip + distutils2

### distutils 
Python 自带的基本安装工具, 适用于非常简单的应用场景; 使用:

为项目创建 setup.py 脚本

执行 setup.py install 可进行安装
### setuptools
针对 distutils 做了大量扩展, 尤其是加入了包依赖机制. 在部分 Python 子社区已然是事实上的标准;
### distribute
由于 setuptools 开发进度缓慢, 不支持 Python 3, 代码混乱, 一帮程序员另起炉灶, 重构代码, 增加功能, 希望能够取代 setuptools 并被接纳为官方标准库, 他们非常努力, 在很短的时间便让社区接受了 distribute;
### easy_install
setuptools 和 distribute 自带的安装脚本, 也就是一旦 setuptools 或 distribute 安装完毕, easy_install 也便可用. 最大的特点是自动查找 Python 官方维护的包源 PyPI , 安装第三方 Python 包非常方便; 使用:

setuptools / distribute 都只是扩展了 distutils
easy_install [PACKAGE_NAME] 自动从 PyPI 查找/下载/安装指定的包;

### pip
pip 的目标非常明确 – 取代 easy_install. easy_install 有很多不足: 安装事务是非原子操作, 只支持 svn, 没有提供卸载命令, 安装一系列包时需要写脚本; pip 解决了以上问题, 已俨然成为新的事实标准, virtualenv 与它已经成为一对好搭档; 使用:

  安装: pip install [PACKAGE_NAME]
  卸载: pip uninstall [PACKAGE_NAME]
  支持从任意能够通过 VCS 或浏览器访问到的地址安装 Python 包

### distutils2 
setuptools 和 distribute 的诞生是因为 distutils 的不济, 进而导致目前分化的状况. 而 Guido 并未接纳 distribute 为官方标准, 并说明了原因. 开发者在失落之余明确了新的方向和任务 – distutils2, 它将成为 Python 3.3 的标准库 packaging , 并在其它版本中以 distutils2 的身份出现; 换句话说, 它和 pip 将联手结束目前混乱的状况;

### zc.buildout
这是一个臃肿的安装、部署系统, 在 Zope 社区运用教广, 功能强大/繁复但使用场景有限, 除非确有需要, 不值得投入太多的精力去研究, pip + virtualenv + fabric 的工具链组合更为简单、灵活.

### 参考
[Why use pip over easy_install?](http://stackoverflow.com/questions/3220404/why-use-pip-over-easy-install)

[Differences between distribute, distutils and setuptools?](http://stackoverflow.com/questions/6344076/differences-between-distribute-distutils-and-setuptools)

[Current State of Packaging](http://guide.python-distribute.org/introduction.html#current-state-of-packaging)

[Future of Packaging](http://guide.python-distribute.org/future.html)

[The fate of Distutils – Pycon Summit + Packaging Sprint detailed report](http://tarekziade.wordpress.com/2010/03/03/the-fate-of-distutils-pycon-summit-packaging-sprint-detailed-report/)

[A Quick Diff between Distutils and Distutils2](http://wokslog.wordpress.com/2011/06/04/distutils-diff/)

[5 tips for packaging your Python projects](http://tarekziade.wordpress.com/2011/08/19/5-tips-for-packaging-your-python-projects/)

---
---
layout: post
title: Vim配置常用资源
category: 资源
tags: Vim配置
keywords: Vim配置
description: 
---

# 基本配置
    
    "开启语法高亮
    syntax on
    "依文件类型设置自动缩进
    filetype indent plugin on
     
    "显示当前的行号列号：
    set ruler
    "在状态栏显示正在输入的命令
    set showcmd
     
    "关闭/打开配对括号高亮
    "NoMatchParen
    DoMatchParen

    "显示行号：
    set number
    "为方便复制，用<F2>开启/关闭行号显示:
    nnoremap <F2> :set nonumber!<CR>:set foldcolumn=0<CR>

    "启用Modeline（即允许被编辑的文件以注释的形式设置Vim选项
    set modeline

    "为深色背景调整配色
    set background=dark

# 插件管理

下文的配置很多都依赖于第三方开发的 Vim 插件。为了方便地安装和维护这些插件，推荐先安装一种插件管理工具，目前较为流行的是 Vundle 和 pathogen。二者功能类似，但 Vundle 的配置更灵活， pathogen 则相对简洁。二者都能很好地与Git结合，安装插件十分方便。
    
    # 在存放配置文件的主文件夹下，添加一个 submodule
    git submodule add https://github.com/gmarik/vundle.git .vim/bundle/vundle
     
    # 用类似的办法添加多个插件后，以后升级插件只需：
    git submodule update
     
    # 如果其它电脑 checkout 出配置文件后，要先：
    git submodule init

插件管理工具无需通过系统的包管理系统安装，只要将需要的文件放在 ~/.vim/ 目录中即可。这样，一套配置文件也可以方便地用在多个不同的系统环境中。

# 代码补全

Vim 7已经内置了代码补全功能[6]，补全操作可分为两种：
关键字补全
即简单地补全到文档中已有的词，快捷键为 Ctrl-N 或 Ctrl-P。
智能补全
Vim 7中引入 Omni Complete，可根据语义补全，快捷键为 Ctrl-X Ctrl-O。
Vim的补全菜单操作方式与一般IDE的方式不同，可加入如下设置[7]：

    "让Vim的补全菜单行为与一般IDE一致(参考VimTip1228)
    set completeopt+=longest
     
    "离开插入模式后自动关闭预览窗口
    autocmd InsertLeave * if pumvisible() == 0|pclose|endif
     
    "回车即选中当前项
    inoremap <expr> <CR>       pumvisible() ? "\<C-y>" : "\<CR>"
 
    "上下左右键的行为
    inoremap <expr> <Down>     pumvisible() ? "\<C-n>" : "\<Down>"
    inoremap <expr> <Up>       pumvisible() ? "\<C-p>" : "\<Up>"
    inoremap <expr> <PageDown> pumvisible() ? "\<PageDown>\<C-p>\<C-n>" : "\<PageDown>"
    inoremap <expr> <PageUp>   pumvisible() ? "\<PageUp>\<C-p>\<C-n>" : "\<PageUp>"

如需自动补全，可安装AutoComplPop插件，安装后如需在补全是显示文档（预览），可加入设置：
    
    let g:acp_completeoptPreview = 1

# 注释管理

经常要将一段代码注释掉或取消注释，而尤其对于某些只支持单行注释的语言来说，逐行加注释很麻烦，这时快速注释（或取消注释）代码的插件就显得很有用了。

常见的注释管理插件为The NERD Commenter，默认支持多种语言，使用方法也很简单：只需在可视(V)模式中选择一段代码，按下\cc加逐行注释，\cu取消注释，\cm添加块注释。

如有其它需求，也可考虑comments、EnhCommentify等插件。

# 缩进

使用自动缩进可能需要设置，vim中对自动缩进的详细设置办法见Vim代码缩进设置。

在不同的模式中调整缩进的方法不同：

插入模式
Ctrl-T增加缩进，Ctrl-D减小缩进。
命令模式
>> 右缩进， << 左缩进，注意n<< 或 n>>是缩进多行，如4>>
可视模式
< 、 > 用于左右缩进， n< 、 n> 可做多节缩进，如 2> 。
另外，= 可对选中的部分进行自动缩进；]p可以实现p的粘贴功能，并自动缩进。

# 代码浏览与跳转

代码跳转类似于IDE中的Ctrl+点击功能。与代码补全类似，代码浏览工具亦可分为基于文本分析的和基于代码理解的两类。

简单代码跳转
在命令模式下可直接使用下述指令：[8]

跳转到定义
gd到局部变量的定义，gD到全局变量的定义
搜索
*, # 可对光标处的词向前/向后做全词搜索，g*, g# 做相对应的非全词匹配搜索
代码块首尾
[[, ]] 可跳到当前代码块起始或结束的大括号处。
括号首尾
% 可在配对的括号、块首尾之前跳转。
位置历史
Ctrl-O 在历史记录中后台，Ctrl-I 则为前进。

基于代码理解的跳转
该功能依赖于ctags工具。[9]安装好ctags后，在存放代码的文件夹运行

    ctags -R .

即可生成一个描述代码结构的tags文件。
-ctags的功能很强大，更详细的配置请参考其文档。

建议在~/.vimrc中添加如下配置以使Vim在父目录中寻找tags文件[10]：

    set tags=tags;/

设置好后，可在Vim中使用如下功能：Ctrl-]转至最佳匹配的相应Tag，Ctrl-T返回上一个匹配。如果有多个匹配，g Ctrl-]可显示所有备选的tags。如有需要，可互换Ctrl-]和g Ctrl-] [11]：

    "在普通和可视模式中，将<c-]>与g<c-]>互换
    nnoremap <c-]> g<c-]>
    vnoremap <c-]> g<c-]>
     
    nnoremap g<c-]> <c-]>
    vnoremap g<c-]> <c-]>

就地编译和错误处理

使用:make可调用make命令编译程序，配合Vim内置的QuickFix功能，可以像IDE一样打开一个窗口展示编译错误和警告，通过它还可以方便地跳转到各编译错误的产生位置。

常用的命令有:cw[indow]（如有错误打开quickfix窗口）、:cn（跳到下一个错误）、:cp（跳到前一个错误）等，具体可:help quickfix。

如果想在有错时自动打开quickfix窗口[12]：

    " 编译后，如有错误则打开quickfix窗口。（光标仍停留在源码窗口）
    "
    " 注意：需要开启netsting autocmd
    autocmd QuickFixCmdPost [^l]* nested cwindow
    autocmd QuickFixCmdPost    l* nested lwindow

默认情况下，:mak[e]会跳转到第一个错误，如果不想启用这个功能，请使用:make!。

# 代码折叠
代码较长时可启用代码折叠功能，如按语法高亮元素折叠：
    
    set foldmethod=syntax
    "默认情况下不折叠
    set foldlevel=99

随后即可使用z系列命令管理代码折叠。如za会翻转当前位置的折叠状态，zA会递归翻转当前层所有代码的折叠状态等。当然也可以把功能键映射到za:

    map <F3> za

查看文档
K 键可用于查看当前函数的文档。

# 其它插件
近来仍被积极维护的代码托管在 GitHub 上的插件[13]：

[Fugitive](https://github.com/tpope/vim-fugitive/)
让 Vim 更好地与 Git 整合。
[Powerline](https://github.com/Lokaltog/vim-powerline)
炫丽实用的状态栏
[Tagbar](http://majutsushi.github.com/tagbar/)
比 taglist 更现代的代码结构浏览工具
[The NERD tree](https://github.com/scrooloose/nerdtree)
以树形结构浏览文件夹中的文件
[Syntastic](https://github.com/scrooloose/syntastic)
语法检查
[surround.vim](https://github.com/tpope/vim-surround)
快速删除/修改光标周围配对的括号
其它常用插件[14]：

[Project](http://www.vim.org/scripts/script.php?script_id=69)
方便管理工程中的文件
[snipmate.vim](http://www.vim.org/scripts/script.php?script_id=2540)
在编辑中实现模板展开
[a.vim](http://www.vim.org/scripts/script.php?script_id=31)
在.cpp/.h等文件对中跳转
[matchit.zip](http://www.vim.org/scripts/script.php?script_id=39)
增强%的功能
[winmanager](http://www.vim.org/scripts/script.php?script_id=95)
将文件管理窗口和taglist堆叠起来。

# 相关文档
[配置基于Vim的Python编程环境](http://linux-wiki.cn/wiki/%E9%85%8D%E7%BD%AE%E5%9F%BA%E4%BA%8EVim%E7%9A%84Python%E7%BC%96%E7%A8%8B%E7%8E%AF%E5%A2%83)
[让vim自动判断中文编码](http://linux-wiki.cn/wiki/%E8%AE%A9vim%E8%87%AA%E5%8A%A8%E5%88%A4%E6%96%AD%E4%B8%AD%E6%96%87%E7%BC%96%E7%A0%81)

# 参考资料
- [How to setup VIM properly for editing Python files - *.py (StackOverflow)](http://stackoverflow.com/questions/65076/how-to-setup-vim-properly-for-editing-python-files-py)
- [amix的vimrc](http://amix.dk/vim/vimrc.html)
- [Python and vim: Make your own IDE (2009.2)](http://dancingpenguinsoflight.com/2009/02/python-and-vim-make-your-own-ide/)
- [Python官网上的Vim介绍](http://wiki.python.org/moin/Vim)
- [Git Tools - Submodules](http://git-scm.com/book/en/Git-Tools-Submodules)
- [细说 Vim 7 之新特性-LinuxToy](http://linuxtoy.org/archives/vim_7_new_features.html)
- [VimTip 1228: Improve completion popup menu](http://vim.wikia.com/wiki/VimTip1228)
- [Browsing programs with tags -- Vim Tips Wiki](http://vim.wikia.com/wiki/Browsing_programs_with_tags)
- [Vim and Ctags tips and tricks](http://stackoverflow.com/questions/563616/vim-and-ctags-tips-and-tricks)
- [use :tjump instead of :tag vim on pressing ctrl-] (StackOverflow)](http://stackoverflow.com/questions/7640663/use-tjump-instead-of-tag-vim-on-pressing-ctrl)
- [Automatically open the quickfix window on :make](http://vim.wikia.com/wiki/Automatically_open_the_quickfix_window_on_:make)
- [LinuxTOY Xu Xiaodong 的VimEnv](https://github.com/xuxiaodong/vimenv)
- [手把手教你把Vim改装成一个IDE编程环境(图文)](http://blog.csdn.net/wooin/article/details/1858917)
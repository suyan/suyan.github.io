---
layout: post
title: win7快速打开应用程序或文件
category: 工具
tags: Windows
description: windows下打开文件或应用程序经常需要手点，作为键盘控肯定是不能忍受的。之前试过一些软件，设置各个程序的快捷键，但是快捷键可能会有冲突，而且记性不好实在不好用，所以选择使用Win自带的“运行”来加快打开速度
---

Win7下打开“运行”的快捷键是 Win+R

## 打开系统命令
windows的“运行”功能本来就是帮助用户快速打开程序的，不过其支持的主要是系统的一些程序，大致如下(来自网络，有一部分失效或无法打开)：

    1、cleanmgr: 打开磁盘清理工具 
    2、compmgmt.msc: 计算机管理 
    3、conf: 启动系统配置实用程序 
    4、charmap: 启动字符映射表 
    5、calc: 启动计算器 
    6、chkdsk.exe: Chkdsk磁盘检查 
    7、cmd.exe: CMD命令提示符 
    8、certmgr.msc: 证书管理实用程序 
    9、Clipbrd: 剪贴板查看器 
    10、dvdplay: DVD播放器 
    11、diskmgmt.msc: 磁盘管理实用程序 
    12、dfrg.msc: 磁盘碎片整理程序 
    13、devmgmt.msc: 设备管理器 
    14、dxdiag: 检查DirectX信息 
    15、dcomcnfg: 打开系统组件服务 
    16、explorer: 打开资源管理器 
    17、eventvwr: 事件查看器 
    18、eudcedit: 造字程序 
    19、fsmgmt.msc: 共享文件夹管理器 
    20、gpedit.msc: 组策略 
    21、iexpress: 工具，系统自带 
    22、logoff: 注销命令 
    23、lusrmgr.msc: 本机用户和组 
    24、MdSched:来启动Windows内存诊断程序 
    25、mstsc: 远程桌面连接 
    26、Msconfig.exe: 系统配置实用程序 
    27、mplayer2: 简易widnows media player 
    28、mspaint: 画图板 
    29、magnify: 放大镜实用程序 
    30、mmc: 打开控制台 
    31、mobsync: 同步命令 
    32、notepad: 打开记事本 
    33、nslookup: 网络管理的工具向导 
    34、narrator: 屏幕“讲述人” 
    35、netstat : an(TC)命令检查接口 
    36、OptionalFeatures：打开“打开或关闭Windows功能”对话框 
    37、osk: 打开屏幕键盘 
    38、perfmon.msc: 计算机性能监测程序 
    39、regedt32: 注册表编辑器 
    40、rsop.msc: 组策略结果集 
    41、regedit.exe: 注册表 
    42、services.msc: 本地服务设置 
    43、sysedit: 系统配置编辑器 
    44、sigverif: 文件签名验证程序 
    45、shrpubw: 创建共享文件夹 
    46、secpol.msc: 本地安全策略 
    47、syskey: 系统加密 
    48、Sndvol: 音量控制程序 
    49、sfc.exe: 系统文件检查器 
    50、sfc /scannow: windows文件保护（扫描错误并复原） 
    51、taskmgr: 任务管理器 
    52、utilman: 辅助工具管理器 
    53、winver: 检查Windows版本 
    54、wmimgmt.msc: 打开windows管理体系结构(WMI) 
    55、Wscript.exe: windows脚本宿主设置 
    56、write: 写字板 
    57、wiaacmgr: 扫描仪和照相机向导 
    58、psr：问题步骤记录器 
    59、PowerShell：提供强大远程处理能力 
    60、colorcpl：颜色管理，配置显示器和打印机等中的色彩。 
    61、credwiz：备份或还原储存的用户名和密码 
    62、eventvwr：事件查看器管理单元(MMC) ，主要用于查看系统日志等信息。 
    63、wuapp：Windows更新管理器，建议设置为更新提醒模式 
    64、wf.msc：高级安全Windows防火墙 
    65、soundrecorder：录音机，没有录音时间的限制 
    66、snippingtool：截图工具，支持无规则截图 
    67、slui：Windows激活，查看系统激活信息 
    68、sdclt：备份状态与配置，就是查看系统是否已备份 
    69、Netplwiz：高级用户帐户控制面板，设置登陆安全相关的选项 
    70、msdt：微软支持诊断工具 
    71、lpksetup：语言包安装/删除向导，安装向导会提示下载语言包

系统自带的很多已经够用了，例如其中的notepad命令，想要直接修改hosts文件（常用）可以直接输入

    notepad %systemroot%\system32\drivers\etc\hosts

%systemroot%是window内自带的变量，即指向了C:\Windows,其他一些常用变量如：

    %HOMEDRIVE% = C:\          当前启动的系统的所在分区 
    %SystemRoot% = C:\WINDOWS          当前启动的系统的所在目录 
    %windir% = %SystemRoot% = C:\WINDOWS          当前启动的系统的所在目录 
    %USERPROFILE% = C:\Documents and Settings\sihochina          当前用户数据变量 
    %HOMEPATH% = C:\Documents and Settings\sihochina          当前用户环境变量 
    %temp% = %USERPROFILE%\Local Settings\Temp = C:\Documents and Settings\sihochina\Local Settings\Temp          当前用户TEMP缓存变量 

另外输入盘符可直达相应盘符，文件也是

    d:
    d:\application

## 自定义命令

只有系统的应用程序是不够我们用的，要想增加自己另外安装的程序，可以通过其他手段实现

### 方法一：修改环境变量(不推荐)

经常使用cmd命令的同学应该明白，放在环境变量中的文件夹下的应用程序，可以在任何位置直接运行，因为环境变量是windows搜索应用程序的路径，直接放在环境变量下文件夹中的应用程序可以直接运行。

    1. 计算机（右键）-》属性-》高级系统设置-》环境变量
    2. 修改PATH值，在其后增加相应路径，用‘;’隔开
  
之所以不推荐是因为环境变量如果设太多，一是管理不便，二又会拖慢应用程序打开速度。

### 方式二:快捷方式(推荐)

这种方式和第一种类似，但是不是修改环境变量，而是往已有的环境变量中增加应用程序的快捷方式

    1. 右键应用程序-》发送到桌面快捷方式
    2. 修改名字为想要打开的命令
    3. 移动快捷方式到已有环境变量中，如C:\windows下

### 方式三：注册表方式(不推荐)

修改注册表实现，太繁琐，不容易控制

### 方式四：软件方式（推荐）

有一些软件可以帮助建立这样的命令，具体方式因软件而异，但是它们会把功能做的比较人性化，如可以实现增加、更新、删除等

魔方有这个功能，我用的就是这个

    打开魔方-》优化设置大师-》系统设置-》快捷命令

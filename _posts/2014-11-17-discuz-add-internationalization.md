---
layout: post
title: 给Discuz加上国际化功能
category: 技术
tags: Discuz
description: Discuz是国内一个比较成熟的开源论坛系统，可惜的是不支持国际化语言支持
---

## 准备工作

### 初始化部署到一个可安装运行的环境中

到[官方下载](http://download.comsenz.com/DiscuzX/3.2/Discuz_X3.2_SC_UTF8.zip)最新的安装包，强烈建议使用UTF8编码包。安装好并可以正常打开前台后台页面，然后开始下面的步骤。

### 统一替换路径

在discuz/source/plugin/目录中查找 "'source/language/"
在2014.11.14下载的官方安装包中共有四处，替换为 "'./source/language/"
该步骤是因为源代码的写法不统一，此处替换为方便后面的一次性替换所有


  /media/lee/DATA/www/test/discuz/source/plugin/qqconnect/install.php:166行
  /media/lee/DATA/www/test/discuz/source/plugin/qqconnect/upgrade.php:129行
  /media/lee/DATA/www/test/discuz/source/plugin/security/install.php:76行
  /media/lee/DATA/www/test/discuz/source/plugin/security/upgrade.php:56行


### 全局替换语言包路径

全局查找 "'./source/language/" 替换为 "LANGUAGE_PATH.'"


  /media/lee/DATA/www/test/Discuz/upload/source/class/optimizer/optimizer_setting.php
  /media/lee/DATA/www/test/Discuz/upload/source/function/function_core.php
  /media/lee/DATA/www/test/Discuz/upload/source/language/lang_admincp.php
  /media/lee/DATA/www/test/Discuz/upload/source/module/misc/misc_mobile.php
  /media/lee/DATA/www/test/Discuz/upload/source/plugin/manyou/Service/Server/Security.php
  /media/lee/DATA/www/test/Discuz/upload/source/plugin/qqconnect/install.php
  /media/lee/DATA/www/test/Discuz/upload/source/plugin/qqconnect/upgrade.php
  /media/lee/DATA/www/test/Discuz/upload/source/plugin/security/install.php
  /media/lee/DATA/www/test/Discuz/upload/source/plugin/security/upgrade.php
  11 matches across 9 files

替换完毕之后保存全部

### 修改全局配置定义语言包路径

在config/config_global.php末尾加入如下代码

      /**
       *      [DiscuzX3.2] Language Internationalized.
       *      By clh021@gmail.com
       */
      //------------  Language Internationalized  [BEGIN] -----------
      function DectLang(){
          $language = explode(",", $_SERVER["HTTP_ACCEPT_LANGUAGE"]);
          array_key_exists("language", $_COOKIE) && $language = $_COOKIE['language'];
          array_key_exists("language", $_GET) && $language = $_GET['language'];
          $language = $language ? $language : 'zh-CN';
          $language = file_exists(DISCUZ_ROOT.'./source/language/'.$language) ? $language : 'zh-CN';
          setcookie('language', $language, time() + 3600 * 24 * 365);
          return $language;
      }
      define('LANGUAGE', DectLang());
      define('LANGUAGE_PATH', './source/language/'.LANGUAGE.'/');
      //------------  Language Internationalized  [END] -----------


### 安装语言包

将discuz/source/language/*下的全部文件移动到discuz/source/language/zh-CN/*即可支持国际化中文语言
"zh-CN"来自于浏览器
将zh-CN 复制两份，分别命名为 zh-TW,en-US
分别翻译好下列文件及后面的对应的提示值，以查看最终语言切换的效果

    #discuz/source/language/zh-CN/forum/lang_template.php
    #可以不用翻译
    #discuz/source/language/zh-TW/forum/lang_template.php
    welcome_new_members -> 歡迎新會員
    #discuz/source/language/en-US/forum/lang_template.php
    welcome_new_members -> Welcome new members


### 在页面中添加语言切换链接

discuz/template/default/common/header.htm 第64行  也是以下代码

    <!--{/loop}-->
    <!--{hook/global_cpnav_extra1}-->

之后，添加如下代码

    <div style="float: right;position: absolute;right: 130px;">
    <a href="forum.php?language=zh-TW">繁体中文</a>
    <a href="forum.php?language=zh-CN">简体中文</a>
    <a href="forum.php?language=en-US">English</a>
    </div>

修改 source/function/function_core.php 第 631行

    $cachefile = './data/template/'.(defined('STYLEID')

修改为

    $cachefile = './data/template/'.LANGUAGE.'_'.(defined('STYLEID')

即可(其中添加了 LANGUAGE )

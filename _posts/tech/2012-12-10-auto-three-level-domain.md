---
layout: post
title: 使用PHP自动解析三级域名
category: 技术
tags: 三级域名
description:
---

···<?php
$root_url  = 'uping';
$path      = substr($_SERVER['SERVER_NAME'], 0, strpos($_SERVER['SERVER_NAME'], '.'));
$url_list  = array(
    '懂生活系列' => 'http://www.uping.sinaapp.com',
    '懂生活社区' => 'http://bbs.uping.sinaapp.com',
    '良宏博客' => 'http://lianghong.uping.sinaapp.com',
    'love' => 'http://love.uping.sinaapp.com',
    'life' => 'http://life.uping.sinaapp.com'
);
$curl_list = array(
    'bbs',
    'yohe',
    'lianghong',
    'www'
); //http://*.dongshenghuo.com
 
if ($root_url != $path) {
    if (in_array($path, $curl_list)) {
        $content = file_get_contents('http://' . $path . '.dongshenghuo.com');
        preg_match('/<title>(.*?)<\/title>/', $content, $matches);
        $title   = $matches[1];
        $content = preg_replace('/<title>(.)+<\/title>/', '<title>我的标题</title>', $content);
        echo $content;
        
    } else {
        if (file_exists($path . '/index.php')) {
            include($path . '/index.php');
        } else {
            foreach ($url_list as $key => $val) {
                echo ('<br /><a href="' . $val . '">' . $key . '</a>');
            }
        }
    }
} else {
    foreach ($url_list as $key => $val) {
        echo ('<br /><a href="' . $val . '">' . $key . '</a>');
    }
}
···
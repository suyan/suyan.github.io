---
layout: post
title: 自制简易API文档
category: 技术
tags: API
description: 常常会有一些项目简单到我们不用框架徒手开发，而调试却又必不可少所以我手上诞生了这些个小家伙。
---

公司要制作一个APP接口，自然的就需要编写一个API接口文档，原来的接口文档版面还不错，就是需要重新设计接口，重新编写，重新来过，何况还是一个静态的html，初次见面，瞬间崩溃。

这不，我立即改写，本来打算用数据库的，心想算了，那又要花我更多的功夫了，而且除了我，也不需要别人来编辑这个文档。所以我就制作了一个以数据库为基础的文档。
```
$apis = array(
    'nonce' => array(
        'title' => '安全验证',
        'des' => '通过控制器和方法名获取令牌，令牌12小时会自动更新，24小时有效<br />
            获取格式：/api/get_nonce/?controller=控制器&method=方法名<br />在进行包含有一定危险性操作时需要持有有效令牌，单纯获取资料，不做修改删除不必持有令牌',
        'content' => array(
            '令牌' => array(
                '获取与验证' => array(
                    '/api/get_nonce/?controller=auth&method=generate_auth_cookie',
                    '{"status":"ok","controller":"auth","method":"generate_auth_cookie","nonce":"0bf680a229"}',
                    '当提示nonce参数时，或提示nonce参数错误时，请重新获取该参数<br />其它方法的使用/api/contoller-name/method-name/?cookie=Catherine|1392018917|3ad7b9f1c5c2cccb569c8a82119ca4fd',
                    '今天登录操作的令牌<a href="/api/get_nonce/?controller=auth&method=generate_auth_cookie" target="_blank">点击这里测试</a>',
                ) ,
            ) ,
        ) ,
    ) , //*/
    'user' => array(
        'title' => '用户',
        'des' => '如果不能登录，请先尝试注册。',
        'content' => array(
            '登录' => array(
                '安全验证' => array(
                    '/api/get_nonce/?controller=auth&method=generate_auth_cookie',
                    '{"status":"ok","controller":"auth","method":"generate_auth_cookie","nonce":"0bf680a229"}',
                    '',
                    '<a href="/api/get_nonce/?controller=auth&method=generate_auth_cookie" target="_blank">点击这里测试</a>',
                ) ,
                '登录' => array(
                    '/api/auth/generate_auth_cookie/?nonce=0bf680a229&username=username&password=password',
                    '{"status":"ok","cookie":"leehom|1395052118|ae4c079636d453dd0a14830e826fca53","user":{"id":1,"username":"leehom","nicename":"leehom","email":"clh21@126.com","url":"","registered":"2012-12-12 12:12:12","displayname":"\u826f\u5b8f","firstname":"","lastname":"","nickname":"\u826f\u5b8f","description":"","capabilities":"","avatar":null}}',
                    '<b>注意：客户端应保存返回的cookie，这是进行其它操作的用户身份凭证。</b>',
                    '<form method="get" target="_blank" action="/api/auth/generate_auth_cookie/?">
                      nonce：<red>*</red><input type="text" name="nonce" value="">
                      用户名：<red>*</red><input type="text" name="username" value="">
                      密码：<red>*</red><input type="text" name="password" value=""><input type="submit" value="点击这里测试"></form>',
                ) ,
            ) ,
            '注册' => array(
                '注册' => array(
                '待更新'=> array('待更新','待更新','待更新','待更新'),
                ) ,
            ) ,
            '找回密码' => array(
                '待更新'=> array('待更新','待更新','待更新','待更新'),
            ) ,
        ) ,
    ) ,
);/*
```

```
*/
?>
<html>
<head><meta http-equiv="Content-Type" content="text/html; charset=utf8" /><title>麦芽</title></head>
<body>
<div id="demo2" class="demo"><span>麦芽 · API目录</span>
    <ol class="mulu">
<?php
foreach($apis as $method=>$m){
    echo '<li><a class="ca" href="#'.$method.'"> '.$m['title'].' </a>';
    $tmp='<ol>';//var_dump($m['content']);
    foreach($m['content'] as $t => $c){$tmp.='<li class="f"><a class="ca" href="#'.$t.'"> '.$t.'</a></li>';}
        $tmp.='</ol>';
        echo $tmp;
    echo '</li>';
}
?></ol>
</div>
<style>
*{font-family:arial,Helvetica,sans-serif;}
    BODY {margin:0;padding:0;border:0;}
    ol {font-size:12px;}
    .mulu {padding:0;margin:0;padding-left:20px;display:block;}
    ol ol { list-style-type: upper-alpha }
    ol ol ol{ list-style-type: lower-alpha }
    red{color:red;}b,h1{color:#003366;}h2{color:blue}
    .demo{width:180px; margin:10px;border:2px solid #003366;color:#fff; background:#003366; padding:10px;}
    #demo2{position:absolute; margin-top:66px;  right:30px;}
    .demo a{text-decoration:underline; cursor:pointer;color:#fff; }
    .demo p{line-height:20px}
</style>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
<script type="text/javascript" src="jquery.cookie.js"></script>
<script type="text/javascript" src="jquery.scroll-follow.js"></script>
<script type="text/javascript">$(function(){$("#demo2").scrollFollow({speed:800,});});</script>
    <div style="background-color: #003366;color: #FFFFFF;font-size: 26px;width: 100%;">
        <div style="padding:3 40 5 20px;">麦芽 · 官方API接口<font size='1'>更新时间：<?php echo date('Y-m-d H:i:s',filemtime (__FILE__));?></font></div>
        <div style="padding-left:20px;"><font size='1'>特别说明：本接口全部使用主流json格式进行数据传输，并提供友好错误提示。——clh021@gmail.com</font></div>
    </div>
<div style="font-size:12px;padding-left: 30px;padding-bottom: 2em;">
    <span>
        <ol><?php
foreach($apis as $method=>$m){
    echo '<li><h1 id="'.$method.'">'.$m['title'].'</h1>';
    echo $m['des']?'<span>说明：'.$m['des'].'</span>':'';
    echo '<ol>';
    //var_dump($m['content']);
    foreach($m['content'] as $tittle=>$func){
        echo '';
            echo '<li><h2 id="'.$tittle.'">'.$tittle.'</h2><ol>';
            if(count($func)>1){
                foreach($func as $k=>$v){
                    echo '<li><h3>'.$k.'</h3><p>获取方式：'.$v[0].'</p><p>返回示例：'.$v[1].'</p>';
                    echo !empty($v[2])?'<p>补充说明：'.$v[2].'</p>':'';
                    echo !empty($v[3])?'<p><fieldset><legend>测试</legend>'.$v[3].'</fieldset>':'';
                    echo '</li>';
                }
            }else{
                foreach($func as $k=>$v){
                    echo '<p>获取方式：'.$v[0].'</p><p>返回示例：'.$v[1].'</p>';
                    echo !empty($v[2])?'<p>补充说明：'.$v[2].'</p>':'';
                    echo !empty($v[3])?'<p><fieldset><legend>测试</legend>'.$v[3].'</fieldset>':'';
                }
            }
        echo '</ol></li>';
    }
    echo '</ol></li>';
}
?></ol>
    </span>
</div>
<script type="text/javascript" src="jquery.cookie.js"></script>
<script type="text/javascript" src="jquery.scroll-follow.js"></script>
</body>
</html>
<?php
/**/
?>
```

这不，一个API文档就搞定了，随处滑动的目录，观看者也十分方便。想要的拿去吧。
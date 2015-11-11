---
layout: post
title: 我的测试代码
category: 技术
tags: Test
description: 常常会有一些项目简单到我们不用框架徒手开发，而调试却又必不可少所以我手上诞生了这些个小家伙。
---
用法：

在代码中直接使用logs($要截取显示的变量，单条日志名以备注区分打印值的意义，日志文件名默认是logs不用.php后缀)

在logs.php日志文件打开网页地址即可查看日志，同时后面可跟上clearlog参数，附上任意值，即可清理当前日志文件。

    //Log0.2版本
    //Copyright (c) , 2011 , clh021@gmail.com
    //Author: chenlianghong (clh021@gmail.com)
    < ?php
    function logs($str = '',$title = '',$name=''){
            ob_start();var_dump($str);$str = ob_get_contents();ob_end_clean();
            $user_IP = empty($_SERVER["HTTP_VIA"]) ? $_SERVER["REMOTE_ADDR"] : $_SERVER["HTTP_X_FORWARDED_FOR"];
            $user_IP = empty($user_IP) ? $_SERVER["REMOTE_ADDR"] : $user_IP;$w=$_SERVER["DOCUMENT_ROOT"];
            $client_agent = $_SERVER['HTTP_USER_AGENT'];
     $name=empty($name)?'logs':str_replace('/','_',$name);
     $fp=$w.'/'.$name.".php";
            if(filesize($fp)>1000*1000){
        if(!is_dir($w.'/log')){mkdir($w.'/log',0777);}
        rename($fp,$w.'/log/'.$name.date('Ymdhis').'.php');
      }
            $content =file_get_contents($fp);
            $head=empty($content)?'<?php if(!empty($_REQUEST["clearlog"])) {file_put_contents("'.$fp.'","");}?><style>*{font-size:12px;}</style>':'';
            $content .= $head.'<hr />'.date("Y-m-d H:i:s").'_______<font color="red";>'.$title.'</font><br /><font color="blue";>Client Info:'.$user_IP.','.$client_agent.'</font><br />'.$str;
            file_put_contents($fp,$content);
    }}
    ?>


    //Log0.3版本
    //Copyright (c) , 2012 , clh021@gmail.com
    //Author: chenlianghong (clh021@gmail.com)<?php
    function logs($S = '',$T = '',$N=''){
        $C=array('SPLIT'=>true,'MAXSIZE'=>1000);
            ob_start();var_dump($S);$S = ob_get_contents();ob_end_clean();
            $ip = empty($_SERVER["HTTP_VIA"]) ? $_SERVER["REMOTE_ADDR"] : $_SERVER["HTTP_X_FORWARDED_FOR"];
            $ip = empty($ip) ? $_SERVER["REMOTE_ADDR"] : $ip;
            $N=empty($N)?'logs':str_replace('/','_',$N);

            $W=$_SERVER["DOCUMENT_ROOT"];
            $fp=$W.'/'.$N.".php";
            if($C['SPLIT'] && (filesize($fp)>1000*$C['MAXSIZE'])){
                if(!is_dir($W.'/log')){mkdir($W.'/log',0777);}
                rename($fp,$W.'/log/'.$N.date('Ymdhis').'.php');}

            $Ct =file_get_contents($fp);
            $H=empty($Ct)?'<?php if(!empty($_REQUEST["clearlog"])) {file_put_contents("'.$fp.'","");}?><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><style>*{font-size:12px;}t{color:#ff0000;}d{color:#0066CC;}g{color:#009900;}w{color:#743a3a;}</style><script src="http://code.jquery.com/jquery-latest.js"></script>
    <script type="text/javascript">$(document).ready(function(){
    function _(url,txt){
        return("<a target=_blank href="+url+">×</a>");
        var result=$.getJSON(url,function(data){return data;}).error(
            function(){
                return("<a target=_blank href="+url+">×</a>");
            }
        );
    }
          $("d").click(function(){
    $(this).after(" <w>["+_("http://int.dpool.sina.com.cn/iplookup/iplookup.php?ip="+$(this).text())+"]</w>");
          });
          $("g").click(function(){
    $(this).after(" <w>["+_("http://www.useragentstring.com?getText=all&uas="+$(this).text())+"]</w>");
          });
    });</script>':'';
            $Ct .= $H.'<hr/>'.date("Y-m-d H:i:s").substr(microtime(),1,8).' <t>'.$T.'</t><br />Client Info:<d>'.$ip.'</d>,<g>'.$_SERVER['HTTP_USER_AGENT'].'</g><br />'.$S;
            file_put_contents($fp,$Ct);
    }



    //Log0.3.1版本
    //Copyright (c) , 2012 , clh021@gmail.com
    //Author: chenlianghong (clh021@gmail.com)<?php
    if (!function_exists('logs')) {
    function logs($S = '',$T = '',$N=''){
        $C=array('SPLIT'=>true,'MAXSIZE'=>1000);
            ob_start();var_dump($S);$S = ob_get_contents();ob_end_clean();
            $ip = empty($_SERVER["HTTP_VIA"]) ? $_SERVER["REMOTE_ADDR"] : $_SERVER["HTTP_X_FORWARDED_FOR"];
            $ip = empty($ip) ? $_SERVER["REMOTE_ADDR"] : $ip;
            $N=empty($N)?'logs':str_replace('/','_',$N);
     
            $W=$_SERVER["DOCUMENT_ROOT"];
    //        $W=dirname($_SERVER["SCRIPT_FILENAME"]);
            $fp=$W.'/'.$N.".php";
            if($C['SPLIT'] && (filesize($fp)>1000*$C['MAXSIZE'])){
                if(!is_dir($W.'/log')){mkdir($W.'/log',0777);}
                rename($fp,$W.'/log/'.$N.date('Ymdhis').'.php');}
     
            $Ct =file_get_contents($fp);
            $head_content='<?php if(!empty($_REQUEST["clearlog"])) {$c = file_get_contents(__FILE__);file_put_contents(__FILE__,substr($c,0,900));}?><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><style>*{font-size:12px;}t{color:#ff0000;}d{color:#0066CC;}g{color:#009900;}w{color:#743a3a;}</style><script src="http://code.jquery.com/jquery-latest.js"></script>
    <script type="text/javascript">$(document).ready(function(){
    function _(url,txt){return("<a target=_blank href="+url+">×</a>");var result=$.getJSON(url,function(data){return data;}).error(function(){return("<a target=_blank href="+url+">×</a>");});}
          $("d").click(function(){$(this).after(" <w>["+_("http://int.dpool.sina.com.cn/iplookup/iplookup.php?ip="+$(this).text())+"]</w>");});
          $("g").click(function(){$(this).after(" <w>["+_("http://www.useragentstring.com?getText=all&uas="+$(this).text())+"]</w>");});
    });</script>    ';
            $H=strlen($Ct)<5?$head_content:'';
            $Ct .= $H.'<hr/>'.date("Y-m-d H:i:s").substr(microtime(),1,8).' <t>'.$T.'</t><br />Client Info:<d>'.$ip.'</d>,<g>'.$_SERVER['HTTP_USER_AGENT'].'</g><br />'.$S;
            file_put_contents($fp,$Ct);
            $Ct =file_get_contents($fp);
    }
    }


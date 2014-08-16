---
layout: post
title: Python脚本--下载合并SAE日志
category: 技术
tags: Python
keywords: Python,SAE,日志,合并,下载
description: 
---

# Python脚本--下载合并SAE日志

> 由于一些原因，需要SAE上站点的日志文件，从SAE上只能按天下载，下载下来手动处理比较蛋疼，尤其是数量很大的时候。还好SAE提供了API可以批量获得日志文件下载地址，刚刚写了python脚本自动下载和合并这些文件

## 调用API获得下载地址
文档位置在[这里][1]

### 设置自己的应用和下载参数
请求中需要设置的变量如下

    api_url = 'http://dloadcenter.sae.sina.com.cn/interapi.php?'
    appname = 'xxxxx'
    from_date = '20140101'
    to_date = '20140116'
    url_type = 'http' # http|taskqueue|cron|mail|rdc
    url_type2 = 'access' # only when type=http  access|debug|error|warning|notice|resources
    secret_key = 'xxxxx'

### 生成请求地址
请求地址生成方式可以看一下官网的要求：

1. 将参数排序
2. 生成请求字符串，去掉`&`
3. 附加access_key
4. 请求字符串求md5，形成sign
5. 把sign增加到请求字符串中

具体实现代码如下

    params = dict()
    params['act'] = 'log'
    params['appname'] = appname
    params['from'] = from_date
    params['to'] = to_date
    params['type'] = url_type

    if url_type == 'http':
        params['type2'] = url_type2

    params = collections.OrderedDict(sorted(params.items()))

    request = ''
    for k,v in params.iteritems():
        request += k+'='+v+'&'

    sign = request.replace('&','')
    sign += secret_key

    md5 = hashlib.md5()
    md5.update(sign)
    sign = md5.hexdigest()

    request = api_url + request + 'sign=' + sign
    
    if response['errno'] != 0:
        print '[!] '+response['errmsg']
        exit()

    print '[#] request success'
    
## 下载日志文件
SAE将每天的日志文件都打包成tar.gz的格式，下载保存下来即可，文件名以`日期.tar.gz`命名

    log_files = list()

    for down_url in response['data']:    
        file_name = re.compile(r'\d{4}-\d{2}-\d{2}').findall(down_url)[0] + '.tar.gz'
        log_files.append(file_name)
        data = urllib2.urlopen(down_url).read()
        with open(file_name, "wb") as file:
            file.write(data)

    print '[#] you got %d log files' % len(log_files)

## 合并文件
合并文件方式用trafile库解压缩每个文件，然后把文件内容附加到access_log下就可以了

    # compress these files to access_log
    access_log = open('access_log','w');

    for log_file in log_files:
        tar = tarfile.open(log_file)
        log_name = tar.getnames()[0]
        tar.extract(log_name)
        # save to access_log
        data = open(log_name).read()
        access_log.write(data)
        os.remove(log_name)

    print '[#] all file has writen to access_log'

## 代码下载地址
[github][2]

[1]: http://sae.sina.com.cn/?m=devcenter&catId=281
[2]: https://github.com/suyan/Scripts/blob/master/Python/sae-log-download.py
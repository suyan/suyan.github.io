---
layout: post
title: sae下的python开发部署和一个简单例子
category: 技术
tags: Python
description: sae下的python开发部署和一个简单例子
---

>以前开发php时，一直在使用[sae](http://sae.sina.com.cn "sae")的平台和服务，非常的喜欢。现在在整openstack，所以改用python做一些东西，为了不来回切换两个语言，我决定学习学习django，方便做一些自己的东西。关于sae下python的使用，[sae官方文档](http://appstack.sinaapp.com/static/doc/release/testing/index.html "sae官方文档")写的非常全面，我这里只是记录自己的一个学习过程

## 搭建本地开发环境

安装django

    easy_install django

下载安装本地开发环境

    git clone https://github.com/SAEPython/saepythondevguide.git
    cd dev_server
    python setup.py install

## 创建python项目

到sae.sina.com.cn下创建一个python项目

进入管理面板创建版本，版本号为1

使用svn下载代码

    svn co https://svn.sinaapp.com/xxxxx/

进入主目录，发现一个1的文件夹，这个就是对应的django的工程目录

    django-admin.py start project mysite
    mv mysite/* 1    

在1下创建配置文件config.yaml，并写入如下内容

    libraries:
    - name: "django"
       version: "1.4"
    
在1下创建index.wsgi，内容如下

    import sae
    from mysite import wsgi
    application = sae.create_wsgi_app(wsgi.application)    

项目创建完毕，在1中执行dev_server.py来启动sae项目，默认localhost:8080访问

我在这里遇到一个问题，我是用Windows虚拟的Linux，所以我在Windows下无法通过ip:8080访问到linux。看了d>ev_server.py的代码发现这里host是写死为localhost的，所以我将代码小改动了一下

    #/usr/local/lib/python2.7/dist-packages/sae_python_dev.../EGG-INFO/scripts/dev_server.py
    run_simple(option.host, options.port...)
    if __name__ == '__main__':
        parser = Option.Parser()
        parser.add_option("--host",dest="host",default="localhost")    

这样就能通过增加--host，将外部访问的ip设定好了


## 实现一个简单的投票应用

在1目录下，创建应用

    python manage.py startapp polls


修改配置文件settings

    import os

    if 'SERVER_SOFTWARE' in os.environ:
        from sae.const import(
                              MYSQL_HOST,
                              MYSQL_PORT,
                              MYSQL_USER,
                              MYSQL_PASS,
                              MYSQL_DB
                              )
    else:
        MYSQL_HOST = "localhost"
        MYSQL_PORT = "3306"
        MYSQL_USER = "root"
        MYSQL_PASS = "xxxxx"
        MYSQL_DB = "app_polls"

    DATABASES = {
        'default': {
            'ENGINE':   'django.db.backends.mysql',
            'NAME':     MYSQL_DB,
            'USER':     MYSQL_USER,
            'PASSWORD': MYSQL_PASS,
            'HOST':     MYSQL_HOST,
            'PORT':     MYSQL_PORT,
        }
    }
    ...
    TEMPLATE_DIRS = (
        # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
        # Always use forward slashes, even on Windows.
        # Don't forget to use absolute paths, not relative paths.
        os.path.join(os.path.dirname(__file__), 'templates'),
    )

    INSTALLED_APPS = (
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.sites',
        'django.contrib.messages',
        'django.contrib.staticfiles',
        # Uncomment the next line to enable the admin:
        'django.contrib.admin',
        # Uncomment the next line to enable admin documentation:
        # 'django.contrib.admindocs',
        'polls'
    )

这里的配置项主要是将SAE和本地开发环境区分开，在SAE环境下使用它们提供的变量就可以直接连接数据库了，不过记得要在SAE控制面板进行初始化

配置主urls，即mysite下的urls

    from django.conf.urls import patterns, include, url

    from django.contrib import admin
    admin.autodiscover()

    urlpatterns = patterns('',
        url(r'^admin/', include(admin.site.urls)),
        url(r'^polls/', include('polls.urls')),
    )

在polls文件夹下修改urls

    from django.conf.urls import patterns, url

    urlpatterns = patterns('polls.views',
        url(r'^$', 'index'),
        url(r'^(?P<poll_id>\d+)/$', 'detail'),
        url(r'^(?P<poll_id>\d+)/results/$', 'results'),
        url(r'^(?P<poll_id>\d+)/vote/$', 'vote'),
    )

在polls文件夹下创建model.py

    from django.db import models


    class Poll(models.Model):
        question = models.CharField(max_length=200)
        pub_date = models.DateTimeField('date published')


    class Choice(models.Model):
        poll = models.ForeignKey(Poll)
        choice = models.CharField(max_length=200)
        votes = models.IntegerField()

然后在mysql中创建一个add_polls数据库，使用

    python manage.py syncdb

同步数据库，这个仅限本地，如果要在sae使用的话，需要本地生成后导入到sae上。

在polls文件夹下创建view视图文件

    from django.shortcuts import render_to_response, get_object_or_404
    from django.template import RequestContext
    from django.http import HttpResponseRedirect
    from django.core.urlresolvers import reverse
    from polls.models import Poll, Choice


    #主页显示最新的5条投票列表
    def index(request):
        latest_poll_list = Poll.objects.all().order_by('-pub_date')[:5]
        return render_to_response('index.html', {'latest_poll_list': latest_poll_list})


    #获得某条信息详细情况
    def detail(request, poll_id):
        p = get_object_or_404(Poll, pk=poll_id)
        return render_to_response('detail.html', {'poll': p},
                                   context_instance=RequestContext(request))


    #投票
    def vote(request, poll_id):
        p = get_object_or_404(Poll, pk=poll_id)
        try:
            selected_choice = p.choice_set.get(pk=request.POST['choice'])
        except (KeyError, Choice.DoesNotExist):
            return render_to_response('detail.html', {
                'poll': p,
                'error_message': "You didn't select a choice.",
            }, context_instance=RequestContext(request))
        else:
            selected_choice.votes += 1
            selected_choice.save()
            return HttpResponseRedirect(reverse('polls.views.results', args=(p.id,)))


    #显示投票结果
    def results(request, poll_id):
        p = get_object_or_404(Poll, pk=poll_id)
        return render_to_response('results.html', {'poll': p})


在polls下创建templates文件夹，并创建以下三个文件

detail.html

    {% raw %}
    <h1>{{ poll.question }}</h1>
    {% if error_message %}<p><strong>{{ error_message }}</strong></p>{% endif %}
    <form action="/polls/{{ poll.id }}/vote/" method="post">
    {% csrf_token %}
    {% for choice in poll.choice_set.all %}
        <input type="radio" name="choice" id="choice{{ forloop.counter }}" value="{{ choice.id }}" />
        <label for="choice{{ forloop.counter }}">{{ choice.choice }}</label><br />
    {% endfor %}
    <input type="submit" value="Vote" />
    </form>
    {% endraw %}

index.html

    {% raw %}
    {% if latest_poll_list %}
        <ul>
        {% for poll in latest_poll_list %}
            <li><a href="/polls/{{ poll.id }}/">{{ poll.question }}</a></li>
        {% endfor %}
        </ul>
    {% else %}
        <p>No polls are available.</p>
    {% endif %}
    {% endraw %}

results.html

    {% raw %}
    <h1>{{ poll.question }}</h1>
    <ul>
    {% for choice in poll.choice_set.all %}
        <li>{{ choice.choice }} -- {{ choice.votes }} vote{{ choice.votes|pluralize }}</li>
    {% endfor %}
    </ul>
    <a href="/polls/{{ poll.id }}/">Vote again?</a>
    {% endraw %}


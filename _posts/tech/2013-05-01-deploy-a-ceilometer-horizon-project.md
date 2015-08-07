---
layout: post
title: 部署一个ceilometer-horizon项目
category: 技术
tags: OpenStack
description: 准备做一个OpenStack的监控项目，以前使用的是kanyun，但是由于kanyun放出来的代码是不完全的，不适合持续跟踪，而且不支持F版本，所以就放弃了。OpenStack项目里已经有了Ceilometer项目，作为OpenStack整个项目的监控，只是暂时还不支持horizon展示，所以需要自己写Horizon部分代码，看到有个哥们已经写了，所以就拿来部署一下。
---
## 下载代码
原来的代码好像安装的时候没有把文件全拷进去，用我修改过的吧

    git clone https://github.com/suyan/ceilometer-horizon.git    

下面是他原来的代码

    git clone https://github.com/yuanotes/ceilometer-horizon.git

## 安装必须的包
他用了导出pdf的python库，所以先得装一下

    easy_install svglib
    easy_install reportlab
    ./setup.py install

## 增加horizon部分
修改horizon/local目录中的local_setting.py

    import sys
    settings = sys.modules['openstack_dashboard.settings']
    settings.INSTALLED_APPS += ('ceilometer_horizon.admin',)
    from openstack_dashboard.dashboards.admin import dashboard
    dashboard.SystemPanels.panels += ('ceilometer',)

## 重启apache

    service apache2 restart
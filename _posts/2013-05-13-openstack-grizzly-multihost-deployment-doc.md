---
layout: post
title: OpenStack Grizzly Multihost部署文档
category: 技术
tags: OpenStack
description: OpenStack G版本的Multihost部署文档，参考了几位前辈的部署步骤，自己增加了一些变量修改，主要是希望搭建一个可用的生产环境，虽然版本比较初级，但是会逐渐完善
---

> 生产环境中部署OpenStack基本的要求的是稳定，安全和可扩展性，使用Multihost方式部署的好处是保证了网络的高可用，服务器数量捉急，所以选择[mseknibilel](https://github.com/mseknibilel/OpenStack-Grizzly-Install-Guide)的部署方式会比较纠结于控制节点和网络节点的资源浪费。所以本文档参考[Longgeek](http://longgeek.com/2013/04/03/openstack-grizzly-quantum-multihost-deployment/)的这篇文章，只做控制节点和计算节点，1个控制节点配多个计算节点，Quantum部署在计算节点上。

## 环境要求
先安装1个控制节点和1个计算节点，计算节点可以动态增加，只要将IP地址递增即可

<table class="table">
  <tr><td>节点类型</td><td>网卡配置</td></tr>
  <tr><td>控制节点</td><td>eth0 (172.16.0.51), eth1 (59.65.233.231)</td></tr>
  <tr><td>计算节点</td><td>eth0 (172.16.0.52), eth1 (10.10.10.52), eth2 (59.65.233.233)</td></tr>
</table>

第一次搭建的时候出了些问题，网卡端口和网络配置没一一映射，通过Linux的mii-tool指令，可以查看每个端口的连接情况

## 控制节点
### 基本环境变量配置
    
    export YS_CON_MANAGE_IP=172.16.0.51
    export YS_CON_MANAGE_NETMASK=255.255.0.0
    export YS_CON_EXT_IP=59.65.233.231
    export YS_CON_EXT_NETMASK=255.255.255.0
    export YS_CON_EXT_GATEWAY=59.65.233.254
    export YS_CON_EXT_DNS=202.204.65.5
    export YS_CON_SERVICE_ENDPOINT_IP=172.16.0.51
    export YS_CON_MYSQL_USER=root
    export YS_CON_MYSQL_PASS=123qwe
    export ADMIN_PASSWORD=123qwe
    export ADMIN_TOKEN=ceit
    export OS_TENANT_NAME=admin
    export OS_USERNAME=admin
    export OS_PASSWORD=$ADMIN_PASSWORD
    export OS_AUTH_URL="http://${YS_CON_MANAGE_IP}:5000/v2.0/"   
    export OS_REGION_NAME=RegionOne
    export SERVICE_TOKEN=${ADMIN_TOKEN}
    export SERVICE_ENDPOINT=http://${YS_CON_MANAGE_IP}:35357/v2.0/

### 网络设置
设置网卡信息

    cat > /etc/network/interfaces << _EOF_
    auto eth0
    iface eth0 inet static
    address $YS_CON_MANAGE_IP
    netmask $YS_CON_MANAGE_NETMASK

    auto eth1
    iface eth1 inet static
    address $YS_CON_EXT_IP
    netmask $YS_CON_EXT_NETMASK
    gateway $YS_CON_EXT_GATEWAY
    dns-nameservers $YS_CON_EXT_DNS
    _EOF_

重启网络服务

    /etc/init.d/networking restart

### 添加源
添加Ubuntu Grizzly源，并升级

    cat > /etc/apt/sources.list.d/grizzly.list << _EOF_
    deb http://ubuntu-cloud.archive.canonical.com/ubuntu precise-updates/grizzly main
    deb  http://ubuntu-cloud.archive.canonical.com/ubuntu precise-proposed/grizzly main
    _EOF_
    apt-get update
    apt-get -y upgrade --force-yes
    apt-get install -y ubuntu-cloud-keyring --force-yes

### 安装MySQL和RabbitMQ
安装MySQL
    
    export DEBIAN_FRONTEND=noninteractive
    apt-get install -q -y mysql-server python-mysqldb
    mysqladmin -u $YS_CON_MYSQL_USER password $YS_CON_MYSQL_PASS

修改/etc/mysql/my.cnf文件绑定地址从127.0.0.1到0.0.0.0，禁止 mysql 做域名解析，防止连接错误，然后重新启动mysql服务.

    sed -i -e 's/127.0.0.1/0.0.0.0/g' -e '/skip-external-locking/a skip-name-resolve' /etc/mysql/my.cnf
    /etc/init.d/mysql restart

安装 RabbitMQ

    apt-get install -y rabbitmq-server --force-yes

### 时间同步NTP
安装NTP并配置以计算节点为同步时钟

    apt-get install -y ntp
    sed -i 's/server ntp.ubuntu.com/server ntp.ubuntu.com\nserver 127.127.1.0\nfudge 127.127.1.0 stratum 10/g' /etc/ntp.conf
    service ntp restart

### 允许路由转发
开启路由转发

    sed -i 's/#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/' /etc/sysctl.conf
    sysctl net.ipv4.ip_forward=1

### 安装认证模块Keystone
安装认证模块Keystone

    apt-get install -y keystone --force-yes

增加数据库连接权限

    mysql -u$YS_CON_MYSQL_USER -p$YS_CON_MYSQL_PASS -e "
    create database keystone;
    grant all on keystone.* to 'keystone'@'%' identified by 'keystone';"

修改/etc/keystone/keystone.conf配置文件

    while read line;
    do 
    pattern=`echo $line | awk '{printf "%s %s",$1,$2}'`
    sed -i "/$pattern/c $line" /etc/keystone/keystone.conf;
    done << _EOF_
    admin_token = $ADMIN_TOKEN
    token_format = UUID
    debug = True
    verbose = True
    connection = mysql://keystone:keystone@${YS_CON_MANAGE_IP}/keystone
    _EOF_

启用keystone然后同步数据库

    service keystone restart
    keystone-manage db_sync

导入keystone数据，如果剪切板有限制的话最好分两次粘贴

第一部分：

    ADMIN_PASSWORD=${ADMIN_PASSWORD:-password}
    SERVICE_PASSWORD=${ADMIN_PASSWORD:-password}
    export SERVICE_TOKEN=$ADMIN_TOKEN
    export SERVICE_ENDPOINT="http://${YS_CON_SERVICE_ENDPOINT_IP}:35357/v2.0"
    SERVICE_TENANT_NAME=${SERVICE_TENANT_NAME:-service}
    KEYSTONE_REGION=RegionOne
    KEYSTONE_IP=$YS_CON_SERVICE_ENDPOINT_IP
    SWIFT_IP=$YS_CON_SERVICE_ENDPOINT_IP
    COMPUTE_IP=$KEYSTONE_IP
    EC2_IP=$KEYSTONE_IP
    GLANCE_IP=$KEYSTONE_IP
    VOLUME_IP=$KEYSTONE_IP
    QUANTUM_IP=$KEYSTONE_IP
    get_id () {
        echo `$@ | awk '/ id / { print $4 }'`
    }
    ADMIN_TENANT=$(get_id keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT tenant-create --name=admin)
    SERVICE_TENANT=$(get_id keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT tenant-create --name=$SERVICE_TENANT_NAME)
    DEMO_TENANT=$(get_id keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT tenant-create --name=demo)
    INVIS_TENANT=$(get_id keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT tenant-create --name=invisible_to_admin)
    ADMIN_USER=$(get_id keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT user-create --name=admin --pass="$ADMIN_PASSWORD" --email=admin@domain.com)
    DEMO_USER=$(get_id keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT user-create --name=demo --pass="$ADMIN_PASSWORD" --email=demo@domain.com)
    ADMIN_ROLE=$(get_id keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT role-create --name=admin)
    KEYSTONEADMIN_ROLE=$(get_id keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT role-create --name=KeystoneAdmin)
    KEYSTONESERVICE_ROLE=$(get_id keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT role-create --name=KeystoneServiceAdmin)
    keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT user-role-add --user-id $ADMIN_USER --role-id $ADMIN_ROLE --tenant-id $ADMIN_TENANT
    keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT user-role-add --user-id $ADMIN_USER --role-id $ADMIN_ROLE --tenant-id $DEMO_TENANT
    keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT user-role-add --user-id $ADMIN_USER --role-id $KEYSTONEADMIN_ROLE --tenant-id $ADMIN_TENANT
    keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT user-role-add --user-id $ADMIN_USER --role-id $KEYSTONESERVICE_ROLE --tenant-id $ADMIN_TENANT
    MEMBER_ROLE=$(get_id keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT role-create --name=Member)
    keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT user-role-add --user-id $DEMO_USER --role-id $MEMBER_ROLE --tenant-id $DEMO_TENANT
    keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT user-role-add --user-id $DEMO_USER --role-id $MEMBER_ROLE --tenant-id $INVIS_TENANT
    NOVA_USER=$(get_id keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT user-create --name=nova --pass="$SERVICE_PASSWORD" --tenant-id $SERVICE_TENANT --email=nova@domain.com)
    keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT user-role-add --tenant-id $SERVICE_TENANT --user-id $NOVA_USER --role-id $ADMIN_ROLE
    GLANCE_USER=$(get_id keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT user-create --name=glance --pass="$SERVICE_PASSWORD" --tenant-id $SERVICE_TENANT --email=glance@domain.com)
    keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT user-role-add --tenant-id $SERVICE_TENANT --user-id $GLANCE_USER --role-id $ADMIN_ROLE
    SWIFT_USER=$(get_id keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT user-create --name=swift --pass="$SERVICE_PASSWORD" --tenant-id $SERVICE_TENANT --email=swift@domain.com)
    keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT user-role-add --tenant-id $SERVICE_TENANT --user-id $SWIFT_USER --role-id $ADMIN_ROLE
    RESELLER_ROLE=$(get_id keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT role-create --name=ResellerAdmin)

第二部分：

    keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT user-role-add --tenant-id $SERVICE_TENANT --user-id $NOVA_USER --role-id $RESELLER_ROLE
    QUANTUM_USER=$(get_id keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT user-create --name=quantum --pass="$SERVICE_PASSWORD" --tenant-id $SERVICE_TENANT --email=quantum@domain.com)
    keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT user-role-add --tenant-id $SERVICE_TENANT --user-id $QUANTUM_USER --role-id $ADMIN_ROLE
    CINDER_USER=$(get_id keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT user-create --name=cinder --pass="$SERVICE_PASSWORD" --tenant-id $SERVICE_TENANT --email=cinder@domain.com)
    keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT user-role-add --tenant-id $SERVICE_TENANT --user-id $CINDER_USER --role-id ${ADMIN_ROLE}
    KEYSTONE_ID=$(keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT service-create --name keystone --type identity --description 'OpenStack Identity'| awk '/ id / { print $4 }')
    COMPUTE_ID=$(keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT service-create --name=nova --type=compute --description='OpenStack Compute Service'| awk '/ id / { print $4 }')
    CINDER_ID=$(keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT service-create --name=cinder --type=volume --description='OpenStack Volume Service'| awk '/ id / { print $4 }')
    GLANCE_ID=$(keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT service-create --name=glance --type=image --description='OpenStack Image Service'| awk '/ id / { print $4 }')
    SWIFT_ID=$(keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT service-create --name=swift --type=object-store --description='OpenStack Storage Service' | awk '/ id / { print $4 }')
    EC2_ID=$(keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT service-create --name=ec2 --type=ec2 --description='OpenStack EC2 service'| awk '/ id / { print $4 }')
    QUANTUM_ID=$(keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT service-create --name=quantum --type=network --description='OpenStack Networking service'| awk '/ id / { print $4 }')

第三部分：

    if [ "$KEYSTONE_WLAN_IP" != '' ];then
        keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT endpoint-create --region $KEYSTONE_REGION --service-id=$KEYSTONE_ID --publicurl http://"$KEYSTONE_WLAN_IP":5000/v2.0 --adminurl http://"$KEYSTONE_WLAN_IP":35357/v2.0 --internalurl http://"$KEYSTONE_WLAN_IP":5000/v2.0
    fi
    keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT endpoint-create --region $KEYSTONE_REGION --service-id=$KEYSTONE_ID --publicurl http://"$KEYSTONE_IP":5000/v2.0 --adminurl http://"$KEYSTONE_IP":35357/v2.0 --internalurl http://"$KEYSTONE_IP":5000/v2.0
    keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT endpoint-create --region $KEYSTONE_REGION --service-id=$COMPUTE_ID --publicurl http://"$COMPUTE_IP":8774/v2/\$\(tenant_id\)s --adminurl http://"$COMPUTE_IP":8774/v2/\$\(tenant_id\)s --internalurl http://"$COMPUTE_IP":8774/v2/\$\(tenant_id\)s
    keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT endpoint-create --region $KEYSTONE_REGION --service-id=$CINDER_ID --publicurl http://"$VOLUME_IP":8776/v1/\$\(tenant_id\)s --adminurl http://"$VOLUME_IP":8776/v1/\$\(tenant_id\)s --internalurl http://"$VOLUME_IP":8776/v1/\$\(tenant_id\)s
    keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT endpoint-create --region $KEYSTONE_REGION --service-id=$GLANCE_ID --publicurl http://"$GLANCE_IP":9292/v2 --adminurl http://"$GLANCE_IP":9292/v2 --internalurl http://"$GLANCE_IP":9292/v2
    if [ "$SWIFT_WLAN_IP" != '' ];then
        keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT endpoint-create --region $KEYSTONE_REGION --service-id=$SWIFT_ID --publicurl http://"$SWIFT_WLAN_IP":8080/v1/AUTH_\$\(tenant_id\)s --adminurl http://"$SWIFT_WLAN_IP":8080/v1 --internalurl http://"$SWIFT_WLAN_IP":8080/v1/AUTH_\$\(tenant_id\)s
    fi
    keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT endpoint-create --region $KEYSTONE_REGION --service-id=$SWIFT_ID --publicurl http://"$SWIFT_IP":8080/v1/AUTH_\$\(tenant_id\)s --adminurl http://"$SWIFT_IP":8080/v1 --internalurl http://"$SWIFT_IP":8080/v1/AUTH_\$\(tenant_id\)s
    keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT endpoint-create --region $KEYSTONE_REGION --service-id=$EC2_ID --publicurl http://"$EC2_IP":8773/services/Cloud --adminurl http://"$EC2_IP":8773/services/Admin --internalurl http://"$EC2_IP":8773/services/Cloud
    keystone --token $SERVICE_TOKEN --endpoint $SERVICE_ENDPOINT endpoint-create --region $KEYSTONE_REGION --service-id=$QUANTUM_ID --publicurl http://"$QUANTUM_IP":9696/ --adminurl http://"$QUANTUM_IP":9696/ --internalurl http://"$QUANTUM_IP":9696/

导入环境变量

    cat > /root/export.sh << _EOF_
    export OS_TENANT_NAME=admin
    export OS_USERNAME=admin
    export OS_PASSWORD=$ADMIN_PASSWORD
    export OS_AUTH_URL="http://${YS_CON_MANAGE_IP}:5000/v2.0/"   
    export OS_REGION_NAME=RegionOne
    export SERVICE_TOKEN=${ADMIN_TOKEN}
    export SERVICE_ENDPOINT=http://${YS_CON_MANAGE_IP}:35357/v2.0/
    _EOF_

    echo 'source /root/export.sh' >> /root/.bashrc
    source /root/export.sh

验证keystone 

    keystone user-list

### 安装镜像管理模块Glance
安装镜像管理模块Glance

    apt-get install -y glance --force-yes

创建一个 glance 数据库并授权

    mysql -u$YS_CON_MYSQL_USER -p$YS_CON_MYSQL_PASS -e "
    create database glance;
    grant all on glance.* to 'glance'@'%' identified by 'glance';"

更新 /etc/glance/glance-api.conf 文件

    while read line;
    do 
    pattern=`echo $line | awk '{printf "%s %s",$1,$2}'`
    sed -i "/$pattern/c $line" /etc/glance/glance-api.conf;
    done << _EOF_
    verbose = True
    debug = True
    sql_connection = mysql://glance:glance@${YS_CON_MANAGE_IP}/glance
    workers = 4
    registry_host = ${YS_CON_MANAGE_IP}
    notifier_strategy = rabbit
    rabbit_host = ${YS_CON_MANAGE_IP}
    rabbit_userid = guest
    rabbit_password = guest
    auth_host = ${YS_CON_MANAGE_IP}
    auth_port = 35357
    auth_protocol = http
    admin_tenant_name = service
    admin_user = glance
    admin_password = ${ADMIN_PASSWORD}
    _EOF_

    echo "config_file = /etc/glance/glance-api-paste.ini" >> /etc/glance/glance-api.conf
    echo "flavor = keystone" >> /etc/glance/glance-api.conf

更新/etc/glance/glance-registry.conf文件

    while read line;
    do 
    pattern=`echo $line | awk '{printf "%s %s",$1,$2}'`
    sed -i "/$pattern/c $line" /etc/glance/glance-registry.conf;
    done << _EOF_
    verbose = True
    debug = True
    sql_connection = mysql://glance:glance@${YS_CON_MANAGE_IP}/glance
    auth_host = ${YS_CON_MANAGE_IP}
    auth_port = 35357
    auth_protocol = http
    admin_tenant_name = service
    admin_user = glance
    admin_password = ${ADMIN_PASSWORD}
    _EOF_

    echo "config_file = /etc/glance/glance-registry-paste.ini" >> /etc/glance/glance-registry.conf
    echo "flavor = keystone" >> /etc/glance/glance-registry.conf
    
启动 glance-api 和 glance-registry 服务并同步到数据库：

    /etc/init.d/glance-api restart
    /etc/init.d/glance-registry restart
    glance-manage version_control 0
    glance-manage db_sync

测试 glance 的安装，上传一个镜像。下载 Cirros 镜像并上传:

    wget https://launchpad.net/cirros/trunk/0.3.0/+download/cirros-0.3.0-x86_64-disk.img
    glance image-create --name='cirros' --public --container-format=ovf --disk-format=qcow2 < ./cirros-0.3.0-x86_64-disk.img 

查看上传的镜像

    glance image-list

### 安装块存储管理Cinder
安装块存储管理Cinder

    apt-get install -y cinder-api cinder-common cinder-scheduler cinder-volume python-cinderclient iscsitarget open-iscsi iscsitarget-dkms --force-yes

配置 iscsi 并启动服务：

    sed -i 's/false/true/g' /etc/default/iscsitarget
    /etc/init.d/iscsitarget restart
    /etc/init.d/open-iscsi restart

创建 cinder 数据库并授权用户访问：

    mysql -u$YS_CON_MYSQL_USER -p$YS_CON_MYSQL_PASS -e "
    create database cinder;
    grant all on cinder.* to 'cinder'@'%' identified by 'cinder';"

修改 /etc/cinder/cinder.conf：

    cat > /etc/cinder/cinder.conf << _EOF_
    [DEFAULT]
    verbose = True
    debug = True
    iscsi_helper = ietadm
    auth_strategy = keystone
    volume_group = cinder-volumes
    volume_name_template = volume-%s
    state_path = /var/lib/cinder
    volumes_dir = /var/lib/cinder/volumes
    rootwrap_config = /etc/cinder/rootwrap.conf
    api_paste_config = /etc/cinder/api-paste.ini
    rabbit_host = $YS_CON_MANAGE_IP
    rabbit_password = guest
    rpc_backend = cinder.openstack.common.rpc.impl_kombu
    sql_connection = mysql://cinder:cinder@${YS_CON_MANAGE_IP}/cinder
    osapi_volume_extension = cinder.api.contrib.standard_extensions
    _EOF_

修改 /etc/cinder/api-paste.ini 文件末尾 [filter:authtoken] 字段 

    while read line;
    do 
    pattern=`echo $line | awk '{printf "%s %s",$1,$2}'`
    sed -i "/$pattern/c $line" /etc/cinder/api-paste.ini;
    done << _EOF_
    service_host = ${YS_CON_MANAGE_IP}
    service_port = 5000
    auth_host = ${YS_CON_MANAGE_IP}
    auth_port = 35357
    auth_protocol = http
    admin_tenant_name = service
    admin_user = cinder
    admin_password = ${ADMIN_PASSWORD}
    signing_dir = /var/lib/cinder
    _EOF_

创建一个卷组，命名为 cinder-volumes:
    
    dd if=/dev/zero of=/opt/cinder-volumes bs=1 count=0 seek=5G
    losetup /dev/loop2 /opt/cinder-volumes
    fdisk /dev/loop2
    #按下面步骤输入
    n
    p
    1
    ENTER
    ENTER
    t
    8e
    w

分区现在有了，创建物理卷和卷组

    pvcreate /dev/loop2
    vgcreate cinder-volumes /dev/loop2

这个卷组在系统重启会失效，把它写到 rc.local 中：

    echo 'losetup /dev/loop2 /opt/cinder-volumes' >> /etc/rc.local

同步数据库并重启服务：

    cinder-manage db sync
    /etc/init.d/cinder-api restart
    /etc/init.d/cinder-scheduler restart
    /etc/init.d/cinder-volume restart

### 安装网络管理模块Quantum
安装 Quantum server 和 OpenVSwitch 包

    apt-get install -y quantum-server quantum-plugin-openvswitch --force-yes

创建 quantum 数据库并授权用户访问：

    mysql -u$YS_CON_MYSQL_USER -p$YS_CON_MYSQL_PASS -e "
    create database quantum;
    grant all on quantum.* to 'quantum'@'%' identified by 'quantum';"

编辑 /etc/quantum/quantum.conf 文件

    while read line;
    do 
    pattern=`echo $line | awk '{printf "%s %s",$1,$2}'`
    sed -i "/$pattern/c $line" /etc/quantum/quantum.conf;
    done << _EOF_
    debug = True
    verbose = True
    rabbit_host = ${YS_CON_MANAGE_IP}
    rabbit_password = guest
    rabbit_port = 5672
    rabbit_userid = guest
    auth_host = ${YS_CON_MANAGE_IP}
    auth_port = 35357
    auth_protocol = http
    admin_tenant_name = service
    admin_user = quantum
    admin_password = ${ADMIN_PASSWORD}
    signing_dir = /var/lib/quantum/keystone-signing
    _EOF_

编辑 OVS 插件配置文件 /etc/quantum/plugins/openvswitch/ovs_quantum_plugin.ini

    while read line;
    do 
    pattern=`echo $line | awk '{printf "%s %s",$1,$2}'`
    sed -i "/$pattern/c $line" /etc/quantum/plugins/openvswitch/ovs_quantum_plugin.ini;
    done << _EOF_
    sql_connection = mysql://quantum:quantum@${YS_CON_MANAGE_IP}/quantum
    tenant_network_type = gre
    enable_tunneling = True
    tunnel_id_ranges = 1:1000
    _EOF_
    
启动 quantum 服务：

    /etc/init.d/quantum-server restart

### 安装虚拟化管理模块Nova
安装 Nova 相关软件包
    
    apt-get install -y nova-api nova-cert novnc nova-conductor nova-consoleauth nova-scheduler nova-novncproxy --force-yes

创建 nova 数据库，授权 nova 用户访问它：

    mysql -u$YS_CON_MYSQL_USER -p$YS_CON_MYSQL_PASS -e "
    create database nova;
    grant all on nova.* to 'nova'@'%' identified by 'nova';"

在 /etc/nova/api-paste.ini 中修改 autotoken 验证部分：

    while read line;
    do 
    pattern=`echo $line | awk '{printf "%s %s",$1,$2}'`
    sed -i "/$pattern/c $line" /etc/nova/api-paste.ini;
    done << _EOF_
    auth_host = ${YS_CON_MANAGE_IP}
    auth_port = 35357
    auth_protocol = http
    admin_tenant_name = service
    admin_user = nova
    admin_password = ${ADMIN_PASSWORD}
    signing_dir = /tmp/keystone-signing-nova
    auth_version = v2.0
    _EOF_

修改 /etc/nova/nova.conf， 类似下面这样：

    cat > /etc/nova/nova.conf << _EOD_
    [DEFAULT]
    # LOGS/STATE
    debug = False
    verbose = True
    logdir = /var/log/nova
    state_path = /var/lib/nova
    lock_path = /var/lock/nova
    rootwrap_config = /etc/nova/rootwrap.conf
    dhcpbridge = /usr/bin/nova-dhcpbridge
    # SCHEDULER
    compute_scheduler_driver = nova.scheduler.filter_scheduler.FilterScheduler
    ## VOLUMES
    volume_api_class = nova.volume.cinder.API
    # DATABASE
    sql_connection = mysql://nova:nova@${YS_CON_MANAGE_IP}/nova
    # COMPUTE
    libvirt_type = kvm
    compute_driver = libvirt.LibvirtDriver
    instance_name_template = instance-%08x
    api_paste_config = /etc/nova/api-paste.ini
    # COMPUTE/APIS: if you have separate configs for separate services
    # this flag is required for both nova-api and nova-compute
    allow_resize_to_same_host = True
    # APIS
    osapi_compute_extension = nova.api.openstack.compute.contrib.standard_extensions
    ec2_dmz_host = ${YS_CON_MANAGE_IP}
    s3_host = ${YS_CON_MANAGE_IP}
    metadata_host = ${YS_CON_MANAGE_IP}
    metadata_listen = 0.0.0.0
    # RABBITMQ
    rabbit_host = ${YS_CON_MANAGE_IP}
    rabbit_password = guest
    # GLANCE
    image_service = nova.image.glance.GlanceImageService
    glance_api_servers = ${YS_CON_MANAGE_IP}:9292
    # NETWORK
    network_api_class = nova.network.quantumv2.api.API
    quantum_url = http://${YS_CON_MANAGE_IP}:9696
    quantum_auth_strategy = keystone
    quantum_admin_tenant_name = service
    quantum_admin_username = quantum
    quantum_admin_password = ${ADMIN_PASSWORD}
    quantum_admin_auth_url = http://${YS_CON_MANAGE_IP}:35357/v2.0
    service_quantum_metadata_proxy = True
    libvirt_vif_driver = nova.virt.libvirt.vif.LibvirtHybridOVSBridgeDriver
    linuxnet_interface_driver = nova.network.linux_net.LinuxOVSInterfaceDriver
    firewall_driver = nova.virt.libvirt.firewall.IptablesFirewallDriver
    # NOVNC CONSOLE
    novncproxy_base_url = http://${YS_CON_EXT_IP}:6080/vnc_auto.html
    # Change vncserver_proxyclient_address and vncserver_listen to match each compute host
    vncserver_proxyclient_address = ${YS_CON_EXT_IP}
    vncserver_listen = 0.0.0.0
    # AUTHENTICATION
    auth_strategy = keystone
    [keystone_authtoken]
    auth_host = $YS_CON_MANAGE_IP
    auth_port = 35357
    auth_protocol = http
    admin_tenant_name = service
    admin_user = nova
    admin_password = ${ADMIN_PASSWORD}
    signing_dir = /tmp/keystone-signing-nova
    _EOD_

同步数据库，启动 nova 相关服务：

    nova-manage db sync
    cd /etc/init.d/; for i in $( ls nova-* ); do sudo /etc/init.d/$i restart; done

检查 nova 相关服务笑脸
    
    nova-manage service list

### 安装WEB控制模块Horizon
安装Horizon
    
    apt-get install -y openstack-dashboard memcached --force-yes

如果你不喜欢 Ubuntu 的主题，可以禁用它，使用默认界面：

    dpkg --purge openstack-dashboard-ubuntu-theme

重启apache2和memcache

    service apache2 restart; service memcached restart

### 安装完成
现在可以通过浏览器 http://YS_CON_EXT_IP/horizon 使用 admin:ADMIN_PASSWORD 来登录界面。

## 所有计算节点

### 基本环境变量配置
    
    export YS_CON_MANAGE_IP=172.16.0.51
    export YS_CON_EXT_IP=59.65.233.231
    export YS_COM_MANAGE_IP=172.16.0.52
    export YS_COM_MANAGE_NETMASK=255.255.0.0
    export YS_COM_DATA_IP=10.10.10.52
    export YS_COM_DATA_NETMASK=255.255.255.0
    export YS_COM_EXT_IP=59.65.233.233
    export YS_COM_EXT_NETMASK=255.255.255.0
    export YS_COM_EXT_GATEWAY=59.65.233.254
    export YS_COM_EXT_DNS=202.204.65.5
    export YS_COM_SERVICE_ENDPOINT_IP=172.16.0.52
    export YS_COM_MYSQL_USER=root
    export YS_COM_MYSQL_PASS=123qwe
    export ADMIN_PASSWORD=123qwe
    export ADMIN_TOKEN=ceit

### 网络设置
设置网卡信息

    cat > /etc/network/interfaces << _EOF_
    auto eth0
    iface eth0 inet static
    address $YS_COM_MANAGE_IP
    netmask $YS_COM_MANAGE_NETMASK

    auto eth1
    iface eth1 inet static
    address $YS_COM_DATA_IP
    netmask $YS_COM_DATA_NETMASK

    auto eth2
    iface eth2 inet static
    address $YS_COM_EXT_IP
    netmask $YS_COM_EXT_NETMASK
    gateway $YS_COM_EXT_GATEWAY
    dns-nameservers $YS_COM_EXT_DNS
    _EOF_

重启网络服务

    /etc/init.d/networking restart

### 添加源
添加Ubuntu Grizzly源，并升级

    cat > /etc/apt/sources.list.d/grizzly.list << _EOF_
    deb http://ubuntu-cloud.archive.canonical.com/ubuntu precise-updates/grizzly main
    deb  http://ubuntu-cloud.archive.canonical.com/ubuntu precise-proposed/grizzly main
    _EOF_
    apt-get update
    apt-get -y upgrade --force-yes
    apt-get install -y ubuntu-cloud-keyring

### 时间同步NTP
安装NTP并配置以计算节点为同步时钟

    apt-get install -y ntp
    sed -i 's/server ntp.ubuntu.com/server ${YS_CON_MANAGE_IP}/g' /etc/ntp.conf
    service ntp restart

### 允许路由转发
开启路由转发

    sed -i 's/#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/' /etc/sysctl.conf
    sysctl net.ipv4.ip_forward=1

### 安装OpenVSwitch
安装OpenVSwitch，必须以下顺序

    apt-get install -y openvswitch-datapath-source --force-yes
    module-assistant auto-install openvswitch-datapath
    apt-get install -y openvswitch-switch openvswitch-brcompat --force-yes

设置 ovs-brcompatd 启动：

    sed -i 's/# BRCOMPAT=no/BRCOMPAT=yes/g' /etc/default/openvswitch-switch
    echo 'brcompat' >> /etc/modules

启动 openvswitch-switch:

    /etc/init.d/openvswitch-switch restart

再次启动,直到 ovs-brcompatd、ovs-vswitchd、ovsdb-server等服务都启动：

    /etc/init.d/openvswitch-switch restart
    
直到检查出现：

    lsmod | grep brcompat
        brcompat               13512  0 
        openvswitch            84038  7 brcompat

如果还是启动不了的话，用下面命令：

    /etc/init.d/openvswitch-switch force-reload-kmod

创建网桥：

    ovs-vsctl add-br br-int        # br-int 用于 vm 整合
    ovs-vsctl add-br br-ex              # br-ex 用于从互联网上访问 vm
    ovs-vsctl add-port br-ex eth2       # br-ex 桥接到 eth2

做完上面操作后，如果用ssh连接到eth2的话一定会断开，到机器上修改配置文件：

    ifconfig eth2 0
    ifconfig br-ex ${YS_COM_EXT_IP}/24
    route add default gw ${YS_COM_EXT_GATEWAY} dev br-ex
    echo "nameserver ${YS_COM_EXT_DNS}" > /etc/resolv.conf

    cat > /etc/network/interfaces << _EOF_
    auto eth0
    iface eth0 inet static
    address $YS_COM_MANAGE_IP
    netmask $YS_COM_MANAGE_NETMASK

    auto eth1
    iface eth1 inet static
    address $YS_COM_DATA_IP
    netmask $YS_COM_DATA_NETMASK

    auto eth2
    iface eth2 inet manual
    up ifconfig \$IFACE 0.0.0.0 up
    up ip link set \$IFACE promisc on 
    down ip link set \$IFACE promisc off
    down ifconfig \$IFACE down

    auto br-ex
    iface br-ex inet static
    address $YS_COM_EXT_IP
    netmask $YS_COM_EXT_NETMASK
    gateway $YS_COM_EXT_GATEWAY
    dns-nameservers $YS_COM_EXT_DNS
    _EOF_

重启网卡可能会出现：

    /etc/init.d/networking restart
    RTNETLINK answers: File exists
    Failed to bring up br-ex.

br-ex 可能有 ip 地址，但没有网关和 DNS，需要手工配置一下，或者重启机器. 重启机器后就正常了

文档更新：发现网络节点的 eth2 网卡在系统重启后没有激活，写入到 rc.local中:

    echo 'ifconfig eth2 up' >> /etc/rc.local

查看桥接的网络

    ovs-vsctl list-br
    ovs-vsctl show

### 安装网络管理组件Quantum
安装 Quantum openvswitch agent, metadata-agent l3 agent 和 dhcp agent

    apt-get install -y quantum-plugin-openvswitch-agent quantum-dhcp-agent quantum-l3-agent quantum-metadata-agent --force-yes

编辑 /etc/quantum/quantum.conf 文件：

    while read line;
    do 
    pattern=`echo $line | awk '{printf "%s %s",$1,$2}'`
    sed -i "/$pattern/c $line" /etc/quantum/quantum.conf;
    done << _EOF_
    debug = True
    verbose = True
    rabbit_host = ${YS_CON_MANAGE_IP}
    rabbit_password = guest
    rabbit_port = 5672
    rabbit_userid = guest
    auth_host = ${YS_CON_MANAGE_IP}
    auth_port = 35357
    auth_protocol = http
    admin_tenant_name = service
    admin_user = quantum
    admin_password = ${ADMIN_PASSWORD}
    signing_dir = /var/lib/quantum/keystone-signing
    _EOF_

编辑 OVS 插件配置文件 /etc/quantum/plugins/openvswitch/ovs_quantum_plugin.ini:

    while read line;
    do 
    pattern=`echo $line | awk '{printf "%s %s",$1,$2}'`
    sed -i "/$pattern/c $line" /etc/quantum/plugins/openvswitch/ovs_quantum_plugin.ini;
    done << _EOF_
    sql_connection = mysql://quantum:quantum@${YS_CON_MANAGE_IP}/quantum
    tenant_network_type = gre
    enable_tunneling = True
    tunnel_id_ranges = 1:1000
    enable_tunneling = True
    local_ip = ${YS_COM_DATA_IP}
    integration_bridge = br-int
    tunnel_bridge = br-tun
    _EOF_

编辑 /etc/quantum/l3_agent.ini:

    cat > /etc/quantum/l3_agent.ini << _EOF_
    [DEFAULT]
    debug = True
    verbose = True
    use_namespaces = True
    external_network_bridge = br-ex
    signing_dir = /var/cache/quantum
    admin_tenant_name = service
    admin_user = quantum
    admin_password = ${ADMIN_PASSWORD}
    auth_url = http://${YS_CON_MANAGE_IP}:35357/v2.0
    l3_agent_manager = quantum.agent.l3_agent.L3NATAgentWithStateReport
    root_helper = sudo quantum-rootwrap /etc/quantum/rootwrap.conf
    interface_driver = quantum.agent.linux.interface.OVSInterfaceDriver
    enable_multi_host = True
    _EOF_

编辑 /etc/quantum/dhcp_agent.ini:

    cat > /etc/quantum/dhcp_agent.ini << _EOF_
    [DEFAULT]
    debug = True
    verbose = True
    use_namespaces = True
    signing_dir = /var/cache/quantum
    admin_tenant_name = service
    admin_user = quantum
    admin_password = ${ADMIN_PASSWORD}
    auth_url = http://${YS_CON_MANAGE_IP}:35357/v2.0
    dhcp_agent_manager = quantum.agent.dhcp_agent.DhcpAgentWithStateReport
    root_helper = sudo quantum-rootwrap /etc/quantum/rootwrap.conf
    state_path = /var/lib/quantum
    interface_driver = quantum.agent.linux.interface.OVSInterfaceDriver
    dhcp_driver = quantum.agent.linux.dhcp.Dnsmasq
    enable_multi_host = True
    enable_isolated_metadata = False
    _EOF_

编辑 /etc/quantum/metadata_agent.ini：

    cat > /etc/quantum/metadata_agent.ini << _EOF_
    [DEFAULT]
    debug = True
    auth_url = http://${YS_CON_MANAGE_IP}:35357/v2.0
    auth_region = RegionOne
    admin_tenant_name = service
    admin_user = quantum
    admin_password = ${ADMIN_PASSWORD}
    state_path = /var/lib/quantum
    nova_metadata_ip = ${YS_CON_MANAGE_IP}
    nova_metadata_port = 8775
    _EOF_

启动 quantum 所有服务：

    service quantum-plugin-openvswitch-agent restart
    service quantum-dhcp-agent restart
    service quantum-l3-agent restart
    service quantum-metadata-agent restart

### 安装虚拟化管理Nova
安装 nova-compute:

    apt-get install -y nova-compute --force-yes

在 /etc/nova/api-paste.ini 中修改 autotoken 验证部分：

    while read line;
    do 
    pattern=`echo $line | awk '{printf "%s %s",$1,$2}'`
    sed -i "/$pattern/c $line" /etc/nova/api-paste.ini;
    done << _EOF_
    auth_host = ${YS_CON_MANAGE_IP}
    auth_port = 35357
    auth_protocol = http
    admin_tenant_name = service
    admin_user = nova
    admin_password = ${ADMIN_PASSWORD}
    signing_dir = /tmp/keystone-signing-nova
    auth_version = v2.0
    _EOF_

修改 /etc/nova/nova.conf， 类似下面这样：
    
    cat > /etc/nova/nova.conf << _EOF_
    [DEFAULT]
    # LOGS/STATE
    debug = False
    verbose = True
    logdir = /var/log/nova
    state_path = /var/lib/nova
    lock_path = /var/lock/nova
    rootwrap_config = /etc/nova/rootwrap.conf
    dhcpbridge = /usr/bin/nova-dhcpbridge
    # SCHEDULER
    compute_scheduler_driver = nova.scheduler.filter_scheduler.FilterScheduler
    ## VOLUMES
    volume_api_class = nova.volume.cinder.API
    osapi_volume_listen_port=5900
    # DATABASE
    sql_connection = mysql://nova:nova@${YS_CON_MANAGE_IP}/nova
    # COMPUTE
    libvirt_type = kvm
    compute_driver = libvirt.LibvirtDriver
    instance_name_template = instance-%08x
    api_paste_config = /etc/nova/api-paste.ini
    # COMPUTE/APIS: if you have separate configs for separate services
    # this flag is required for both nova-api and nova-compute
    allow_resize_to_same_host = True
    # APIS
    osapi_compute_extension = nova.api.openstack.compute.contrib.standard_extensions
    ec2_dmz_host = ${YS_CON_MANAGE_IP}
    s3_host = ${YS_CON_MANAGE_IP}
    metadata_host=${YS_CON_MANAGE_IP}
    metadata_listen=0.0.0.0
    # RABBITMQ
    rabbit_host = ${YS_CON_MANAGE_IP}
    rabbit_password = guest
    # GLANCE
    image_service = nova.image.glance.GlanceImageService
    glance_api_servers = ${YS_CON_MANAGE_IP}:9292
    # NETWORK
    network_api_class = nova.network.quantumv2.api.API
    quantum_url = http://${YS_CON_MANAGE_IP}:9696
    quantum_auth_strategy = keystone
    quantum_admin_tenant_name = service
    quantum_admin_username = quantum
    quantum_admin_password = ${ADMIN_PASSWORD}
    quantum_admin_auth_url = http://${YS_CON_MANAGE_IP}:35357/v2.0
    service_quantum_metadata_proxy = True
    libvirt_vif_driver = nova.virt.libvirt.vif.LibvirtHybridOVSBridgeDriver
    linuxnet_interface_driver = nova.network.linux_net.LinuxOVSInterfaceDriver
    firewall_driver = nova.virt.libvirt.firewall.IptablesFirewallDriver
    # NOVNC CONSOLE
    novncproxy_base_url = http://${YS_CON_EXT_IP}:6080/vnc_auto.html
    # Change vncserver_proxyclient_address and vncserver_listen to match each compute host
    vncserver_proxyclient_address = ${YS_COM_EXT_IP}
    vncserver_listen = 0.0.0.0
    # AUTHENTICATION
    auth_strategy = keystone
    [keystone_authtoken]
    auth_host = ${YS_CON_MANAGE_IP}
    auth_port = 35357
    auth_protocol = http
    admin_tenant_name = service
    admin_user = nova
    admin_password = ${ADMIN_PASSWORD}
    signing_dir = /tmp/keystone-signing-nova
    _EOF_

启动 nova-compute 服务：

    service nova-compute restart

检查 nova 相关服务笑脸，找到计算节点：

    nova-manage service list

## 创建一个虚拟机
创建一个新的tenant

    keystone tenant-create --name project_one

创建一个新用户以及给其赋予角色

    keystone user-create --name=user_one --pass=user_one --tenant-id $put_id_of_project_one --email=user_one@domain.com
    keystone user-role-add --tenant-id $put_id_of_project_one  --user-id $put_id_of_user_one --role-id $put_id_of_member_role

创建一个新的网络

    quantum net-create --tenant-id $put_id_of_project_one net_proj_one

创建一个新的子网

    quantum subnet-create --tenant-id $put_id_of_project_one net_proj_one 50.50.1.0/24

创建一个路由

    quantum router-create --tenant-id $put_id_of_project_one router_proj_one

增加路由到三层代理

    quantum agent-list (to get the l3 agent ID)
    quantum l3-agent-router-add $l3_agent_ID router_proj_one    

增加路由到子网

    quantum router-interface-add $put_router_proj_one_id_here $put_subnet_id_here

重启quantum服务

    cd /etc/init.d/; for i in $( ls quantum-* ); do sudo service $i restart; done

创建一个外网到admin tenant

    quantum net-create --tenant-id $put_id_of_admin_tenant ext_net --router:external=True

为浮动ip创建子网

    quantum subnet-create --tenant-id $put_id_of_admin_tenant --allocation-pool start=59.65.233.231,end=59.65.233.234 --gateway 59.65.233.254 ext_net 59.65.233.0/24 --enable_dhcp=False

设置路由到外网网络

    quantum router-gateway-set $put_router_proj_one_id_here $put_id_of_ext_net_here

增加tenant环境变量

    nano creds_proj_one

    #Paste the following:
    export OS_TENANT_NAME=project_one
    export OS_USERNAME=user_one
    export OS_PASSWORD=user_one
    export OS_AUTH_URL="http://59.65.233.231:5000/v2.0/"

    source creds_proj_one

增加安全规则

    nova --no-cache secgroup-add-rule default icmp -1 -1 0.0.0.0/0
    nova --no-cache secgroup-add-rule default tcp 22 22 0.0.0.0/0

分配一个浮动ip

    quantum floatingip-create ext_net

启动一个虚拟机

    nova --no-cache boot --image $id_myFirstImage --flavor 1 my_first_vm

选择合适的端口到虚拟机：

    quantum port-list

将浮动ip分配给虚拟机

    quantum floatingip-associate $put_id_floating_ip $put_id_vm_port

## 开启端口

- TCP 22 (ssh)
- ICMP -1 (ping)
- TCP 3306 (mysql)
- TCP 3389 (远程桌面)

## 修改bug

quantum里面有一个bug，这个环境重启以后nova会无法启动，参考[aass](http://blog.sina.com.cn/s/blog_6de3aa8a0101lnar.html)修改源码可以解决

修改计算节点/usr/share/pyshared/nova/virt/libvirt/vif.py第360行所在函数

    def plug_ovs_hybrid(self, instance, vif):
        network, mapping = vif
        iface_id = self.get_ovs_interfaceid(mapping)
        br_name = self.get_br_name(mapping['vif_uuid'])
        v1_name, v2_name = self.get_veth_pair_names(mapping['vif_uuid'])

        if not linux_net.device_exists(br_name):
            utils.execute('brctl', 'addbr', br_name, run_as_root=True)
            utils.execute('brctl', 'setfd', br_name, 0, run_as_root=True)
            utils.execute('brctl', 'stp', br_name, 'off', run_as_root=True)

        if not linux_net.device_exists(v2_name):
            linux_net._create_veth_pair(v1_name, v2_name)
            utils.execute('ip', 'link', 'set', br_name, 'up', run_as_root=True)
            try:
                v1_tap="tap"+br_name[3:]
                try:
                    utils.execute('ovs-vsctl', 'del-port', br_name, v1_tap, run_as_root=True)
                except Exception,e:
                    pass
                utils.execute('brctl', 'addif', br_name, v1_name, run_as_root=True)
            except Exception,e:
                pass
            linux_net.create_ovs_vif_port(self.get_bridge_name(network),
                                          v2_name, iface_id, mapping['mac'],
                                          instance['uuid'])


## 其他可能问题

### 网卡配置问题

装完系统发现网卡竟然不亮，主要是服务器上有5个网卡，而我们只用到2-3个，结果是啥？结果就是配置了eth0和eth1，你却插到了eth5和eth6……

解决方法是利用ubuntu下的mii-tool命令，一个一个排查，看看是否插对了网卡

### 配置子网的问题

多个网卡意味着多个网段，在/etc/network/interfaces下是不能配置多个gateway的，解决的方式就是通过增加静态路由，这个可以参考网上的方式

发现子网没法访问，可以使用route add -net 172.16.0.0/16 dev eth0 来增加网络访问

这个问题可以通过route来查看自己网络的联通情况

### 终端命令行问题

1.执行keystone user-list时，遇到错误“Invalid Openstack Identity credentials".

解决：/etc/keystone/keystone.conf里的admin_token要与环境变量SERVICE_TOKEN相同值。

2.执行nova flavor-list时，遇到错误"Invalid Openstack Nova Credentials."

解决：环境变量OS_USERNAME, OS_PASSWORD, OS_TENANT_NAME等指定的username，passowrd，tenant应该存在于keystone里，如上所述。可以通过nova --debug flavor-list获得调试信息。

3.使用ubuntu官网镜像时需要使用密钥才能登录

创建密钥
ssh-keygen
上传密钥
nova keypair-add --pub_key .ssh/id_rsa.pub key1
创建虚拟机时选择相应密钥
使用密钥登录
ssh -i .ssh/id_rsa ubuntu@192.168.22.35

4.网络虚拟机里不能git clone
修改mtu值
sudo ifconfig eth0 mtu 1000
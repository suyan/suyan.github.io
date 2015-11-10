---
layout: post
title: symfony 常用资源
category: 资源
tags: symfony
keywords: symfony
description: 
---

### 安装composer.phar

    curl -s http://getcomposer.org/installer | php
    //或者
    <span style="color: #333333;">php -r "readfile('https://getcomposer.org/installer');" | php </span>

### 创建项目

    #安装symfony框架
    php composer.phar create-project symfony/framework-standard-edition path/to/install
    chown www-data:www-data install.log #建议更改目录文件所属权
    php composer.phar update //可以用来更新项目组件代码
    php composer.phar update--prefer-dist //结尾参数可以让更新或者下载速度更快，以压缩包的形式下载好以后解压进行创建或者更新升级操作。
    php composer.phar update

### 使用symfony的命令
    
    php app/console //命令列表
    #创建bundle
    php ./app/console generate:bundle --namespace="Deepin\DeepinID\UserBundle" --dir="src/" --format="yml" --no-interaction
    #关于doctrine:entity命令
    php ./app/console generate:doctrine:entity --entity="DeepinDeepinIDUserBundle:UserLoginlog" 生成指定entity
    php app/console doctrine:schema:update  这行并不会真正执行，只是计算下需要执行多少条sql语句
    php app/console doctrine:schema:update --dump-sql 将要执行的sql语句打印到命令行
    php app/console doctrine:schema:update --force 执行，这才是真正的执行

### 自己编写或者修改的entity类似这样

    <?php
    namespace Deepin\DeepinID\UserBundle\Entity;
    use Doctrine\ORM\Mapping as ORM;
    /**
     * User
     *
     * @ORM\Tabl e(
     *      name="user",
     *      uniqueConstraints={
     *          @ORM\UniqueConstraint(name="username_unique", columns={"username"}),
     *          @ORM\UniqueConstraint(name="email_unique", columns={"email"})
     *      }
     * )
     * @ORM\Entity
     */
    class User
    {
        private $id;
        private $username;
        private $password;
        private $email;
        private $mobile;
    }

### 更多命令操作

    #创建model
    php app/console doctrine:generate:entities Acme/StoreBundle/Entity/Product 创建一个model
    php app/console doctrine:generate:entities Deepin 创建多个model
    #创建from
    php app/console doctrine:generate:form Deepin\DeepinID\UserBundle:User
    #刷新缓存
    sudo -u www-data php app/console cache:clear --env=prod
    #翻译
    sudo -u www-data php app/console translation:update --output-format="yml" --dump-messages --force --clean en DeepinIDUserBundle
    #调试
    \Doctrine\Common\Util\Debug::dump($form); #控制器中
    {{ dump(form) }} #模板中
    #前端素材
    php app/console assets:install --symlink
    #单元测试
    phpunit -c app/ src/Deepin

### 单元测试示例，test/controller

    public function Common($get_url,$filter,$autologin=false)
    {
        if ($autologin) {
            # Simulation of the login operation
            
        }
        $client = static::createClient();
        $crawler = $client->request('GET', $get_url);
        $contains=$client->getContainer()->get('translator')->trans('deepinid.user.'.$filter);
        // echo($get_url.' '.$contains."\n");
        $this->assertTrue($crawler->filter('html:contains("'.$contains.'")')->count() > 0);
    }
    public function testLogin(){
        $this->Common('/login','deepin_user_center');
    }

### 实体关联

    use Doctrine\Common\Collections\ArrayCollection;
    use Doctrine\ORM\Mapping as ORM;
    class User implements UserInterface, \Serializable
    {
        private $isActive;
     
        public function __construct()
        {
            $this->userInfo = new ArrayCollection();
            $this->isActive = true;
            // ......
        }
     
        /**
         * @ORM\OneToOne(targetEntity = "UserInfo")
         * @ORM\JoinColumn(name = "id", referencedColumnName = "id")
         **/
        private $userInfo;
     
        public function setUserInfo($userInfo)
        {
            $this->userInfo = $userInfo;
            return $this;
        }
     
        public function getUserInfo()
        {
            return $this->userInfo;
        }
    }

### 测试数据

    "doctrine/doctrine-fixtures-bundle": "2.2.*", // 安装测试数据的bundle
    sudo -u www-data app/console d:f:load --fixtures=src/Deepin/DeepinID/FriendBundle/DataFixtures　//执行测试数据

### 测试数据编写实例

    <?php
    namespace Deepin\DeepinIDFriendBundle\DataFixtures\ORM;
     
    use Doctrine\Common\DataFixtures\AbstractFixture;
    use Doctrine\Common\DataFixtures\FixtureInterface;
    use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
    use Doctrine\Common\Persistence\ObjectManager;
    use Deepin\DeepinID\UserBundle\Entity\User;
    use Deepin\DeepinID\UserBundle\Entity\UserInfo;
    use Deepin\DeepinID\FriendBundle\Entity\FriendPermission;
    use Deepin\DeepinID\UserBundle\Common\UserUtilTrait;
     
    /**
     * Add faker data of user for testing.
     */
    class FriendFixtures extends AbstractFixture implements FixtureInterface, OrderedFixtureInterface
    {
        use UserUtilTrait;
        private $manager;
     
        /**
         * {@inheritDoc}
         */
        public function load(ObjectManager $manager)
        {
            $this->manager = $manager;
            $this->insertDataFix('clh21@126.com','123456');
            $this->insertDataFix('clh021@gmail.com','123456');
            for ($i=0; $i < 20; $i++) {
                $this->insertDataFix();
            }
        }
     
        public function insertDataFix($email = null, $password = null, $username = null)
        {
            $username = $username ? $username : date('is').substr(microtime(),1,4);
            $password = $password ? $password : $username;
            $email = $email ? $email : $username.'@dongshenghuo.com';
            $user = new User();
            $user->setEmail($email);
            $user->setPassword($this->getMd5Password($password));
            $user->setUsername($username);
            $this->manager->persist($user);
            $this->manager->flush();
     
            $userinfo = new UserInfo();
            $userinfo->setId($user->getId());
            $userinfo->setLoginCount(0);
            $userinfo->setRegistered(new \DateTime(date('Y-m-d H:i:s')));
            $userinfo->setActivity(time() + (3600 * 24 * 3));
            $userinfo->setStatus(User::$STATUS['ACTIVITIED']);
            $this->manager->persist($userinfo);
            $this->manager->flush();
     
            $permissionData = new FriendPermission();
            $permissionData->setUserId($user->getId());
            $permissionData->setPrivacy($this->getArrMultipleRandData(array('can_be_added','can_recommend_to_others')));
            $permissionData->setVerifyMethod($this->getArrRadioRandData(array('all_can_request','must_be_answered')));
            $permissionData->setVerifyAnswer1('my name?');
            $permissionData->setVerifyQuestion1('leehom');
            if ( rand()%2 )
            {
                $permissionData->setVerifyAnswer2('my age?');
                $permissionData->setVerifyQuestion2('27');
            }
            if ( rand()%2 )
            {
            $permissionData->setVerifyAnswer3('my height?');
            $permissionData->setVerifyQuestion3('+2');
            }
            $this->manager->persist($permissionData);
            $this->manager->flush();
        }
        public function getArrRadioRandData(array $resourceArrData)
        {
            return $resourceArrData[rand(0,count($resourceArrData)-1)];
        }
     
        public function getArrMultipleRandData(array $resourceArrData)
        {
            $result = array();
            if (is_array($resourceArrData)) {
                foreach ($resourceArrData as $v) {
                    if (rand()%2) {
                        $result[] = $v;
                    }
                }
            }
     
            return $result;
        }
     
        /**
         * {@inheritDoc}
         */
        public function getOrder()
        {
            return 1;
        }
    }

### 更多命令行说明

    用法:
    [选项] 命令 [参数]

    选项:
    –help -h 显示本帮助信息。
    –quiet -q 不输出任何信息。
    –verbose -v 增加信息的详细程度。
    –version -V 显示本程序的版本号。
    –ansi 迫使 ANSI 输出。
    –no-ansi 禁止 ANSI 输出。
    –no-interaction -n 不进行任何交互问题的询问。
    –shell -s 启动 shell。
    –env -e 环境名。
    –no-debug 关闭调试模式。

    Available commands:
    help 显示命令的帮助信息
    list 命令列表
    assetic
    assetic:dump 将所有asset保存到文件系统。
    assets
    assets:install 在公用网站目录中安装各Bundle网站的asset。
    cache
    cache:clear 清除缓存
    cache:warmup Warms up an empty cache
    container
    container:debug 为应用程序显示当前服务
    doctrine
    doctrine:cache:clear-metadata 为一个实体管理器清除所有的元数据缓存。
    doctrine:cache:clear-query 为一个实体管理器清除所有的查询缓存
    doctrine:cache:clear-result 为一个实体管理器清除结果缓存
    doctrine:database:create 创建一个已配置的数据库
    doctrine:database:drop 删除一个已配置的数据库
    doctrine:ensure-production-settings 确认在生产环境下Doctrine的配置是正确的
    doctrine:generate:crud 基于Doctrine实体生成增删改查（CRUD）
    doctrine:generate:entities 从您的映射信息中生成实体类和方法的存根
    doctrine:generate:entity 生成Bundle中的新Doctrine实体
    doctrine:generate:form 基于Doctrine实体生成一个表单类型类
    doctrine:mapping:convert 在支持的格式间转换映射信息
    doctrine:mapping:import 从已存在的数据库中导入映射信息
    doctrine:mapping:info 显示所有被映射实体的基本信息
    doctrine:query:dql 直接从命令行中运行任何的DQL
    doctrine:query:sql 直接从命令行中运行任何的SQL
    doctrine:schema:create 执行（或转储）生成数据库方案所需的SQL语句
    doctrine:schema:drop 执行（或转储）删除数据库方案所需的SQL语句
    doctrine:schema:update 执行（或转储）更新匹配当前映射元数据数据库方案所需的SQL语句
    generate
    generate:bundle 生成Bundle
    generate:doctrine:crud 基于Doctrine实体生成CRUD
    generate:doctrine:entities 从您的映射信息中生成实体类和方法的存根
    generate:doctrine:entity 在Bundle中生成一个Doctrine的新实体
    generate:doctrine:form 基于Doctrine实体生成一个表单类型类
    init
    init:acl 在数据库中安装ACL数据表
    router
    router:debug 为应用程序显示当前路由
    router:dump-apache 将所有路由转储为Apache重写规则
    swiftmailer
    swiftmailer:spool:send 从池中发送电子邮件

### symfony目录结构说明

    /var/www/ <- Web根目录
        Symfony/ <- Symfony2解压的根目录
            app/ <- 存放symfony的核心文件的目录
                cache/ <- 存放缓存文件的目录
                config/ <- 存放全局配置的目录
                logs/ <- 存放日志的目录
            src/ <- 应用程序源代码（自己写的）
                ...
            vendor/ <- 供应商或第三方的模组和插件（别人写的）
                ...
            web/ <- Web入口（访问入口）
                app.php <- 生产环境下的前端控制器


### symfony常见错误修复

	#为了保险起见 
	rm -rf app/cache/* 
	rm -rf app/logs/* 
	 
	#设置ACL 
	sudo setfacl -R -m u:www-data:rwx -m u:firehare:rwx app/cache app/logs 
	sudo setfacl -dR -m u:www-data:rwx -m u:firehare:rwx app/cache app/logs 
	 
	#如果上面的命令还出错，请检查
	#setfacl是否已经安装，如果没有的话，可以通过以下命令安装（在Ubuntu 11.10中好象已经缺省安装了，包为叫acl）：
	#sudo apt-get install setfacl 
	#如果setfacl已经安装，那么请查看/etc/fstab文件，看看是否添加了acl选项：
	# /var was on /dev/sda7 during installation 
	#UUID=c2cc4104-b421-479a-b21a-1108f8895110 /var  ext4  defaults,acl  0  2

### 添加新的应用程序模块

	#在app/autoload.php文件中添加
	$loader->registerNamespaces(array(  
	    // ...
	    //添加自定义的名称空间  
	    'Acme' => __DIR__.'/../src',  
	    // ...  
	));

	#在app/kernel.php文件中添加
	public function registerBundles() 
	{ 
	    $bundles = array( 
	        // ... 
	        new Acme\HelloBundle\AcmeHelloBundle(), 
	    ); 
	 
	    // ... 
	 
	    return $bundles; 
	}

	#添加路由，参照下面的代码
	
	hello: 
    resource: "@AcmeHelloBundle/Resources/config/routing.yml"

    #自己的路由文件 #src/Acme/HelloBundle/Resources/config/routing.yml
    hello: 
    pattern: /hello/{name} 
    defaults: { _controller: AcmeHelloBundle:Hello:index, name:'pu' }

    #访问地址类似：http://localhost/web/app_dev.php/hello/index 
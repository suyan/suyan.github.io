---
layout: post
title: Docker 使用总结
category: 工具
tags: Docker
keywords: Docker
---

## Docker 基本概念

### 镜像 Image

镜像是一些打包好的已有的环境，可以被用来启动和创建容器，本身不能被直接修改。

### 容器 Container

容器是镜像的实例化，是可以修改的，但是都是临时修改。

### 容器启动过程

1. 检查本地是否存在指定的镜像，不存在就从公有仓库下载
2. 利用镜像创建并启动一个容器
3. 分配一个文件系统，并在只读的镜像层外面挂载一层可读写层
4. 从宿主主机配置的网桥接口中桥接一个虚拟接口到容器中去
5. 从地址池配置一个 ip 地址给容器
6. 执行用户指定的应用程序
7. 执行完毕后容器被终止

## Docker 常用命令

### Image 操作

#### 基本操作

- 显示本地所有镜像

```
docker images
```

- 搜索一个image

```
docker search image_name
```

- 下载image

```
docker pull image_name
```

- 删除镜像

```
docker rmi image_name
```

- 显示镜像历史

```
docker history image_name
```

#### 制作镜像

```
docker build -t image_name DockerfilePath
```

这里DockerfilePath是Context上下文目录，在创建的时候会全部上传到Docker Server端，所以这个目录不要太大

#### 迁移镜像

- 保存镜像到文件

```
docker save image_name -o file.tar
```

- 加载一个tar包的镜像

```
docker load -i file.tar
```

### Container 操作

#### 显示相关

- 查看运行中的容器

```
docker ps

# 一行显示全部容器
docker ps | less -S

# 最近一次启动
docker ps -l

# 列出所有容器
docker ps -a
```

- 显示一个运行的容器里面的进程信息

```
docker top cid
```

- 显示容器详细信息

```
docker inspect cid
```

- 查看容器日志

```
docker logs cid

# 实时查看日志输出
docker logs -f cid
```

- 查看容器更改

```
docker diff cid
```

- 查看容器root用户密码

```
docker logs cid 2>&1 | grep '^User: ' | tail -n1
```

#### 运行相关

- 启动容器并执行一个命令（交互）

```
# -t 终端
# -i 交互操作
docker run -it ubuntu /bin/bash

# 运行一个hello word然后就自动关闭
docker run image_name echo "hello word"

# 命名并启动容器
docker run --name test ubuntu

# 后台运行一个容器
docker run -d -it ubuntu

# 映射端口
docker run -p 8080:8080 ubuntu

# 挂载volumn
docker run -v ./test:/var/www

# container 内 root 拥有真正root权限
docker run --privileged=false

# 启动完镜像后自动删除
docker run -it --rm ubuntu bash
```

- 附着到正在运行的容器, 附着完以后退出会导致容器也终止

```
docker attach cid
```

- 进入正在运行的 container 并且执行

```
docker exec -it 839a6cfc9496 /bin/bash
```

- 在容器中运行一段程序

```
docker run ubuntu apt-get update
```

- 拷贝文件出来

```
docker cp cid:/container_path to_path  
```

#### 修改容器

image相当于类，container相当于实例，不过可以动态给实例安装新软件，然后把这个container用commit命令固化成一个image

- 提交一个commit

```
docker commit cid new_image_name
```

- 删除容器

```
docker rm cid

# 强制删除
docker rm -f cid

# 删除所有容器
docker rm `docker ps -a -q`
```

- 状态修改

```
docker start/stop/kill/restart cid
```

- 更改名字

```
docker rename old new
```

#### 链接容器

sonar容器连接到mysql容器，并将mysql容器重命名为db。这样，sonar容器就可以使用db的相关的环境变量了。

```
docker run -it --name sonar -d -link mysql:db tpires/sonar-server
```

### 仓库操作

- 登录到docker仓库

```
docker login
```

- 上传镜像

```
docker push new_image_name
```

## Dockerfile 常用命令

有了 Dockerfile 可以自定义一些自己需要的镜像，在熟悉了 Docker 基本操作，然后使用过一些别人提供好的镜像以后，难免需要自己修改一部分。

### FROM

指定基础镜像。例如：

- ubuntu
- nginx
- redis
- ...

```
FROM nginx
```

### RUN

执行一些命令

```
RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
```

每个RUN命令都会在容器中建立一层，所以尽量合并多个命令。例如

```
RUN buildDeps='gcc libc6-dev make' \
    && apt-get update \
    && apt-get install -y $buildDeps \
    ...
```

### COPY

复制文件到指定目录 source -> target

```
COPY ./package.json /usr/src/app
```

### CMD

容器的启动命令

```
CMD ["nginx", "-g", "daemon off;"]
```

这个命令可以在启动时被覆盖。另外它也可以为 ENTRYPOINT 提供参数。

> CMD 理论上只能执行一次，如果想要执行两个命令，需要使用 `&` 来连接两个命令，或者使用一个bash文件。更为高级一点的方法是用supervisor来管理

### ENTRYPOINT

ENTRYPOINT 和 CMD 有一部分重复工作，但是 ENTRYPOINT 可以让容器像软件一样执行。例如

```
ENTRYPOINT /bin/echo
```

在容器启动时，之后增加的内容都属于这个命令的参数。

### ENV

设置环境变量。

`ENV key value`

### ARG

构建参数，在容器启动后不会存在。

### VOLUME

定义匿名卷，以免用户忘了挂载volumn，导致大量写入。这个 Volume 在容器启动前可以添加内容，但是并不是实际操作用户挂载的内容。在用户挂载完 volume 后，原来写在这里的内容会被复制到用户挂载的目录。

> 注意：在 VOLUME 命令之后对这个目录的所有操作，将被忽略。

### EXPOSE

申明端口，可以用来默认映射端口，以及容器间互通。

```
EXPOSE 22 80
```

### WORKDIR

指定工作目录。不仅是当前 docker 中的目录，同时也是运行容器时刚刚登录以后的目录。

### USER

指定当前用户。

```
RUN groupadd -r redis && useradd -r -g redis redis
USER redis
RUN [ "redis-server" ]
```

### HEALTHCHECK

健康检查

### ONBUILD

当此容器作为别的容器的基础容器时操作内容

```
FROM node:slim
RUN "mkdir /app"
WORKDIR /app
ONBUILD COPY ./package.json /app
ONBUILD RUN [ "npm", "install" ]
ONBUILD COPY . /app/
CMD [ "npm", "start" ]
```

## Docker-compose 常用指令

### depends_on

这个不仅可以保证build的先后顺序，还可以省去links的设置

### links

和docker run命令一致，主要原因是在每次新开启container的时候，port可能会变，所以有了这个设置可以保证每次都可以绑定到正确的值。

## 实例操作

### 创建一个LAMP的项目

首先是目录结构

```
├── README.md
├── apache
│   └── virtualhost.conf
├── docker-compose.yml
├── mysql
│   ├── Dockerfile
│   └── my.cnf
├── php
│   ├── Dockerfile
│   └── php.ini
└── src
    └── index.php
```

创建 docker-compose.yml

```yml
version: '2'
services:
  mysql:
    image: mysql
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: phpdata
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    volumes:
      - dbdata:/var/lib/mysql
  php:
    build: ./php
    ports:
      - '8080:80'
    volumes:
      - ./src:/var/www/html
      - ./apache:/etc/apache2/sites-enabled/
    depends_on:
      - mysql
  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    ports:
      - '8081:80'
    links:
      - mysql:db
    environment:
      PMA_USER: root
      PMA_PASSWORD: password
    volumes:
      - adminsessions:/sessions
    depends_on:
      - mysql
      - php
volumes:
  dbdata:
  adminsessions:
```

## 问题记录

### Mysql 挂载 volume 后启动时显示无权限

设置mysql的启动模式 `privileged:true`

另外这个问题一般不会发生，我之前遇到主要原因是我把多个 volume 都映射到了一个上面，导致目录内部读写发生冲突。



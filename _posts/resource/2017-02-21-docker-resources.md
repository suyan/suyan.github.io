---
layout: post
title: Docker 常用资源
category: 资源
tags: Docker
keywords: Docker
---

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

- 发布 image

```
docker push new_image_name
```

#### 制作镜像

```
docker build -t image_name DockerfilePath
```

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
docker run -i -t ubuntu /bin/bash

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
```

- 附着到正在运行的容器, 附着完以后退出会导致容器也终止

```
docker attach cid
```

- 进入正在运行的 container 并且执行

```
# -t 选项让Docker分配一个伪终端（pseudo-tty）并绑定到容器的标准输入上
# -i 则让容器的标准输入保持打开
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
docker rename old  new
```

#### 链接容器

sonar容器连接到mysql容器，并将mysql容器重命名为db。这样，sonar容器就可以使用db的相关的环境变量了。

```
docker run -it --name sonar -d -link mysql:db   tpires/sonar-server
```

### 仓库操作

- 登录到docker仓库

```
docker login
```



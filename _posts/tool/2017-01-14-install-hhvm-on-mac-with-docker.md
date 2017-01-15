---
layout: post
title: 在 Mac 下用 Docker 安装测试 HHVM
category: 工具
tags: [Mac, Docker]
keywords: Mac,Docker,HHVM,Hack
---

本来在 Mac 下用 Homebrew 安装 HHVM 应该是最容易的，但是最近有[一个 bug](https://github.com/hhvm/homebrew-hhvm/issues/68) 导致我在自己电脑上一直安装失败，所以我只好决定用 Docker 来装。

## 安装 Docker 

现在在 Mac 下安装 Docker 非常方便，到 [官网](https://docs.docker.com/docker-for-mac/) 下载一个 dmg 包直接安装就好。

## 制作 HHVM 镜像

[HHVM](https://github.com/hhvm/hhvm-docker) 官方提供了 Docker image，但是我在直接启动启动时发现官方的 image 竟然没有启动 hh_client ，所以需要自己稍微修改一下。

另外在 build 过程中可能因为网络问题会失败... 因为你懂得的原因。所以直接把这个过程放在国外服务器上执行吧，速度快还不会出问题。

### 下载 Dockerfile

```bash
git clone https://github.com/hhvm/hhvm-docker.git
```

官方给了 `hhvm-latest-proxygen` 和 `hhvm-latest` 的 Dockerfile，这里我推荐前者，直接就可以映射一个代码目录，在浏览器测试 HHVM。后者的话需要登陆到 container 里面测试代码，不是非常方便。

### 修改 Dockerfile

因为运行 HHVM 需要启动 typechecker，所以需要稍微修改一下 HHVM server 的启动命令。在刚刚下载好的目录 `hhvm-latest-proxygen` 中代码的最后一行改为:

```bash
CMD ["/usr/bin/hhvm", "-m", "server", "-c", "/etc/hhvm/server.ini", "-c", "/etc/hhvm/site.ini", "-d", "hhvm.hack.lang.look_for_typechecker=0"]
```

### 生成自己的 image

然后在 `hhvm-latest-proxygen` 目录下执行下面命令即可：

```bash
docker build -t yourname/hhvm-proxygen .
```

## 上传到到自己仓库中

我就直接上传到 [Docker Hub](http://hub.docker.com) 了。

先用 `docker login` 登陆一下，然后执行下面命令就行了

```bash
docker push yourname/hhvm-proxygen
```

## 启动 HHVM

启动的话我建议弄一个自己的工作目录，建立一个 `index.php` 文件，写入以下内容

```php
<?hh
phpinfo();
```

然后在工作目录下执行以下命令就可以了。

```bash
docker run --name=hhvm -v $(pwd):/var/www/public -d -p 80:80 yourname/hhvm-proxygen
```

我绑定了80端口，所以直接打开 `http://localhost` 就可以测试了。想看 log 的话可以执行

```bash
docker logs hhvm
```





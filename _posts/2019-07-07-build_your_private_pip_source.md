---
title: "搭建私有pip源"
author: "cloga"
comments: yes
layout: post
slug: build_your_private_pip_source
tags:
- python
categories: 
- python

---

在项目交付过程中，经常遇到没有外网的环境，这时系统如果需要依赖pip源，那么通常需要搭建私有pip源。这里需要解决三个问题。

- 搭建私有pip服务器
- 下载/更新私有pip服务中的pip包
- 在pip客户端中设置本地pip源

## 搭建私有pip服务器

官方提供了多个pypi的实现，具体联接为：https://wiki.python.org/moin/PyPiImplementations

- [chishop](https://github.com/ask/chishop)和[djangopypi](https://github.com/benliles/djangopypi)，基于django
- [Plone Software Center](https://pypi.python.org/pypi/Products.PloneSoftwareCenter)
- [pypiserver](http://pypi.python.org/pypi/pypiserver)，最小化pypi服务器，易于安装和使用
- [Warehouse](https://pypi.python.org/pypi/warehouse)，下一代Python包仓库

官网也列出了使用apache搭建私有pip服务器的一些httpd.conf配置。

这里选用轻量级的pypiserver作为私有pip服务器。

### 安装pypiserver

```shell
pip install pypiserver
```

### 启动pypiserver

```shell
pypi-server -p [端口] [python安装包路径]
```

这个时候是没有任何包的，需要先下载pip包才能正常使用。

## 下载/更新私有pip服务中的pip包

这里提供两种方式来下载/更新pip包，一种是使用[bandersnatch](https://github.com/pypa/bandersnatch/)将指定pypi源完整下载下来，另一种是使用pip2pi(https://github.com/wolever/pip2pi) 从requirements.txt来构建pip源。前者是自上而下构建完整的pypi镜像，优点是包会比较全，缺点也显而易见占用磁盘空间较大，需要初始化时间比较久；后者则是自下而上来构建pip源，从项目的实际依赖出发，不断完善pip源，启动较快，但是包肯定不够全。


### 使用bandersnatch

#### 安装bandersnatch

```shell
pip install bandersnatch
```

#### 配置bandersnatch

```shell
sudo bandersnatch mirror
```

运行后，会检查/etc/bandersnatch.conf是否存在，如果不存在则创建对应文件，如果存在则按照其中配置进行pypi镜像同步。

修改一下/etc/bandersnatch.conf配置信息，重点需要修改directory和master，前者是本地存储pypi的路径（启动pypi-server也需要用到），后者是要用来镜像的pypi镜像源。

```
[mirror]
; The directory where the mirror data will be stored.
directory = /srv/pypi

; The PyPI server which will be mirrored.
; master = https://testpypi.python.org
; scheme for PyPI server MUST be https
master = https://pypi.python.org
```

#### 启动bandersnatch

配置完成后再运行

```shell
bandersnatch mirror
```

开始从pypi镜像源同步pip包

```
2019-07-07 12:45:16,166 WARNING: Enabling Plugins keys will move from blacklist:plugins to plugins:enabled in version 4.0.0 - Documentation @ https://bandersnatch.readthedocs.io/
2019-07-07 12:45:16,347 INFO: bandersnatch/3.4.1 (cpython 3.7.1-final0, Darwin x86_64)
2019-07-07 12:45:16,347 INFO: Setting up mirror directory: ~/Documents/packages
2019-07-07 12:45:16,349 INFO: Setting up mirror directory: ~/Documents/packages/web/simple
2019-07-07 12:45:16,349 INFO: Setting up mirror directory: ~/Documents/packages/web/packages
2019-07-07 12:45:16,349 INFO: Setting up mirror directory: ~/Documents/packages/web/local-stats/days
2019-07-07 12:45:16,349 INFO: Generation file missing. Reinitialising status files.
2019-07-07 12:45:16,351 INFO: Status file ~/Documents/packages/status missing. Starting over.
2019-07-07 12:45:16,351 INFO: Syncing with https://pypi.org.
2019-07-07 12:45:16,351 INFO: Current mirror serial: 0
2019-07-07 12:45:16,351 INFO: Syncing all packages.
```

### 使用pip2pi

#### 安装pip2pi

```shell
pip install pip2pi
```

#### 按照requirements.txt下载pip包

生成requirements.txt

```shell
pip freeze > requirements.txt
```

使用如下命令下载pip包

```shell
pip2pi [本地pypi路径] -r requirements.txt
```

### 更新pip包

初始化私有pip源之后有以下几种方式来更新其中的pip包：

- 定期运行```bandersnatch mirror```，这样会按照按照conf中的配置重新更新整个pip源
- 定期运行```pip2pi [本地pypi路径] -r requirements.txt```，会更新requirements.txt中的pip包
- 定期运行```pypi-server -U [本地pypi路径]```，这是由pypi-server，会更新本地pypi路径下的包到最新版本


此时，启动pypiserver后，可以在本地的对应地址看到相关的信息。

![pypiserver-hp](/files/pypiserver-hp.png){:height="50%" width="50%"}

![pypiserver-simple](/files/pypiserver-simple.png){:height="50%" width="50%"}

## 在pip客户端中设置本地pip源

有多种方式可以指定额外的pip源

### 单次pip命令

```shell
pip install  --extra-index-url http://localhost:8080/simple/
```

### 在环境变量中设置```PIP_EXTRA_INDEX_URL```

例如在```~/.bash_profile```增加环境变量

```shell
export PIP_EXTRA_INDEX_URL=http://localhost:8080/simple/
```

### 在pip设置文件```~/.pip/pip.conf```中设置```extra-index-url```

```shell
[global]
extra-index-url = http://localhost:8080/simple/
```





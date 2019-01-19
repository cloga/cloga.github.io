---
title: "从0开始制造一个docker自定义镜像"
author: "cloga"
comments: yes
layout: post
slug: custom_docker_image
tags:
- docker
categories: docker
---

docker容器技术现在火的一塌糊涂，最近的工作刚好和这部分内容有交集，就动手搞了一下，这里记录下Docker使用的相关流程。

## 安装Docker

由于我用的是mac，docker是基于linux系统，因此需要下载[docker desktop](https://hub.docker.com/editions/community/docker-ce-desktop-mac)，是一个mac下的app，下载后放入应用程序中就可以运行。

![image-20190119161549002](/files/image-20190119161549002.png){:height="50%" width="50%"}

运行起来会后在顶部的状态栏中常驻一个小鲸鱼的小图标，点击这个图标可以进行重启，退出等操作。

这iterm2中输入docker version，能看到docker相关信息就说明docker安装成功了，可以开始你的docker之旅吧。

![image-20190119162143952](/files/image-20190119162143952.png){:height="50%" width="50%"}

自定义镜像是由基础镜像和自定义环境构成。这个例子使用的基础镜像是centos，自定义环境使用 tensorflow的模型例子 https://github.com/tensorflow/models

## 启动一个基础镜像 

```
docker run -it --name centos centos:latest /bin/bash
```

docker run命令是启动一个docker容器

-it是指交互式模式

—name是定义容器名称

centos:latest是具体的镜像名称及镜像标签，默认会先从本地的docker镜像库，本地镜像库不存在则会从docker hub上寻找

/bin/bash是交互模式运行的命令

![image-20190119163306494](/files/image-20190119163306494.png){:height="50%" width="50%"}

运行完这段代码后会下载相关镜像并进入容器内部，运行/bin/bash

使用exit可以退出容器，使用-it交互模型启动的容器，退出后容器会变成退出状态。

使用docker ps可以查看正在运行的容器。由于刚刚的容器已经退出了，所以此时的列表为空。

可以使用docker ps -a查看所有的容器。

![image-20190119163633086](/files/image-20190119163633086.png){:height="50%" width="50%"}

可以看到刚才运行的容器也显示出来了，状态是退出。

使用docker images可以显示本地docker仓库中的所有镜像。

![image-20190119163813951](/files/image-20190119163813951.png){:height="50%" width="50%"}

由于tensorflow model需要使用juppyter来查看运行效果，因此，还需要在docker容器运行时将jupyter端口映射到外部，此外，通常还需要将宿主机的硬盘挂载到容器中，这样容器释放后数据还是会在宿主机的硬盘上，同时也可以多个docker共享数据。

让我们先删除之前的这个容器。

```
docker rm <容器ID>
```

rm后面的参数是对应的容器ID，容器ID是通过docker ps -a获得的。

如果要将相关的镜像也删除则需要使用

```
docker image rm <镜像ID>
```

让我们再重启创建一个docker容器，这次需要将jupyter的端口映射出来，同时要讲一个宿主机的目录挂载到docker中。

```
docker run 
	-it 
	--name centos_jupyter
	-v /Users/cloga/Documents/models/research/object_detection:/mnt 
	-p 9999:8888
	centos:latest /bin/bash
```

-v 是磁盘挂载，格式为宿主机的目录:docker目录

-p 是端口映射，格式为宿主机的端口:docker端口

查看一下磁盘挂载是否成功。

![image-20190119165500240](/files/image-20190119165500240.png){:height="50%" width="50%"}

mnt目录存在并且内容也是宿主机上的文件。说明磁盘挂载成功了。

## 配置自定义的环境

要验证端口映射是不是成功需要在docker容器中安装一个jupyter并启动。jupyter notebook的安装可以参考[服务器脚本开发效率神器jupyter notebook](http://cloga.info/python/2017/05/13/efficiency-tool)。

```
yum install -y bzip2
curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
conda install jupyter
```

如果你退出了刚刚的docker容器，导致容器退出，不用怕，只需要docker start，重启启动docker即可。

![image-20190119170304598](/files/image-20190119170304598.png){:height="50%" width="50%"}

dokcer ps命令可以显示容器相关的信息，包括使用哪个镜像创建，创建时间，启动的时候的命令以及端口映射等。

这种情况下，或者使用docker run -d时docker是在后台运行，此时想要进入容器可以使用如下命令：

```
docker exec -it <容器名称> /bin/bash
```

### 跑tensorflow的物体识别的demo

启动jupyter notebook，记录下token

```
jupyter notebook --ip=0.0.0.0 --port=8888 --allow-root
```

在浏览器打开localhost:9999，输入token后

![image-20190119174348752](/files/image-20190119174348752.png){:height="50%" width="50%"}

说明jupyter启动成功，并且docker内的8888端口也成功映射到宿主机的9999端口

在后台运行jupyter

```
nohup jupyter notebook --ip=0.0.0.0 --port=8888 --allow-root&
```

安装git，并把tensorflow models下载到本地

```
yum install git
git clone https://github.com/tensorflow/models.git
```



## 将容器导出为容器文件

## 将自定义容器环境导入为docker镜像

## 用自定义镜像创建一个容器






---
title: "rancher搭建一个k8s集群"
author: "cloga"
comments: yes
layout: post
slug: rancher_intro
tags:
- docker
- k8s
categories: docker
---

[rancher](https://rancher.com/)是一个管理多k8s集群的开源工具，通过rancher可以快速创建和管理多个k8s集群，包括aws，gke，阿里云等公有云厂商及自身的基础设施。

## 安装rancher

rancher自身也是基于docker，因此首先要在集群上安装docker。在centos安装docker可以使用yum install。

```shell
yum install docker
```

按照rancher官网的指导安装rancher镜像。

```shell
sudo docker run -d --restart=unless-stopped -p 80:80 -p 443:443 rancher/rancher
```

**-p:** 是端口映射，格式为：主机(宿主)端口:容器端口

## 设置rancher

访问https:hostname，就可以进入rancher的登录页面

第一次登录需要数据用户名和密码

接下来需要填入集群master节点的ip地址，k8s所有节点需要都能访问这ip。

![image-20181230114018982](/Users/cloga/Library/Application Support/typora-user-images/image-20181230114018982.png)

### 常用的docker命令

```shell
docker ps // 查看所有正在运行容器
docker stop containerId // containerId 是容器的ID
docker ps -a // 查看所有容器
docker ps -a -q // 查看所有容器ID
docker stop $(docker ps -a -q) //  stop停止所有容器
docker  rm $(docker ps -a -q) //   remove删除所有容器
```

设置k8s集群

![image-20181230114201379](/Users/cloga/Library/Application Support/typora-user-images/image-20181230114201379.png)

点击 add cluster

![image-20181230114326553](/Users/cloga/Library/Application Support/typora-user-images/image-20181230114326553.png)

手动安装需要选择custom，添加k8s集群名

选择下一步

![image-20181230114732513](/Users/cloga/Library/Application Support/typora-user-images/image-20181230114732513.png)

在不同的节点上运行给到的docker命令。在主节点可以选择全部三个节点角色，其他的计算节点只需要选择work角色。

![image-20181230115326867](/Users/cloga/Library/Application Support/typora-user-images/image-20181230115326867.png)

在节点上运行了对应的命令后，rancher会显示集群中有对应的节点加入。

![image-20181230115616101](/Users/cloga/Library/Application Support/typora-user-images/image-20181230115616101.png)

如果后续需要加入更多的节点，可以在节点doshboard页点击edit重新获得对应的docker命令。

```shell
yum install docker
service docker start
```


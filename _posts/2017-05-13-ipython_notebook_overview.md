---
title: "服务器脚本开发效率神器jupyter notebook"
author: "cloga"
comments: yes
output: pdf_document
layout: post
slug: multivariate data visualization
tags:
- notebook
- python
categories: python
---

在本地上写python脚本通常使用的效率工具组合ipython + sublimetext，但是，当需要将本地开发的脚本部署到服务器上时，流程就略显复杂，一般的流程是先通过跳板机ssh上去，再从跳板机ssh到服务器，编写好的脚本则需要两次scp才能上传到服务器上，在服务器上调试脚本和修改脚本也相对麻烦，前者可以用ipython，后者则可以是在本地重新scp两次或者在服务器上通过vim来直接修改服务器文件，可能因为我不习惯这种编程模型一直觉得流程不是那么顺。刚好最近在服务器上打一个jupyter notebook，发现使用notebook会是整个流程顺畅很多，这里记录一下相关的一些经验。

## 安装python

一般linux服务器上都有安装python，不过版本可能较低，可以自己手动安装最新版本。
一般的流程是wget下载最新的python包，tar xvf解压tar包
cd进入所在目录
```shh
./configure
make
make install
```

如果没有sudo权限，则需要直接prefix，比如
```shh
./configure --prefix=/home/hdfs/python3.6 --enable-optimizations
```

配置环境
在bash_profile里面添加
添加/home/hdfs/python2.7/bin/
/home/hdfs/python3.6/bin/:/home/hdfs/python3.6/lib/python3.6/site-packages
PATH="/usr/local/bin/python3.6${PATH}"
export PATH
修改之后要source一下
source $HOME/.bash_profile

## 安装jupyter notebook
```
pip3 install jupyter
```

截至到这里jupyter notebook就安装完成了，可以通过
```
jupyter notebook
```
来启动服务器
不过这时只能localhost本地访问http://localhost:8888，如果要让外网也能访问需要进行如下的配置。

## 配置notebook

生成notebook配置文件
```
jupyter notebook --generate-config
```

配置文件的地址为~/.jupyter/jupyter_notebook_config.py

生成访问密码
```
jupyter notebook password
```

生成的密码会写在~/.jupyter/jupyter_notebook_config.json

进行简单的配置
```
c.NotebookApp.ip = '*'
c.NotebookApp.open_browser = False
c.NotebookApp.port = 8888
```
上面的命令以此是：允许任意ip访问；启动notebook后不启动浏览器，因为linux上也没有浏览器可以启动；定义端口

## 启动notebook

```
jupyerter notebook
```

输入服务器ip:8888就可以访问notebook

## notebook高效开发的一些小贴士

- notebook自带的terminal启动就是在服务器端，不需要再从跳板机各种跳转登录服务器，基本上所有的功能都能在这个terminal中进行
- notebook可以直接创建文件并在编辑修改
- notebook可以上传下载或删除文件，不需要在scp几个来回才能传输文件
- notebook 提供的wigets、bqplot和dashboard为notebook增加交互能力，可以为数据科学家填补最后一块拼图，这块的内容可以展开成一系列的文章，后续会写一些介绍内容。
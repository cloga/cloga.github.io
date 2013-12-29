---
author: admin
comments: true
date: 2012-07-25 14:14:54+00:00
layout: post
slug: bluehost%e4%b8%8a%e5%ae%89%e8%a3%85python3
title: Bluehost上安装Python3
wordpress_id: 1604
categories:
- Python
tags:
- Python
---

最近做了一次Blog的迁移，从Godaddy的付费空间（是的，我的空间以前就是Godaddy的付费空间，很坑爹各种打不开）上迁到了Bluehost上。迁到Bluehost上主要有两个原因，看到一些评论说Bluehost的访问速度还可以，迁移过来后这几天确实还比较稳定，而且最近Bluehost在做促销，一年的话是$4.95每月，三年的话是$3.95月，应该也比狗爹的便宜，狗爹好像是$5；第二个原因是Bluehost支持多种语言，最近再看一些Python的东西，希望可以找个环境学习测试一下。我看的书是Head First Python里面的东西是基于3.0的，而Bluehost上的Python默认版本是2.6的，貌似是CentOS自带的版本。所以就需要先在Bluehost的空间上安装Python3。经过几天的研究终于将Python3安装上了。

[caption id="attachment_1605" align="aligncenter" width="640"][![](http://www.cloga.info/wp-content/uploads/2012/07/Python3.png)](http://www.cloga.info/wp-content/uploads/2012/07/Python3.png) Python3[/caption]

<!-- more -->网上似乎没有相关介绍的文章，这里主要是结合两篇文章：1、[Bluehost关于如何从Python2.6升级到2.7的文章](https://my.bluehost.com/cgi/help/python-install)；2、[在CentOS上安装Python3](http://141.109.37.164/~lxu/wp/?p=72)，希望可以帮到有类似需求的同学少走一些弯路。

1、先要获取Bluehost的SSH权限。这个流程Bluehost有详尽的说明，这里只是简单说一些流程。首先是[获取SSH权限](https://my.bluehost.com/cgi/help/180)，默认情况下SSH是不开启的需要手动开启，同时先要验证账户，验证账户的时候各位同为要注意账户的信息不要填写中国的信息，不然验证后就没有了100刀的AdWords代金卷；接着是要[创建公钥和私钥](https://my.bluehost.com/cgi/help/putty)；最后是[连接SSH](https://my.bluehost.com/cgi/help/301)。

2、下载安装Python3

#下载Python3

    
    wget http://www.python.org/ftp/python/3.2/Python-3.2.tar.bz2


我这里将Python3安装在根目录下，安装版本是3.2

#解压Python3的tar包

    
    tar -xjf Python-3.2.tar.bz2


创建了Python-3.2的目录
#安装Python3

    
    ./configure --prefix=$HOME/python3
    
    make
    
    make install


至此，Python3的安装完成了，但是，要加载这个Python还需要修改.bashrc
3、.bashrc的修改
#进入.bashrc

    
    vim ~/.bashrc


#将Python3添加进去，按Insert（不知道Bluehost为什么写的是输入/）变成编辑状态输入下面的内容

    
    export PATH=$HOME/python3/bin:$PATH


#按Esc退出编辑状态，输入

    
    :wq


#保存退出，再输入

    
    source ~/.bashrc


OK，Python3已经安装到Bluehost上了，你可以使用python3 -v确认一下。希望本篇文章能够给和我一样技术小白有一些帮助~如果你还有任何疑问欢迎给我留言。

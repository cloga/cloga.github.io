---
author: admin
comments: true
date: 2013-03-18 06:06:11+00:00
layout: post
slug: '%e7%94%a8python%e7%9a%84simplehttpserver%e6%90%ad%e5%bb%ba%e6%9c%ac%e5%9c%b0ga%e6%b5%8b%e8%af%95%e7%8e%af%e5%a2%83'
title: 用Python的simpleHttpServer搭建本地GA测试环境
wordpress_id: 1904
categories:
- Digital分析
tags:
- GA
---

数码林（[没有网站也能玩转Google Analytics](http://blog.digitalforest.cn/test-google-analytics)）和郑杰同学（[如何本地测试_Google Analytics_跟踪脚本](http://itweb.me/?p=181)）都介绍过本地搭建GA测试环境的方法，前者使用的是Apache，后者使用xampp。我这里介绍使用Python的simpleHttpServer搭建GA本地测试环境的方法。

首先，你要安装python。如果你使用的是OS X或者Linux，那么，Python应该已经安装上了，如果你用的是Windows，那么你需要去http://python.org 下载Python2.7并安装。

安装好Python后，你需要创建一个放置要测试文件的目录（比如说test）。

在命令行下到达这个目录。这里你会用到cd命令，如果你在Windows且test的完整路径是d:\program\test，那么你需要在Windows的CMD中执行下面三行命令。<!-- more -->

    
    d:
    cd \program\test
    python -m SimpleHTTPServer 8000


这样本地的服务器就搭好了，访问一下localhost:8000，你就能看到test文件夹下的内容，将要测试GA代码的页面放在这个目录下，并在浏览器中访问它吧~

推荐使用[Chrome GAdebugger](http://www.cloga.info/2012/05/19/%e5%88%a9%e7%94%a8chrome%e7%9a%84google-analytics-debugger%e8%bf%9b%e8%a1%8cga%e7%9a%84%e6%95%85%e9%9a%9c%e6%8e%92%e9%99%a4/)进行测试。这是一个本地的环境，因此不会真的把数据发送给GA，如果需要将相关数据发送给GA则需要修改本地的Host文件，并将127.0.0.1：8000指向一个虚拟的域名。

---
author: admin
comments: true
date: 2013-01-19 05:50:19+00:00
layout: post
slug: 'attributiontool'
title: 计算GA归因模型数据的小工具
wordpress_id: 1839
categories:
- Digital分析
tags:
- MCF
---

[归因建模工具](http://www.cloga.info/2012/05/20/%E7%BD%91%E7%AB%99%E5%88%86%E6%9E%90%E4%B8%AD%E5%BD%92%E5%9B%A0%E5%BB%BA%E6%A8%A1attribution-modeling/)是GA的Premium版本和测试中的UA的一个新增功能。通过现在版本GA中热门转化路径数据也可以自行计算首次交互，最后交互和线性模型这三种模型的数据。比如[Lunametrics最早提供了在Excel中完成计算的方法](http://www.lunametrics.com/blog/2012/05/17/multichannel-attribution-modeling-tool/)，[胡力同学也提供了类似的解决方案](http://www.szwebanalytics.com/four-web-analytics-attribution-model.html)。

这里我给出一个python做的exe小工具，[点击MCF计算小工具](https://github.com/cloga/MCF/raw/master/mcf.rar)

使用方法如下：<!-- more -->

1、从GA中下载csv格式的热门转化路径数据

2、用记事本打开，并将编码修改为ANSI，将名称改为MCF.csv

3、将rar中文件解压到任意目录，并将MCF.csv放到MCF文件夹中

4、双击MCF.exe，会生成一个mcf_result_XXXX.csv

请注意语言与货币符号的统一。系统语言使用英语则Profile中的货币请使用$，系统语言使用中文，则货币请使用￥。

---
author: cloga0216
comments: true
date: 2010-12-19 13:53:32+00:00
layout: post
slug: '%e5%bc%80%e6%ba%90%e7%9a%84wa%e7%a8%8b%e5%ba%8f%e4%bb%8b%e7%bb%8d'
title: 开源的WA程序 Piwik 介绍
wordpress_id: 753
categories:
- 开源网站分析工具
tags:
- piwik
---

Piwik是一款可下载、开源（GPL许可的）实时网站分析软件程序。它为您提供了网站访问者的详细报告：他们所使用的搜索引擎及关键词、他们的语言、您受欢迎的页面…[等等](http://demo.piwik.org/)。

Piwik旨在成为[Google Analytics](http://google.com/analytics)的一个开源替代品。

Piwik是下载并安装在您的服务器上的一个PHP MySQL软件程序。在5分钟的安装过程之后，Piwik将为您提供JavaScript 标签。只需要将这个标签复制粘贴到你想要跟踪的网站上（或者使用[现有的插件](http://piwik.org/faq/plugins/#faq_20)来为您自动完成这一步骤），就可以实时获得您的分析报告。

![](http://piwik.org/wp-content/uploads/2008/01/Piwik-›-Web-Analytics-Reports-.png)

用通俗的话来说，你能查看谁访问了您的页面，什么时间访问了您的页面，如何访问您的页面以及为什么访问您的页面。如果您不会英语，不用害怕。Piwik有[30多种语言](http://piwik.org/translations/)（持续增加中）可用。

是什么使Piwik在竞争中脱颖而出：

* **实时的网站分析报告**：在Piwik中，默认情况下，报告是实时产生的。对于高流量的网站，你能选择报告处理的频率（[了解更多](http://piwik.org/faq/general/#faq_41)）
* Piwik的功能是构建在内部**插件**中的：你能添加新功能也可以删除不需要的功能。如果你是一个[开发人员](http://dev.piwik.org/)，那么你可以很方便的**构建你自己的网站分析插件！**
* **你拥有自己的数据**：因为Piwik是安装在你的服务器上，所以，数据是存储在你自己的数据库中，您能用[开放的API](http://dev.piwik.org/trac/wiki/API)（以各种格式：xml、json、php、csv，发布这些数据）获得所有的统计数据
•**完全定制化的用户界面**：你能拖放想要的小工具，并且创建专门为你定制的报告！

试试看

* 你可以试一下[在线演示](http://demo.piwik.org/)，这个演示版本展示了最新发布的Piwik。请注意Piwik是一个在不断进行的持续工程，一些用户界面部分是正在不断更新！
* 如果想要安装Piwik，请下载[最新发布的版本](http://piwik.org/latest.zip)，将它上传到你的服务器上（需要PHP5.1以上以及Mysql数据库），打开你的浏览器：安装过程是自动的，只需不到5分钟。

想要了解更多？

Piwik正在开发中，我们努力的[核心团队](http://piwik.org/the-piwik-team/)正在不断壮大。作为Piwik的一员我们很自豪，但是也乐于花费大量的时间在改进现有的功能或扩展补充新功能（这是一个不断进行的持续工作！）。我们[有一个Piwik1.0计划](http://piwik.org/the-piwik-team/)，我们很高兴您想了解更多！我们经常在[官方博客](http://piwik.org/blog/)（订阅到[rss feed](http://piwik.org/blog/)）中发表新闻和网站分析信息。

如果你真的想要帮助我们的Piwik，并且有一些空闲时间来帮助我们，那么，你能成为我们全世界团队的一员，并且参与加入到这个有趣的工作中来。例如，你对翻译工作或测试版测试感兴趣，那么可以[通过email](mailto:hello@piwik.org)告诉我们。如果你有新的网站分析相关功能的建议或设想，那么不用客气，[在论坛中发表您的想法](http://forum.piwik.org/)。我们愿意接受您的想法和贡献，因为我们将这些视为团队合作。

如果您是一名[开发人员](http://dev.piwik.org/)，您一定是有所帮助的。我们的主要目标之一是让外部开发者可以 的为Piwik构建插件。请到开发者园地了解[如何构建Piwik插件](http://dev.piwik.org/)。您是否对帮助Piwik的核心感兴趣？有许多有趣的问题需要解决，有许多新功能需要补充，有许多Bug需要修复：更多的信息和链接请查看[投稿页面](http://piwik.org/contribute/)。

[开发者园地](http://dev.piwik.org/)包含了开始所需的所有资源。[路线图](http://dev.piwik.org/trac/roadmap)将告诉你我们将去哪里，计划了哪些新功能，考虑了哪些新分析报告，等等。你能[报告bug](http://dev.piwik.org/trac/newticket)或者完成[现有的bug报告](http://dev.piwik.org/trac/roadmap)。更多的技术问题，你可以询问[piwik-hackers邮件列表](http://lists.piwik.org/cgi-bin/mailman/listinfo/piwik-hackers)；我们很乐于帮助您。

感谢OpenX！

感谢OpenX使Piwik成为可能，OpenX是开源的广告服务！
注：piwik是[phpMyVisites](http://www.phpmyvisites.us/)的[新的改进版本](http://piwik.org/faq/phpmyvisites/)。
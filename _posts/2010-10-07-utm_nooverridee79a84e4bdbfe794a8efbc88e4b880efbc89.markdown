---
author: cloga0216
comments: true
date: 2010-10-07 03:34:46+00:00
layout: post
slug: utm_nooverride%e7%9a%84%e4%bd%bf%e7%94%a8%ef%bc%88%e4%b8%80%ef%bc%89
title: utm_nooverride的使用（一）
wordpress_id: 551
categories:
- 他山之石
tags:
- nooverride
---

原文地址：[http://www.roirevolution.com/blog/2007/07/using_utm_nooverride_part_1_of_3_branding.html](http://www.roirevolution.com/blog/2007/07/using_utm_nooverride_part_1_of_3_branding.html)
**第一部分-品牌CPC广告系列**
你是否在Adwords、YSM（雅虎的CPC）或AdCenter（微软的CPC）中购买了品牌词？如果你这样做了，那么很可能你从这些特殊的关键词获得ROI非常高。搜索具体品牌的人们知道他们想要什么，并且易于转化，而花费则很低。但是，如果这些人是在通过其他的关键词——可能这些词花了你很多钱，访问后又回到你的网站的，又会怎么样呢？
嗯，有一个方法可以限定品牌词的转化贡献，这样你就能获得原始关键词来源的信息。
正常情况下，Google Analytics将报告最近的非直接来源。这是什么意思呢？当用户直接输入你的URL、使用书签甚至点击email中的链接（如果他们使用Outlook-webmail那么情况不同）都是一个直接访问。对于每一个其他类型的访问，比如来自AdWords广告的访问，Google Analytics将重写用户原有的来源信息。
因此，如果我通过“Cheese Rocks”这个关键词来到了你的网站，然后我又从“Cheseemongr.com”这个关键词回到你的网站并且转化，那么这个转化将归因为最近的关键词，而不是原始关键词。
如果你更喜欢这个转化被归因为“Cheese Rocks”这个关键词，那么，你来对了地方。进行这样的设置是小菜一碟。谁不喜欢容易的事呢？
你所要做的就是为你现用品牌关键词的目标URL添加“utm_nooverride=1”这串字符。如果你正在正确的使用Google Analytics，那么你应该有对这些查询参数有丰富的经验。<!-- more -->
因此，如果当前你品牌广告的目标URL是：
**http://www.site.com/index.htm
**将它改为：
**http://www.site.com/index.htm?utm_nooverride=1**
或者，如果你已经有一个查询参数，比如src=go，那么将它改为：
**http://www.site.com/index.htm?src=go&utm_noovertide=1**
好了，如果一个用户通过你的品牌词来到网站，那么只有当他们没有你的网站的cookie数据时才会被跟踪。
基本上，使用这种方法将把你的品牌转换重新分配给那些为你第一次带来这些流量的词。这样做不是必须的，但是，如果你的商业模型合适，那么这是一个找出哪些关键词没有得到应得的信任的很好的方法。
两个额外的注意事项：
第一，这就是为何来自非AdWords的返回访问，AdWords转换跟踪仍能跟踪到。也就是说，如果我在周二从AdWords访问了网站，但是在这周的晚些时候从其他的渠道回到了这个网站并且转化，AdWords将仍可能跟踪到这个转化。Analytics通常将把这个转化归为第二个渠道。这也就是为什么你的AdWords和Analytics的转化数不会一样。但是，用这种方法将不会影响你在AdWords看到的转化数据。utm_nooverride将仅影响Google Analytics中的数据。
第二，这样做你的Google Analytics将会丢掉大量的成本/收入数据。即使，你是一个在品牌词上投资的高手，他们也不能获得它们所带来的所有转化数。这通常不是一个问题，因为，品牌词与其他更普遍的词相比，有高得多的回报。
因此，如果这引起了你的兴趣，请用你的核心内容尝试一下。一如既往，我很想听听你的想法！

---
author: cloga0216
comments: true
date: 2010-09-09 15:41:32+00:00
layout: post
slug: google-analytics%e8%8e%b7%e5%be%97adwords%e6%95%b0%e6%8d%ae%ef%bc%9a%e9%93%be%e6%8e%a5%e5%88%b0%e4%bd%a0%e7%9a%84adwords%e8%b4%a6%e6%88%b7
title: Google Analytics获得AdWords数据：链接到你的AdWords账户
wordpress_id: 361
tags:
- AdWords
---

如果你是一个在线广告商，那么你极有可能正在使用Google AdWords作为你的营销组合的一部分。Adwords是通过使用Goolge搜索引擎所使用的关键词来进行文字广告定向的手段。这样，你的广告将展示给正在寻找与你的产品相关的东西的受众。AdWords也在Google的合作伙伴上比如Ask.com、AOL.com以及AdSense网络，以类似的形式展示。导入AdSense数据将在接下来的部分讨论，这将对AdSense用户有帮助。
Google AdWords是一种快速而高效的在线营销手段，因为，这个拍卖系统的使用基于有多少用户点击了广告而不仅仅是展示了广告。因此，这种广告方法被称为每次点击收费（PPC）或按点击收费（CPC）。Yahoo!搜索营销，微软AdCenter、Miva以及Mirago也采取类似的广告系统。Google Analytics能跟踪所有这些广告系统的访问及转化。
正如你所希望的，Google Analytics作为Google的一部分，当它集成AdWords点击收费系统的数据时有巨大的优势。作为一个独特的网站分析工具，获得你的AdWords数据只是简单的勾选两个复选框——其一在AdWords账户中，另一个在Google Analytics账户中。在你的AdWords账户中，请遵循下列几步：
1．进入我的账户>偏好设置。
2．点击自动跟踪旁边的修改（如图6.6a）。
3．勾选目标网址自动标记，然后点击保存修改。
4．点击报告选项卡，选择Google Analytics>配置文件设置>修改配置文件信息。
5．勾选应用费用数据下面的复选框，现则保存修改（如图6.6b）。


[![](http://www.cloga.info/wp-content/uploads/2010/09/6-6a.jpg)](http://www.cloga.info/wp-content/uploads/2010/09/6-6a.jpg)




图6.6a 在AdWords账户中设置自动标记




[![](http://www.cloga.info/wp-content/uploads/2010/09/6-6b.jpg)](http://www.cloga.info/wp-content/uploads/2010/09/6-6b.jpg)




图6.6b 应用AdWords消费数据


就这样!所有的AdWords数据（展现量、点击量和消费）将自动导入到你账户中。数据每天导入一次（通常是太平洋时间的午夜），是前一天的23:59之前-48小时到-24小时（即前一天）的数据。这种延迟的原因是为了AdWords的欺诈点击算法能对你的账户发挥作用。导入AdWords数据的网站分析工具都会这样。
数据导入的差异的讨论在第2章“为什么PPC服务提供商的数据与网站分析报告不符”。
**从多个AdWords账户中导入消费数据**
你可能希望从多个AdWords账户导入数据——例如，如果你在北京或上海投放广告，或者你有两个不同的代理商分别管理两个单独的广告系列。如果你确实需要这样，那么你需要在Google Analytics账户中提交一个申请。请注意，这里的术语很重要；导入多个数据来源的消费与链接账户不同。链接，即，能从AdWords账户登录Goolge Analytics，只能在一对一的基础上发生——一个AdWords账户只能链接到一个Google Analytics账户。这是Google所使用的数据完全性及完整性的方法的一部分。但是，将多个消费数据导入一个Google Analytics账户是可行的，即基于一对多的基础上。
请记住，将多个来源的消费数据导入一个Google Analytics账户时，数据需要一致。即，所有的时区、货币设置应与Google Analytics所链接的AdWords账户一致——你通过AdWords界面登录的那个。可能是不可行的。另一种办法是为页面添加多个GATC，如前面的“上卷报告”所述。
当自动标记启用时，你将在AdWords广告的着陆页面的URL中看到额外的参数，如果你点击他们的话。例如：www.cloga.info/?gclid=COvQgK7JrY8CFSUWEAodKEEyuA
gclid参数是你账户中关键词级别的一个惟一参数。AdWords为了Google Analytics的跟踪添加这些参数，并且当访问者到达网站时，这些参数必须还在，以便他们能被识别为AdWords引入的访问者。如果gclid参数丢失或损坏，那么访问者将被错误的归为“goolge（organic）”而不是“goolge（cpc）”。

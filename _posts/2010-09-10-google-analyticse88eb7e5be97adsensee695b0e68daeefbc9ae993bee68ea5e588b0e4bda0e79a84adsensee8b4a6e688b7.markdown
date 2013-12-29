---
author: cloga0216
comments: true
date: 2010-09-10 15:54:48+00:00
layout: post
slug: google-analytics%e8%8e%b7%e5%be%97adsense%e6%95%b0%e6%8d%ae%ef%bc%9a%e9%93%be%e6%8e%a5%e5%88%b0%e4%bd%a0%e7%9a%84adsense%e8%b4%a6%e6%88%b7
title: Google Analytics获得AdSense数据：链接到你的AdSense账户
wordpress_id: 367
tags:
- AdSense
---

[](http://www.cloga.info/wp-content/uploads/2010/09/6-10.bmp)在线广告发布商，你可能使用Goolge的AdSense产品。AdSense是一个允许你在网站上展示Google广告的工具，从而分享点击收入。AdSense的聪明之处是在你的网站上展示的广告是针对你的内容的，即，内容关联广告。通过这种方法，所展示的广告更符合你的受众的兴趣。这样你可以专注于构建迷人的高品质内容，而Google负责为你的读者展示相关的广告。AdSense的更多信息请见http://adsense.google.com。
**注：**AdWords广告客户控制是否在运行AdSense的网站上展示他们的广告。从广告客户的角度这被称为在他们的账户中选择“内容网络”。
与前面所讨论过的导入AdWords的消费及展示数据一样，你也能导入AdSense收入、展示和内容绩效数据。进入AdSense账户的报告部分，整合你的AdSense账户与Google Analytics，如图6.7所示。


[![](http://www.cloga.info/wp-content/uploads/2010/09/6-7.bmp)](http://www.cloga.info/wp-content/uploads/2010/09/6-7.bmp)




图6.7 整合AdSense与Google Analytics


接下来的界面让你要么创建一个Google Analytics账户，要么选择一个现存的账户。如果选择后者，请在开始前，确定你所使用的AdSense账户在Google Analytics账户中也被列为管理员。如果你已经这样做了，那么AdSense将链接你的Google Analytics账户，并且现实它的配置文件——见图6.8。


[![](http://www.cloga.info/wp-content/uploads/2010/09/6-8.bmp)](http://www.cloga.info/wp-content/uploads/2010/09/6-8.bmp)




图6.8 选择接受AdSense数据的Google Analytics配置文件


假如你只在Google Analytics账户中管理一个单一域的网站，那么选择你想要导入AdSense数据的配置文件。通常这将是你的所有配置文件，因此，不需要改变GATC。但是，你可能管理多个域，AdSense在你网站的所有网络上展示。如果你是这种情况，那么你将需要决定哪个域为你导入数据的主域；见图6.9。主域不需要修改GATC，但是二级域名（子域）将需要修改GATC。因此，你应该选择最复杂的GATC配置文件作为你的主域，这样，你只需要最少的变化。请参考帮助中心的文章：[http://www.google.com/support/analytics/bin/answer.py?answer=92625](http://www.google.com/support/analytics/bin/answer.py?answer=92625)。


![](http://www.cloga.info/wp-content/uploads/2010/09/6-9.bmp)




图6.9  选择接受AdSense数据的Google Analytics的配置文件




如果你需要选择一个主域，下图显示了需要更新的GATC代码段——如图6.10。最后，点击继续完成链接过程。这样做很快会在Google Analytics报告中产生一个新部分:内容>AdSense部分。AdSense数据（展示、点击、收入）将自动导入你的账户。




请记住，与AdWords一样，数据每天导入一次（通常是太平洋时间的午夜），这些数据是前一天23:59分之前-48到-24小时的数据，因此，AdWords的费用数据通常至少是24小时之前的。这种延迟的原因是为了AdWords的欺诈点击算法能对你的账户发挥作用。导入AdWords数据的网站分析工具都会这样。数据导入的差异讨论在第2章“为什么PPC服务提供商的数据与网站分析报告不符”。
**注：**目前不能将多个AdSense账户的数据导入单一的Google Analytics账户中。




[![](http://www.cloga.info/wp-content/uploads/2010/09/6-10.bmp)](http://www.cloga.info/wp-content/uploads/2010/09/6-10.bmp)[](http://www.cloga.info/wp-content/uploads/2010/09/6-9.bmp)




图6.10 AdSense导入界面最后的设置

---
author: cloga0216
comments: true
date: 2010-08-30 13:39:06+00:00
layout: post
slug: google-analytics%e5%a6%82%e4%bd%95%e5%b7%a5%e4%bd%9c
title: Google Analytics如何工作
wordpress_id: 150
tags:
- Google Analytics
- web metrics
---

从第2章“现有的方法及其准确性”你了解了数据收集技术及cookies在网站分析中的作用。Google Analytics是采用第一方cookie的页面标签法。通过这种方法，所有数据的收集、处理、维护及程序更新都作为一种托管服务由Google管理——也被称为SaaS（软件即服务）。但是，它的流程和数据流是怎样的？图3.2的三步示意图很好的解释了这些。
1．访问者到达你的网站之前什么也不会发生。访问者通过不同的途径到达你的网站，包括搜索引擎、e-mail营销，推介链接等等。无论哪个途径，当访问者浏览了你的网站上带有Google Analytics跟踪代码（GATC）的页面之一时，自动向http://www.google-analytics.com/ga.js文件发出请求。这是Google Analytics的主文件——一个25Kb大小的文件，在访问者的一次会话中只下载一次。对这一文件更多的请求将在访问者的浏览器缓存中取回。因为ga.js文件设置正确，推介网站信息将与其他访问者信息（比如页面URL、时间戳、惟一ID、屏幕分辨率、颜色深度）一起被收集，并将产生一小段第一方cookies以识别访问者——或当访问者回访时更新。
2．对于每一个页面浏览，GATC通过向google-analytics.com请求一个透明的、1×1像素的GIF图片，将这一信息发送到Google的数据收集服务器。访问者在页面内的活动也能通过这种方式跟踪，例如，点击Flash动画的开始。整个数据的传输不过一眨眼的功夫。
3．Google每小时处理收集到的数据并更新你的Google Analytics报告。但是，因为方法以及所包含的数据量庞大，因此，报告通常有3到4小时的延迟，这一过程有时会更长，但是不会长于24小时。

[![](http://www.cloga.info/wp-content/uploads/2010/08/3-2.jpg)](http://www.cloga.info/wp-content/uploads/2010/08/3-2.jpg)


图3.2   Google Analytics如何工作的示意图




**注：**在大多数情况下，从多数数据收集服务器中采集数据能顺利进行，但是，有时会有问题，比如，日志文件的传输中断。因为，这一原因，Google收集数据并且在24小时内在一天结束重新处理所有数据。因此，一旦你当天的数据丢失了别恐慌。如果这持续了24小时以上，联系Google Analytics支持团队：http://www.google.com/support/googleanalytics/bin/request.py。
**注：**尽管Google Analytics每小时处理数据，但是数据以不同频率导入。例如，Adwords和Adsense数据的导入（如果可用的话）每天发生一次，并且是24小时后。这允许Google的点击欺诈算法完成他们的工作。由于Adwords数据导入引起的潜在差异在第2章中讨论。
Google Analytics有意让所有访问者和所有网站站长使用相同的ga.js跟踪代码段。这意味着在大部分网站使用者的跟踪代码在缓存中——优势是有几百万网站的使用基础包括一些非常受欢迎的门户网站。这是一个好消息，因为，这意味着如果一个来到你的网站访问者之前访问了其他的也运行Google Analytics的网站，ga.js文件根本不用下载——它已被缓存。其结果是Google Analytics对你的网站加载时间有最小的影响。通常的文件缓存为期7天，尽管这一值能在你的浏览器设置中进行调整。
正如你能在图3.2的描述中所认识到的一样，如果访问者阻止了JavaScript的执行或阻止了第1方cookies的设置，或者如果你忘记在页面上添加GATC，或者你的网站服务器不允许GATC执行（即，它有防火墙），Google Analytics将不会发挥作用也将不会收集数据。一旦数据丢失，你不能找回并重新加工，因此，GATC实施的定期审核应是你实施计划的一部分。
**注：**目前有三个版本Google Analytics跟踪代码（GATC）：称为urchin.js的原始旧代码，已不再更新，但是仍在运行；2007年底提出的ga.js代码，是你从Google Analytics功能中获益所必需，比如事件跟踪；以及2009年底推出的异步跟踪代码。
最新的ga.js是在2007年底推出的。尽管，Google没有声称具体什么时候不再支持urchin.js，如果你仍在使用urchin.js，那么你应该计划在不远的将来替换它。为了这样做，登录你作为管理员的Google Analytics账户，并且在你的配置文件设置中点击检查状态链接。你将看到你的新跟踪代码。请注意，如果你也使用urchin.js的旧功能，例如，捕捉虚拟浏览量，那么，这些也将需要更新为新的格式。
异步的跟踪方式具有以下优点：
跟踪代码的加载速度更快，改善浏览器的执行效率
增强数据收集的准确性
消除因为JavaScript未完全加载引起的误差

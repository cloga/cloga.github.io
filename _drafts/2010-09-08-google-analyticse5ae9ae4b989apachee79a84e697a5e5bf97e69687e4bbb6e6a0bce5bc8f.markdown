---
author: cloga0216
comments: true
date: 2010-09-08 13:52:07+00:00
layout: post
slug: google-analytics%e5%ae%9a%e4%b9%89apache%e7%9a%84%e6%97%a5%e5%bf%97%e6%96%87%e4%bb%b6%e6%a0%bc%e5%bc%8f
title: Google Analytics定义Apache的日志文件格式
wordpress_id: 346
tags:
- Apache
- 日志文件
---

Apache能以不同的自定义格式设置日志数据。Google Analytics最终的部分是记录cookie信息。建议在httpd.conf文件中使用完整的NCSA日志格式，如下所示：
`LogFormat “%h %v %u %t “%r” %>s %b “%{Referer}i” “%{User-Agent}i”“%{Cookie}i”” combined
`注意：从头至尾使用的双引号，这句语句必须在你的配置文件中是一行。
对于Microsoft IIS，格式如下：
`2010-01-01 01:56:56 68.222.73.77--- GET /__utm.gif
utmn=1395285084&utmsr=1280x1024&utmsa=1280x960 &utmsc=32-bit&utmbs=1280x809&utmul=en-us&utmje=1&utmce=1&utmtz=-0500&utmjv=1.3&utmcn=1&utmr=http://www.yoursite.com/s/s.dll?spage=search%2Fresultshome1.htm&startdate=01%2F01%2F2010&man=1&num=10&SearchType=web&string=looking+for+mysite.com&imageField.x=12&imageField.y=6&utmp=/ 200 878 853 93 - -Mozilla/4.0+(compatible;+MSIE+6.0;+Windows+NT+5.1;+SV1;+ .NET+CLR+1.0.3705;+Media+Center+PC+3.1;+.NET+CLR+1.1.4322) - http://www.yoursite.com/
`在这个例子中，日志条目将以访问者的时间戳开始，以网站的主机名结束。
两个例子中，GATC所应用的附加信息是utmx的名称-值对。这种方法被称为混合数据收集法，已在第2章中讨论。
请注意，保存访问者数据的本地副本，需要考虑开支，这些我们已经在第3章“Goolge Analytics的特性、优势和局限”中讨论过。因为，服务器日志文件能够很快变大，耗费硬盘空间，所以，我一般不推荐在本地保存数据副本，除非你有一些特殊的原因必须这样做。换句话说，维护Google Analytics数据的本地副本，为你提供了下面这些选择：
•更大程度的控制你的数据——比如说，为了审计的目的
•Google Analytics实施的问题排查
•处理历史数据——使用Urchin软件
•重新处理数据——使用Urchin软件
让我们详细看一下这些优势：
**更大程度的控制你的数据 ** 一些企业更习惯于数据完全在自己的掌握中，并且也准备在IT资源上投资。你不能在另一个网站分析工具上运行这些数据，因为GATC标签数据对其他工具可能没有意义。但是，你确实有了将你的数据发送给第三方审计服务商的选择。一些网站主使用第三方审计公司来证明他们的访问者数——对出售广告的内容发布网站非常有用，因为他们需要证明他们的价格（CPM等等）。
提醒：当你将数据发送给第三方时，请注意保护最终用户的隐私（你的访问者）是你的义务，并且你应该在隐私报告中予以声明。
**Google Analytics实施的问题排查**  Google Analytics访问数据的本地副本有助于复杂的Google Analytics实施的问题排查。这是因为，服务日志中的每一个页面浏览条目实时抓取的。因此，你能查出你是否正确实施了跟踪——特别是对非标准跟踪，比如PDF、EXE及其他下载文件及出站链接。更多的问题排查工具请见附录B。
**处理历史数据——使用Urchin软件**  如前所述，Google Analytics目前存储最多25个月的报告（尽管，Google目前为止没想删除更久的数据，见图3.1）。如果你想要保存更长时间的报告，你应该购买Urchin软件处理更早以前的数据。下载版的软件版本在本地服务器上运行，处理服务器日志文件，包括混合法。Urchin也提供Google Analytics的一些补充报告，如第3章所述。
**提醒：**Urchin软件的报告与Google Analytics的报告不是100%一致，因为，这是两种不同的数据收集方法。例如，日志文件法跟踪一个下载是否完成，而页面标签法跟踪的只是onclick事件——这些永远都不会是同一件事。数据校准及准确性问题在第2章中讨论过。
**重新处理数据**  因为数据和网站分析工具都在你的掌握中，你能对旧数据应用过滤器并处理数据。例如，比方说你想要创建一个单独的配置文件只报告blog访问者。通常这是通过应用一个页面级的过滤器来完成——即，包含所有/blog目录的页面浏览数据。对于Google Analytics来说，报告是在配置文件过滤器应用时形成的——即，从那一点以后。（Cloga：换句话说，对于已经形成报告的数据无法应用配置文件过滤器对原始数据重新处理，当然，你可以在内容报告的热门内容及内容细目查看到一些相关的数据）。而对于Urchin软件，你能重新处理旧数据，查看blog的历史报告。
**注：**Urchin，如第三章所述，仅通过Urchin软件授权顾问（USAC）网络进行销售及支持。USAC的完整列表，见http://www.google.com/urchin/zh-CN/usac.html。

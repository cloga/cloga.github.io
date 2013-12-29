---
author: cloga0216
comments: true
date: 2010-09-12 14:53:10+00:00
layout: post
slug: _trackpageview%ef%bc%9agoogle-analytics%e7%9a%84%e4%b8%bb%e5%8a%9b
title: _trackPageview()：Google Analytics的主力
wordpress_id: 382
tags:
- cookie
- trackPageview
---

如第6章“起来与Google Analytics一起奔跑”中所讨论的，GATC的最后一部分是调用JavaScript例程_tractPageview()。这是Google Analytics中跟踪页面的主要函数。_trackPageview()设置了所有会话所需要的cookie，并且将数据提交给Google服务器。图7.1列出了Google Analytics所设置的Cookie。你可以用浏览器的偏好设置看到这些值——通常在你的隐私设置中。对于IE来说，你可以在IE选项>浏览历史记录>查看文件中找到这个cookie文件。


[![](http://www.cloga.info/wp-content/uploads/2010/09/7.1.bmp)](http://www.cloga.info/wp-content/uploads/2010/09/7.1.bmp)




当查看你的Google Analytics cookie时，你可能注意到所有值之前的都是GATC所在的域的名称的哈希值。这个哈希值是代表你的网站的固定长度的数值。例如，www.mysite.com的哈希值可能是202414657，因此，cookie _utmv的值是202414657.test%20user。同样，www.yoursite.com的哈希值可能是195485746，而cookie _utmv的值是1954857467.another%20test。注意，哈希值的长度都是9个数字，尽管域名的长度不同。这正是哈希值的目的所在。Google Analytics中的与哈希值的作用是用这个值来检查访问者cookie的完整性。
**小技巧：**如果你对Google Analytics哈希值算法的运作机制感兴趣，请见：http://www.google.com/support/forum/p/Google+Analytics/thread?tid=626b0e277aaedc3c&hl=en。
如果你有多个二级域名，比如www.mysite.com和support.mysite.com，并且你希望跟踪在这些二级域穿梭的访问者，那么你需要关闭域哈希值，以便cookie完整性检查不会拒绝从一个域到另一个域的用户cookie。同样，如果你将访问者用一个域传递给你所控制的另一个第三方域，例如从www.mysite.com到www.mysite.co.uk，那么你也需要做出修改。这些特殊的案例将在本章的“定制GATC”中讨论。
理解了_trackPageview()如何工作以后，你能利用它来跟踪虚拟页面浏览（虚拟综合浏览量）和文件下载，正如接下来要讨论的。

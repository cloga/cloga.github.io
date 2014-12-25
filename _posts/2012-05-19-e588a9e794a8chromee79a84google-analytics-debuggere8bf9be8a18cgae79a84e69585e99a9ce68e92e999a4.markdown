---
author: cloga0216
comments: true
date: 2012-05-19 14:11:13+00:00
layout: post
slug: '%e5%88%a9%e7%94%a8chrome%e7%9a%84google-analytics-debugger%e8%bf%9b%e8%a1%8cga%e7%9a%84%e6%95%85%e9%9a%9c%e6%8e%92%e9%99%a4'
title: 利用Chrome的Google Analytics Debugger进行GA的故障排除
wordpress_id: 1523
categories:
- Digital分析
tags:
- debug
---

GA代码初次部署或代码修改后的故障排除是一件比较麻烦的事情。一般会使用的工具有httpwatch(IE/firefox)，firebug(firefox)，在这篇文章里我为大家介绍一下Google自己的一个故障排除工具：[Google Analytics Debugger](https://chrome.google.com/extensions/detail/jnkmfdileelhofjcijamephohjechhna)。


## Google Analytics Debugger的安装


这是一个Chrome浏览器的扩展程序，因此，首先需要安装Chrome。然后进入Chrome网上应用商城，安装[Google Analytics Debugger](https://chrome.google.com/extensions/detail/jnkmfdileelhofjcijamephohjechhna)。

安装完成后会在Chrome地址栏右侧出现![bugger_icon1](http://www.cloga.info/files/debugger_icon1.png)，点击一下这个图标，图标会点亮![bugger_icon2](http://www.cloga.info/files/debugger_icon1.png)。

点击F12，或Ctrl+Shift+J，调出Chrome的Javascript控制台。

![console](http://www.cloga.info/files/console.png)

点击Console，你会看到类似上面的界面。下面我们再来看一下如何进行GATC的故障排除。


## GA跟踪代码的故障排除的基本步骤


1、打开GA Debugger

2、访问要检查的URL

3、相关的GA方法正确

GA Debugger会先列出这个页面上调用的GA方法及其参数。通过这个列表可以发现是否每个参数都按照我们的预想工作。

4、确保相关参数正确

GA跟踪的本质是通过对http://www.google-analytics.com/__utm.gif的参数传递相关信息。完整的请求样例如下：

http://www.google-analytics.com/__utm.gif?utmwv=4&utmn=769876874&utmhn=example.com&utmcs=ISO-8859-1&utmsr=1280x1024&utmsc=32-bit&utmul=en-us&utmje=1&utmfl=9.0%20%20r115&utmcn=1&utmdt=GATC012%20setting%20variables&utmhid=2059107202&utmr=0&utmp=/auto/GATC012.html?utm_source=www.gatc012.org&utm_campaign=campaign+gatc012&utm_term=keywords+gatc012&utm_content=content+gatc012&utm_medium=medium+gatc012&utmac=UA-30138-1&utmcc=__utma%3D97315849.1774621898.1207701397.1207701397.1207701397.1%3B...

其中的参数意义可以参考[GA的官方说明](https://developers.google.com/analytics/resources/articles/gaTrackingTroubleshooting#gifParameters)。

通过Chrome的GA debugger，可以一目了然的看到各个参数的值。比如Account ID对应的是utmac，page title对应的是utmdt。


## **一些常见的错误**


最后再简单和大家分享一下一些常见的错误

1、GA的网络媒体资源ID错误

GA的网络媒体资源ID是最重要的参数之一，如果这个参数错误会导致数据发送给另外的GA账户。如果_setAccount方法的参数存在空格，则数据会正常发送，但是，你的报告中不会有数据。因此，要注意GA的参数中没有空格。

另外还需要提醒大家的一点是要保证页面上调用的跟踪器名称一致，如果调用一个并不存在的跟踪器，则utm请求还会正常发送，但是Account ID会显示为XXXXX-XX

2、转化归属的错误

如果域哈希值处理的有问题就会出现大部分转化归属为Direct，并且网站的新访比例也会偏高。

比如，网站上一些页面使用了_gaq.push(['_setDomainName','abc.com']);，而有些页面则使用_gaq.push(['_setDomainName','.abc.com']);。

3、Session超出500hit的上限

GA记录一个Session的hit上限是500，如果超过这个上限则GA的请求不会发送。如果你在一个Session中发现莫名不发送utm.gif的请求，那么请删除一下cookie，再刷新一下页面。

PS：如果注意观察的话，经常会发现GA的版本会经常升级，有时也会发现一些作用不明的参数。


## 代码检测实例


页面加载

![GA Method](http://www.cloga.info/files/GA_Method.png)

上图是我的Blog加载后页面上的GATC加载的的一个截图。我们可以在里面看到我的GATC中一共定义了几个方法。Track Pageview，Tracking beacon sent!表明当前是发送的Pageview请求，发送成功。如果你是用的了Event或者电子商务的Track trans，那么也会有对应的提示。但是，请注意不代表有Track Pageview的方法就一定会发送数据，如果页面上定义了抽样的话，那么有可能你被排除了就不会发送beacon。


接下来是beacon具体的参数信息，我们可以看到这个请求中包含的所有信息，比如对应的GA账户，URL，Referrer、VisitorID等。

除了基本的Pageview以外，GA debugger也可以补抓到其他的GA方法请求。上图是我点击了页面的搜索框后发送的Event，由于我使用了GAS自动标记这些交互，因此，这个过程是自动的。我们可以看到GAS自动产生的事件类别是Form Tracking（不知道为啥写的的是Event Name），事件动作是form (none)（同样无厘头的写着Event Type），事件标签是s (change)。通过这些信息，我就可以事件与对应的GA标签对应起来，比如我要将这个事件设置为目标的话，那么就指定事件目标，其类型为Form Tracking，动作为form (none)，标签为form (none)。

好了，GA Debugger的使用就介绍到这里，如果您有相关的问题可以给我留言~

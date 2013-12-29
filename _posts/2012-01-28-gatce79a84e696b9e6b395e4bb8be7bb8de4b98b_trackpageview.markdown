---
author: cloga0216
comments: true
date: 2012-01-28 05:19:06+00:00
layout: post
slug: gatc%e7%9a%84%e6%96%b9%e6%b3%95%e4%bb%8b%e7%bb%8d%e4%b9%8b_trackpageview
title: GATC的方法介绍之_trackPageview
wordpress_id: 1392
categories:
- GA API
tags:
- API
- _trackPageview
---

_trackPageview是GATC的主力函数。

一、主要作用：

1、重写GA的几个cookie。

2、登记一次页面浏览并把相关信息，通过__utm.gif请求发送给GA的数据收集服务器。

这个方法是使用的最多，最重要的一个方法。除了_trackPageview之外，_trackEvent、_trackTrans和_trackSocial这几个方法也可以向GA服务器发送__utm.gif的请求，并重写cookie。因此，这几个方法都会产生与GA服务器的交互，并影响跳出率。

除了这几个方法以外，其他大部分的方法，都为这些方法的辅助，定义的一个参数都需要这些方法才能生效。比如，_setDomainName，_setCustomVar等都必须要基于这些方法，即都需要放在这些方法之前调用。<!-- more -->

二、两个作用分离的情况

_trackPageview方法登记页面浏览的作用是比较好理解的。但是，对于这个方法重写cookie的作用可能被大家忽略掉。其实，在实际的跟踪情境中有一些情况下， 可以看到两个作用分离的情况，即有一些情况下，_trackPageview表现出重写cookie这个作用，而没有发挥登记页面浏览，发送__utm.gif图片这个作用。

当GATC中指定的cookie路径与代码实际放置的路径不同时，就会出现两个功能的分离。

比如，在我的Blog的GATC中添加_gaq.push(['_setCookiePath','/test']);即将GA的cookie路径指定为/test，由于我的Blog的url不存在这个路径，因此，cookie放置的路径与GATC的实际位置不符。在这种情况下，_trackPageview方法会将cookie信息写在/test路径下（即对应的cookie的path属性为/test），并且在读取cookie时，也是读取这个路径下的cookie，如果，不存在则不会发送__utm.gif请求，即不会登记一个页面浏览。

三、一些实际的应用情景

1、重写URI

_trackPageview的默认参数为[location.pathname](javascript:location.pathname)，有时可能需要URI变成可读性更好的内容，比如将index.html记录为首页，将product.php?id=1234记录为产品A，这时只需要将这些内容作为_trackPageview的参数。比如，调用_gaq.push(['_trackPageview','首页‘])。

URI重写有两个策略，一种是只针对个别页面的重写，一种是整站的重写。

个别页面的重写即是为个别页面的_trackPageview方法添加参数（注意不是添加新的_trackPageview方法）。

较常见的两个情景是：使用同一个URL的多个步骤以及静态化URL的搜索结果页。

使用同一个URL的多个步骤。比如，注册流程三个步骤（不是ajax处理）都是一个URL（/reg.html），这种情况下，就需要为三个步骤_trackPageview传递三个不同的参数，比如reg1，reg2，reg3。这些是由服务器端脚本进行处理的。

静态化URL的搜索结果页。GA的站内搜索是根据_trackPageview的参数的搜索参数进行判断的。比如，你告诉GA你所使用的站内搜索参数为q，那么GA就会从_trackPageview的参数搜索类似于q=abc这样的名值对，并将abc作为站内搜索词。如果，你们的搜索结果页使用了静态化处理，比如，/search.php?q=abc静态化为/search/q/abc.html，那么将造成GA的站内搜索失效，这时就需要进行URI重写，另外，还可以通过添加搜索类别参数来记录搜索0结果页面。比如，用户搜索bcd这个词，网站上显示查无相关内容，则可以将这个搜索结果的URI定义为/search.php?q=abc&type=zeroresult，要记得在配置文件设置中将type作为搜索类别，这样，查看zeroresult类别下搜索词就可以知道网站缺少哪些用户需要的内容。

而对于整站重写，我的建议是每个页面调用两个_trackPageview方法，一个方法是默认的没有参数的形式，一个方法是添加了URI作为参数的，比如_gaq.push(['_trackPageview','/vp/首页‘])，注意要用一个路径将虚拟的URI和真正的URI区分开。我这里使用的是vp代表virtual path。然后，通过创建两个配置文件，一个是仅包含vp这个子目录的，一个是排除vp这个子目录的。这样就分离了虚拟URI和真实URI。使用两个_trackPageview是因为修改_trackPageview参数作用在数据收集部分，与过滤器重写的策略类似，也需要保留一个原始的数据，以防由于一些原因造成的数据丢失。

2、监测按钮及链接的点击

默认情况，GA不能监测按钮及部分链接（出站链接图片或文件的链接）的点击数据。如果要监测这些数据，只需要在a标签或button标签上添加一个onclick事件即可。比如：<a href="http://www.cloga.info" onclick="_gaq.push(['_trackPageview','/link']);">Cloga与网站分析</a>

如果这个事件已经有一个方法， 比如Rss()，那么只需要用用分号分隔，再添加一个方法即可。比如：<a href="http://www.cloga.info" onclick="_gaq.push(['_trackPageview','/link']);Rss();">Cloga与网站分析</a>

这样点击这个链接，将在GA中记录对/link的一次页面浏览。

3、监测页面内嵌入Flash的交互

嵌入页面的Flash交互的监测有两种方式，第一种可以嵌入GA提供的[Flash/Flex组件](http://code.google.com/intl/en/apis/analytics/docs/tracking/flashTrackingIntro.html)，这种方式需要在组件中指定网络资源ID，这样跟踪的对象是这个Flash文件，无论嵌入哪个网站，所进行的交互都会被记录，网页中是否嵌入GA代码均可。第二种方式是在AS中调用JS方法。比如，使用geturl方法调用_trackPageview方法记录虚拟的页面浏览。比如，要记录Flash中注册按钮点击


geturl("[javascript:_gaq.push(function(){var pageTracker = _gat._getTrackerByName(); pageTracker._trackPageview('/app_reg');});](javascript:_gaq.push(function(){var pageTracker = _gat._getTrackerByName(); pageTracker._trackPageview('/app_reg');});)")


其中，_getTrackerByName()返回跟踪器对象，用pageTracker引用了这个跟踪器，接着调用了_trackPageview方法，并将两个步骤合并为一个匿名的方法中，添加在_gaq这个命令数组中。

这样点击注册按钮，将在GA中记录对/app_reg的一次页面浏览。

以上就是关于_trackPageview方法的说明，如果您关于_trackPageview方法还有什么疑问，欢迎给我留言~祝龙年大吉~

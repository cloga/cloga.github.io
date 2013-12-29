---
author: cloga0216
comments: true
date: 2010-10-01 10:32:56+00:00
layout: post
slug: '%e5%b0%86banners%e5%8f%8a%e5%85%b6%e4%bb%96%e5%87%ba%e7%ab%99%e9%93%be%e6%8e%a5%e8%b7%9f%e8%b8%aa%e4%b8%ba%e4%ba%8b%e4%bb%b6'
title: 将Banners及其他出站链接跟踪为事件
wordpress_id: 525
tags:
- 事件追踪
---

如果你在网站发布推荐访问者到其他网站的banner或者链接，那么，你将有两个跟踪选择：将点击进入跟踪为虚拟综合浏览量或者事件。两个选择都可以让你货币化点击行为，本章前面的“虚拟综合浏览量VS事件追踪”讨论了二者的优点。这部分我仅考虑将类别定义为退出点的事件追踪。
对于一个GIF动画或其他非Flash banner广告，将出站链接修改如下：
旧的ga.js：
`<a href=”http://www.advertise-site.com” onClick=”pageTracker._trackEvent(‘退出点’,’点击’,’广告主名称-广告版本A’,4><img src=”banner.gif”></a>
`异步代码：
`<a href=”http://www.advertise-site.com” onClick=”javascript:_gaq.push([‘_trackEvent’,’退出点’,’点击’,’广告主名称-广告版本A’,4><img src=”banner.gif”></a>
`请注意：为点击事件分配的价值为4。以下是在Flash banner中使用的等效的代码，这个事件被分配了更高的价值：
`myBtn.addEventListener(
MouseEvent.CLICK, ExternalInterface.call(‘pageTracker._trackEvent’,’退出点, ‘点击’, ‘广告名称–广告版本B’,5));
`对两个例子来说，可以通过广告主名称及广告版本查看及细分报告，例如，顶部banner VS 擎天柱。<!-- more -->
**注：**从现在起Flash例子中使用的为ActionScript3。除了以上的代码外，你还需要在你的FLA文件中设置 importflash.external.ExternalInterface，并且在HTML中设置allowScripAccess——如在前面“跟踪Flash事件”中所述。
但是，我更喜欢用动作名称来区分对象元素。例如，我不是将所有出站链接的类型都归为点击这一事件操作，而是更进一步，在Flash及GIF banner的点击进入之间进行区分。如下：
GIF banner 事件追踪：
旧的ga.js：
`<a href=”http://www.advertiser-site.com”onClick=”pageTracker._trackEvent(‘退出点’,‘点击–GIF banner’,’广告名称–广告版本 A’,4)”><img src=”bannerA.gif”></a>
`异步代码：
`<a href=”http://www.advertiser-site.com”onClick=”_gaq.push([‘_trackEvent’,‘退出点’,‘点击–GIF banner’,’广告名称–广告版本 A’,4])”><img src=”bannerA.gif”></a>
`Flash banner事件追踪：
旧的ga.js：
`myBtn.addEventListener(
MouseEvent.CLICK, ExternalInterface.call(‘pageTracker._trackEvent’,’退出点’,‘点击–FLASH banner’,‘广告名称–广告版本A’, 5));
`为了将这一系列出站点击跟踪集中起来，那么对一个出站链接，使用链接事件追踪：
旧的ga.js：
`<a href=http://www.advertiser-site.com onClick=”pageTracker._trackEvent(‘退出点’,‘点击-链接’,’链接URL’,1)“>查看我的合作伙伴</a>
`异步代码：
`<a href=http://www.advertiser-site.com onClick=”_gaq.push([‘_trackEvent’,‘退出点’,‘点击-链接’,’链接URL’,1)“>查看我的合作伙伴</a>
`**跟踪Mailto:点击事件**
mailto:链接应另一种应该以前面介绍的方式跟踪的出站链接。我在这里单独讨论它只是为了强调跟踪mailto:点击的重要性——特别是对非电子商务网站，对于这些网站，任何能够为你带来更多商机线索的动作都有其内在价值。因为你的营销部门会跟进这些联系方式，所以你能评估这些商机线索的转化率及平均订单价值，因此可以货币化mailto:onClick事件。将你的mailto:链接修改如下：
旧的ga.js：
`<a href=mailto:mail@mysite.co.uk onClick=”pageTracker._trackEvent(‘退出点’,‘点击-mailto’,’cloga@163.com’)“>cloga@163.com</a>
`异步代码：
`<a href=mailto:cloga@163.com onClick=”_gaq.push([‘_trackEvent’, ‘退出点’,‘点击-mailto’,’cloga@163.com’])”>
`根据需要为这一事件添加一个货币值。

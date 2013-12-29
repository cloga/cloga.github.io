---
author: cloga0216
comments: true
date: 2010-09-29 14:26:05+00:00
layout: post
slug: flash%e4%b8%93%e4%b8%9a%e4%ba%ba%e5%91%98%e7%9a%84%e4%ba%8b%e4%bb%b6%e8%bf%bd%e8%b8%aa
title: Flash专业人员的事件追踪
wordpress_id: 515
tags:
- Flash
---

前面的例子让你在需要时，在事件为基础上追踪Flash动作为事件。通常，你在将SWF文件嵌入到已包含GATC的页面时，使用这些技术。如果你是一个站长，并且想要与第三方Flash设计者沟通Google Analytics跟踪需求时，这是最简单的方法。
但是，如果你全职开发Flash应用，那么前面的频繁编码每个动作的方法将是很费力的。因此，你能使用gaforflash软件组块：[http://code.google.com/p/gaforflash/](http://code.google.com/p/gaforflash/)。
这是一个Google Analytics ActionScrip3 API，在Adobe系统公司的开源精神之下用来Google Analytics数据收集和开发。它能用许多方法简化你对Flash内容的跟踪，比如下面这些：
•你在HTML页中嵌入了大量的Flash文件
•你创建托管在HTML页中的独立Flex应用或仅有Flash的网站
•你将你的Flex/Flash应用发布到你没有控制权的网站
<!-- more -->**注：**目前，Flash跟踪对嵌入在页面中的任何Flash内容都是可用的。跟踪Adobe Air、Shockwave发送的数据，或者通过Flash IDE发送的信息目前都不支持。
首先，从[http://code.google.com/p/gaforflash/](http://code.google.com/p/gaforflash/)下载并安装gaforflash。安装很简单，将类文件（SWC）复制或导入到Flash或Flex的相关安装目录。接着，你有两个方法跟踪你的Flash事件——Bridge模式和AS3模式。
Bridge模式是最常用的方法，因为，它用于已经在页面嵌入GATC的情况。它为所有使用ExternalInterface类的所有ga.js函数提供了简单的封装器（wrapper）。其他的事物有Flash自身管理。在Bridge模式中，gaforflash将调用后台中的ExternalInterface（或geturl，如果ExternalInterface因为某些原因被阻止）。下面的代码是使用Bridge模式的一个例子：
`import com.google.analytics.AnalyticsTracker;
import com.google.analytics.GATracker;
var tracker:AnalyticsTracker = new GATracker(this, “window.pageTracker”,”Bridge”, false);
tracker.trackPageview(“/Movies”);     //跟踪虚拟综合浏览量
tracker.trackEvent(“Video”, “Play”, “Ice Age 3”, 9);  //跟踪事件
`AS3模式提供了绕过Flash与JavaScript交互问题的方法。如果你的SWF文件部署在不同域上时，即使用第三方内容的网站，这相当有用，因为，通常这些网站不能用ExternalInterface法。在AS3模式中，不需要HTML用GATC——这是完全写入ActionScript的Google Analytics跟踪实施。因此，所有的Google Analytics交互从Flash对象中产生。下面是使用AS3模式的一个例子：
`import com.google.analytics.AnalyticsTracker;
import com.google.analytics.GATracker;
var tracker:AnalyticsTracker = new GATracker(this, “UA-12345-1”, “AS3”,false);
tracker.trackPageview(“/Movies”);     //跟踪虚拟综合浏览量
tracker.trackEvent(“Video”, “Play”, “Ice Age 3”, 9);  //跟踪事件
`除了你为多个域开发部署相同的Flash内容外，绝大多数情况下，你将在Bridge模式下使用gaforflash。
gaforflash的很多内容都超出了本书的范畴。我希望通过这些皮毛，已经吊起了你对它功能的胃口。如果你是一个Flash开发人员，最新的进展请看一下：
[http://code.google.com/apis/analytics/docs/tracking/eventTrackerOverview.html](http://code.google.com/apis/analytics/docs/tracking/eventTrackerOverview.html)。
**Flash Cookies和隐私权的思考**
在AS3模式中，Google Analytics cookies存储在其他Flash cookies中。但是，这些不在用户浏览器的控制之下，而是安装在机器上的Flash播放器的一部分，被称为共享对象（Share Object）。Wikipedia提供了共享对象的完整描述：[http://en.wikipedia.org/wiki/Local_Shared_Object](http://en.wikipedia.org/wiki/Local_Shared_Object)。
因为用户浏览器无法控制共享对象，所有使用这种方法有重要的隐私问题。第2、3章探讨了网站分析及Google Analytics各自的隐私问题。实施跟踪方法最佳实践的关键是公开你是如何处理访问者的隐私，并且向访问者提供如何选择退出这种跟踪的清晰指南。
从用户角度来说，能用Adobe Flash播放器设置管理器来管理Flash共享对象：[http://www.macromedia.com/support/documentation/cn/flashplayer/help/settings_manager.html](http://www.macromedia.com/support/documentation/cn/flashplayer/help/settings_manager.html)。许多火狐的插件提供了类似的功能，比如说BetterPrivacy。

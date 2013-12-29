---
author: cloga0216
comments: true
date: 2010-09-23 12:50:03+00:00
layout: post
slug: google-analytics%e4%ba%8b%e4%bb%b6%e8%bf%bd%e8%b8%aa
title: Google Analytics事件追踪
wordpress_id: 480
tags:
- 事件追踪
---

Google Analytics能跟踪任何基于浏览器的事件，包括Flash和JavaScript事件。将这些想象成来自访问者的页面内动作，不产生页面浏览。但是，当考虑事件追踪时，也请记住使用虚拟综合浏览量的可能性，如本章前面所讨论的。
事件活动与你的页面浏览活动是分开报告的。页面内事件的例子包括下面这些：
•任何Flash驱动的元素，比如Flash网站或Flash媒体播放器
•嵌入的Ajax页面元素，例如onClick、onSubmit、onReset、onMouseOver、onMouseOut、onMouseMove、onSelect、onFocus、onBlur、onKeyPress、onChange等等。
•网页小工具（gadget）
•文件下载
•加载时间
跟踪事件时需要重点考虑的是页面跳出率的影响。因为没有事件追踪，单页的访问是一个跳出。这通常认为是一次不良的访问者体验——他们来了，看一页，然后离开了。人们的观点是这样，如果网站的内容对访问者是相关的有益的，那么他们应该想要多读几页！于是，跳出率高的页面被认为是这一环节中出错的有效指标。
现在，假设一个访问者到了一个页面查看或与你的Ajax控件或Flash动画交互。尽管只查看了一个单独的HTML页，但是，这个访问者也完全有可能有很好的用户体验。事件追踪能够测量这些，因为触发了事件的单页访问不再被认为是一个跳出。你可以在随后用其他的指标来确定用户体验是否糟糕，比如，每个访问的事件数及类型。当然，如果，这个页面的跳出率仍很高，那么，你就知道访问者不喜欢你的控件/Flash动画。
跳出率是用于网站优化的广受欢迎的KPI。这些内容将在第10章“关注KPI”中“内容创建者的KPI例子”部分和第11章“现实世界中的任务”中的“识别并优化表现差的页面”。
**注：**目前，跟踪到的事件无法被定义为Google Analytics中的转化目标或渠道步骤。

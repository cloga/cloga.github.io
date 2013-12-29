---
author: cloga0216
comments: true
date: 2012-01-08 15:08:43+00:00
layout: post
slug: gatc%e7%9a%84%e6%96%b9%e6%b3%95%e4%bb%8b%e7%bb%8d%e4%b9%8b%e5%9f%ba%e6%9c%acgatc%e8%af%b4%e6%98%8e
title: GATC的方法介绍之基本GATC说明
wordpress_id: 1379
categories:
- GA API
tags:
- API
---

一、GATC的基本构成

`<script type="text/javascript">`

`var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-XXXXX-X']);
_gaq.push(['_trackPageview']);`

`(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();`

`</script>`

以上是基本的GA跟踪代码。这段代码由两部分组成。<!-- more -->

1、GATC的方法：

`var _gaq = _gaq || [];//判断_gaq的数组是否存在，不存在则创建一个
_gaq.push(['_setAccount', 'UA-XXXXX-X']);//调用``_setAccount方法，``定义GA的网络资源ID
_gaq.push(['_trackPageview']);//调用``_trackPageview，发送跟踪数据`

` `

2、对ga.js的引用

` `

`(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();//一个闭包函数，根据http协议还是https协议调用不同地址的ga.js`

封装在ga.js中的函数的调用方法。粗略统计一下，ga.js中提供的方法大概有50多个，常用的有10个左右。完整的方法列表见：http://code.google.com/intl/en/apis/analytics/docs/gaJS/gaJSApi.html

二、异步代码的作用机理

异步的GA跟踪代码创建一个_gaq数组，并用push方法将每个方法添加到一个命令队列中，遵循先进先出原则，当ga.js加载完成后，则按照命令队列的顺序执行这些方法。这样也就不会因为ga.js加载过慢或加载失败影响页面的加载速度，如果ga.js没有加载，则这些方法只是作为_gaq数组的一个元素。这种方法的好处是，对页面加载速度影响较小，其缺点是，如果ga.js确实加载过慢则跟踪数据丢失的可能性就增大。

三、_gaq.push方法介绍

1、_gaq名称由来

每个变量的名称都有其意义，比如UTM是Urchin Tracking Monitor，据猜测_gaq应该是Google Analytics Queue的缩写。

2、参数

push方法是向数组的末尾添加元素的JS方法。

_gaq这个数组的元素是GATC的方法，因此，_gaq.push的参数是GATC的方法，也是一个数组（是的，以数组为元素的数组），这个数组的第一个元素是方法名，第二个元素开始为方法的参数。可以一个_gaq.push语句调用一个GATC方法也可以调用多个。

GATC的方法的数组由跟踪器、方法名和方法的参数构成。默认的情况下，跟踪器为一个空字符串。比如，` _gaq.push(['_setAccount', 'UA-XXXXX-X']);。``[]中间的数组的元素，第一个元素为GATC的方法名``_setAccount（其实是默认的跟踪器对象的方法），第二个参数为这个方法的参数。`

3、跟踪器对象

这里强调一下跟踪器对象，首先看一下非异步代码：
`var pageTracker = _gat._getTracker("UA-xxxxxx-x");//定义了一个叫做``pageTracker的``跟踪器
pageTracker._trackPageview();`

而在异步代码中，不需要显性的定义一个跟踪器对象，默认会创建一个空字符串作为默认的跟踪器对象，即`_setAccount实际上是空字符串对象一个方法（原谅我，我不知道该怎么写一个空字符串对象），``如果要使用多跟踪器时，只需要修改对应的方法所属的对象，即，如果要新增一个跟踪器t2，则在每个方法前都添加t2.，比如对于``_setAccount，则应为t2.``_setAccount``。而在非异步代码中则需要使用``_gat._getTracker方法``定义这个跟踪器。其实``_getTracker这个方法已经被`_createTracker()所替换，不过ga.js里面会自动进行处理，我们不用理会。

四、异步代码与非异步代码

最后再谈一下，异步代码和非异步代码混杂使用的问题。

一个网站，至少是一个页面中，应该保证代码形式的统一，即统一使用异步或非异步代码。其实，通过上面的内容，我们知道，异步代码与非异步代码的主要区别是默认的跟踪器对象不同：异步代码的默认跟踪器对象是空字符串，而非异步代码的默认跟踪器对象是`pageTracker。只要保证跟踪器对象一致就没有问题。`

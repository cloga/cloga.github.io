---
author: cloga0216
comments: true
date: 2010-09-08 14:05:30+00:00
layout: post
slug: google-analytics%e4%b8%8a%e5%8d%b7%e6%8a%a5%e5%91%8a
title: Google Analytics上卷报告
wordpress_id: 349
tags:
- 上卷报告
---

上卷报告不是Google Analytics的标准功能。但是，通过一小段额外的代码。你能获得具体网站（专注于产品）的独立报告，以及一个上卷报告来获得全球的概况。（Cloga：上卷（roll up）是数据立方体的术语，与下钻（drill down）相对，这两个术语相当于汇总与细分。）
考虑以下情境，你有一个半自主的国家办事处，有适合于这个特定市场需求的具体品牌或产品。由于这些特殊的需要，每个网站有分离的、独立的Google Analytics账户是有意义的。用这种方式，细分、推荐分析和电子商务收入（或询价（lead）的产生）能被详细分析。
但是，全球总部还需要对所有网站访问者活动的更高水平的概述。你能通过一个“总”Google Analytics账户来达到这一目的，来自所有网站的数据聚合在一起形成一个上卷报告。只要集中实施一致的GATC，那么这种方法将提供国家自主或具体产品的网站报告，同时也将为全球总部提供查看所有网站活动的宏观报告。两个报告可以分开管理，不会互相影响。
上卷报告的原理非常简单——建立一个额外的Google Analytics账户并且为你的网站页面添加两个GATC。一个是单独的报告，另一个是上卷报告。这是两个网站的示意图：
旧的ga.js代码段：
`<script>
调用JavaScript主文件
</script>
<script>
1．跟踪网站A的页面浏览到单独的账户
2．跟踪网站A的页面浏览到上卷的账户
</script>`
异步代码段：
`<script>
1．跟踪网站A的页面浏览到单独的账户
2．跟踪网站A的页面浏览到上卷的账户
</script>
<script>
调用JavaScript主文件
</script>
`尽管我将这种方法解释为添加两个GATC，但是不需要向你的页面上添加完整的GATC，而只是第2个跟踪对象。突出了第二个跟踪对象的实际的GATC如下：
旧的ga.js代码段：
`<script type=”text/javascript”>
var gaJsHost = ((“https:” == document.location.protocol) ? “https://ssl.” :
“http://www.”);
document.write(unescape(“%3Cscript src=’” + gaJsHost + “googleanalytics.
com/ga.js’ type=’text/javascript’%3E%3C/script%3E”));
</script>
<script type=”text/javascript”>
try {
var firstTracker = _gat._getTracker(“UA-12345-1”);
firstTracker._trackPageview();
**var secondTracker = _gat.getTracker(“UA-67890-1”);
secondTracker._trackPageview();**
} catch(err) {}</script>
`异步代码段：
`<script type="text/javascript">
var _gaq = _gaq || [];
_gaq.push(['._setAccount', 'UA-12345-1']);
_gaq.push(['_trackPageview']);
**_gaq.push(['t2._setAccount', 'UA-67890-1']);
_gaq.push(['t2._trackPageview']);**
(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
</script>`
**注意，**我将pageTracker重命名为firstTracker及secondTracker以区别两种情况。这些可以是你选择的任何名字，不过应该尽量清晰。对于每个独立的网站（网站A、网站B等等），用具体网站的UA账户代码修改var firstTracker行。上卷账户的信息，var secondTracker，在每个网站上都是一样的——在这个例子中是UA-67890-1，当然需要改成上卷账户代码。
这样，全球总部的市场营销部门能登陆Google Analytics账户UA-67890-1，获得上卷报告、细分或设置。国家或具体产品的办事处能登陆UA-12345-1，能按照自己的意愿修改，而不会影响全球的上卷报告。
**注：**对于完整的实施，你也需要考虑电子商务跟踪及这种方法的许多警告的影响。这将在第9章“玩转Google Analytics”中详细讨论。

**上卷报告与多配置文件间的选择**
也许你已经从前面的部分中注意到，决定使用上卷报告及多账户配置文件的标准非常相似。那么，哪一个是更好的呢？
对于绝大多数实施，配置文件是最适合的选择。例如，你有一个网站，使用一个AdWord账户，以一种货币及时区交易。你可能细分访问者——可能通过地域、语言或访问网站区域——为了这样，你需要确保任何相关的电子商务或AdWords数据在所有配置文件中保持一致。创建应用过滤器的配置文件能有效的做到这一点，而不需要修改你的GATC。默认情况下，电子商务及AdWords数据应用于账户内的所有数据。
上卷报告满足了企业用户非常特殊的需求。使用这个方法，你能让独立的办事处或部门按照自己管理报告，同时，你又能保持对数据完整性的控制，即，GATC在整体企业部署，因而，所有的部门能相互比较。独立的Google Analytics账户赋予了每个部门对账户访问权的控制（比如网站或营销代理商），并且提供了一系列的报告及设置，而不会与其他部门混淆。例如，如果你在不同的时区、以不同的货币进行交易，那么你可能想要将这些单独保存。这样也克服了每个账户50个配置文件的限制。注意，上卷报告是Google Analytics的非标准功能，需要对GATC进行修改。这将在第9章详细讨论。

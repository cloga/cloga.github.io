---
author: cloga0216
comments: true
date: 2010-10-09 14:53:49+00:00
layout: post
slug: '%e8%ae%be%e7%bd%ae%e5%85%b3%e9%94%ae%e8%af%8d%e5%bf%bd%e7%95%a5%e5%81%8f%e5%a5%bd'
title: 设置关键词忽略偏好
wordpress_id: 559
tags:
- 关键词
---

你能设定Google Analytics将一个关键词视为直接来源（即，不作为一个推介）——例如，在搜索引擎中输入你的网址的访问者。
如下所示，使用_addignoredOrganic()将一个关键词视为一个直接点击或使用_addignoredRef()将一个推介视为一个直接点击：
旧的ga.js：
`<script type=”text/javascript”>
var gaJsHost = ((“https:” == document.location.protocol) ? “https://ssl.”: “http://www. “);
document.write(unescape(“%3Cscript src=’” + gaJsHost + “google-analytics.com/ga.js’ type=’text/javascript’%3E%3C/script%3E”));
</script>
<script type=”text/javascript”>
try {
var pageTracker = _gat._getTracker(“UA-12345-1”);
**pageTracker._addIgnoredOrganic(“cloga”);
pageTracker._addIgnoredRef(“cloga.info”);**
pageTracker._trackPageview();
} catch(err) {}</script>
`<!-- more -->异步ga.js代码：
`<scripr type=”test/javascript”>
var _gaq=_gaq || [];
_gaq.push([‘_setDomainName’,’none’]);
**_gaq.push([‘_addIgnoredOrganic’,’cloga’]);
_gaq.push([‘_addIgnoredRef’,’cloga.info’]);**
_gaq.push([‘_trackPageciew’]);
(function() {
var ga=document.creatElement(‘script’;ga.type=’test/javascript’;ga.async=true;
ga.src=(’https:’==document.location.protocol ? ‘https://ssl’ : ‘http://www’) + ’.google-analytics.com/ga.js’;
var s=document.getElementByTagName(‘script’)[0];
s.paretNode.insertBefore(ga,s);
})();
</script>
`尽管这些变化是你可以调整的，但是我建议不要使用它们。请注意，你的品牌词在搜索引擎中的使用是评估你的品牌效应的重要信息。
在将特定的推介网站视为直接点击方法，如果你有多个域名，那么你可能想要看到它们之间的交互。如果你不希望它们间的交互，那么，请考虑在你的服务器上（或者.htaccess文件）使用301重定向代码以确保所有的访问者和搜索引擎robot都来到了你的主域。
**注：**你能在[http://httpd.apache.org/docs/1.3/mod/mod_alias.html#redirect](http://httpd.apache.org/docs/1.3/mod/mod_alias.html#redirect)上找到关于Apache服务器重定向的更多信息。

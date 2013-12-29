---
author: cloga0216
comments: true
date: 2010-09-08 13:49:42+00:00
layout: post
slug: google-analytics%e5%a4%87%e4%bb%bd%ef%bc%9a%e5%9c%a8%e6%9c%ac%e5%9c%b0%e4%bf%9d%e5%ad%98%e6%95%b0%e6%8d%ae%e5%89%af%e6%9c%ac
title: Google Analytics备份：在本地保存数据副本
wordpress_id: 344
tags:
- 备份
---

在本地保存Google Analytics数据的副本对你的企业非常有用。例如，Google目前承诺保存25个月的数据，以便你的企业可以比较年报。这对大部分用户足够了，但是，如果你希望保留更长时间的数据该怎么办？而且，因为Google不会将原始数据传送给第三方，所以当你的网站访问者数据必须被审计时，你需要另一种方法。广告发布网站通常需要这样。
这种技术是修改GATC，以便它能同时向Google Analytics数据收集服务器及你的服务器日志文件发送你的访问者数据。需要在GATC代码段中加入一行修改：
旧版的ga.js代码段：

`<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "[https://ssl](https://ssl)." : "[http://www](http://www).");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-XXXXX-YY");
pageTracker._trackPageview();
**pageTracker._setLocalRemoteServerMode();**
} catch(err) {}</script>`

异步代码段：

`<script type="text/javascript">
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-XXXXX-YY']);
**_gaq.push(['_setLocalRemoteServerMode']);
**_gaq.push(['_trackPageview']);
(function() {
var ga = document.createElemen•t('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
</script>`

这项修改的结果是当你的GATC加载时,会从你的服务器上额外请求一个文件名为_utm.gif的文件。这是一个1×1像素的透明图片，Google Analytics用它来向你的web服务器上添加GATC信息。创建这一信息并将其上传到文档根目录中，即，首页的位置。
因为所有的web服务器默认记录他们的活动，通常以明文形式，所以，你应该在作出这个改变之后，很快看到额外的utm.gif条目在你的服务器日志中出现。这些对应于Google Analytics中看到的访问数据。同时，你的web服务器必须能够记录cookie信息。如果你不能在日志文件中看到cookie值，请检查为web服务器指定的日志格式。正常工作的Apache日志文件条目应是这样的：
`79.79.125.174 advanced-web-metrics.com - [03/Jan/2010:00:17:01 +0000] “GET/images/book-cover.jpg HTTP/1.1” 200 27905 “http://www.advanced-webmetrics.com/blog/2008/02/16/accuracy-whitepaper/” “Mozilla/5.0 (Windows; U;WindowsNT 6.0; en-GB; rv:1.9.0.15) Gecko/2009101601 Firefox/3.0.15 (.NET CLR3.5.30729)”
“__utma=202414657.217961957.1257207415.1257207415.1257207415.1;
__utmb=202414657.1.10.1257207415; __utmc=202414657;
__utmz=202414657.1257207415.1.1.utmcsr=google.co.uk|utmccn=(referral)|utmcmd
=referral|utmcct=/imgres; session_start_time=1257207419839”`
注意这是日志文件中的一行，以访问者IP地址开始，以GATC的cookie值结束。

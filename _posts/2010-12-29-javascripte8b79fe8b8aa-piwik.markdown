---
author: cloga0216
comments: true
date: 2010-12-29 17:49:05+00:00
layout: post
slug: javascript%e8%b7%9f%e8%b8%aa-piwik
title: JavaScript跟踪-Piwik
wordpress_id: 806
categories:
- 开源网站分析工具
tags:
- JavaScript
- 跟踪
---

1、先决条件：使用新版本的JavaScript跟踪代码
2、JavaScript跟踪代码的功能
（1）自定义在Piwik中显示的页面名称
（2）手动触发目标转化
（3）考虑一个主机的“别名”，不将这个域名的链接记录为“出站链接”
（4）禁用下载及出站链接跟踪
（5）禁用特定CSS类的下载及出站链接跟踪
（6）禁用特定链接上的下载及出站链接跟踪
（7）将一个链接的点击在Piwik中强制记录为下载
（8）将一个链接的点击在Piwik中强制记录出站链接
（9）修改暂停定时器
（10）修改跟踪为“下载”的文件扩展名列表
3、其他函数
（1）自定义发送到Piwik.php跟踪脚本的JASON数据
（2）多个Piwik跟踪代码
（3）异步跟踪
（4）覆盖Piwik.js的单元测试
4、跟踪API可用的所有方法列表
5、相关文档
Piwik配备了相当强大的JavaScript跟踪API。高级用户能使用Piwik跟踪代码定制一些网站分析数据记录在Piwik中的方式。插件开发者也能向Piwik跟踪脚本发送定制化的JSON数据，并且在插件中使用这些数据。
**1、先决条件：使用新版本的JavaScript跟踪代码
**基本的Piwik跟踪代码如下：
<!-- Piwik -->
<script type="text/javascript">
var pkBaseURL = (("https:" == document.location.protocol) ? "[https://{$PIWIK_URL](https://{$PIWIK_URL)}" : "[http://{$PIWIK_URL](http://{$PIWIK_URL)}");
document.write(unescape("%3Cscript src='" + pkBaseURL + "piwik.js' type='text/javascript'%3E%3C/script%3E"));
</script><script type="text/javascript">
try {
var piwikTracker = Piwik.getTracker(pkBaseURL + "piwik.php", {$IDSITE});
piwikTracker.trackPageView();
piwikTracker.enableLinkTracking();
} catch( err ) {}
</script>
<!-- End Piwik Tag -->

<!-- more -->在Piwik跟踪代码中，{$PIWIK_URL}将被替换为你的Piwik URL，{$IDSITE}将被替换为你在Piwik中跟踪的网站ID。
如果你的Piwik跟踪代码不是这样的，那么，你可能正在使用过时的旧版本。旧版本仍将按期望工作，继续跟踪你的访问者。但是，为了使用这个页面中所介绍的所有功能，你将需要使用新版本的跟踪代码。请访问你的Piwik管理部分，请求给定网站的JavaScript代码，并且将你的页面更新为新的代码。
**2、JavaScript跟踪代码的功能
**（1）定制Piwik中显示的页面名称
默认情况下，Piwik在Piwik界面中使用当前页面的URL作为页面的名称。如果您的URL很复杂，或者如果你想要定制Piwik跟踪页面的方式，你能在JavaScript标签中指定页面名称。

常用的方法是使用HTML标题的值：
 `[...]
piwikTracker.setDocumentTitle(document.title);
piwikTracker.trackPageView();
[...]
`高级用户也能动态产生页面名称，例如在PHP中：
`[...]
piwikTracker.setDocumentTitle("<?php echo $myPageTitle; ?>");
piwikTracker.trackPageView();
[...]
`（2）手动触发目标转化
默认情况下，目标在Piwik被定义为部分URL的“匹配”（开始、包含或正则式匹配）。你也能默认将特定页面查看、下载或出站链接跟踪为目标。
在一些情况下，你想要将其他类型的动作登记为转化，例如：
•访问者提交一个表单：
•访问者在页面上停留超过给定时间
•访问者与你的Flash应用程序进行了一些交互
•用户提交了购物车并完成了支付：你能将Piwik跟踪代码提供给支付网站，这个网站将在稍后在你的Piwik数据库中登记这个转化以及自定义的收入。
•等等
使用Piwik JavaScript跟踪手动触发一个目标，你可以简单的这样做：
`[...]
piwikTracker.trackGoal(1); // 记录目标1的一次转化
[...]
`你也能为这个目标记录自定义收入，例如，你可以生成对跟踪目标的动态调用，以便设置这笔交易的收入：
`[...]
piwikTracker.trackGoal(1, <?php echo $cart->getCartValue(); ?>); // 记录设置了自定义收入的目标1的一次转化
[...]
`目标跟踪的更多信息见跟踪目标文档。
（3）考虑一个主机的“别名”，不将这个域名的链接记录为“出站链接”
默认情况下，所有域名不是当前域名的连接都被认为是出站链接。如果你有多个域名，不希望将指向这些网站的链接被认为是“出站链接”，那么你可以在一个域名数组中指定。如果你想要忽略特定域的二级域的所有点击，那么可以使用通配符。
`[...]
piwikTracker.setDomains(["*.hostname1.com", "hostname2.com"]); // 至少目前跟踪的网站应添加到这个数组中
piwikTracker.trackPageView();
[...]`
（4）禁用下载及出站链接跟踪
Piwik跟踪代码默认启用点击和下载跟踪。禁用所有自动下载和出站链接跟踪，你必须去掉对enableLinkTracking()函数的调用：
`[...]
// 我们注释掉启用链接跟踪的函数
// piwikTracker.enableLinkTracking();
piwikTracker.trackPageView();
[...]`
（5）禁用特定CSS类的下载及出站链接跟踪
你能禁用对特定CSS类的下载及出站链接的自动跟踪
`[...]
**piwikTracker.setIgnoreClasses( "no-tracking" ); // 你也能传递一个字符串数组
**piwikTracker.trackPageView();
[...]`
这将导致链接<a href='http://example.com' class='no-tracking'>Test</a>的点击不被计算。
（6）禁用特定链接的下载或出站链接的跟踪
如果你想要一直忽略特定链接的下载或出站链接跟踪，你能为它添加“piwik_ignore”CSS类：
<a href='latest.zip' class='piwik_ignore'>不想跟踪为下载的文件</a>
（7）将一个链接的点击在Piwik中强制记录为下载
如果你想让Piwik将一个给定链接考虑为下载，那么，你可以为这个链接添加“piwik_download”CSS类：
`<a href='last.php' class='piwik_download'>我想要跟踪为下载的链接</a>`
注：你可以自定义和重命名用于强制被记录为下载的点击的CSS类：
` [...]
// 现在所有“download”CSS类的链接将为记录为下载
piwikTracker.setDownloadClasses( "download" ); //你也可以传递一个字符串数组
piwikTracker.trackPageView();
[...]`
（8）将一个链接的点击在Piwik中强制记录出站链接
如果你想让Piwik将一个给定的链接考虑为出站链接（指向当前域或一个别名域的链接），那么，你可以为这个链接添加“piwik_link”CSS类：
`<a href='http://mysite.com/partner/' class='piwik_link'>我想要跟踪为出站链接的链接</a>`
注：你可以自定义和重命名用于强制被记录为出站链接的点击的CSS类：
`[...]
//现在所有“external”CSS类的链接上的点击将被计算为出站链接
piwikTracker.setLinkClasses( "external" ); //你也可以传递一个字符串数组
piwikTracker.trackPageView();
[...]`
（9）修改暂停定时器
当访问者点击文件下载，或点击出站链接时，Piwik将记录它。为了这样做，Piwik在重定向用户到请求的文件或链接之前添加了一小段延迟。我们使用的默认值是500ms，但是你可以将它设置为更短的时间。但是，需要注意的是，这样做会带来由于这段时间过短而使Piwik无法记录数据的风险。
`[...]
piwikTracker.setLinkTrackingTimer( 250 ); // 250 毫秒
piwikTracker.trackPageView();
[...]`
（10）修改跟踪为“下载”的文件扩展名列表
默认情况下，任何以下列这些文件扩展名之一结尾的文件在Piwik界面中都会被认为是“下载”:
7z|aac|arc|arj|asf|asx|avi|bin|csv|doc|exe|flv|gif|gz|gzip|hqx|jar|jpe?g|js|mp(2|3|4|e?g)|mov(ie)?|msi|msp|pdf|phps|png|ppt|qtm?|ra(m|r)?|sea|sit|tar|tgz|torrent|txt|wav|wma|wmv|wpd||xls|xml|z|zip
为了替换你想要跟踪为文件下载的扩展名列表，你可以：
`[...]
piwikTracker.setDownloadExtensions( "jpg|png|gif" ); //我们现在只跟踪图片上的点击
piwikTracker.trackPageView();
[...]`
如果你想跟踪新的文件名类型，你可以仅将它添加到这个列表中：
`[...]
//点击以mp5或mp6结尾的URL将被计算为下载
piwikTracker.addDownloadExtensions( "mp5|mp6" );
piwikTracker.trackPageView();
[...]`
**3、其他函数
**（1）向piwik.php跟踪脚本发送自定义JSON数据（插件开发者）
例如，向一个（虚构的）跟踪插件发送用户ID数据：
`[...]
var user = { 'userId' : user_id };
piwikTracker.setCustomData( user );
piwikTracker.trackPageView();
[...]`
在trackLink方法中，你也可以为特定点击发送自定义数据。例如，发送交易数据供虚构的电子商务跟踪插件使用。
`[...]
var trans = { 'orderId' : order_id,
'storeId' : store_id,
'total' : total,
'city' : city,
'state' : state,
'country' : country,
'skus' : 'A;B;C',
'units' : '1;2;1'
};
piwikTracker.trackLink( '/store', 'addTransaction', trans );
[...]`
所有的自定义数据能被设置为JASON对象。Piwik代码将自动编码JASON对象并且构建为一个字符串版本，随后你可以在php段使用json_decode()解码。我们使用json.org上的开源JSON工具。
注：目前，自定义数据不会记录在Piwik数据库中。插件使用的自定义数据必须在自己的表中存储数据，然后进行归档。如果你需要别人帮忙构建这样的功能，请在piwik-hacker的邮箱列表中询问你的问题（[更多信息](http://dev.piwik.org/)）。
（2）多个Piwik跟踪器
可以使用指向相同或不同Piwik服务器的多个Piwik跟踪器跟踪同一个页面。为了减少加载时间，你可以加载piwik.js一次。每一次调用Piwik.getTracker()都返回惟一Piwik跟踪器对象（事例），这些跟踪对象可以进行配置。
调用getTracker的第一个参数
`<script type="text/javascript">
try {
    var piwikTracker = Piwik.getTracker("[http://URL_1/piwik.php](http://URL_1/piwik.php)", 1);
    piwikTracker.trackPageView();
    var piwik2 = Piwik.getTracker("[http://URL_2/piwik.php](http://URL_2/piwik.php)", 4);
    piwik2.trackPageView();
} catch( err ) {}
</script>
`注意你也可以手动设置网站ID和piwik跟踪器URL，而不是在getTracker调用中设置它们：
`//我们替换Piwik.getTracker("[http://example.com/piwik/](http://example.com/piwik/)", 12)
var piwikTracker = Piwik.getTracker();
piwikTracker.setSiteId( 12 );
piwikTracker.setTrackerUrl( "[http://example.com/piwik/](http://example.com/piwik/)" );
piwikTracker.trackPageView();`
（3）异步跟踪
Piwik JavaScript跟踪API也支持异步跟踪，以便页面加载（或看起来加载）的更快。配置和跟踪调用被推送到_paq数组进行执行，与piwik.js加载异步。其形式为：
`_paq.push([ 'API_method_name', parameter_list ]);`
异步Piwik跟踪代码应插入到<head>标签中，形式如下：
`<!-- Piwik -->
<script type="text/javascript">
var _paq = _paq || [];
(function(){
    var u=(("https:" == document.location.protocol) ? "[https://{$PIWIK_URL](https://{$PIWIK_URL)}" : "[http://{$PIWIK_URL](http://{$PIWIK_URL)}");
    _paq.push(['setSiteId', {$IDSITE}]);
    _paq.push(['setTrackerUrl', u+'piwik.php']);
    _paq.push(['trackPageView']);
    var d=document,
        g=d.createElement('script'),
        s=d.getElementsByTagName('script')[0];
        g.type='text/javascript';
        g.defer=true;
        g.async=true;
        g.src=u+'piwik.js';
        s.parentNode.insertBefore(g,s);
})();
</script>
<!-- End Piwik Tag -->`
（为了清晰，以上代码段没有压缩。）
（4）覆盖Piwik.js的单元测试
Piwik JavaScript跟踪API由广泛JavaScript单元测试控件来确保代码的质量尽可能高，我们永远不会破坏这种功能。测试使用QUnit-jQuery单元测试执行器写的。运行这些测试，只需要检查Piwik的SVN端口汇合，进入/path/to/piwik/tests/javascript/。测试在你的浏览器中进行。
Piwik JavaScript API经过许多web浏览器的测试：包括（但不限于）火狐2、3.0、3.1；IE 5.5、6、7、8；Opera 7.54、8.54、9.64、10；Safari 3.0、3.2、4.0；Konqueror 3.5；SeaMonkey 1.1、2.0。我们有时使用[browsershots.org](http://browsershots.org/)来帮助测试。
（5）压缩piwik.js
Piwik.js被压缩为你的网站访问者将要下载的最小尺寸。我们使用YUI压缩器在压缩JavaScript（[了解更多](http://dev.piwik.org/trac/browser/trunk/js/README#L1)）。你可以在[/js/piwik.js](http://dev.piwik.org/trac/browser/trunk/js/piwik.js#L1)找到原始的未经压缩的版本。
**4、跟踪API可用的所有方法列表
**_从Piwik类请求跟踪器实例
_•Piwik.getTracker( trackerUrl, siteId )——获得跟踪器的新实例
 •[Google Analytics等价物] _getTracker(account)
 •[Yahoo! Analytics等价物] getTracker(account)
_使用跟踪器对象
_•enableLinkTracking()——在所有可以应用的链接元素上安装链接跟踪
•addListener(element)——为特定链接元素添加链接监听器。当点击时，Piwik将自动记录点击。
•setRequestMethod(method)——将请求方法设置为“GET”或“POST”（默认是“GET”）。使用POST请求方法，Piwik的主机必须与跟踪网站的主机相同（Piwik安装在与跟踪网站相同的域上）。
•trackGoal( idGoal, [customRevenue], [customData])——手动记录idGoal目标的一个转化，如果指定了的话，传递customRevenue和customData
•trackLink( url, linkType, [customData] )——手动记录来自你自己代码的一次点击。url是点击的URL。linkType可以是“link”出站链接也可以是“download”下载。
•trackPageView([customTitle], [customData])——记录这个页面的访问
•[Google Analytics等价物] _trackPageview(opt_pageURL)
•[Yahoo! Analytics等价物] submit()
_跟踪器对象的设置
_•setDocumentTitle( string )——重写文档标题
 •[Yahoo! Analytics 等价物] YWATracker.setDocumentName("xxx")
•setDomains( array)——设置当做本地处理的主机名或域名数组
 •[Google Analytics 等价物] _setDomainName(".example.com")
 •[Yahoo! Analytics equivalent] setDomains("*.abc.net")
•setCustomData( object|string )——向服务器传递自定义数据
•setCustomUrl( string )——重写页面报告的URL
•setReferrerUrl( string )——重写检测到的Http-Referer
•setSiteId( integer )——指定网站的ID。多余的：能在getTracker()构造函数中指定。
•setTrackerUrl( string )——指定Piwik服务器URL。多余的：能在getTracker()构造函数中指定。
•setDownloadClasses( string | array )——设置处理为下载（除了piwik_download以外）的类。
•setDownloadExtensions( string )——设置识别为下载的文件扩展名列表。例如：“doc|pdf|txt”。
•addDownloadExtensions( string )——指定更多的识别为下载的文件扩展名。；例如：“doc|pdf|txt”。
•setIgnoreClasses( string | array )——设置如果出现在链接中将被忽略的类（除了piwik_ignore以外）
•setLinkClasses( string | array )——设置被处理为出站链接的类（除了piwik_link以外）
•setLinkTrackingTimer( integer )——设置链接跟踪的延迟，以毫秒为单位。
**5、问题？
**如果你有任何关于Piwik JavaScript跟踪问题，请在[网站中搜索](http://piwik.org/search/)，或者[在论坛中询问](http://forum.piwik.org/)。祝您愉快！

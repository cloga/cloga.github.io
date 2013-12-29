---
author: cloga0216
comments: true
date: 2010-09-15 09:58:41+00:00
layout: post
slug: google-analytics%e8%b7%9f%e8%b8%aa%e7%94%b5%e5%ad%90%e5%95%86%e5%8a%a1%e4%ba%a4%e6%98%93
title: Google Analytics跟踪电子商务交易
wordpress_id: 396
tags:
- 电子商务
---

在解释如何抓取电子商务数据之前，考虑一下收集访问者交易数据时需要注意的要点：
**每个本地化的网站使用一个Google Analytics账户** 在Google Analytics中，交易和商品的交易与货币无关——即，尽管能在设置中指定货币符号（见第8章，“最佳配置指南”），但这只是一个报告标签。如果你用当地货币运行了多个网站，那么Google Analytics将不会将这些货币转换成美元（或者你所设置的货币标签）。
当然，你可以将按照汇率计算为统一的货币后再发送给Google Analytics，但这将搞乱你的区域营销部门，他们需要去除汇率的波动以确定一个广告系列是否成功。
因此，最佳的做法是为每一个本地化的网站使用一个Google Analytics账户。当你考虑到每一个本地化网站也可能以当地的时区运行，并且运行自己的Adwords广告系列，同时消费数据可本地化，那么这么做是有意义的。
如果你想要合计所有本地网站的报告，那么在你的页面上再添加一个GATC。这种情况在第6章的“上卷报告”部分详细讨论。
**以来自网络渠道的收入测量你的成功** 使用Google Analytics电子商务报告以来自网络渠道的收入测量你的网站及市场营销活动的效果。它不应该用作你的后台或客户关系管理（CRM）系统，因为，这些数据源通常有差异。
例如，当网站访问者数据与订单完成系统进行比较时，禁用JavaScript的浏览器、cookie的阻止和删除、访问者的重复点击、互联网连接信号、退单、错误等等都增加了误差。第6章“现有的方法及其准确性”的“比较不同服务提供商的数据”部分讨论了关于这种情况下准确性的思考。
**向CRM系统中导入cookie数据** Google Analytics不收集任何个人可识别信息，试图收集这种信息这违反了服务条款。但是，可以将交易细节及Google Analytics cookie数据同时发送给CRM系统。这将在第12章“导出Google Analytics信息”。
记住这几点，第一步是收集你的访问者交易数据到Google Analytics，我们接下来将讨论这一点。
**捕捉安全电子商务交易**
Google Analytics支持客户端数据收集技术捕捉电子商务交易。通过在购买收据页上GATC的一些简单补充，你能设置Google Analytics来记录交易及产品信息。下面是一个GATC的例子：
旧的ga.js：
`<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." :"http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-12345-1");
pageTracker._trackPageview();
**pageTracker._addTrans**(
"1234",                        //订单 ID - 必填
"Mountain View Book Store",    //关联企业或商店名称
"89.97 ",                      //总计 - 必填
"6.30 ",                       //税
"5",                           //运费
"San Jose",                    //城市
"California",                  //省、自治区、直辖市
"USA"                          //国家
);
**pageTracker._addItem**(
"1234",                        //订单 ID - 必填
"DD44-BJC",                    //产品代码
"Advanced Web Metrics",        //产品名称
"Web, Technical",              //类别或版本
"29.99",                       //单价-必填
"3"                            //数量-必填
);
**pageTracker._trackTrans();     **//向GA服务器发送交易
} catch(err) {}</script>`
异步代码：
`<script>
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-12345-1']);
_gaq.push(['_trackPageview']);
**_gaq.push(['_addTrans',     **
'1234',                        //订单 ID - 必填
' Mountain View Book Store ',  //关联企业或商店名称
'89.97 ',                      //总计 - 必填
'6.30 ',                       //税
'5',                           //运费
'San Jose',                    //城市
'California',                  //省、自治区、直辖市
'USA'                          //国家
]);
//_addItem将调用购物车中的每一个商品，你的电子商务引擎将loop购物车中的所有商品，将每一个产品输出为一个_addItem。
**_gaq.push(['_addItem',**
'1234',                        //订单 ID - 必填
' DD44-BJC',                   //产品代码-必填
' Advanced Web Metrics ',      //产品名称
' Web, Technica ',             //类别或版本
'29.99',                       //单价-必填
'3'                            //数量-必填
]);
**_gaq.push(['_trackTrans']);**   //向GA服务器发送交易
(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);   })();
</script>`
在这个例子中，GATC添加了3行代码：
•定义为_addTrans()的交易行，是一个用引号（旧的ga.js中是双引号，异步代码中是单引号）标记界定的，以逗号分隔开的值的列表。
•定义为_addItem()的产品行，是一个用引号标记界定的，以逗号分隔开的值的列表。
•调用_trackTrans()函数，发送交易及商品信息到Google Analytics。
这些行在GATC中的顺序很重要，因此，在你的收据页上保持这里的顺序。
如例子所示，_addTrans()和_addItem()为了清晰都被写成了多行。相反，它们也可以写成一行，这对你来说是可以用来跟踪包含多个商品的交易的简单格式，例如：
旧版ga.js：
`pageTracker._addTrans("1234","Mountain View Book Store","89.97","6.30","5","San Jose","California","USA");
pageTracker._addItem("1234","ISBN-9780470253120","Advanced Web Metrics","Web","29.99","2");
pageTracker._addItem("1234","ISBN-9780321344755","Don’t Make me Think","Web","29.99","1");`
异步代码：
`_gaq.push(['_addTrans','1234','Mountain View Book Store','89.97','6.30','5','San Jose','California','USA');
_gaq.push(['_addItem','1234','ISBN-9780470253120','Advanced Web Metrics','Web','29.99','2');
_gaq.push(['_addItem','1234','ISBN-9780321344755','Don’t Make me Think','Web','29.99','1');`
对于每一个交易，只应有一个_addTrans()条目。这一行详细列出了交易总额、购买者的国家省市。对于每一个购买的产品，都必须有一个_addItem()行。即，购买两个产品要求两个_addItem()，等等。产品行包含产品名、产品代码、单价和数量。图7.2显示了需要的变量值。你能从电子商务购物车系统中获得它们。




![](http://www.cloga.info/wp-content/uploads/2010/09/7.2.bmp)


如果你没有哪个变量的数据，把变量的引号留空（没有空格）。例如，如果你没有关联网络，运费包含在交易总额中，并且你不需要使用类别，那么你可以像下面一样使用：
`pageTracker._addTrans("1234","","89.97 ","6.30 ","","San Jose","California","USA");
pageTracker._addItem("1234","ISBN-9780470253120","Advanced Web Metrics","","29.99","2");
pageTracker._addItem("1234","ISBN-9780321344755","Don’t Make me Think","","29.99","1");`
**注：**在前面的例子中，引号之间没有空格（旧的ga.js是双引号，异步跟踪代码是单引号。）也请注意在交易总额及税额最后的空格。我强调这些是因为它们不影响报告，因为，Google Analytics在处理的过程中删除了它们。变量值的词之间的空格不会被删除。例如，“San Jose”不会改变。
**惟一订单ID的重要性**
为每一个交易使用惟一订单ID（文本和数据的混合）是很重要的。否则，有相同交易ID的不同的交易会混在一起，使数据失去意思。最好的做法是避免这种行为。下面是JavaScript的例子：
`<script>
var firsttime;
function validator(){
if (firsttime == "Y"){
alert("请等一下，你的支付正在进行。");
return (false);
}
firsttime = "Y";
return (true);
}
</script>`
请将上面的代码粘贴到包含最终电子商务结账链接或按钮的HTML页的区域中。接着，像下面这样，修改在这个页面的HTML中的表单提交。
`<FORM METHOD="POST" ACTION="authorize.cgi" onSubmit="return validator()">`
onSubmit事件处理程序将避免表单的重复提交，这将避免Google Analytics捕捉重复的交易ID。
如果你的购买表单中已经有一个onSubmit事件处理程序，添加如下的验证器调用：
`<FORM METHOD="POST" ACTION="authorize.cgi" onSubmit="return checkEmail;return validator()">`

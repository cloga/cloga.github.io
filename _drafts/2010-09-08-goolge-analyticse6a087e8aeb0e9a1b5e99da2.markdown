---
author: cloga0216
comments: true
date: 2010-09-08 13:26:10+00:00
layout: post
slug: goolge-analytics%e6%a0%87%e8%ae%b0%e9%a1%b5%e9%9d%a2
title: Google Analytics标记页面
wordpress_id: 334
tags:
- 标记页面
---

注册过程中最重要的部分是配置文件的倒数第二步，在这一页列出了应放置在所有页面的特有标签。这被称为Google Analytics跟踪代码（GATC）。使用一个信标来收集访问者数据——每一页都是完全一样的标签——这使Google Analytics的安装很简单。  

2009年12月，Google Analytics的新一代跟踪代码异步跟踪代码，最初为beta版，目前已经全面取代ga.Js。使用异步跟踪代码的加载时间将缩短。（Cloga：以后的内容将增加异步跟踪代码的内容介绍，由于这部分的中文内容比较少，本人知识有限，所出现的错误，请各位见谅。）  

**理解Google Analytics跟踪代码  

**GATC是粘贴到你的网站上的一小段JavaScript代码。代码是隐藏的，并且作为收集访问者数据并将其发送给Google Analytics数据收据服务器的标记。如图6.2所示。




[![](http://www.cloga.info/wp-content/uploads/2010/09/6-2.jpg)](http://www.cloga.info/wp-content/uploads/2010/09/6-2.jpg)




图6.2 添加到网站上的Google Analytics异步跟踪代码




**注：**如果你已经设置了Google Analytics账号，那么你能从配置文件设置访问设置如图6.2所示。点击“检查状态“链接。  

第3章“Google Analytics的特性、优势和局限”的图3.2以图解的方式解释了GATC的原理。在这里更详细的讨论一下这些代码。其实，GATC包括3个部分：  

**（1）从Google服务器调用JavaScript主文件** 主文件ga.js包括进行数据收集所必须的代码。这个文件的大小大约24KB，一旦请求过那么它将在访问者的浏览器缓存中，能被用于随后的页面浏览。所有Google Analytics的账户都是这一个文件。因而，如果你的访问者最近了也安装了Google Analytics的其他网站（这很可能），那么，ga.js文件可能根本不需要请求。  

尽管这一段GATC看起来很长，但是，它只是检测是通过标准的HTTPweb请求还是通过HTTPS（加密）协议下载ga.js。这种自动检测意味着访问者进入网站的安全区域，例如输入信用卡信息时，你不需要改变任何事。  

**（2）UA--XXXX-YY形式的惟一账户ID**  这个ID对每一个Google Analytics账户是惟一的，并且必须被准确引用，否则，你的数据将被发送到别的账户。这种情况可能意外发生（实施错误），也可能故意发生（人们希望通过在别的地方使用你的账户ID来“污染”你的数据）。你能使用过滤器来避免，我们将在第8章“最佳配置指南”中讨论这些。  

**（3）调用函数_trackPageview()**  这是Google Analytics的主力。实际上，_gaq.push(['_trackPageview'])这一行收集访问者下载到浏览器中的URL以及相关参数，比如，浏览器类型、语言设置、引荐网址和时间戳。然后读取并设置Cookies，这个信息被发送回Google 数据收集服务器。  

**注：**在原ga.js代码中，第2、3部分被包含在try-catch代码块中。这是处理JavaScript错误的小技巧——避免向访问者显示多余的错误信息。例如，如果访问者所安装的广告拦截器（例如，火狐的广告拦截插件）禁止了ga.js的加载，那么，当_trackPageview()试图与其通信时，将发生错误。使用try-catch代码，这个错误将被捕捉（不显示），并且不会跟踪访问者。这比向访问者显示不相关的信息更好。  

你也许在图6.2中注意到了GATC的其他选项。这些选项在顶部的选项卡菜单显示为标准、高级和自定义。在标准选项卡中，其实，如果你只有一个域名需要跟踪，例如，www.mysite.com，那么单个域名的GATC正是你所需要的。当你有一个含有多个二级域名的网站需要跟踪，例如www.mysite.com和cloga.mysite.com时，则应选择一个域名包含多个子域名。如果你需要跨域跟踪，比如，使用第三方购物车，那么，请选择多个顶级域。高级及自定义变量将在第7章“高级实施”的“自定义GATC”中涉及。




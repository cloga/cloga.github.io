---
author: admin
comments: true
date: 2012-10-10 06:19:06+00:00
layout: post
slug: google-tag-manager%e7%ae%80%e4%bb%8b
title: Google Tag Manager简介
wordpress_id: 1662
categories:
- Digital分析
tags:
- Tag manager
---

Google在10月1日发布了免费的Tag Management Tool:[Google Tag Manager](http://www.google.com/tagmanager)。这对Tag Manager工具提供商来说是一个冲击，一方面Google进入这个领域，表明这个领域存在的巨大潜力，另一方面，免费的策略意味着目前的工具提供商必须要提供有价值的差异化服务才能向用户收费。就像2005年，Google通过收购Urchin进入网站分析领域一样，一方面，由于GA这款免费但不失优秀的工具，使整个网站分析业获得快速的发展，从最初不到三分之一网站使用网站分析工具，到目前几乎所有的网站都使用网站分析工具；同时网站分析行业也进行了大清洗。感兴趣的同学可以看一下Tag Management的工具提供商近期的Blog，比如，


[What Google Tag Manager Means to the Tag Management Industry](http://blog.tealium.com/tag-management/google-tag-manager)


[WELCOME TO THE PARTY GOOGLE](http://http://www.qubitproducts.com/the-official-product-blog/welcome-google-tag-manager/?utm_source=OpenTag+CRM&utm_campaign=a1fcd0115f-GTM_Announcement10_9_2012&utm_medium=email)

基本上都是将Google进入Tag Management领域既看作是机遇也是挑战。

在介绍Google Tag Manager之前，我们先来看一下关于Tag Management的一些基本问题。


### 什么是Tag Management Tool？为什么要用到Tag Management Tool？


目前的主流网站分析工具都是用Page Tag的方式，这种方式的一个优势是对IT资源的需求量大幅减少，但是，在工作中由于一些原因对Tag的修改或新增仍需要借助于IT同事的力量。对于大中型企业来说，某些情况下，添加一个转化跟踪代码所需要的流程和时间成本，要远超这件事情本身。而Tag Management Tool就是在这样的背景下诞生的。Tag Management Tool顾名思义，是用来管理页面上Tag的工具。从本质上来说，Tag Management Tool是一个用来承载多种Tag的一个容器。在这个容器中你可以放置多种Tag，比如GA的Pageview，Event，Adwords转化跟踪，百度统计，DFA的Flood Light等等。Tag Management Tool的出现，为网站分析师以及外部的Agency提供了极大的便利，其实也是IT同学的福音。

在为网站分析师带来便利的同时，一些风险和责任也同时让渡了过来。主要集中在两点：一是由于涉及到页面上Tag的一些改动，所以QA的工作也自然而然的落到的网站分析师的身上，不然由于你的Tag改动，造成整体页面功能失灵就不好玩了，为此，所有的Tag Manager工具都提供了Debug模式，正式发布之前进行测试是必不可少的环节，而在以前这部分工作是IT同学的职责。此外，由于网站分析师要与页面上的Tag打交道，甚至操作DOM及JS变量，因此，对网站分析师的HTML及JS正则式的基础知识提出了新的要求。

下面让我们来具体看一下Google Tag Manager。<!-- more -->


### 账户结构


Account<Container<Tag<Rule, Macro

一个Google账户可以创建多个Tag Manager的账号，每个Tag Manager包含多个Container，每个Container可以由多个Tag构成。每个Tag可以与多个Macro交互（从Macro中提取一些值在Tag使用），每个Tag由Rule来规定触发规则（什么时候显示在页面中）


### Container


容器，用来存放Tag，通常一个容器对应一个网站。但是，一个页面中其实可以放置多个Container，比如一个是网站分析师管理网站分析工具的Tag，一个是给Agency添加他们的转化跟踪代码，请注意Tag Manager控制权限的最小单位就是Container。同样也可以在多个网站上使用一个容器，比如GA的跨主域跟踪。


### Data Layer


数据层，是用来存放可以被Tag Manager调用的变量的一个全局对象，其中的每个成员都是名值对的形式。其实在Omniture对数据层的应用很普遍，在每一个使用Omniture的网站上都可以看到数据层的身影。对数据层感兴趣的同学可以看一下：[Google建议的数据层变量列表](http://https://developers.google.com/tag-manager/reference#varnames)。

数据层的应用需要在每个页面上预先将可能用到的所有变量动态输出到页面上（需要IT同学的帮忙，具体请参见：[GTM的开发文档](https://developers.google.com/tag-manager/)），位置在GTM的上方，然后才可以在Rule和Macro中调用。


### Macro


[caption id="attachment_1676" align="alignright" width="149"][![Macro Type](http://www.cloga.info/wp-content/uploads/2012/10/3332.jpg)](http://www.cloga.info/wp-content/uploads/2012/10/3332.jpg) Macro Type[/caption]

宏为规则和标签提供了动态的数据。

Tag Manager中的宏有8种类型：固定的字符、Javascript变量、数据层变量、DOM文本、DOM属性、URL、自定义事件、HTTP Referrer（当前页面的前一个页面）。

例如你可以将作者名称、商品类别这些变量的值，存储在宏中，并在Tag中调用这些值，存储到网站分析工具中。假设你的作者名称的值存储在ID为author的DOM元素的文本中，那么你就可以设置类型为DOM Text名称为author的宏来存储这个值，同理，如果你知道商品类别的值存储在ID为category的DOM元素的文本中，那么，你可以设置名称为category类型为DOM Text的宏来存储这个值。当然，最佳的做法还是通过数据层来存储这些值。数据层的一个目的就是用数据独立于页面的结构，这样即使页面改变，比如ID发生变化，也不会影响到网站分析的数据。


### Tag


[caption id="attachment_1665" align="alignright" width="194"][![](http://www.cloga.info/wp-content/uploads/2012/10/1111.jpg)](http://www.cloga.info/wp-content/uploads/2012/10/1111.jpg) Add New Tag[/caption]


标签，通常一个标签就用来存放一种标签。比如，GA的Tag和百度统计应该分开在两个标签中，这样账号的结构会比较清晰，也便于日后的维护。


 从右侧的截图中，我们可以看到Google Tag Manager中目前支持AdWords的转化跟踪，自定义的HTML标签，自定义图片标签，Double Click的Flood Light标签，GA的标签，AdWords再营销标签。

其实就本质上而言，这些标签都是HTML标签，而且，相信我，就目前而言，那些各种名目的标签没有使用自定义HTML标签来的方便。也许是因为其他的产品获取代码的用户体验更好，希望在后续的版本中可以有所改善。

比如，我们要添加一个AdWords转化跟踪标签，并且标签类型选择了AdWords转化跟踪，那么，我们将看到下面的界面。

[caption id="attachment_1666" align="alignleft" width="150"][![](http://www.cloga.info/wp-content/uploads/2012/10/22222-150x150.jpg)](http://www.cloga.info/wp-content/uploads/2012/10/22222.jpg) Conversion Tracking[/caption]

如你所见，你需要手动填写Conversion ID，Conversion Label的值，而这些值其实是在AdWords生成的转化跟踪标签中。手动填写既繁琐又容易出现错误。当然，也许在不远的将来，Tag Manager和AdWords可以整合，那我们所需要做的只是勾勾选选，即可以将AdWords转化跟踪标签加入到Container中。在这之前，建议您还是使用自定义的HTML标签。

对于GA标签也存在类似的问题，目前的Tag Manager提供的GA标签为标准代码，支持的两个自定义是指定网络资源ID（如果这个也算一个自定义的话）和Cookie Path（话说这个还没有DomainName用的多）。Event Tracking与Pageview的二选一同样有点纠结，从Tag本身来说定义基本参数的Tag和触发Beacon的Tag应该要区分开才对，向网络资源ID，DomainName这些基本参数的定义，在一个页面上只应定义一次，不会每个Pageview或者Event都要重新定义一下。对于中国的用户来说，添加搜索引擎基本上标准配置，而目前通过Tag Manager提供的标签类型是无法实现的，同样，需要跨子域的用户，也没法通过GA这种标签类型设置。

自定义HTML标签只需要将网站分析工具提供的复制进去即可，比如，GATC、AdWords转化跟踪等等。

Tag也可以使用Macro（宏）的值，比如前面提到的例子，如果你将作者名称或者商品类别存储在宏中，那么在tag中调用这些宏中存储的值，只需要使用如下的形式{{宏名称}}，比如，要使用作者名称这个宏，那么，你应使用{{author}}，商品类别则为{{category}}。如果你要将作者名称存储在page级的GA自定义变量中，那么你只需要添加如下的Tag：_gaq.push(['_setCustomVar',5,'Author',{{author}},3]);

这里要注意的一个问题是，Tag是异步的形式加载，因此我们无法指定Tag的顺序。而上面这个代码属于参数定义型的Tag，如果后面没有触发Beacon的Tag，那么将不会起作用。一个解决方案是直接在后面再调用一个Event，如果不希望影响Bounce Rate，请使用第5个参数。

另外一个值得注意的问题是目前百度统计仍然使用document.write的形式，由于不是异步形式，因此，目前Tag Manager中是不支持的，解决方法是将百度统计改为异步形式加载，参见：[Baidu统计代码异步优化](http://rokie.ueuo.com/baidu-asyc-tracking-code.html)。（感谢sobeited丢出这个问题，Oscar提醒GTM关于异步代码的说明，Rokie同学给出的解决方案）


### Rule


规则是指触发Tag的规则。不是所有的Tag都需要在所有的页面上触发。当然 基本参数定义的Tag和Pageview的Tag除外，这两个Tag应该在所有的页面上都触发。

Rule的构建是通过宏与一定的逻辑运算。默认的宏包括URL、Referrer和Event。

比如，对于AdWords的转化跟踪代码，它应该只在订单成功页面触发，那么，它就需要URL等于订单页面的规则。同理上面提到的作者名称和商品类型的例子，GA的自定义变量代码也不是在全站运行，也应该限定在文章页面或者商品详情页，这些限定也需要用到URL的规则。


### Debug模式


[caption id="attachment_2084" align="alignleft" width="272"][![Debug](http://www.cloga.info/wp-content/uploads/2012/10/Screen-Shot-2013-10-26-at-11.05.14-am.png)](http://www.cloga.info/wp-content/uploads/2012/10/Screen-Shot-2013-10-26-at-11.05.14-am.png) Debug[/caption]

在每个Version的右上可以选择预览和Debug，选择了Debug模式后，访问放置了对应GTM的页面时，会在页面的下方显示每个tag是否正常触发，结合Chrome的控制台，可以很方便的进行Debug。

以上就是关于Tag Manager的简介，希望能够对你的工作有所帮助，如果你有任何疑问欢迎给我留言~

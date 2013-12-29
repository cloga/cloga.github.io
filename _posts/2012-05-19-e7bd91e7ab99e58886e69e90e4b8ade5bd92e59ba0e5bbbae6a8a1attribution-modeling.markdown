---
author: cloga0216
comments: true
date: 2012-05-19 16:08:43+00:00
layout: post
slug: '%e7%bd%91%e7%ab%99%e5%88%86%e6%9e%90%e4%b8%ad%e5%bd%92%e5%9b%a0%e5%bb%ba%e6%a8%a1attribution-modeling'
title: 网站分析中归因建模(Attribution Modeling)
wordpress_id: 1532
categories:
- Digital分析
tags:
- 归因模型
---

**什么是归因模型？**

归因模型是指一个规则集，用于解释转化路径中每个接触点所贡献的转化量或转化价值。例如，大家熟知的GA的的转化归因模型属于”最后互动“归因，即将转化归因为距离转化最近的一个接触点。

[caption id="attachment_1541" align="aligncenter" width="553" caption="GA中的归因建模"][![Attribution model in GA](http://www.cloga.info/wp-content/uploads/2012/05/44564654.png)](http://www.cloga.info/wp-content/uploads/2012/05/44564654.png)[/caption]

**网站分析中归因模型的种类及其适用情景**

我们先来假设一个场景，以便更好的理解这些模型。

假设有一个访问者，最初通过一个新浪上的Banner广告来到了你的网站，第二天上午，她又通过你们的官方微博发送的信息来到了网站，下午的时候她收到了你们的一封促销邮件，又一次来到的网站并产生了购买。我们来看一下几种归因模型如何归因这个订单。

1、最后互动归因模型

[caption id="attachment_1542" align="alignright" width="113" caption="最后互动"][![Last Interaction](http://www.cloga.info/wp-content/uploads/2012/05/Last-Interaction.png)](http://www.cloga.info/wp-content/uploads/2012/05/Last-Interaction.png)[/caption]

最后互动归因模型会将订单100%归因于转化发生前的一个接触点。促销邮件产生了一个订单。

最后互动归因模型是目前应用最广泛的一种归因模型。<!-- more -->

_适用情景：_

_适用于吸引用户立即购买的广告或Campaign，或者购买周期中不存在考虑周期的情况。_

[caption id="attachment_1544" align="alignright" width="113" caption="最初互动归因模型"][![First Interaction](http://www.cloga.info/wp-content/uploads/2012/05/First-Interaction1.png)](http://www.cloga.info/wp-content/uploads/2012/05/First-Interaction1.png)[/caption]

2、最初互动归因模型

最初互动归因模型会将订单100%归因于转化路径上最初的接触点。新浪的Banner产生了一个订单。

_适用情景：_

_适用于品牌初创阶段，这个阶段的重点是塑造品牌，因此，应该为能够带来品牌曝光的渠道增加更多的预算。_

3、线性归因模型

[caption id="attachment_1545" align="alignright" width="113" caption="线性归因模型"][![Linear](http://www.cloga.info/wp-content/uploads/2012/05/linear.png)](http://www.cloga.info/wp-content/uploads/2012/05/linear.png)[/caption]

线性归因模型会将订单按照相等权重分配给转化路径上的每个接触点。新浪的Banner、微博和促销邮件都产生了1/3个订单。

_适用情景：_

_如果你的商业模式中每个接触点都很重要，在整个销售周期中都要维持客户的注意并保持与客户的联系，那么这个模型是比较适用的。_

4、时间衰退归因模型

[caption id="attachment_1546" align="alignright" width="113" caption="时间衰退归因模型"][![Time Decay](http://www.cloga.info/wp-content/uploads/2012/05/Time-Decay.png)](http://www.cloga.info/wp-content/uploads/2012/05/Time-Decay.png)[/caption]

时间衰退归因模型认为离转化越近的接触点其价值越高。那么，新浪Banner贡献了o.2个订单，微博贡献了0.3个订单，而促销邮件贡献了0.5个订单。（其中为每个渠道分配的权重，即随时间推移权重的变化，可以根据自身情况进行调整。）

_适用情景：_

_如果你进行了一个短期的营销活动，那么推广周期内交互的价值应该会更高，这种情况下，可以适用时间衰退归因模型来评估本次活动的效果。_

5、基于位置的归因模型

[caption id="attachment_1547" align="alignright" width="113" caption="基于位置的归因模型"][![Position Based](http://www.cloga.info/wp-content/uploads/2012/05/Position-Based.png)](http://www.cloga.info/wp-content/uploads/2012/05/Position-Based.png)[/caption]

基于位置的归因模型为最后交互及最初交互各分配40%的权重，渠道中间的交互分配20%的权重。新浪Banner和促销邮件各产生了0.4个订单而微博产生了0.2个订单。

_适用情景：_

_适用于既关注品牌认知和最终转化的情况。_

以上这些归因模型只是对转化流程中不同接触点的权重分配不同，如何找到真正适合自身发展阶段的归因模型才是难点所在。

**更新：**Lunametric在最新的文章中介绍了如果用Excel用GA免费版的数据构建归因模型：[http://www.lunametrics.com/blog/2012/05/17/multichannel-attribution-modeling-tool/](http://www.lunametrics.com/blog/2012/05/17/multichannel-attribution-modeling-tool/)，并给到了一个模版 [Attribution Modeling Tool](https://docs.google.com/spreadsheet/ccc?key=0AliSM9M0UxNsdElTeWxmNnJzX0NOOVdKUmlpcU90ZHc)，感谢Kurt的分享~

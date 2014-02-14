---
author: cloga0216
comments: true
date: 2012-03-20 16:49:01+00:00
layout: post
slug: '%e5%85%8d%e8%b4%b9%e7%9a%84ga%e5%af%bc%e5%87%ba%e6%8f%92%e4%bb%b6excellent-analytics%e4%bd%bf%e7%94%a8%e6%96%b9%e6%b3%95%e4%bb%8b%e7%bb%8d'
title: 免费的GA数据导出插件Excellent Analytics使用方法介绍
wordpress_id: 1481
categories:
- Digital分析
- GA API
tags:
- Excellent Analytics
---

Cloga：先插播一条广告~我所在公司（我们是一家4A广告公司）的网站分析Team目前有多个网站分析职位空缺，有无经验均可，如果你对网站|数字分析（我们的业务还会涉及Mobile site，Social Media）感兴趣，并且有良好的学习能力，我们都欢迎您的加入。当然也欢迎有经验的同学。简历请发送至：cloga0216@gmail.com。欢迎推荐与自荐。

你是否为每次只能同时查看两个维度而苦恼？你是否厌倦了每次导出后CSV之后将编码方式修改为ANSI来避免乱码？你是否希望能直接在Excel获取GA数据，而不需要登陆GA的界面？

如果你有以上的需求，那么，来试一下[Excellent Analytics](http://excellentanalytics.com)吧~这是一款免费的Excel插件，通过它你就可以在Excel中直接查询GA数据。这个插件是在Excel中实现对GA API的调用。这意味着在一次查询中，我们最多可以查询7个维度（GA的界面中是2个，虽然支持的下钻最多4次），10个指标，总量为10,000条（GA默认是500，通过修改参数可以最多导出20,000）GA的数据。Excellent Analytics还提供查询更新，只要点击更新就可以在现有查询条件的基础上修改条件查询更新数据（我们需要做的通常只是更新一下时间），你也可以将查询条件复制到表格的其他地方更新数据，同时也支持一次查询多个Profile的数据（这个功能比较少会用到）。如果希望的话，你可以用Excellent Analytics制作Dashboard，并且通过更新查询，来更新数据。下面让我们来看一下Excellent Analytics的使用。<!-- more -->


#### 使用Excellent Analytics


**![](http://excellentanalytics.com/wp-content/uploads/2009/08/ga1.jpg)**

在你安装了Excellent Analytics之后，打开Microsoft Excel，找到Excellent Analytics并在菜单选择“Account”。

**![](http://excellentanalytics.com/wp-content/uploads/2009/08/ga2.jpg)**

输入你用来登陆Google Analytics的电子邮件地址和密码。确保你输入的信息正确。如果你登录失败，请检查[谷歌的帮助 ](http://www.google.com/support/accounts/bin/answer.py?answer=48598&hl=en)。如果你做了太多的登录尝试，你就必须输入Google Analytics（分析）网站上captcha图像中的字母，或请求一个新的密码。

当您已成功登陆后，下一步是创建您的第一个query。只需按一下“New Query”。将打开Excellent Analytics窗口。

**Dimensions（维度）**
**![](http://excellentanalytics.com/wp-content/uploads/2009/08/dim2.jpg)**

首先，你必须选择包括哪些维度。如果你勾选一个复选框，你会选择在该级别中包含的所有维度。例如，如果你勾选的“content（内容）”复选框“、那么，exit page path（退出页面路径）”、“Landing page path（着陆页面路径）”、“page path（页面的路径）”和“page title（页面标题）”都将被选中。如果你只想选择其中之一，你需要展开这个水平，只勾选你想添加的维度前面的复选框。

**Metrics（指标）**
**![](http://excellentanalytics.com/wp-content/uploads/2009/08/met2.jpg)**

选择指标的工作与选择维度的方式相同。勾选整个水平，或者只勾选你选择的指标。

谷歌已经写了[一个清单，很好的解释了可以组合维度和指标](http://code.google.com/intl/sv-SE/apis/analytics/docs/gdata/gdataReferenceDimensionsMetrics.html) 。

执行query前的最后一步是要考虑是否设置一个或多个过滤器限制导入的数据。

**Filter（过滤器）**
**![](http://excellentanalytics.com/wp-content/uploads/2009/08/filt.jpg)**

最后，你可以随时刷新数据。

**![](http://excellentanalytics.com/wp-content/uploads/2009/08/refresh.jpg)**

只要选中query产生的表单的第一行，然后按一下“Update Query”。你需要选中您希望更新的表的标题。它包含了选定的Google Analytics（分析）配置文件的名称和选定日期范围。

好了，关于Excellent Analytics的使用就介绍到这里，如果您对Excellent Analytics的使用有任何疑问，欢迎给我留言~

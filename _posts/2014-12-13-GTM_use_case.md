---
author: cloga
comments: true
layout: post
slug: Google Tag Manager
title: Google Tag Manger的几个应用实例
categories:
- Google Tag Manager
tags:
- Google Tag Manager

---
# Google Tag Manager简介
[Google Tag Manager](https://www.google.com.hk/tagmanager/)是Google提供的一个代码管理工具，准确的说其实在页面上提供了一个容器，在这个容器中可以放置任意的HTML及JS代码。

可跟踪可量化是Digital Marketing的优势之一，随着而来的问题是需要在很多不同的页面上放置不同Vendor提供的监测代码，网站上要添加网站分析代码，转化页面需要添加Adwords转化代码或其他的Ad Network的转化代码，不同的代码有效期也可能不一致。代码管理工具应运而生，通过代码管理工具，网站分析师或者Digital营销人员可以自己管理页面上的代码，而不用每次都“劳烦”网站管理员。通过代码管理器可以有效的保证监测代码的一致性，也加快了响应速度。

其实Google在这个领域也只是一个追随者，凭借免费及巨大的用户规模而使Google Tag Manager更广泛的被大家所了解。简单做一下市场调查的话，会发现市场上其实有许多类似的产品：

- [Dynamic Tag Management](https://dtm.adobe.com/)：Adobe的代码管理器
- [Universal Tag Management System](http://www.signal.co/products/tag/)：Signal的产品
- [Open Tag](http://www.qubitproducts.com/tag-management)：Qubit的代码管理器，应该是这个领域里面比较早的产品，同时他们还有A/B Test的产品
- [代码管家](http://web.tagmanager.cn/)

# Google Tag Manager的组成元素

GTM在近期更新了UI 2.0，这里的名称以2.0的为准。

#### Account（账户）
一个GTM账号可以创建多个容器。

#### Container（容器）
每个容器对应于一个网站，一个容器对应一段GTM的代码。一个容器中可以包含若干代码。

#### Tag（代码）
一个代码对应于一种监测代码。代码比如指定在特定的条件下（触发器）触发。

#### Trigger | Rule（触发器）
触发器是代码的触发条件。触发器可以设定多种条件，比如URL，自定义事件，Dom元素等

#### Variable | Macro（变量）
GTM可以从Dom元素，URL及数据层获取一些变量，并将这些变量作为参数在Tag中使用

# Google Tag Manager的真实应用实例

#### UA基本监测代码的部署

- 代码
基本的UA Pageview代码，在代码的类型中选择UA，填写对应的Tracking ID即可

- 触发器
默认提供的所有页面触发器，其本质是一个可以匹配所有URL的触发器，.*正则式是匹配所有字符的意思

#### 监测点击事件

GTM内部会对页面的点击事件进行监听，我们可以在触发器中使用这些事件来达到监测特定点击事件的目的。

下面用一个实例在具体说明一下，如下:
![png](http://cloga.info/files/reg_login.png)

在这个页面的右上有登陆和注册的链接，如果想要监测注册链接，在没有使用GTM时，我们需要改动对应页面的元素，在上面添加onclick事件，并在其中调用对应的GA方法。如下图所示：

![png](http://cloga.info/files/manul_onclick.png)

使用了GTM之后，我们不需要技术同事在原始的HTML页面上添加对应的代码，具体的做法如下：

- 代码
首先要新加一个代码，监听所有的点击事件
![png](http://cloga.info/files/click_listener.png)

触发条件为所有页面


接下来要定义点击了这个链接应该触发的GA代码，我在这里选择了事件监测。
![png](http://cloga.info/files/event_config.png)

- 触发器
先来捕捉右上注册点击事件

![png](http://cloga.info/files/reg_right_top_trigger.png)

第一个条件是触发了Click事件，第二个条件是这个事件发生的Dom元素的类包含navi\_login\_name navi\_hover\_bg。结合起来的触发条件就是在在类包含navi\_login\_name navi\_hover\_bg的元素上发生Click事件。

GTM提供了许多的element的属性可以作为条件，比如id，url，text，classes都可以作为触发器的条件，也可以多个属性结合在一起。
![png](http://cloga.info/files/element_conditions.png)

#### 监测表单填写

- 代码

- 触发器

# Google Tag Manager测试

加好了代码之后接下来就要进行测试并发布，GTM提供了完整的测试和发布流程，首先点击previe>debug，进入测试模式
![png](http://cloga.info/files/gtm_debug.png)

进入debug模式后在页面下方会出现GTM的debug窗口，当前页面上触发的代码都有提示。
![png](http://cloga.info/files/gtm_debug1.png)

如图所示，基本的GA代码已经触发了。

点击一下右上的注册链接，看一下效果
![png](http://cloga.info/files/gtm_debug2.png)

可以看到我们新建的右上注册butoon点击已经触发了

在选中这个点击事件时，点击一下debug里面宏看一下：
![png](http://cloga.info/files/gtm_debug3.png)

啊哈，里面显示了一个事件对应的所有属性，通过这个页面可以很方便的了解定位这个事件的参数。

# Google Tag Manager发布

最后，不要忘记发布当前的代码。

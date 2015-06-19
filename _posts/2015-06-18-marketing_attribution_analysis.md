---
author: cloga
comments: true
layout: post
slug: marketing attribution analysis
title: 营销归因分析
categories:
- marketing
tags:
- marketing
- attribution analysis

---
Cloga：这篇文章是国外两篇文章的翻译，试图解决营销中的归因分析问题，即GA中的多渠道如何给定权重。英文原文地址：[Marketing attribution analysis: the remarkable (but scary) new world of data](http://www.callahancreek.com/marketing-attribution-analysis-the-remarkable-but-scary-new-world-of-data)，[Marketing attribution analysis part 2: Embrace the complexity](http://www.callahancreek.com/marketing-attributon-analysis-part-2-embrace-the-complexity)

---

最近，在与密切合作的分析公司的“午餐 + 学习”的演讲会上，出乎意料的令人震惊和振奋。我们在一个引人注目的时刻。新的分析技术发展允许我们研究行为中非常深入和复杂的模式。然而更加难以抵挡的是，处理由购物者每天产生的数据量以及难以置信购物路径，包括多种接触点以及多种设备。这引起了一些难题。销售该归功于哪个接触点？哪个路径带来了最多的销售？就转化而言，一个接触点组合是否优于另一个？从历史上来说，我们回答这些问题的能力很有限，通常需要使用最佳判断。但是，称为营销归因分析的新一代分析方法有望提供更加精确和有预测力的答案。

# 什么是营销归因分析？

营销归因分析是应用统计方法为购物路径上的每一个接触点分配值，这个值反应了营销接触点在带来销售上的相对强度。今天最受欢迎的是过分简化的“单点接触”归因。这种方法假设第一次或最后一次的接触产生了销售，但是，我们知道这是不充分不准确的假设。简化“多触点”方法是一个进步，不过，许多仍然缺乏严谨。他们试图通过判断、相同权重、时间（接触点与销售之间的时间越长，获得的权重越小），或者用基于回归的方法来分配权重。尽管更加有效，当接触点的数量或数据变得巨大时，他们的有效性也迅速消失，更高级多触点方法显示出了极大的希望，他们使用高级的统计模型（比如马尔科夫链模型）作为分析基础。

# 我们为什么需要营销归因分析？

我们需要这种更先进方法的原因是我们无法控制消费者在什么时间如何爆光在我们的信息中。今天的消费者完全控制他们的购物体验。他们比以前有更多的方式与品牌交互。越来越多的研究在强化消费在一个消费旅程中将使用多种渠道，这决定于他们在特定时候的背景。当销售这只有5个不同的渠道与你的品牌交互时，一个消费者在购买前可以有3,000多的路径。

因为绝大多数营销方案将纳入五个以上的营销渠道，并且管理人员将继续要求营销开支上的ROI，我们必须可以优化营销资源的使用，以便达成最大的回报。我们将需要可以：

- 将资源从没有效果的渠道移走
- 知道哪个渠道在贡献转化
- 评估不同交互（交互组合）的影响
- 并且预测可以产生最大回报的下一步

最精明的多触点营销归因模型将使这些决策成为可能。

# 马上继续：它是如何工作的

在接下来的几周，我将分享一些来自于我们的分析合作伙伴关于这种新方法如何工作的更多观点。我将预先警告你 - 这不适合那些心脏不好的人。它需要花费一些智力上的坚韧和决心，但是这是值得的。在这个领域，花费时间和精力来发展能力的公司（特别是代理商）将有极大的竞争优势。他们将更加了解客户，更加有效的使用他们的营销资源，并且最终将获得更多的收益。我相信每一个C级的管理者都会认为这是一个好事情。

-----------

在10月，我写了营销归因分析世界的改变，以及为什么它这么重要，需要投入时间和资源在这个复杂形式的分析中。我收到了一些非常棒的问题和评论，许多都是关于“你是否把它弄的比需要的复杂？”或者“我们是不是想多了？”我的答案毋庸置疑是“不是！”

就在我今早的晨读中，关于营销碎片话的微博、博客和文章已经数不胜数。与之前相比，消费者有更多的方式来和品牌交互，通常使用多个渠道在一个购物旅程中。会出现几千的购物路径组合，远远超出了我们快速便捷的理解和评估它们的能力，更不用说量化整个路径上的每个接触点（或触点组合）影响。但是，我们仍然期望可以展示我们的媒体投资回报。

上个月我做了一个假设，因为这些碎片化路径，我们收集我们需要的知识和洞察的方式需要使用比以往更加高级的分析方法。简单来说，我知道，如果你的公司和我们的公司类似，在公司内部你可能没有这些技能。因此，你如何完成这个任务？在我们的情况下，解决方案是与Analytic Marketing Innovations的数据科学家：Kurt Seemar、Trich Schultz和Jill Giele合作。因为，我没有解释这些新多触点营销方法的知识（目前没有！），我问了Kurt Seemar、Trich Schultz和Jill Giele一些问题关于这些更高级的多触点模型如何工作。

** 你可以总结一下为什么多触点模型要比单触点模型更好？**

Jill: 营销人员过去一直依赖“单触点归因”，将销售归因于最初或最后的接触的归因模型。这个方法很难说完美，但是，在现在被认为是有严重的瑕疵的，因为有非常多的潜在接触点可能贡献了销售。

Kurt: 这些导致了近期在营销分析世界的产生了推动力去寻找一种方式来为路径上的每个接触点赋值（归因权重），基于“多触点归因”算法。这些更新的多触点模型的一种常用的方式是为路径上的每个步骤分配权重（要么相等或者主观分配），但是，这仍然是有问题的，因为，它并不能真正告诉我们我们想要知道的 - 不同接触点（接触点组合）影响的真正区别 - 或者预测与品牌交互的消费者下一个最佳的接触点是哪个。

这就是为什么在Analytic Marketing Innovations，我们设计了一个独特的多触点归因模型来告诉我们需要知道的东西，通过应用被称为马尔科夫链的分析模型。

** 那么，什么是马尔科夫链模型？**

Trich: 

The Markov Chain Model (named after mathematician Andrew Markov) is a method for assigning value to any number of steps along the customer journey (as long as that number is finite).


![马尔科夫链模型](http://www.callahancreek.com/stuff/contentmgr/files/1/76c8305480ead76396e4848269d977d5/files/kents_blog_image_words.gif)
When data scientists employ a Markov Chain Model for multi-touch attribution, we can see the likely chains of events along the various consumer pathways to a sale. The Markov Chain Model assigns credit to each touch along the path to conversion while also sequencing and predicting each step.

All of this, of course, can be quite complicated, because with the increasing fragmentation in how consumers interact with a brand, there are more than just a few pathways to a sale. Using the Markov technique, it is possible to find and understand every statistically significant path, which can add up to thousands of models (paths) for a marketing campaign. That would have been difficult to accomplish using traditional tools and techniques, but is very possible with this approach due to the way the data is managed, integrated and analyzed.

Why is the Markov Chain Model better than other models?

Trich: The Markov Chain Model is more effective because it uses superior, proven statistical methods to derive the value for each touch on the customer journey, as well as what combination of touches will be most effective. That knowledge allows more informed, objective decisions (rather than just assigning equal weights or subjective judgments), which in turn leads to marketing efforts that are more effective and quantifiable.

Kurt: Importantly, the models can be used to optimize marketing throughout the execution cycle. Attribution results can be applied in real time because they are relevant at the individual level. Because of this, we can truly optimize the customer journey by predicting the best next step for each interaction an individual may have. For example, if we know that a person who has received an email and then clicked on a banner ad is much more likely to buy if s/he receives another email, the marketing team can then make sure that an email is sent. In other cases, if we can see a certain marketing path is creating fatigue, the team can pull back that type of marketing for some customers.

Are there particular types of brands that are better suited to this kind of approach than others? 

Jill: Any brand that is executing multi-channel marketing and is committed to learning more about how to make their campaigns more efficient and effective will benefit from this type of marketing attribution analysis. But commitment is key, because it does require an ongoing devotion of time and effort to establish and then use the models.

Typically, it's best to have three months of data to start the analysis. The first step is setting up tracking on a campaign and working with various vendors, including a Data Management Platform (DMP) vendor, which helps combine the online and offline touches. The second step is gathering data for three months and then building models. The final step is analyzing the resulting output to identify the top paths leading to conversion and allowing the development of marketing heuristics for the remainder of the campaign.

In an environment of shrinking marketing budgets, there is considerable pressure on marketing departments to demonstrate quantifiable results for each channel, and good multi-touch marketing attribution analysis can be invaluable in this type of assessment. The insights not only improve results overall, but they also help in shifting budget dollars during a campaign from unproductive channels into those that ARE contributing to sales. 
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

在10月，
In October, I wrote about the changing world of marketing attribution analysis and why it is important to invest time and resources in this complex form of analysis. I’ve received some great questions and comments, many of them along the lines of “Are you making it more complicated than it needs to be?” or “Are we overthinking it?” My answer to these questions is an unqualified “No!”

In my morning scan just today, the tweets, blogs and articles written about marketing fragmentation were too numerous to count. Consumers have more ways than ever to interact with a brand, frequently using multiple channels on the same shopping journey. The thousands of shopping path permutations that can now occur have far outstripped our ability to quickly and easily understand and assess them, let alone quantify the influence each of the touch points (or a combination of them) has on the overall path. And yet we are expected to demonstrate a return on our marketing investment.

I made the suggestion last month that the way to garner the knowledge and insights we need, given these fragmented paths, is by employing a more advanced analytical approach than is being used today. Easy to say, I know, and if your company is like ours, you may not have that skill set residing in house. So how do you accomplish this? In our case, the solution was to partner with the Data Scientists at Analytic Marketing Innovations: Kurt Seemar, Trich Schultz and Jill Giele. And since I don’t have the knowledge to be able to explain these new multi-touch modeling approaches (yet!), I asked Kurt, Trich and Jill if they would answer a few questions about how these more advanced multi-touch models work.

Can you recap why a multi-touch model is better than a single-touch model?

Jill: Marketers have historically relied on “single-touch attribution,” an attribution method that assigns credit for a sale to either the first touch or the last touch. The method was never perfect, but is now considered by most to be seriously flawed because there are so many more potential touch points that may be contributing to a sale.

Kurt: All of this led to a recent push in the marketing analytics world to find a way to assign a value (credit) to various touch points along the pathway, based on a “multi-touch attribution” algorithm. A common approach to these newer multi-touch models has been to assign a weight to each step on the pathway (either equally or subjectively), but this is still problematic because it doesn’t really tell us what we need to know - the true difference of influence among different touches (or combination of touches) - or predict what the next best touch point should be for the individual consumer who interacts with a brand.

That’s why at Analytic Marketing Innovations, we designed a unique multi-touch attribution model that tells us what we need to know by employing an analytical method called the Markov Chain Model.

So, just what is a Markov Chain Model?

Trich: The Markov Chain Model (named after mathematician Andrew Markov) is a method for assigning value to any number of steps along the customer journey (as long as that number is finite).



When data scientists employ a Markov Chain Model for multi-touch attribution, we can see the likely chains of events along the various consumer pathways to a sale. The Markov Chain Model assigns credit to each touch along the path to conversion while also sequencing and predicting each step.

All of this, of course, can be quite complicated, because with the increasing fragmentation in how consumers interact with a brand, there are more than just a few pathways to a sale. Using the Markov technique, it is possible to find and understand every statistically significant path, which can add up to thousands of models (paths) for a marketing campaign. That would have been difficult to accomplish using traditional tools and techniques, but is very possible with this approach due to the way the data is managed, integrated and analyzed.

Why is the Markov Chain Model better than other models?

Trich: The Markov Chain Model is more effective because it uses superior, proven statistical methods to derive the value for each touch on the customer journey, as well as what combination of touches will be most effective. That knowledge allows more informed, objective decisions (rather than just assigning equal weights or subjective judgments), which in turn leads to marketing efforts that are more effective and quantifiable.

Kurt: Importantly, the models can be used to optimize marketing throughout the execution cycle. Attribution results can be applied in real time because they are relevant at the individual level. Because of this, we can truly optimize the customer journey by predicting the best next step for each interaction an individual may have. For example, if we know that a person who has received an email and then clicked on a banner ad is much more likely to buy if s/he receives another email, the marketing team can then make sure that an email is sent. In other cases, if we can see a certain marketing path is creating fatigue, the team can pull back that type of marketing for some customers.

Are there particular types of brands that are better suited to this kind of approach than others? 

Jill: Any brand that is executing multi-channel marketing and is committed to learning more about how to make their campaigns more efficient and effective will benefit from this type of marketing attribution analysis. But commitment is key, because it does require an ongoing devotion of time and effort to establish and then use the models.

Typically, it's best to have three months of data to start the analysis. The first step is setting up tracking on a campaign and working with various vendors, including a Data Management Platform (DMP) vendor, which helps combine the online and offline touches. The second step is gathering data for three months and then building models. The final step is analyzing the resulting output to identify the top paths leading to conversion and allowing the development of marketing heuristics for the remainder of the campaign.

In an environment of shrinking marketing budgets, there is considerable pressure on marketing departments to demonstrate quantifiable results for each channel, and good multi-touch marketing attribution analysis can be invaluable in this type of assessment. The insights not only improve results overall, but they also help in shifting budget dollars during a campaign from unproductive channels into those that ARE contributing to sales. 
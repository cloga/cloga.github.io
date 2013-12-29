---
author: cloga0216
comments: true
date: 2010-09-01 15:33:06+00:00
layout: post
slug: cross-segmenting-driil-down%e7%9a%84%e5%89%8d%e4%b8%96%e4%bb%8a%e7%94%9f
title: Cross-segmenting Driil Down的前世今生
wordpress_id: 213
categories:
- Digital分析
tags:
- drill down
- 上卷
- 下钻
- 正交
- 细分
---

说实话，我以前和Cross-segmenting（或者Cross-segmentation）也不熟，如果没有Brian大神的书，估计我还不认识他，或者给他起个和阿姆斯特朗（Armstrong）一样酷的名字，叫他克罗斯西格门庭。又或者每天看到他的Google官方中文代号：跨群体细分，而不知道这是指他。

让我们来仔细认识一下Cross-segmenting，cross：交叉、十字；segment：分割。让我们组合一下，得到如下的信息：交叉分割、十字分割。叫他什么好呢？看一下Brian大神的解释：Cross-segmenting是用于一组数据与另一组数据的交叉参照或相关的术语。相关~恩，我想到了因素分析中正交变换，因素之间不相关称为正交，Cross-segmenting的维度之间本来就不相关，OK，就叫他正交细分吧，也许交叉参照，交叉细分的名字更适合他。尽管我查到正交的英文应该是Orthogonal（正交实验法为Orthogonal experimental design），但我还是使用了这个名字，这也许就和Google官方将Advanced segments译为高级群体一样，难以解释吧。

再来看一下Drill down，我和drill down比和cross-segmenting熟，之前看过一些关于数据挖掘东西，了解一些数据立方体的基本概念。其实GA就属于数据挖掘、数据仓库理论的应用，比如维度（dimention）和指标（metrics）。driil down（下钻）和roll up（上卷）其实说白了就相当于汇总和细分。比如你看来自全世界的访问，然后只看中国的访问这就是在地区这个维度上的下钻；如果你先看北京市的流量，又看中国的流量这就是上卷。

那么Cross-Segmenting Drill Down是什么意思呢？

我理解按照Brian大神的意思，当你查看来源媒介报告时，你对来自google/organic的流量产生了兴趣，于是你点击链接进入了来源媒介详情，然后你又选择了关键词，那么这就是正交细分下钻。下钻到google/organic，正交细分了搜索来源与关键词两个维度。如果此时，你在第二个维度中选择市/县，那么这就属于Secondary Cross-Segmenting Drill Down（二次正交细分下钻）。

如果你在查看来源媒介报告时，除默认的指标来源/媒介指标外，你还同时选择了关键字这个维度，那么这属于次级维度（Secondary Dimensions）的使用。如果此时，你在过滤器中包含google/organic，就能获得与上面同样的效果。

整理一下，如果你使用了两个维度就属于正交细分，如果你在一个维度中下钻后，正交细分另一个维度，那就是正交细分下钻，而如果你在一个维度下钻后，正交细分于另外两个维度就属于二次正交细分。

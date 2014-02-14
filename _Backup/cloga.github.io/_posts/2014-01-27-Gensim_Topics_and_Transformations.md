---
author: cloga
comments: true
layout: post
slug: gensim_Topics_and_Transformations
title: gensim文档-主题与转换
categories:
- Python
tags:
- Python
- gensim
---

如果你想要查看logging事件不要忘记设置。

```python
import logging
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)
```

# 转化接口

在前面的[语料和向量空间](http://cloga.info/python/2014/01/27/Gensim_Corpora_and_Vector_Spaces)的教程中，我们创建了一个文档语料，用向量流来表征。接下来，让我们发动 gensim使用那些语料：

```python
from gensim import corpora, models, similarities
dictionary = corpora.Dictionary.load('/tmp/deerwester.dict')
corpus = corpora.MmCorpus('/tmp/deerwester.mm')
print corpus

MmCorpus(9 documents, 12 features, 28 non-zero entries)
```

在这个教程中，我将展示如何从一个向量表征转化为另一个向量。这个过程服务于两个目的：

- 显示出语料中的隐藏结构，发现词的关系，用他们以一种新的（希望是）更语义的方式来描述文档。

- 让文档表征更紧凑。这既可以改善效率（新表征消耗更少的资源）也可以改善效力（忽略边际数据趋势，降低噪音）。

# 创建转换

转换是标准的Python对象，通常用训练语料的平均数初始化：

```python
tfidf = models.TfidfModel(corpus) # 第一步--初始化一个模型
```

我们用教程1的旧语料来初始化（训练）转换模型。不同的转换需要不同的初始化参数；假如是TfIdf，“训练”包括简单过一次提供的语料以及文档所有特征的频率。训练其他模型，比如潜在语义分析(Latent Semantic Analysis，LSA)或Latent Dirichlet Allocation（LDA），更加复杂，因此也需要更多的时间。

注意

转换通常在两个具体的向量空间中转化。相同的向量空间（等于相同的特征ids）必须被用于训练和接下来的向量转换。不使用相同的输入特征空间，比如，应用一个不同的字符预处理，使用不同的特征 ids，或者在期望Tfidf向量时使用词袋作为输入向量，将导致转换调用时特征错配，因此，产生垃圾输出和或者运行异常。

# 转换向量

从这里开始，tfidf被作为一个只读的对象，可以被用于将任意向量从旧表征（词袋整数计数）转化为新表征（TfIdf实值加权）：

```python
doc_bow = [(0, 1), (1, 1)]
print tfidf[doc_bow] # 第二步--用模型转换向量

[(0, 0.70710678), (1, 0.70710678)]
```

或者在整个语料上应用转换：

```python
corpus_tfidf = tfidf[corpus]
for doc in corpus_tfidf:
	print doc

[(0, 0.57735026918962573), (1, 0.57735026918962573), (2, 0.57735026918962573)]
[(0, 0.44424552527467476), (3, 0.44424552527467476), (4, 0.44424552527467476), (5, 0.32448702061385548), (6, 0.44424552527467476), (7, 0.32448702061385548)]
[(2, 0.5710059809418182), (5, 0.41707573620227772), (7, 0.41707573620227772), (8, 0.5710059809418182)]
[(1, 0.49182558987264147), (5, 0.71848116070837686), (8, 0.49182558987264147)]
[(3, 0.62825804686700459), (6, 0.62825804686700459), (7, 0.45889394536615247)]
[(9, 1.0)]
[(9, 0.70710678118654746), (10, 0.70710678118654746)]
[(9, 0.50804290089167492), (10, 0.50804290089167492), (11, 0.69554641952003704)]
[(4, 0.62825804686700459), (10, 0.45889394536615247), (11, 0.62825804686700459)]
```

在这个特殊的案例中，我们转换了训练用的语料，但是，这只是偶然。一旦转化模型被初始化后，它可以被用于任何向量（当然，假如他们来自相同的向量空间），即使他们根本没有被用于训练语料。这在LSA中通过成为折叠的过程实现，在LDA通过主题推断等等。

注意

调用model[语料]只是在旧语料文档流创建了一个封装器 - 实际上转化是在文档迭代时即时完成的。我们不能在调用corpus_transformed = model[corpus]时转化整个语料库，因为，这意味着将结果存储在主内存中，这与gensim内存独立的目的相悖。如果你需要在转换后的corpus_transformed多次迭代，那么转换是代价昂贵的，[先系列化结果语料库到硬盘](http://radimrehurek.com/gensim/tut1.html#corpus-formats)，然后继续使用。

转换也能被序列化，一个叠一个，以一种链式：

```python
lsi = models.LsiModel(corpus_tfidf, id2word=dictionary, num_topics=2) # 初始化一个LSI转换
corpus_lsi = lsi[corpus_tfidf] # 在原始语料上创建一个双重封装器: bow->tfidf->fold-in-lsi
```

这里我们用潜在语义索引（[Latent Semantic Indexing](http://en.wikipedia.org/wiki/Latent_semantic_indexing)）将我们的Tf-Idf语料库转换到潜在2-D空间（2-D因为我们设置 num_topics=2）。现在你可以觉得奇怪：这两个潜在维度是什么？让我们检查一下models.LsiModel.print_topics():

```python
lsi.print_topics(2)

topic #0(1.594): -0.703*"trees" + -0.538*"graph" + -0.402*"minors" + -0.187*"survey" + -0.061*"system" + -0.060*"response" + -0.060*"time" + -0.058*"user" + -0.049*"computer" + -0.035*"interface"
topic #1(1.476): -0.460*"system" + -0.373*"user" + -0.332*"eps" + -0.328*"interface" + -0.320*"response" + -0.320*"time" + -0.293*"computer" + -0.280*"human" + -0.171*"survey" + 0.161*"trees"
```
(主题被打印在log中-见本页顶部关于激活logging的说明)

看起来根据LSI，“trees”，“graph” 和 “minors” 都是相关的词（对第一个主题的方向贡献最大），而第二个主题实际上关注自身及其他一些词。和预期类似，前五个文档与第二个主题的联系更近，而剩下的四个文档则更贴近第一个主题：

```python
for doc in corpus_lsi: # 在这里，bow->tfidf 和 tfidf->lsi 转换实际上都是即时执行的
	print doc

[(0, -0.066), (1, 0.520)] # "Human machine interface for lab abc computer applications"
[(0, -0.197), (1, 0.761)] # "A survey of user opinion of computer system response time"
[(0, -0.090), (1, 0.724)] # "The EPS user interface management system"
[(0, -0.076), (1, 0.632)] # "System and human system engineering testing of EPS"
[(0, -0.102), (1, 0.574)] # "Relation of user perceived response time to error measurement"
[(0, -0.703), (1, -0.161)] # "The generation of random binary unordered trees"
[(0, -0.877), (1, -0.168)] # "The intersection graph of paths in trees"
[(0, -0.910), (1, -0.141)] # "Graph minors IV Widths of trees and well quasi ordering"
[(0, -0.617), (1, 0.054)] # "Graph minors A survey"
```

模型的持久化通过save()和load()函数完成：

```python
lsi.save('/tmp/model.lsi') # tfidf，lda...也一样
lsi = models.LsiModel.load('/tmp/model.lsi')
```

接下来的问题可能是：那些文档间的相似度究竟是怎么样的？是否有方法正态化相似度，以便，给定一个输入的文档，我们可以根据相似度排序其他文档？[下一篇教程](http://radimrehurek.com/gensim/tut3.html)中将涵盖相似度查询。

# 可用的转换

Gensim实现了一些流行的向量空间模型算法：

- [词频 * 逆向文本概率，Tf-Idf](http://en.wikipedia.org/wiki/Tf%E2%80%93idf)在初始化时期望词袋（整型值）训练语料库。在转换中，它接收一个向量返回相同维度的另一个向量，只是增大了在训练语料库中罕见特征的值。因此，它将整值的向量转化为实值的向量，同时保持维度数不变。也可以视需要将产生的向量用（欧几里得）单位长度进行正态化。

```python
model = tfidfmodel.TfidfModel(bow_corpus, normalize=True)
```

- [潜在语义索引，LSI（有时也称为LSA）](http://en.wikipedia.org/wiki/Latent_semantic_indexing)从词袋或（优先）TfIdf加权的空间转换为低维的潜在空间。对于上面的样本语料库我们只使用了两个潜在的维度，但是，真正的语料库，200-500的目标微博被推荐为“黄金标准”。

```python
model = lsimodel.LsiModel(tfidf_corpus, id2word=dictionary, num_topics=300)
```

LSI的训练是唯一的，我们可以在任意时候继续“训练”，只需要提供更多的训练文档。这是通过为底层模型增加更新达到的，这个过程称为线上训练。因为这个，特征，数据的文档流可能几乎是无限的-只要在新文档到达时喂给LSI就行，同时，将计算完的转换模型作为只读来使用！

```python
model.add_documents(another_tfidf_corpus) # 现在 LSI 已经在 tfidf_corpus + another_tfidf_corpus 上进行训练
lsi_vec = model[tfidf_vec] # 将新文档转化到LSI空间，而不影响模型
...
model.add_documents(more_documents) # tfidf_corpus + another_tfidf_corpus + more_documents
lsi_vec = model[tfidf_vec]
...
```

关于在无限流中，如何让LSI不断“忘记”旧的观察的细节，请参见[gensim.models.lsimodel](http://radimrehurek.com/gensim/models/lsimodel.html#module-gensim.models.lsimodel)文档。如果你想要自己探索，你也可以调整参数，影响LSI算法的速度 vs. 内存占用 vs. 数值精度。

gensim用一种新颖线上增量流式分布训练算法（好拗口！），我发布在[5](http://radimrehurek.com/gensim/tut2.html#id10)。gensim在内部也执行来自Halko等等的随机多通道算法，以便加速核内计算部分。更多关于通过计算集群间的分布计算来进一步加速请见[Experiments on the English Wikipedia](http://radimrehurek.com/gensim/wiki.html)。

- [随机投影，RP](http://www.cis.hut.fi/ella/publications/randproj_kdd.pdf)目的是减低向量空间的维数。通过引入一点随机性，这是一个非常高效（内存和CPU友好）的方法来逼近文档间的TfIdf距离，推荐的维数也是几百到几千，取决于你的数据集。

```python
model = rpmodel.RpModel(tfidf_corpus, num_topics=500)
```

- [Latent Dirichlet Allocation, LDA](http://en.wikipedia.org/wiki/Latent_Dirichlet_allocation)也是另一个从词袋计数到低维主题空间的转换。LDA是LSA（也称为多项PCA）的概率扩展，因此，LDA的主题可以被解释为词的概率分布。与LSA类似，这些分布是自动由训练语料库推断出来的。反过来，文档可以解释为这些主题的（软性）组合（又和LSA类似）。	

```python
model = ldamodel.LdaModel(bow_corpus, id2word=dictionary, num_topics=100)
```

根据[[2](http://radimrehurek.com/gensim/tut2.html#id7)]gensim使用了线上LDA参数估计的一个快速实现，修改后可以在计算集群上以[分布模型](http://radimrehurek.com/gensim/distributed.html)运行。

- [Hierarchical Dirichlet Process, HDP](http://jmlr.csail.mit.edu/proceedings/papers/v15/wang11a/wang11a.pdf)是一个非参数贝叶斯方法（注意没有请求的主题数):

```python
model = hdpmodel.HdpModel(bow_corpus, id2word=dictionary)
```

gensim使用了基于[[3](http://radimrehurek.com/gensim/tut2.html#id8)]的快速线上实现。HDP模型是gensim一个新增部分，并且它的学术边界仍然较粗糙-小心使用。

添加新的VSM转换（比如不同的加权方案）非常简单；更多的信息和例子请看一下[API参考](http://radimrehurek.com/gensim/apiref.html)或者直接看一下Python代码。

有必要再重复一下，这些是特有的增量实施，不需要将全部语料库一次读入内存。通过小心处理内存，我正在改善[分布计算](http://radimrehurek.com/gensim/distributed.html)，也在改善CPU的效率。如果你可以出一份力（测试，提供使用案例或者代码），[请联系原作者](radimrehurek%40seznam.cz)。

下一篇教程是关于[相似性查询](http://radimrehurek.com/gensim/tut3.html)。

[原文地址](http://radimrehurek.com/gensim/tut2.html)
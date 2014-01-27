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
[原文地址](http://radimrehurek.com/gensim/tut2.html)

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

模型持久化通过save()和load()函数完成：

```python
lsi.save('/tmp/model.lsi') # same for tfidf, lda, ...
lsi = models.LsiModel.load('/tmp/model.lsi')
```

接下来的问题可能是：那些文档间的相似度究竟是怎么样的？是否有方法正态化相似度，以便，给定一个输入的文档，我们可以根据相似度排序其他文档？[下一篇教程](http://radimrehurek.com/gensim/tut3.html)中将涵盖相似度查询。

# 可用的转换

Gensim实现了一些流行的向量空间模型算法：

- 词频 * 逆向文本概率


Term Frequency * Inverse Document Frequency, Tf-Idf expects a bag-of-words (integer values) training corpus during initialization. During transformation, it will take a vector and return another vector of the same dimensionality, except that features which were rare in the training corpus will have their value increased. It therefore converts integer-valued vectors into real-valued ones, while leaving the number of dimensions intact. It can also optionally normalize the resulting vectors to (Euclidean) unit length.

>>> model = tfidfmodel.TfidfModel(bow_corpus, normalize=True)
Latent Semantic Indexing, LSI (or sometimes LSA) transforms documents from either bag-of-words or (preferrably) TfIdf-weighted space into a latent space of a lower dimensionality. For the toy corpus above we used only 2 latent dimensions, but on real corpora, target dimensionality of 200–500 is recommended as a “golden standard” [1].

>>> model = lsimodel.LsiModel(tfidf_corpus, id2word=dictionary, num_topics=300)
LSI training is unique in that we can continue “training” at any point, simply by providing more training documents. This is done by incremental updates to the underlying model, in a process called online training. Because of this feature, the input document stream may even be infinite – just keep feeding LSI new documents as they arrive, while using the computed transformation model as read-only in the meanwhile!

>>> model.add_documents(another_tfidf_corpus) # now LSI has been trained on tfidf_corpus + another_tfidf_corpus
>>> lsi_vec = model[tfidf_vec] # convert some new document into the LSI space, without affecting the model
>>> ...
>>> model.add_documents(more_documents) # tfidf_corpus + another_tfidf_corpus + more_documents
>>> lsi_vec = model[tfidf_vec]
>>> ...
See the gensim.models.lsimodel documentation for details on how to make LSI gradually “forget” old observations in infinite streams. If you want to get dirty, there are also parameters you can tweak that affect speed vs. memory footprint vs. numerical precision of the LSI algorithm.

gensim uses a novel online incremental streamed distributed training algorithm (quite a mouthful!), which I published in [5]. gensim also executes a stochastic multi-pass algorithm from Halko et al. [4] internally, to accelerate in-core part of the computations. See also Experiments on the English Wikipedia for further speed-ups by distributing the computation across a cluster of computers.

Random Projections, RP aim to reduce vector space dimensionality. This is a very efficient (both memory- and CPU-friendly) approach to approximating TfIdf distances between documents, by throwing in a little randomness. Recommended target dimensionality is again in the hundreds/thousands, depending on your dataset.

>>> model = rpmodel.RpModel(tfidf_corpus, num_topics=500)
Latent Dirichlet Allocation, LDA is yet another transformation from bag-of-words counts into a topic space of lower dimensionality. LDA is a probabilistic extension of LSA (also called multinomial PCA), so LDA’s topics can be interpreted as probability distributions over words. These distributions are, just like with LSA, inferred automatically from a training corpus. Documents are in turn interpreted as a (soft) mixture of these topics (again, just like with LSA).

>>> model = ldamodel.LdaModel(bow_corpus, id2word=dictionary, num_topics=100)
gensim uses a fast implementation of online LDA parameter estimation based on [2], modified to run in distributed mode on a cluster of computers.

Hierarchical Dirichlet Process, HDP is a non-parametric bayesian method (note the missing number of requested topics):

>>> model = hdpmodel.HdpModel(bow_corpus, id2word=dictionary)
gensim uses a fast, online implementation based on [3]. The HDP model is a new addition to gensim, and still rough around its academic edges – use with care.

Adding new VSM transformations (such as different weighting schemes) is rather trivial; see the API reference or directly the Python code for more info and examples.

It is worth repeating that these are all unique, incremental implementations, which do not require the whole training corpus to be present in main memory all at once. With memory taken care of, I am now improving Distributed Computing, to improve CPU efficiency, too. If you feel you could contribute (by testing, providing use-cases or code), please let me know.

Continue on to the next tutorial on Similarity Queries.

[1]	Bradford. 2008. An empirical study of required dimensionality for large-scale latent semantic indexing applications.
[2]	Hoffman, Blei, Bach. 2010. Online learning for Latent Dirichlet Allocation.
[3]	Wang, Paisley, Blei. 2011. Online variational inference for the hierarchical Dirichlet process.
[4]	Halko, Martinsson, Tropp. 2009. Finding structure with randomness.
[5]	Řehůřek. 2011. Subspace tracking for Latent Semantic Analysis.

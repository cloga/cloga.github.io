---
author: cloga
comments: true
layout: post
slug: gensim_Similarity_Queries
title: gensim文档-相似性查询
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

# 相似性接口

在前面语料与向量空间的教程及主题和转换的教程中，我们涵盖了什么是在向量空间中创建一个语料库以及如何在不同的向量空间间转换。绕这样一个圈子的原因是我们想要判断一堆文档的相似性，或者特定文档与一组其他文档的相似性（比如用户查询 vs. 索引文档）。

为了展示gensim如何做到这一点，让我们看一下前面例子中语料（最初来自Deerwester等的[“Indexing by Latent Semantic Analysis” seminal 1990 article]）:

```python
from gensim import corpora, models, similarities
dictionary = corpora.Dictionary.load('/tmp/deerwester.dict')
corpus = corpora.MmCorpus('/tmp/deerwester.mm') # 来自一篇教程“从字符到向量”
print corpus

MmCorpus(9 documents, 12 features, 28 non-zero entries)
```

遵循Deerwester的例子，我们首先使用这个小样本语料定义一个二维的LSI空间：

```python
lsi = models.LsiModel(corpus, id2word=dictionary, num_topics=2)
```

现在假设用户输入查询“Human computer interaction”。我们会想要以与查询相似度降序排列我们的9个语料。与现代搜索引擎不同，这里我们只关注可能相似的一个方面-文档（词）的表面抑郁相关。没有超链接，静态排名的随机游走，只有在布尔关键词匹配的语义扩展：

```python
doc = "Human computer interaction"
vec_bow = dictionary.doc2bow(doc.lower().split())
vec_lsi = lsi[vec_bow] # convert the query to LSI space
print vec_lsi

[(0, -0.461821), (1, 0.070028)]
```
此外，我们将用余弦相似性来决定两个向量间的相似性。余弦相似性是向量空间模型中的标准度量，但是，当向量代表概率分布时，不同的相似性度量可能更适合。

# 初始化查询结构

要准备相似性查询，我们需要输入所有想要与随后的查询比较的所有文档。在这种情况下，还是用于训练LSI的9个文档被转化为二维空间。但是，这只是偶然，我们也可能索引不同的的语料。

```python
index = similarities.MatrixSimilarity(lsi[corpus]) # 将语料转换为LSI，并索引
```

## 警告

similarities.MatrixSimilarity这个类只适用于所有语料可以放入内存的情况。例如，使用这个类，256维的LSI空间中的100万文档会需要2G的内存。

如果没有2G的可用内存，你需要使用similarities.Similarity类。这个类通过在硬盘的多个文件上分割索引，这些文件称为 shards，使用固定内存运行。它在内部使用similarities.MatrixSimilarity及similarities.SparseMatrixSimilarity，因此，仍然很快，尽管有点更加复杂。

索引的持久化通过标准的save()和load()函数处理：

```python
index.save('/tmp/deerwester.index')
index = similarities.MatrixSimilarity.load('/tmp/deerwester.index')
```

所有的索引类都是这样的（similarities.Similarity, similarities.MatrixSimilarity和similarities.SparseMatrixSimilarity)。接下来这些也是，索引可以是这类中的任何一个对象。如果不确定，使用similarities.Similarity，因为这是扩展性最好的版本，并且它还支持后续为索引添加更多的文档。

# 进行查询

获得查询文档对9个索引文档的相似性：

```python
sims = index[vec_lsi] # 进行语料的相似查询
print list(enumerate(sims)) # 打印(document_number, document_similarity) 2-tuples

[(0, 0.99809301), (1, 0.93748635), (2, 0.99844527), (3, 0.9865886), (4, 0.90755945),
(5, -0.12416792), (6, -0.1063926), (7, -0.098794639), (8, 0.05004178)]
```

余弦度量返回的的相似性在<-1,1>之前（越大越相似），因此，第一个文档的总分为0.99809301。

使用类似的标准Python魔法，我们可以将相似性降序排列，获得“Human computer interaction”查询的最终答案:

```python
sims = sorted(enumerate(sims), key=lambda item: -item[1])
print sims # 打印排序的 (document number, similarity score) 2-tuples

[(2, 0.99844527), # The EPS user interface management system
(0, 0.99809301), # Human machine interface for lab abc computer applications
(3, 0.9865886), # System and human system engineering testing of EPS
(1, 0.93748635), # A survey of user opinion of computer system response time
(4, 0.90755945), # Relation of user perceived response time to error measurement
(8, 0.050041795), # Graph minors A survey
(7, -0.098794639), # Graph minors IV Widths of trees and well quasi ordering
(6, -0.1063926), # The intersection graph of paths in trees
(5, -0.12416792)] # The generation of random binary unordered trees
```

（为了更清晰，我在输出中用评论添加了原始文档的”字符形式”。）

这里注意的是第二号（"The EPS user interface management system")及第四号（"Relation of user perceived response time to error measurement"）文档永远也不会返回一个标准的布尔全文搜索，因为它们与"Human computer interaction"没有相同的词。但是，应用LSI后，我们可以看到他们获得了很高的相似性分数（二号实际上是最相似！），更好的反映了我们的直觉，他们与查询都是关于“计算机-人类”这个话题。事实上，这句语言概括也是首先应用主题建模的原因。

# 接下来是什么？

祝贺你，你完成了教程-现在你知道了gensim如何工作:-)要研究更多细节，你需要看一下[API文档]，查看[维基百科实验]或者看一下gensim中[分布计算]。


Gensim是相当成熟的包，被许多个人和公司成功应用，无论是快速原型还是在生产环境。
但是，这不意味这它是完美的：

- 有许多部分应该更有效的实现（比如说用C），或者使用更好的并行机制（多核）

- 新算法层出不穷；通过[讨论]帮助gensim保持更新并且[贡献代码]

- 非常欢迎和感激你的反馈（不仅仅是代码！）：贡献思想、报告bug或者[考虑共享用户故事和一般问题]

Gensim没有野心称为一个无所不包的框架，涉及所有NLP（甚至机器学习）的领域。它的使命是帮助NLP从业者轻松在大数据集上尝试流行主题建模算法，并且帮助研究者设计算法原型。

[原文地址]

[原文地址]:http://radimrehurek.com/gensim/tut3.html
[“Indexing by Latent Semantic Analysis” seminal 1990 article]:http://www.cs.bham.ac.uk/~pxt/IDA/lsa_ind.pdf
[API文档]:http://radimrehurek.com/gensim/apiref.html
[维基百科实验]:http://radimrehurek.com/gensim/wiki.html
[分布计算]:http://radimrehurek.com/gensim/distributed.html
[讨论]:http://groups.google.com/group/gensim
[贡献代码]:https://github.com/piskvorky/gensim/wiki/Developer-page
[考虑共享用户故事和一般问题]:http://groups.google.com/group/gensim/topics
---
author: cloga
comments: true
layout: post
slug: corpora_vector_space
title: gensim文档-语料库与向量空间
categories:
- Python
tags:
- Python
- gensim
---
[原文地址](http://radimrehurek.com/gensim/tut1.html)

如果你想要查看logging事件不要忘记设置。

```python
import logging
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)
```

# 从字符到向量

这次让我们从文档表征为字符开始：

```python
from gensim import corpora, models, similarities
documents = ["Human machine interface for lab abc computer applications",
              "A survey of user opinion of computer system response time",
              "The EPS user interface management system",
              "System and human system engineering testing of EPS",
              "Relation of user perceived response time to error measurement",
              "The generation of random binary unordered trees",
              "The intersection graph of paths in trees",
              "Graph minors IV Widths of trees and well quasi ordering",
              "Graph minors A survey"]
```

这是九个文档的小语料库，每个文档只包含一个句子。

首先，让我们标记化这些文档，删除一些常见词（用一个小停用词表）及在语料库中：

```python
# remove common words and tokenize
stoplist = set('for a of the and to in'.split())
texts = [[word for word in document.lower().split() if word not in stoplist]
          for document in documents]

# remove words that appear only once
all_tokens = sum(texts, [])
tokens_once = set(word for word in set(all_tokens) if all_tokens.count(word) == 1)
texts = [[word for word in text if word not in tokens_once]
          for text in texts]

print texts

[['human', 'interface', 'computer'],
 ['survey', 'user', 'computer', 'system', 'response', 'time'],
 ['eps', 'user', 'interface', 'system'],
 ['system', 'human', 'system', 'eps'],
 ['user', 'response', 'time'],
 ['trees'],
 ['graph', 'trees'],
 ['graph', 'minors', 'trees'],
 ['graph', 'minors', 'survey']]
```

你处理这些文档的方式可能有些不同；这里我只是用白空格去标记化，接下来将每个词转为小写。事实上，我用这个特别（简单化而低效）的设置来模拟Deerwester等在最初的LSA文章中所做的实验。

处理文档的方式多种多样并且与用途和语言无关，我决定不用任何接口加以限制。而是，每个文档用从中抽取的特征来表征，而不是由“表面”字符形式：如何获取特征取决于你。下面我描述一个通用的一般目的的方法（称为词袋），但是，记住不同的应用领域要求不同的特征，一如既往，输入一堆垃圾，产出的也必然是一堆垃圾······

要将文档转化为向量，我们需要使用一种称为词袋的文档表征。在这种表征中，每个文档是由一个向量来表征，每一个向量元素代表一个问题-答案对，形式如下：

“词汇系统在文档中出现了几次？一次。”

仅用（整型）id来表征这些问题是比较方便的。问题与id之前的映射称为字典：

```python
dictionary = corpora.Dictionary(texts)
dictionary.save('/tmp/deerwester.dict') # store the dictionary, for future reference
print dictionary

Dictionary(12 unique tokens)

```
这里我们用gensim.corpora.dictionary.Dictionary类为每个出现在语料库中的词分配了一个整型的id。这个类扫描文本，收集词频及其他统计值。最后，我们在处理过的语料库中发现了12个唯一的词，这意味着每个文档将用12个数字表示（即用12维向量）。查看词和id的映射：

```python
print dictionary.token2id

{'minors': 11, 'graph': 10, 'system': 5, 'trees': 9, 'eps': 8, 'computer': 0,
'survey': 4, 'user': 7, 'human': 1, 'time': 6, 'interface': 2, 'response': 3}
```
实际转化标记化文本为向量：

```python
new_doc = "Human computer interaction"
new_vec = dictionary.doc2bow(new_doc.lower().split())
print new_vec # the word "interaction" does not appear in the dictionary and is ignored

[(0, 1), (1, 1)]
```
函数doc2bow()只是计算每个唯一的词的出现频率，将词转化整型词id并且将结果作为稀疏向量返回。因此，稀疏向量[(0, 1), (1, 1)]读作：在文档“Human computer interaction”中,词computer (id 0)和human (id 1)出现1次;其他字典词出现0次。

```python
corpus = [dictionary.doc2bow(text) for text in texts]
corpora.MmCorpus.serialize('/tmp/deerwester.mm', corpus) # store to disk, for later use
print corpus

[(0, 1), (1, 1), (2, 1)]
[(0, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1)]
[(2, 1), (5, 1), (7, 1), (8, 1)]
[(1, 1), (5, 2), (8, 1)]
[(3, 1), (6, 1), (7, 1)]
[(9, 1)]
[(9, 1), (10, 1)]
[(9, 1), (10, 1), (11, 1)]
[(4, 1), (10, 1), (11, 1)]
```
到这里为止，你要明确的是id=10的向量特征代表问题“词 graph在这个文档中出现了几次” 对于前6个文档答案是”0“，剩下的三个的答案是”1“。事实上我们已经获得了与[Quick Example](http://radimrehurek.com/gensim/tutorial.html#first-example)相同的语料向量。

# 语料流 - 一次一个文档

上面的语料库都是作为一个纯Python的List全部加载到内存中。在这个简单的例子中，这没什么，但是，为了让事情更清楚，让我们假设在语料库中有几百万的文档。将这些文档都存入RAM是不现实的。相反，让我们假设这些文档都是存储在硬盘的一个文件上，每个文档一行。Gensim只需要语料库可以每次返回一个文档向量：

```python
class MyCorpus(object):
     def __iter__(self):
         for line in open('mycorpus.txt'):
             # assume there's one document per line, tokens separated by whitespace
             yield dictionary.doc2bow(line.lower().split())
```

在这里下载样本文件[mycorpus.txt](http://radimrehurek.com/gensim/mycorpus.txt)。假设每个文档占据单个文档中的一行并不重要；你可以参照__iter__函数来满足你的输入格式，无论什么格式。游走的字典间，解析XML，访问网络...只需要
在__iter__中，将解析你的输入恢复为在每个文档中标记的清晰列表，然后通过字典转化标记为他们的id，yield产生的稀疏向量。

```python
corpus_memory_friendly = MyCorpus() # doesn't load the corpus into memory!
print corpus_memory_friendly

<__main__.MyCorpus object at 0x10d5690>
```
现在语料库是一个对象。我们没有定义任何的方式来打印它，因此，print只是输出了对象在内存中的地址。不是非常有用。要查看向量的构成成分，让我们在语料库上进行迭代，并且打印每个文档向量（每次一个）：

```python
for vector in corpus_memory_friendly: # load one vector into memory at a time
print vector

[(0, 1), (1, 1), (2, 1)]
[(0, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1)]
[(2, 1), (5, 1), (7, 1), (8, 1)]
[(1, 1), (5, 2), (8, 1)]
[(3, 1), (6, 1), (7, 1)]
[(9, 1)]
[(9, 1), (10, 1)]
[(9, 1), (10, 1), (11, 1)]
[(4, 1), (10, 1), (11, 1)]
```
尽管输入还是纯Python列表，现在语料库是非常内存友好的，因为，每次最多只有一个向量驻留在RAM中。你的语料现在可以是任意大小。

同样，不需要加载所有的文章到内存就可以构造字典：

```python
# collect statistics about all tokens
dictionary = corpora.Dictionary(line.lower().split() for line in open('mycorpus.txt'))
# remove stop words and words that appear only once
stop_ids = [dictionary.token2id[stopword] for stopword in stoplist
           if stopword in dictionary.token2id]
once_ids = [tokenid for tokenid, docfreq in dictionary.dfs.iteritems()if docfreq == 1]
dictionary.filter_tokens(stop_ids + once_ids) # remove stop words and words that appear only once
dictionary.compactify() # remove gaps in id sequence after words that were removed
print dictionary

Dictionary(12 unique tokens)
```
这就是全部了！至少到目前为止都是关于词袋表征。当然，我们要对这些语料做什么是另外一件事；根本没有涉及到为什么计算每个唯一的词出现的频率会是有用的。事实证明，这并不是很有用，在我们用它在计算一些有意义的文档 vs. 文档相似性之前，我们将需要在最初的简单表征上做一些转换。转换将涵盖在[下一个教程](http://radimrehurek.com/gensim/tut2.html)中，在这之前，让我们暂时将注意力转到语料持久化上。

# 语料格式

有一些现存的方法可以序列化向量空间语料（向量序列）到硬盘。Gensim通过前面提到的streaming corpus接口实现了他们：文件以一种懒惰的形式从硬盘中读取，每次读取一个文件，而不是一次将所有语料读入主内存。

一个值得注意的文件格式是 [Market Matrix format](http://math.nist.gov/MatrixMarket/formats.html). 将语料存储为Matrix Market format:

```python
from gensim import corpora
# create a toy corpus of 2 documents, as a plain Python list
corpus = [[(1, 0.5)], []]  # make one document empty, for the heck of it

corpora.MmCorpus.serialize('/tmp/corpus.mm', corpus)
```

其他的格式包括[Joachim的 SVMlight 格式](http://svmlight.joachims.org/),[[Blei的 LDA-C 格式](http://www.cs.princeton.edu/~blei/lda-c/)和[GibbsLDA++ 格式](http://gibbslda.sourceforge.net/).

```python
corpora.SvmLightCorpus.serialize('/tmp/corpus.svmlight', corpus)
corpora.BleiCorpus.serialize('/tmp/corpus.lda-c', corpus)
corpora.LowCorpus.serialize('/tmp/corpus.low', corpus)
```

反过来，从 Matrix Market 文件读取语料迭代器：

```python
corpus = corpora.MmCorpus('/tmp/corpus.mm')
```

语料对象是数据流，因此，通常你不能直接打印他们：

```python
print corpus

MmCorpus(2 documents, 2 features, 1 non-zero entries)
```
相反，要查看语料的内容：

```python
# one way of printing a corpus: load it entirely into memory
print list(corpus) # calling list() will convert any sequence to a plain Python list
[[(1, 0.5)], []]
```
或

```python
# another way of doing it: print one document at a time, making use of the streaming interface
for doc in corpus:
    print doc

[(1, 0.5)]
[]
```
第二种方式明显更加内存友好，但是，为了测试和开发的目的，什么也不如简单的调用列表（语料）。

要以 Blei’s LDA-C 格式保存相同的 Matrix Market 文档流：

```python
corpora.BleiCorpus.serialize('/tmp/corpus.lda-c', corpus)
```

用这种方式，gensim也可以用作一种高效的内存 I/O格式转化工具：只需要用一种格式加载文档流，马上用另一种格式保存。添加新的格式相当简单，查看SVMlight语料的代码作为例子。

# 与Numpy和Scipy的兼容性

Gensim也包含[高效的实用函数](http://radimrehurek.com/gensim/matutils.html)来帮助从/向 numpy矩阵转换：

```python
corpus = gensim.matutils.Dense2Corpus(numpy_matrix)
numpy_matrix = gensim.matutils.corpus2dense(corpus)
```

以及从/向 scipy.sparse 矩阵转换:

```python
corpus = gensim.matutils.Sparse2Corpus(scipy_sparse_matrix)
scipy_csc_matrix = gensim.matutils.corpus2csc(corpus)
```

完整的参考（想要将字典缩小为更小的大小？优化语料和Numpy/SciPy数组间的转换？），请见[API 文档](http://radimrehurek.com/gensim/apiref.html)，或者继续下一个教程[主题与转化](http://radimrehurek.com/gensim/tut2.html)。
---
author: cloga
comments: true
layout: post
slug: 'sklearn_text_feature_extraction'
title: sklearn文本特征提取
tags:
- sklearn
- Python
- text feature extraction
- feature extraction
---

# 文本特征提取
## 词袋（Bag of Words）表征
文本分析是机器学习算法的主要应用领域。但是，文本分析的原始数据无法直接丢给算法，这些原始数据是一组符号，因为大多数算法期望的输入是固定长度的数值特征向量而不是不同长度的文本文件。为了解决这个问题，[scikit-learn](http://scikit-learn.org/)提供了一些实用工具可以用最常见的方式从文本内容中抽取数值特征，比如说：

- *标记（tokenizing）*文本以及为每一个可能的标记（token）分配的一个整型ID ，例如用白空格和标点符号作为标记的分割符（中文的话涉及到分词的问题）
- *计数（counting）*标记在每个文本中的出现频率
- *正态化(nomalizating)* 降低在大多数样本/文档中都出现的标记的权重

在这个方案中，特征和样本的定义如下：

将*每个标记出现的频率*(无论是否正态化)作为*特征*。

给定*文件*中所有标记的出现频率所构成的向量作为多元*样本*。

因此，语料文件可以用一个词文档矩阵代表，每行是一个文档，每列是一个标记（即词）。

将文档文件转化为数值特征的一般过程被称为*向量化*。这个特殊的策略（标记，计数和正态化）被称为*词袋*或者Bag of n-grams表征。用词频描述文档，但是完全忽略词在文档中出现的相对位置信息。

## 稀疏性

大多数文档通常只会使用语料库中所有词的一个子集，因而产生的矩阵将有许多特征值是0（通常99%以上都是0）。

例如，一组10,000个短文本（比如email）会使用100,000的词汇总量，而每个文档会使用100到1,000个唯一的词。

为了能够在内存中存储这个矩阵，同时也提供矩阵/向量代数运算的速度，通常会使用稀疏表征例如在scipy.sparse包中提供的表征。

## 通用向量使用

*CountVectorizer*在一个类中实现了标记和计数：

```python
from sklearn.feature_extraction.text import CountVectorizer
```
这个模型有许多参数，不过默认值已经非常合理（具体细节请见[参考文档](http://scikit-learn.org/stable/modules/classes.html#text-feature-extraction-ref)）：

```python
vectorizer = CountVectorizer(min_df=1)
vectorizer

CountVectorizer(analyzer=...'word', binary=False, charset=None,
        charset_error=None, decode_error=...'strict',
        dtype=<... 'numpy.int64'>, encoding=...'utf-8', input=...'content',
        lowercase=True, max_df=1.0, max_features=None, min_df=1,
        ngram_range=(1, 1), preprocessor=None, stop_words=None,
        strip_accents=None, token_pattern=...'(?u)\\b\\w\\w+\\b',
        tokenizer=None, vocabulary=None)
```
让我们用它来标记和计算一个简单语料的词频：

```python
corpus = [
     'This is the first document.',
     'This is the second second document.',
     'And the third one.',
     'Is this the first document?',
 ]
X = vectorizer.fit_transform(corpus)
X                              

<4x9 sparse matrix of type '<... 'numpy.int64'>'
    with 19 stored elements in Compressed Sparse Column format>
```
默认设置通过抽取2个字符以上的词标记字符。完成这个步骤的具体函数可以直接调用：

```python
analyze = vectorizer.build_analyzer()
analyze("This is a text document to analyze.") == (
     ['this', 'is', 'text', 'document', 'to', 'analyze'])

True
```
在拟合过程中，每一个分析器找到的词都会分配一个在结果矩阵中对应列的整型索引。列的含义可以用下面的方式获得：

```python
vectorizer.get_feature_names() == (
     ['and', 'document', 'first', 'is', 'one',
      'second', 'the', 'third', 'this'])

True

X.toarray()
array([[0, 1, 1, 1, 0, 0, 1, 0, 1],
       [0, 1, 0, 1, 0, 2, 1, 0, 1],
       [1, 0, 0, 0, 1, 0, 1, 1, 0],
       [0, 1, 1, 1, 0, 0, 1, 0, 1]]...)
```
特征名称与列索引的转化映射被存储在向量器（vectorizer）的vocabulary_属性中：

```python
vectorizer.vocabulary_.get('document')

1
```
因此，在训练语料中没有出现的词在后续调用转化方法时将被完全忽略：

```python
vectorizer.transform(['Something completely new.']).toarray()
                           
array([[0, 0, 0, 0, 0, 0, 0, 0, 0]]...)
```
注意在前面的语料中，第一个和最后一个文档的词完全相同因此被编码为等价的向量。但是，我们丢失了最后一个文档是疑问形式的信息。为了保留一些局部顺序信息，我们可以在抽取词的1-grams（词本身）之外，再抽取2-grams：

```python
bigram_vectorizer = CountVectorizer(ngram_range=(1, 2),
                                     token_pattern=r'\b\w+\b', min_df=1)
analyze = bigram_vectorizer.build_analyzer()
analyze('Bi-grams are cool!') == (
     ['bi', 'grams', 'are', 'cool', 'bi grams', 'grams are', 'are cool'])

True
```
因此，由这个向量器抽取的词表非常大，现在可以解决由于局部位置模型编码的歧义问题：

```python
X_2 = bigram_vectorizer.fit_transform(corpus).toarray()
X_2
...                           
array([[0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
       [0, 0, 1, 0, 0, 1, 1, 0, 0, 2, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0],
       [1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0],
       [0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1]]...)
```
特别是疑问形式“Is this”只出现在最后一个文档：

```python
feature_index = bigram_vectorizer.vocabulary_.get('is this')
X_2[:, feature_index]     

array([0, 0, 0, 1]...)
```
## Tf-idf词权重

在较低的文本语料库中，一些词非常常见（例如，英文中的“the”，“a”，“is”），因此很少带有文档实际内容的有用信息。如果我们将单纯的计数数据直接喂给分类器，那些频繁出现的词会掩盖那些很少出现但是更有意义的词的频率。

为了重新计算特征的计数权重，以便转化为适合分类器使用的浮点值，通常都会进行tf-idf转换。

Tf代表*词频*，而tf-idf代表词频乘以*逆向文档频率*。这是一个最初为信息检索（作为搜索引擎结果的排序功能）开发的词加权机制，在文档分类和聚类中也是非常有用的。

*text.TfidfTransformer*类实现了这种正态化：

```python
from sklearn.feature_extraction.text import TfidfTransformer
transformer = TfidfTransformer()
transformer

TfidfTransformer(norm=...'l2', smooth_idf=True, sublinear_tf=False,
                 use_idf=True)
```
同样对于每个参数的详细解释，请参见[参考文档](http://scikit-learn.org/stable/modules/classes.html#text-feature-extraction-ref)。

让我们用下面的计数作为例子。第一个词出现每次100%出现因此不是携带的信息不多。另外两个特征只在不到50%的时间出现，因此，对文档内容的代表能力可能更强一些：

```python
counts = [[3, 0, 1],
           [2, 0, 0],
           [3, 0, 0],
           [4, 0, 0],
           [3, 2, 0],
           [3, 0, 2]]
tfidf = transformer.fit_transform(counts)
tfidf                         

<6x3 sparse matrix of type '<... 'numpy.float64'>'
    with 9 stored elements in Compressed Sparse Row format>

tfidf.toarray()                        

array([[ 0.85...,  0.  ...,  0.52...],
       [ 1.  ...,  0.  ...,  0.  ...],
       [ 1.  ...,  0.  ...,  0.  ...],
       [ 1.  ...,  0.  ...,  0.  ...],
       [ 0.55...,  0.83...,  0.  ...],
       [ 0.63...,  0.  ...,  0.77...]])
```
每一行被正态化为单位的欧几里得范数。由fit方法计算的每个特征的权重存储在model属性中：

```python
transformer.idf_                       

array([ 1. ...,  2.25...,  1.84...])
```
由于tf-idf经常用于文本特征，因此有另一个类称为*TfidfVectorizer*，将*CountVectorizer*和*TfidfTransformer*的所有选项合并在一个模型中：

```python
from sklearn.feature_extraction.text import TfidfVectorizer
vectorizer = TfidfVectorizer(min_df=1)
vectorizer.fit_transform(corpus)
...                                
<4x9 sparse matrix of type '<... 'numpy.float64'>'
    with 19 stored elements in Compressed Sparse Row format>
```
尽管tf-idf的正态化也非常有用，在一些情况下，binary occurrence markers通常比特征更好。可以用*CountVectorizer*的*二元*参数达到这个目的。特别是，一些预测器比如[Bernoulli Naive Bayes](http://scikit-learn.org/stable/modules/naive_bayes.html#bernoulli-naive-bayes)显性建模离散的布尔随机变量。非常短的文本也可能有满是噪音的tf-idf值，而binary occurrence info则更加稳定。

同样，调整特征抽取参数的最佳唯一方式是使用交叉验证网格搜索（grid search），例如，通过分类器用管道传输特征抽取器：
[Sample pipeline for text feature extraction and evaluation](http://scikit-learn.org/stable/auto_examples/grid_search_text_feature_extraction.html#example-grid-search-text-feature-extraction-py)
## 解码文本文件
文本由文字构成，但是文件由字节构成。在Unicode中，可能的文字会比可能的字节多很多。每一个文本文件都是编码的，因此，文字也可以用字节表示。

当你在python中处理文本时，应该都是Unicode。在scikit-learn中的大多数文本特征抽取器只能用于Unicode。因此，正确的从文件（或者从网络）加载文本，你需要用正确的编码解码。

编码也被称为"字符集"（“charset”或“character set”），尽管这个术语不准确。*CountVectorizer*用*encoding*参数告诉它用什么编码去解码。

对现代的文本文件来说，正确的编码可能是UTF-8。*CountVectorizer*用*encoding='utf-8'*作为编码默认值。如果你加载的文档实际上不是UTF-8编码，那么你将获得*UnicodeDecodeError*错误。

如果你在解码文本时出现了问题，有一些东西可以尝试一下：

- 找到文本的实际编码。文件可能包含一个文件头告诉你它的编码，或者根据文本的来自哪里你可以猜测一些标准的编码。
- 用UNIX命令*file*，你可以找到它是什么编码。Python的chardet模块有一个叫做*chardetect.py*的脚本，这个脚本会猜测具体的编码，尽管你不能期望它的猜测就是正确的。
- 你可以忽略错误，试一下UTF-8。你可以用*bytes.decode(errors='replace')*来解码字节字符串，用一个无意义的字符来替换所有解码错误，或者在向量器中设置*decode_error='replace'*。这可能特征的有用性。
- 真实的文本可能来自多种来源使用多种编码，甚至可能凌乱的用错误的编码解码。在网络上的文本检索过程中这非常常见。Python的包[ftfy](https://github.com/LuminosoInsight/python-ftfy)可以自动挑选出几类解码错误，因此，你可以尝试尝试将位置文档解码为*latin-1*，然后用*ftfy*来修复错误。
- 如果文本是一坨乱七八糟的东西（20个新闻组的数据集就是这样），很难简单的分类出编码，你可以回滚到单字符编码，比如latin-1。一些文本的显示可能不正确，但是，至少相同的字节序列都会代表相同的特征。

## 应用例子 

词袋表征非常简单，但是在实际应用中出奇的有用。

特别是在有监督的环境下，可以与快读可扩展的线性模型一起去训练文档分类器，例如：

- [Classification of text documents using sparse features](http://scikit-learn.org/stable/auto_examples/document_classification_20newsgroups.html#example-document-classification-20newsgroups-py)

在无监督的环境下，可以通过应用聚类算法比如[K-means](http://scikit-learn.org/stable/modules/clustering.html#k-means)将相同的文档聚集成组：

- [Clustering text documents using k-means](Clustering text documents using k-means)

最后通过relaxing the hard assignment constraint of clustering可以发现语料库的主要主题，例如使用[Non-negative matrix factorization (NMF or NNMF)](http://scikit-learn.org/stable/modules/decomposition.html#nmf)：

- [Topics extraction with Non-Negative Matrix Factorization](http://scikit-learn.org/stable/auto_examples/applications/topics_extraction_with_nmf.html#example-applications-topics-extraction-with-nmf-py)

## 词袋表征的局限

一组unigrams（即词袋）无法捕捉短语和多词（multi-word）表达，词库模型并不能解释可能的拼写错误或派生词。

N-grams来帮忙！与构建简单的一组unigrams相比，人们更倾向于构建一组bigrams（n=2），计数一组成对连续出现的词的频率。

人们也可能考虑一组字母的n-grams，可以处理错误拼写和派生词的表征。

例如，我们处理包含两个文档的语料库：['words', 'wprds']。第二个文档包含“words”这个词的错拼。简单的词袋表征会认为两个文档是完全不同的文档，两个可能的特征是不同的。但是，字母的n-grams表征可以发现两个文档匹配8个特征中的4个，这有助于分类器更好的决策：

```python
ngram_vectorizer = CountVectorizer(analyzer='char_wb', ngram_range=(2, 2), min_df=1)
counts = ngram_vectorizer.fit_transform(['words', 'wprds'])
ngram_vectorizer.get_feature_names() == (
     [' w', 'ds', 'or', 'pr', 'rd', 's ', 'wo', 'wp'])

True

counts.toarray().astype(int)

array([[1, 1, 1, 0, 1, 1, 1, 0],
       [1, 1, 0, 1, 1, 1, 0, 1]])
```
在上面例子中，使用了“char_wb”分析器，这个分析器只从词边界（在两次填充空格）内部创建字母n-grams。“char”分析器则相反，跨词创建n-grams：

```python
ngram_vectorizer = CountVectorizer(analyzer='char_wb', ngram_range=(5, 5), min_df=1)
ngram_vectorizer.fit_transform(['jumpy fox'])
                                
<1x4 sparse matrix of type '<... 'numpy.int64'>'
   with 4 stored elements in Compressed Sparse Column format>

ngram_vectorizer.get_feature_names() == (
     [' fox ', ' jump', 'jumpy', 'umpy '])

True

ngram_vectorizer = CountVectorizer(analyzer='char', ngram_range=(5, 5), min_df=1)
ngram_vectorizer.fit_transform(['jumpy fox'])

<1x5 sparse matrix of type '<... 'numpy.int64'>'
    with 5 stored elements in Compressed Sparse Column format>

ngram_vectorizer.get_feature_names() == (
     ['jumpy', 'mpy f', 'py fo', 'umpy ', 'y fox'])

True
```
区分边界的词变体char_wb对那些使用白空格进行词分隔的语言更加有效，因为在这些语言中，与那些原始字母变体相比，这种方式产生的特征噪音显著减少。对于这些语言，使用这些特征可以增加分类器预测的准确性和收敛的速度，同时保障了w.r.t.的错拼和派生词的强壮性。

尽管可以通过抽取n-grams而不是单独的词保留一部分局部位置信息，但是，词袋和bag of n-grams破坏了绝大多数文档的内部结构，以及内部结构所携带的大部分意义。

为了解决自然语言理解的更广泛任务，应该考虑句子和段落的局部结构。许多模型因此将被转换为“结构化输出”的问题，不过这些问题目前超出了scikit-learn的范围。

## 用哈希技巧向量化大文本向量

以上的向量化情景很简单，但是，事实上这种方式*从字符标记到整型特征的目录（vocabulary_属性）的映射都是在内存中进行*，在*处理大数据集*时会出现一些问题：
- 语料库越大，词表就会越大，因此使用的内存也越大，
- 拟合（fitting）需要根据原始数据集的大小等比例分配中间数据结构的大小。
- 构建词映射需要完整的传递数据集，因此不可能以严格在线的方式拟合文本分类器。
- pickling和un-pickling vocabulary_很大的向量器会非常慢（通常比pickling/un-pickling单纯数据的结构，比如同等大小的Numpy数组），
- 将向量化任务分隔成并行的子任务很不容易实现，因为vocabulary_属性要共享状态有一个细颗粒度的同步障碍：从标记字符串中映射特征索引与每个标记的首次出现顺序是独立的，因此应该被共享，在这点上并行worker的性能收到了损害，使他们比串行更慢。

通过同时使用由sklearn.feature_extraction.FeatureHasher类实施的“哈希技巧”（特征哈希）、文本预处理和CountVectorizer的标记特征有可能克服这些限制。

这个组合在HashingVectorizer实现，这个转换器类是无状态的，其大部分API与CountVectorizer.HashingVectorizer兼容，这意味着你不需要在上面调用fit：

```python
from sklearn.feature_extraction.text import HashingVectorizer
hv = HashingVectorizer(n_features=10)
hv.transform(corpus)
...                                
<4x10 sparse matrix of type '<... 'numpy.float64'>'
    with 16 stored elements in Compressed Sparse Row format>
```
你可以看到从向量输出中抽取了16个非0特征标记：与之前由CountVectorizer在同一个样本语料库抽取的19个非0特征要少。差异来自哈希方法的冲突，因为较低的n_features参数的值。

在真实世界的环境下，n_features参数可以使用默认值2 ** 20（将近100万可能的特征）。如果内存或者下游模型的大小是一个问题，那么选择一个较小的值比如2 ** 18可能有一些帮助，而不需要为典型的文本分类任务引入太多额外的冲突。

注意维度并不影响CPU的算法训练时间，这部分是在操作CSR指标（LinearSVC(dual=True), Perceptron, SGDClassifier, PassiveAggressive），但是，它对CSC matrices (LinearSVC(dual=False), Lasso(), etc)算法有效。

让我们用默认设置再试一下：

```python
hv = HashingVectorizer()
hv.transform(corpus)
...                               
<4x1048576 sparse matrix of type '<... 'numpy.float64'>'
    with 19 stored elements in Compressed Sparse Row format>
```
冲突没有再出现，但是，代价是输出空间的维度值非常大。当然，这里使用的19词以外的其他词之前仍会有冲突。

HashingVectorizer也有以下的局限：

- 不能反转模型（没有inverse_transform方法），也无法访问原始的字符串表征，因为，进行mapping的哈希方法是单向本性。
- 没有提供了IDF权重，因为这需要在模型中引入状态。如果需要的话，可以在管道中添加TfidfTransformer。

## 进行HashingVectorizer的核外扩展

使用HashingVectorizer的一个有趣发展是进行核外扩展的能力。这意味着我们可以从无法放入电脑主内存的数据中进行学习。

实现核外扩展的一个策略是将数据以流的方式以一小批提交给评估器。每批的向量化都是用HashingVectorizer这样来保证评估器的输入空间的维度是相等的。因此任何时间使用的内存数都限定在小频次的大小。尽管用这种方法可以处理的数据没有限制，但是从实用角度学习时间受到想要在这个任务上花费的CPU时间的限制。

一个核外扩展的文本分类任务的实例，请参见[Out-of-core classification of text documents](http://scikit-learn.org/stable/auto_examples/applications/plot_out_of_core_classification.html#example-applications-plot-out-of-core-classification-py).

[原文地址](http://scikit-learn.org/stable/modules/feature_extraction.html#text-feature-extraction)
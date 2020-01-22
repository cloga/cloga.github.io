---
title: "Dask DataFrame最佳实践"
author: "cloga"
comments: yes
layout: post
slug: dask_dataframe_best_practice
tags:
- dask
- dataframe
- best practice
categories: 
- dask
- best practice
- 他山之石

---

原文：https://docs.dask.org/en/latest/dataframe-best-practices.html

入门Dask DataFrame很容易，但是要很好的使用它需要一些经验。这个页面包含最佳实践，以及常见问题的解决方案。

## 使用Pandas
对于适合于内存（RAM）的数据，Pandas通常比使用Dask DataFrame更快捷。尽管“大数据”工具很令人兴奋，但是，他们通常在适合常规数据工具的领域比常规数据工具表现差一些。

## 削减，然后使用Pandas
与上面类似，尽管你有大数据集，但是一定在计算过程中存在一个点，在这个点上数据会削减到更加易于管理的水平。你应该在这个点切换到Pandas。

```python
df = dd.read_parquet('my-giant-file.parquet')
df = df[df.name == 'Alice']              # Select a subsection
result = df.groupby('id').value.mean()   # Reduce to a smaller size
result = result.compute()                # Convert to Pandas dataframe
result...                                # Continue working with Pandas
```

## Pandas性能技巧应用于Dask DataFrame
通常Pandas性能技巧，例如避免apply，使用向量化操作，使用类别等等，对于Dask DataFrame也是试用的。看一下[Tom Augspurger](https://github.com/TomAugspurger)写的[现代的Pandas](https://tomaugspurger.github.io/modern-1-intro)，是关于这个话题的很好材料。

## 使用索引
Dask DataFrame可以按照一个索引列进行排序。这一列上的一些操作会非常快。例如，如果，你的数据集是按照时间排序，你可以快速选择某一天的数据，进行时间序列join等。你可以通过df.known_divisions属性来查看你的数据是否经过排序，你可以通过.set_index(column_name)方法来设置索引列。但是这个操作的代价很高，因为尽量少用（如下）：

```python
df = df.set_index('timestamp')  # set the index to make some operations fast
 
df.loc['2001-01-05':'2001-01-12']  # this is very fast if you have an index
df.merge(df2, left_index=True, right_index=True)  # this is also very fast
```

更多信息查看[dataframe 分区文档](https://docs.dask.org/en/latest/dataframe-design.html#dataframe-design-partitions)。

## 避免全量数据的shuffle（混排）
设置索引是很重要但成本很高的操作（如上）。你应该较少使用它，并在后面持久化（见下面）。

一些操作例如set_index 和 merge/join在并行或分布式设置中很难进行，对比在单机的内存时。特别是混排操作，即重新分配数据会变得需要很高的通信成本。例如，如果你的数据是通过客户ID整理的，但是，要改成按照时间整理，所有分区都需要与其他分区通信交换数据碎片。这非常高成本的过程，特别是在集群中。

因此，需要设置索引，但是，不要太频繁。设置了索引后，如果在集群中，需要 persist你的数据：

```python
df = df.set_index('column_name')  # do this infrequently
```

此外，set_index 有一些选项可以在一些情况加速。例如，如果你知道数据集已经是排序好的，或者你已经知道通过哪些值拆分。你可以提供这些信息来加速 set_index 操作。更多信息看一下[set_index](http://set_index%20docstring./)文档。

```python
df2 = df.set_index(d.timestamp, sorted=True)
```

## 聪明的进行持久化
这部分只适用于分布式系统。

通常DataFrame的工作负载是这样的：

1. 从文件加载数据
2. 过滤数据的特定子集
3. 混排数据来设置一个适合的索引
4. 在这个索引好的数据上进行一些复杂的查询

通常理想的做法是加载，过滤和重新分布（shuffle）一次数据，在内存中保留这个结果。后面，每个复杂的查询都是基于这个内存中的数据，而不是每次都重复完整的加载-过滤-重排过程。要这样做，使用client.presist方法：

```python
df = dd.read_csv('s3://bucket/path/to/*.csv')
df = df[df.balance < 0]
df = client.persist(df)
 
df = df.set_index('timestamp')
df = client.persist(df)
 
>>> df.customer_id.nunique().compute()
18452844
 
>>> df.groupby(df.city).size().compute()
...
```

持久化很重要，因为Dask默认是延迟执行的。这种方式会告诉集群，开始执行你目前定义的计算，并且应该尝试将这些结果保存在内存中。你可以获得一个在与旧DataFrame在语义上相等一个新DataFrame，但是指向了运行的数据。旧DataFrame仍然指向延迟计算：

```python

# Don't do this
client.persist(df)  # persist doesn't change the input in-place
 
# Do this instead
df = client.persist(df)  # replace your old lazy DataFrame
```

## 重新分区来减少开销
Dask DataFrame被拆分成许多Pandas DataFrame。有时我们称之为“分区”，通常分区的数量由你决定。例如，可能是读取的CSV文件数量。但是，随着时间的变化，一旦你通过过滤或者join减少或者增加了pandas DataFrame的大小，建议重新考虑下需要多少分区。太多或者太少都有成本。

分区应该很容易保存在内存中（1G以下）但是，也不该过大。每个分区的每个操作都会花费中心化调度器的几百毫秒来进行处理。如果你只有几千个任务那么不会有太大感觉，但是最好是尽可能的减少这个数量。

通常的情况是这样，你加载大量的数据到一个合理的分区（Dask默认的进行一个优雅的选择）大小，但是，接下来，你将数据集过滤为原始大小的一小部分。在这个时间点，应该将很多小的分区重新分组为较大的分区。你可以通过 repartition 方法来进行：

```python
df = dd.read_csv('s3://bucket/path/to/*.csv')
df = df[df.name == 'Alice']  # only 1/100th of the data
df = df.repartition(npartitions=df.npartitions // 100)
 
df = df.persist()  # if on a distributed system
```

这有助于减少开销并且提高向量化Python操作的效率。你应该以每个分区的数据大概为100MB为目标。

此外，在重新分布（shuffle）前减少分区数往往很有帮助，相对于分区来说这创建了n log(n) 个任务。DataFrame少于100个分区比几万个分区要好重新分配的多。

## Joins
join两个DataFrame可以是代码昂贵也可以代价很小，这依赖于不同的情况。在如下的情况下，代价较小：

1. Join Dask DataFrame与Pandas DataFrame
2. Join Dask DataFrame与另一个Dask DataFrame的一个分区
3. 根据索引Join Dask DataFrame

同时，在下面的情况是成本很高的：

1. 用非索引列Join Dask DataFrame
代价昂贵的情况下需要重新分配。这是可以的，并且Dask DataFrame可以很好的完成这个任务，但是，会比典型的线性时间操作昂贵的多：

```python
dd.merge(a, pandas_df)  # fast
dd.merge(a, b, left_index=True, right_index=True)  # fast
dd.merge(a, b, left_index=True, right_on='id')  # half-fast, half-slow
dd.merge(a, b, left_on='id', right_on='id')  # slow
```

更多的信息参见[join](https://docs.dask.org/en/latest/dataframe-joins.html)。

## 以Apache Parquet格式存储数据
HDF5对于Pandas用户是一个高性能的受欢迎的选择。我们鼓励Dask DataFrame用户使用Parquet来[存储和加载数据](https://docs.dask.org/en/latest/dataframe-create.html)。[Apache Parquet](https://parquet.apache.org/) 是个列式二进制格式，可以很方便的拆分为多个文件（易于并行加载），通常比HDF5处理更简单（从库的角度）。它也是其他大数据系统使用格式，例如[Apache Spark](https://spark.apache.org/)和[Apache Impala](https://impala.apache.org/)，并且有助于与其他系统交换。

```python
df.to_parquet('path/to/my-results/')
df = dd.read_parquet('path/to/my-results/')
```

Dask支持使用Python不同的Apache Parquet实现引擎来读取parquet文件：

```python
df1 = dd.read_parquet('path/to/my-results/', engine='fastparquet')
df2 = dd.read_parquet('path/to/my-results/', engine='pyarrow')
```

这些库可以用如下方法安装：

```sh
conda install fastparquet pyarrow -c conda-forge
```

[fastparquet](https://github.com/dask/fastparquet/) 是使用 Numba Python-to-LLVM编译器的python实现。PyArrow 是 [Apache Arrow](https://arrow.apache.org/) 项目的一部分，使用 [C++ 实现的 Apache Parquet](https://github.com/apache/parquet-cpp).

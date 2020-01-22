---
title: "Dask最佳实践"
author: "cloga"
comments: yes
layout: post
slug: dask_best_practice
tags:
- dask
- best practice
categories: 
- dask
- best practice
- 他山之石

---

原文：https://docs.dask.org/en/latest/best-practices.html

使用Dask API很简单，但是用好他们需要一些经验。本页包含最佳实践建议以及通用问题的解决方案。

这个文档局限在所有Dask API共享的最佳实践。读者应该首先了解具体API的最佳实践文档。

- [Arrays](https://docs.dask.org/en/latest/array-best-practices.html)
- [DataFrames](https://docs.dask.org/en/latest/dataframe-best-practices.html)
- [Delayed](https://docs.dask.org/en/latest/delayed-best-practices.html)

## 从小开始
并行化带来了额外的复杂性和开销。有时对大问题是必须的，通常并不是。在向你的工作负载中添加类似Dask这类并行化计算系统之前，应该尝试一下下面的替代方案：

- 使用更好的算法或数据结构：Numpy、Pandas、Scikit-learn可能针对你正在做的事情有更快的方法。有必要咨询一下专家或者读一下文档找到更好的内置算法
- 更好的文件格式：支持随机读写的高效的二进制格式通常可以帮助你简单高效的管理超过内存的数据集。参见下面的[高效存储数据](https://docs.dask.org/en/latest/best-practices.html#store-data-efficiently)部分。
- 编译代码：用Numba或者Cython编译你的Python代码，可能是并行化没有必要。或者你可以使用这些库提供的多核并行化。
- 抽样：即使你有很多的数据，使用他们中的所有并不会有很大的优势。通过精巧的抽样，你可能可以获得相同的见解，从一个更好管理的子集中。
- 调优：如果你想要加速慢的代码，首先知道它为什么慢很重要。花一些时间来调优你的代码能帮助你发现什么使你变慢。这个信息可以帮助你更好的决策并行化是否能有帮助或者其他的方式更有效。

## 使用Dashboard
Dask的Dashboard帮助你理解worker的状态。这些信息可以帮助你有效的解决问题。在并行化和分布式计算中，有新的成本需要关注，并且你的旧知觉可能不再正确。通过Dashboard可以帮助你重新学习什么是快和慢，以及如何处理。

更多信息看一下[Dask的Dashboard文档](https://docs.dask.org/en/latest/diagnostics-distributed.html)。

## 避免非常大的Partition（分区）
数据分块应该足够小，以便许多分块可以一次加载到worker的内存中。当你在Dask Array指定分块大小或在Dask DataFrame中指定分区大小时，你可以控制这个参数。

Dask可以在一台机器上并行化操作与核数相同的分块，因此，如果1G分块和10个核，那么Dask可能使用最少10G的内存。此外，通常，Dask有2-3倍的分块来进行工作，以便通常有一些工作去做。

如果你有100G和10核的机器，那么你选择的分块会在1G左右。你有每核10个分块的空间，以便Dask有健康的空余，而不是有太小的任务

注意，你也需要避免太小的分块大小，细节看一下下一节。

## 避免非常大的图
Dask工作负载由任务构成。一个任务是一个Python函数，例如np.sum应用于Python对象，例如，Pandas DataFrame或者Numpy array。如果操作的Dask collection有需要分区，那么你进行的每个操作，例如x + 1可能生成很多的任务，至少和collection中的分区一样多。

每个任务有一些开销。大约在200us到1ms。如果计算任务是几千个是可以的，大约有秒级的开销，并不会带来问题。

但是，如果有一个很大的图，有几百万的任务，那么这会成为问题。一方面，开销会是10分钟到几小时之间，另一方面，处理这么大的图的开销也开始吞没调度器。

有一些方法来解决这个问题：

- 构建更小的图，你可以
	- 增加分块大小：如果有1000G数据使用10M分块（chunks），那么你有100,000分区（partitions）。集合上的每个操作将产生至少100,000任务（task）。但是，如果你增加分块大小到1GB或者甚至几GB，那么你将极大的减少开销。这要求worker有1G以上的内存，但是对于大工作负载来说折痕常见。
	- 合并操作：Dask将自动进行这种操作，但是你可以帮助它。如果你有非常复杂的操作，有几十个子操作，也许你可以将这些操作封装在一个Python函数中，然后使用da.map_blocks 或 dd.map_partitions。一般来说，将越多的管理任务放在你函数里越好。这样Dask调度器就不需要考虑所有细粒度操作。
	- 打散你的计算：对于非常大的工作负载，你可能也想尝试一次发送少量的分块到Dask。例如，如果你要处理1PB的数据，但是发现，Dask只能处理100TB，那么应该把计算拆成10份，每次提交一份。

## 学习自定义的技术
高级的Dask集合（array、dataframe和bag）包含通用的算子（operation），遵循Numpy和Pandas的标准Python API。但是，许多Python工作负载很复杂，并且可能需要在这些高级API不包含的操作。

幸运的是，有需要选项可以支持自定义工作负载：

- 所有的集合都有map_blocks 或 map_partitions 方法，将用户提供的方法应用到集合的每一个Pandas dataframe 或者 Numpy array。因为，Dask集合有普通的Python对象构成，要将这些自定义函数映射到数据集的所有分区不需要太多的修改。

```sh
df.map_partitions(my_custom_func)
```

- 更复杂的map_*函数。有时，你的自定义行为不是难以并行化，而是需要更高级的通讯。例如，可能你需要传输一些数据从一个分区到另一个分区，或者你可能想要构建自定义的聚合。Dask集合也有相关函数。
- 对于更复杂的工作负载，你可能将集合转换为独立的块，然后像使用Dask Delayed一样来管理这些块。每一个集合都有 to_delayed 方法。

函数|用途
--|:--:
[blockwise](https://docs.dask.org/en/latest/array-api.html#dask.array.blockwise)(func, out_ind, \*args[, name, …])|Tensor操作：广义的内部和外部乘积
[groupby.Aggregation](https://docs.dask.org/en/latest/dataframe-api.html#dask.dataframe.groupby.Aggregation)(name, chunk, agg[, finalize])|用户定义的groupby聚合
[map_blocks](https://docs.dask.org/en/latest/array-api.html#dask.array.map_blocks)(func, \*args[, name, token, …])|映射一个方法到dask array中的所有块
[map_overlap](https://docs.dask.org/en/latest/array-overlap.html#dask.array.map_overlap)(x, func, depth[, boundary, trim])|映射一个方法到array的所有块中，有一部分重叠
[map_partitions](https://docs.dask.org/en/latest/dataframe-api.html#dask.dataframe.map_partitions)(func, \*args[, meta, …])|在每个Pandas DataFrame上应用Python方法。
[reduction](https://docs.dask.org/en/latest/array-api.html#dask.array.reduction)(x, chunk, aggregate[, axis, …])|通用版本的规约（reductions）
[rolling.map_overlap](https://docs.dask.org/en/latest/dataframe-api.html#dask.dataframe.rolling.map_overlap)(func, df, before, after, …)|在每个分区上应用方法，临近的分区有共享行

## 不需要使用的时候不要用Dask
在许多工作负载中，通常使用Dask来读取大量数据，减少数据，然后在少量数据上进行迭代。在这个后面的阶段，应该停止使用Dask，开始重新使用普通的Python。

```python
df = dd.read_parquet("lots-of-data-*.parquet")
df = df.groupby('name').mean()  # reduce data significantly 显著减少数据
df = df.compute()               # continue on with Pandas/NumPy 继续使用Panda/Numpy
```

## 尽可能持久化
从内存（RAM）访问数据通常比从磁盘快很多。一旦，你的数据集是干净状态，并且满足：

1. 适合在内存
2. 足够干净，可以用于尝试多种不同的分析

此时适合将数据持久化在内存中

```python
df = dd.read_parquet("lots-of-data-*.parquet")
df = df.fillna(...)  # clean up things lazily
df = df[df.name == 'Alice']  # get down to a more reasonable size
 
df = df.persist()  # trigger computation, persist in distributed RAM
```

注意这只有在分布式机器上是才有意义（否则，正如上面提到的，可能不需要接着使用Dask）。

## 高效存储数据
随着计算能力的增长，你可能会发现数据获取或I/O会占用总体时间的很大比例。此外，并行化计算通常对你如何存储数据增加了更多的限制，通常围绕提供对你数据块的随机访问以及你准备如何计算数据。

例如...

- 对于压缩来说，你可能发现你会放弃gzip、bz2而拥抱更新的系统，例如lz4、snappy以及z-standard，来提供更好的性能以及随机访问。
- 对于存储格式来说，你会发现，你会倾向于对随机访问和源存储进行了优化的自我描述的二进制格式，例如Parquet、ORC、Zarr、HDF5、GeoTIFF等。
- 对于云环境来说，你会发现一些比较早的格式HDF5可能也不太有效
- 你会想要以适合通用查询的方式来分区或者分片数据。在Dask DataFrame，这意味着选择可以快速选择和join的列来进行排序。对Dask dataframe来说，这意味着选择使用访问模型和算法的分片大小。

## 进程和线程
如果你使用Numpy、Pandas、Scikit-Learn、Numba以及其他释放[GIL](https://docs.python.org/3/glossary.html#term-global-interpreter-lock)的库来进行绝大多数数值任务，那么大多数情况下使用线程。如果你处理文本数据或者Python集合例如列表、字典那么大多数为进程。

如果是在大型机器上有大量的线程数（大于10），那么，你可能应该将事情至少拆分为一些进程。面对数据任务，Python在每个进程有十个线程的时候会很高效，但是，50个线程就不行了。

关于线程和进程的更多信息，以及如果在Dask中进行配置，查看[调度器文档](https://docs.dask.org/en/latest/scheduling.html)。

## 使用Dask加载数据
如果你想要在大型Python对象进行工作，那么让Dask来创建他们。我们看到的通常反模式是人们在Dask以外创建大型Python对象，然后将这些对象交给Dask，并且让它来进行管理。这样做是可以的，但是这意味着Dask需要从这些比较大的对象中转移数据及元数据，而不是作为通用的Dask-控制的结果。

下面是一些常用的避免模式，和更好的替代方式：

### DataFrames

```python
# Don't
 
ddf = ... a dask dataframe ...
for fn in filenames:
    df = pandas.read_csv(fn)  # Read locally with Pandas
    ddf = ddf.append(df)            # Give to Dask
```

```python
# Do
 
ddf = dd.read_csv(filenames)
```

### Arrays

```python
# Don't
 
f = h5py.File(...)
x = np.asarray(f["x"])  # Get data as a NumPy array locally
 
x = da.from_array(x)  # Hand NumPy array to Dask
```

```python
# Do
 
f = h5py.File(...)
x = da.from_array(f["x"])  # Let Dask do the reading
```

### Delayed
```python

# Don't
 
@dask.delayed
def process(a, b):
    ...
 
df = pandas.read_csv("some-large-file.csv")  # Create large object locally
results = []
for item in L:
    result = process(item, df)  # include df in every delayed call
    results.append(result)
```

```python
# Do
 
@dask.delayed
def process(a, b):
    ...
 
df = dask.delayed(pandas.read_csv)("some-large-file.csv")  # Let Dask build object
results = []
for item in L:
    result = process(item, df)  # include pointer to df in every delayed call
    results.append(result)
```

## 避免重复计算

在一个dask.compute() 调用中，计算有共享计算的相关结果

```python
# Don't repeatedly call compute
 
df = dd.read_csv("...")
xmin = df.x.min().compute()
xmax = df.x.max().compute()
```

```python
# Do compute multiple results at the same time
 
df = dd.read_csv("...")
 
xmin, xmax = dask.compute(df.x.min(), df.x.max())
```
这允许Dask一次计算共享的计算（例如，上面的 dd.read_csv 调用）而不是每次调用一次 compute。

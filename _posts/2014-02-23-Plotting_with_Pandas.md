---
author: 'Cloga'
comments: true
layout: post
slug: 'plotting_with_pandas'
title: 用Pandas作图
categories:
- Python

tags:
- Pandas
- Python
- Ploting
---

关于Pandas的基本使用介绍，请查看另一篇博文：[Python中的结构化数据分析利器-Pandas简介](http://cloga.info/python/%E6%95%B0%E6%8D%AE%E7%A7%91%E5%AD%A6/2013/09/17/pandas_intro/)

推荐使用ipython的pylab模式，如果要在ipython notebook中嵌入图片，则还需要指定pylab=inline。

```python
ipython --pylab ##ipython的pylab模式
ipython notebook --pylab=inline ##notebook的inline模式
import pandas as pd
```

## 基本画图命令

Pandas通过整合[matplotlib](http://matplotlib.sourceforge.net/)的相关功能实现了基于DataFrame的一些
作图功能。下面的数据是每年美国男女出生数据：

```python
url = 'http://s3.amazonaws.com/assets.datacamp.com/course/dasi/present.txt'
present = pd.read_table(url, sep=' ')
present.shape
```

```
(63, 3)
```

```python
present.columns
```

```
Index([u'year', u'boys', u'girls'], dtype='object')
```

可以看到这个数据集共有63条记录，共有三个字段：Year，boys，girls。为了简化计算将year作为索引。

```python
present_year = present.set_index('year')
```

plot是画图的最主要方法，Series和DataFrame都有plot方法。

可以这样看一下男生出生比例的趋势图：

```python
present_year['boys'].plot()
plt.legend(loc='best')
```

```
<matplotlib.legend.Legend at 0x10b9c7610>
```

![png](/files/Plotting_with_Pandas_files/Plotting_with_Pandas_9_1.png)


这是Series上的plot方法，通过DataFrame的plot方法，你可以将男生和女生出生数量的趋势图画在一起。

```python
present_year.plot()
```

```
<matplotlib.axes.AxesSubplot at 0x108ce4910>
```

![png](/files/Plotting_with_Pandas_files/Plotting_with_Pandas_11_1.png)

```python
present_year.girls.plot(color='g')
present_year.boys.plot(color='b')
plt.legend(loc='best')
```

```
<matplotlib.legend.Legend at 0x10999e510>
```

![png](/files/Plotting_with_Pandas_files/Plotting_with_Pandas_12_1.png)

可以看到DataFrame提供plot方法与在多个Series调用多次plot方法的效果是一致。

```python
present_year[:10].plot(kind='bar')
```

```
<matplotlib.axes.AxesSubplot at 0x10ab31390>
```

![png](/files/Plotting_with_Pandas_files/Plotting_with_Pandas_14_1.png)

plot默认生成是曲线图，你可以通过kind参数生成其他的图形，可选的值为：line, bar, barh, kde, density, scatter。

```python
present_year[:10].plot(kind='bar')
```

```
<matplotlib.axes.AxesSubplot at 0x10bb35890>
```

![png](/files/Plotting_with_Pandas_files/Plotting_with_Pandas_16_1.png)

```python
present_year[:10].plot(kind='barh')
```

```
<matplotlib.axes.AxesSubplot at 0x10eb01890>
```

![png](/files/Plotting_with_Pandas_files/Plotting_with_Pandas_17_1.png)

如果你需要累积的柱状图，则只需要指定stacked=True。

```python
present_year[:10].plot(kind='bar', stacked=True)
```

```
<matplotlib.axes.AxesSubplot at 0x10bbdb3d0>
```

![png](/files/Plotting_with_Pandas_files/Plotting_with_Pandas_19_1.png)

制作相对的累积柱状图，需要一点小技巧。

首先需要计算每一行的汇总值，可以在DataFrame上直接调用sum方法，参数为1，表示计算行的汇总。默认为0，表示计算列的汇总。

```python
present_year.sum(1)[:5]
```

```
year
1940    2360399
1941    2513427
1942    2808996
1943    2936860
1944    2794800
dtype: int64
```

有了每一行的汇总值之后，再用每个元素除以对应行的汇总值就可以得出需要的数据。这里可以使用DataFrame的div函数，同样要指定axis的值为0。

```python
present_year.div(present_year.sum(1),axis=0)[:10].plot(kind='barh', stacked=True)
```

```
<matplotlib.axes.AxesSubplot at 0x113223290>
```

![png](/files/Plotting_with_Pandas_files/Plotting_with_Pandas_23_1.png)

# 散点图和相关
plot也可以画出散点图。使用kind='scatter', x和y指定x轴和y轴使用的字段。

```python
present_year.plot(x='boys', y='girls', kind='scatter')
```

```
<matplotlib.axes.AxesSubplot at 0x1141c9810>
```

![png](/files/Plotting_with_Pandas_files/Plotting_with_Pandas_25_1.png)

再来载入一下鸢尾花数据。

```python
url_2 = 'https://raw.github.com/pydata/pandas/master/pandas/tests/data/iris.csv'
iris = pd.read_csv(url_2)
iris.head(5)
```

<div style="max-height:1000px;max-width:1500px;overflow:auto;">
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>SepalLength</th>
      <th>SepalWidth</th>
      <th>PetalLength</th>
      <th>PetalWidth</th>
      <th>Name</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td> 5.1</td>
      <td> 3.5</td>
      <td> 1.4</td>
      <td> 0.2</td>
      <td> Iris-setosa</td>
    </tr>
    <tr>
      <th>1</th>
      <td> 4.9</td>
      <td> 3.0</td>
      <td> 1.4</td>
      <td> 0.2</td>
      <td> Iris-setosa</td>
    </tr>
    <tr>
      <th>2</th>
      <td> 4.7</td>
      <td> 3.2</td>
      <td> 1.3</td>
      <td> 0.2</td>
      <td> Iris-setosa</td>
    </tr>
    <tr>
      <th>3</th>
      <td> 4.6</td>
      <td> 3.1</td>
      <td> 1.5</td>
      <td> 0.2</td>
      <td> Iris-setosa</td>
    </tr>
    <tr>
      <th>4</th>
      <td> 5.0</td>
      <td> 3.6</td>
      <td> 1.4</td>
      <td> 0.2</td>
      <td> Iris-setosa</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 5 columns</p>
</div>

```python
iris.corr()
```

<div style="max-height:1000px;max-width:1500px;overflow:auto;">
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>SepalLength</th>
      <th>SepalWidth</th>
      <th>PetalLength</th>
      <th>PetalWidth</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>SepalLength</th>
      <td> 1.000000</td>
      <td>-0.109369</td>
      <td> 0.871754</td>
      <td> 0.817954</td>
    </tr>
    <tr>
      <th>SepalWidth</th>
      <td>-0.109369</td>
      <td> 1.000000</td>
      <td>-0.420516</td>
      <td>-0.356544</td>
    </tr>
    <tr>
      <th>PetalLength</th>
      <td> 0.871754</td>
      <td>-0.420516</td>
      <td> 1.000000</td>
      <td> 0.962757</td>
    </tr>
    <tr>
      <th>PetalWidth</th>
      <td> 0.817954</td>
      <td>-0.356544</td>
      <td> 0.962757</td>
      <td> 1.000000</td>
    </tr>
  </tbody>
</table>
<p>4 rows × 4 columns</p>
</div>

```python
from pandas.tools.plotting import scatter_matrix
scatter_matrix(iris, alpha=0.2, figsize=(6, 6), diagonal='kde')
```

```
array([[<matplotlib.axes.AxesSubplot object at 0x1141e5290>,
        <matplotlib.axes.AxesSubplot object at 0x114313610>,
        <matplotlib.axes.AxesSubplot object at 0x11433fbd0>,
        <matplotlib.axes.AxesSubplot object at 0x114328e10>],
       [<matplotlib.axes.AxesSubplot object at 0x11411f350>,
        <matplotlib.axes.AxesSubplot object at 0x114198690>,
        <matplotlib.axes.AxesSubplot object at 0x114181b90>,
        <matplotlib.axes.AxesSubplot object at 0x11436eb90>],
       [<matplotlib.axes.AxesSubplot object at 0x11438ced0>,
        <matplotlib.axes.AxesSubplot object at 0x114378310>,
        <matplotlib.axes.AxesSubplot object at 0x1143e34d0>,
        <matplotlib.axes.AxesSubplot object at 0x114d0a810>],
       [<matplotlib.axes.AxesSubplot object at 0x1143ecd50>,
        <matplotlib.axes.AxesSubplot object at 0x114d40e90>,
        <matplotlib.axes.AxesSubplot object at 0x114d63210>,
        <matplotlib.axes.AxesSubplot object at 0x114d4a2d0>]], dtype=object)
```

![png](/files/Plotting_with_Pandas_files/Plotting_with_Pandas_29_1.png)

# 箱图
DataFrame提供了boxplot方法可以用来画箱图。

```python
iris.boxplot()
```

```
{'boxes': [<matplotlib.lines.Line2D at 0x1141439d0>,
  <matplotlib.lines.Line2D at 0x11416c1d0>,
  <matplotlib.lines.Line2D at 0x1141559d0>,
  <matplotlib.lines.Line2D at 0x11414b210>],
 'caps': [<matplotlib.lines.Line2D at 0x11416af90>,
  <matplotlib.lines.Line2D at 0x1141434d0>,
  <matplotlib.lines.Line2D at 0x114172790>,
  <matplotlib.lines.Line2D at 0x114172c90>,
  <matplotlib.lines.Line2D at 0x114153f90>,
  <matplotlib.lines.Line2D at 0x1141554d0>,
  <matplotlib.lines.Line2D at 0x11414f7d0>,
  <matplotlib.lines.Line2D at 0x11414fcd0>],
 'fliers': [<matplotlib.lines.Line2D at 0x114145410>,
  <matplotlib.lines.Line2D at 0x114145b50>,
  <matplotlib.lines.Line2D at 0x11416cbd0>,
  <matplotlib.lines.Line2D at 0x1141530d0>,
  <matplotlib.lines.Line2D at 0x114151410>,
  <matplotlib.lines.Line2D at 0x114151b90>,
  <matplotlib.lines.Line2D at 0x11414bc10>,
  <matplotlib.lines.Line2D at 0x1141743d0>],
 'medians': [<matplotlib.lines.Line2D at 0x114143ed0>,
  <matplotlib.lines.Line2D at 0x11416c6d0>,
  <matplotlib.lines.Line2D at 0x114155ed0>,
  <matplotlib.lines.Line2D at 0x11414b710>],
 'whiskers': [<matplotlib.lines.Line2D at 0x11416a7d0>,
  <matplotlib.lines.Line2D at 0x11416aa10>,
  <matplotlib.lines.Line2D at 0x114172050>,
  <matplotlib.lines.Line2D at 0x114172290>,
  <matplotlib.lines.Line2D at 0x114153590>,
  <matplotlib.lines.Line2D at 0x114153a90>,
  <matplotlib.lines.Line2D at 0x11414f090>,
  <matplotlib.lines.Line2D at 0x11414f2d0>]}
```

![png](/files/Plotting_with_Pandas_files/Plotting_with_Pandas_31_1.png)

通过by参数可以计算不同分组情况下，各个字段的箱图。

```python
iris.boxplot(by='Name', figsize=(8, 8))
```

```
array([[<matplotlib.axes.AxesSubplot object at 0x120dd8f50>,
        <matplotlib.axes.AxesSubplot object at 0x1218d3410>],
       [<matplotlib.axes.AxesSubplot object at 0x1218f47d0>,
        <matplotlib.axes.AxesSubplot object at 0x1218de490>]], dtype=object)
```

![png](/files/Plotting_with_Pandas_files/Plotting_with_Pandas_33_1.png)

# 直方图和概率密度分布

```python
iris.ix[:,:-1].hist()
iris.plot(kind='kde')
```

```
<matplotlib.axes.AxesSubplot at 0x117263890>
```

![png](/files/Plotting_with_Pandas_files/Plotting_with_Pandas_35_1.png)

![png](/files/Plotting_with_Pandas_files/Plotting_with_Pandas_35_2.png)

# 多变量的可视化

Radviz

```python
from pandas.tools.plotting import radviz
radviz(iris, 'Name')
```

```
<matplotlib.axes.AxesSubplot at 0x11412e550>
```

![png](/files/Plotting_with_Pandas_files/Plotting_with_Pandas_38_1.png)

Andrews Curves

```python
from pandas.tools.plotting import andrews_curves
andrews_curves(iris, 'Name')
```

```
<matplotlib.axes.AxesSubplot at 0x1218e2d50>
```

![png](/files/Plotting_with_Pandas_files/Plotting_with_Pandas_40_1.png)

Parallel Coordinates

```python
from pandas.tools.plotting import parallel_coordinates
parallel_coordinates(iris, 'Name')
```

```
<matplotlib.axes.AxesSubplot at 0x1224b36d0>
```

![png](/files/Plotting_with_Pandas_files/Plotting_with_Pandas_42_1.png)

你也可以查看本文的ipython notebook版本：http://nbviewer.ipython.org/gist/cloga/9171281

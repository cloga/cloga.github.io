---
author: 'Cloga'
comments: true
date: 2013-09-03 00:24:03+00:00
layout: post
slug: 'networkxintro'
title: 复杂网络程序包NetworkX简介
wordpress_id: 2006
categories:
- Python
- SNA
tags:
- networkx
- 复杂网络
---

[NetworkX](http://networkx.github.io/)是Python中的一个复杂网络的程序包。从其[文档手册](http://networkx.github.com/documentation/latest/_downloads/networkx_reference.pdf)中可以看到，它提供以下功能：从多种数据源读写图；支持图的线性代数计算；基础的绘图功能；经典的复杂网络算法等。

在Python中引入networkx：

```python
import networkx as nx
```
nx是官方推荐的缩写方式，当然你也可以使用networkx的全拼

NetworkX中支持四种图。按照边是否有方向，两个节点间是否允许多条边两个维度，分为Graph（无向图），MultiGrpah（复合无向图），DiGrpah（有向图），MultiDiGraph（复合有向图）。

```python
G = nx.Graph()
G = nx.DiGraph()
G = nx.MultiGraph()
G = nx.MultiDiGraph()
```
以上就是创建四类图的示例。在networkx中Graph是基本的数据结构，networkx提供的许多方式的input或output都是Graph。以下的示例都以无向图为例。<!-- more -->

在networkx中，Graph是一堆节点与边的组合。 Graph内部使用的是嵌套的字典来表示节点间的关系。我们可以通过add_node和add_edge来添加节点与边。如果通过add_edge添加了不存在的node，那么这个networkx会自动添加这个node。

```python 
G.add_edge('A','B')
G.add_edge('B','C')
G.add_node('D')
```
以上就构建了有四个节点，两条边的无向图。通过adj属性，可以看到networkx中对这个图的表示。

```python
    G.adj

    {'A': {'B': {'color': 'red', 'weight': 0.84, 'size': 300}}, 'C': {'B': {}}, 'B': {'A': {'color': 'red', 'weight': 0.84, 'size': 300}, 'C': {}}, 'D': {}}
```

可以看到第一层的字典的key是每个节点，value则是与其相邻的节点，第二层的字典的key是临近节点，value是edge的属性，同样也是一个字典。

networkx也提供了批量添加node和edge的方法。

```python
G.add_nodes_from('ABCD')
G.add_edges_from([('A','B'),('B','C')])
```

以上两行命令就为G添加4个节点和两条边，批量添加时参数需为可循环的元素，比如字符串，列表等。

除了基本的属性外，节点和边也可以指定其他的属性，比如指定节点的大小、颜色和位置，边的权重颜色等，这些属性主要是用于网络图。

属性既可以在添加节点和边时指定，也可以在添加了节点和边之后再单独指定。

```python 
G.add_node('E',color='red',size=10)
    
G.add_node('E')
G.node['E']['color']='red'
G.node['E']['size']=10
```

以上的两种方式都会为G添加E节点，并为E节点添加两个属性color和size。同理也可以为边增加任意的属性。

NetworkX也提供了复杂网络的重要指标的计算，比如每个节点的度，出度，入度，度中心性，图的直径等等，[networkx支持的完整指标列表](http://networkx.github.io/documentation/development/reference/algorithms.html)。

```python    
nx.number_of_nodes(G)##节点数
nx.number_of_edges(G)##边数
nx.betweenness_centrality(G)##返回每个节点的中介中心性
nx.degree(G)##返回每个节点的度
```

除了这些复杂网络的基本指标之外， networkx还提供[布局（layout）](http://networkx.github.io/documentation/development/reference/drawing.html)的计算。

```python    
pos = nx.spring_layout(G)
```

以上就可以为G计算spring布局时每个节点的位置，返回的是一个字典，Key是节点的标识符，Value是一个元组，元素是X轴和Y轴对应的坐标。

Networkx提供了与多种数据源进行交互的方式，比如，我们可以将networkx中的图输出为不同格式的数据，比如JSON，GEXF等等。

```python    
nx.write_gexf(G, "test.gexf")
```

GEXF是Gephi的文件支持，并可以直接用于Sigma.js，市面上的社交网络传播图多数都是用这个可视化框架。

NetworkX自身也提供一些简单的可视化功能，参见文档的[Drawing](http://networkx.github.io/documentation/development/reference/drawing.html)部分。NetworkX的官方应用样例请参考[gallery](http://networkx.github.io/documentation/latest/gallery.html)。

PS : Wunderman|Agenda的PMC Team正在不断壮大，如果您对Digital Analytics感兴趣，欢迎与我联系（Base在北京）。

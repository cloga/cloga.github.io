---
author: admin
comments: true
date: 2013-11-30 13:28:09+00:00
layout: post
slug: '%e5%85%b3%e4%ba%8epython%e4%bd%a0%e4%b8%8d%e5%8f%af%e4%b8%8d%e7%9f%a5%e7%9a%84%e5%87%a0%e4%bb%b6%e4%ba%8b'
title: 关于Python你不可不知的几件事
wordpress_id: 2091
categories:
- Python
- 数据科学
tags:
- Python
---

这是一篇写给不了解Python或者刚接触Python新手的Python软文。Python老鸟请自觉忽略。

1、Python名字的由来

Python是由Guido van Rossum创建的一门语言，Python是大蟒蛇的意思，之所以使用Python这个名字是因为他是一个叫Monty Python的喜剧团体的爱好者。另一个彩蛋是Python的程序包叫Egg，蟒蛇下的蛋。

2、Python版本的选择

Python目前有python3.3.4和python2.7.6（我印象中之前官网上的说明是2.7.5是最后一个python2.7结果osx10.9发布后没多久，就又发布了2.7.6），尽管Python3.3.4与Python2.7.6相比有许多优化，但是由于需要包目前都是基于Python2的版本，比如众多科学计算的包都是基于Python2，因此，建议以Python2.7.6作为首选。<!-- more -->

3、Python的环境变量

要运行python程序，除了安装python的程序要还要设置环境变量（我的电脑>属性>高级设置>环境变量），添加Path=你的python安装路径

4、Python的包管理器

安装Python的程序的最便捷方式就是使用Python的包管理器Pip或者Easy_install，二者之间可以互相替代，不过有的包可能只能用二者之一进行安装，如果安装失败，请尝试另一种方式。

5、对于无法用pip或easy_install安装python包你有更多的选择

Windows用户可以看一下[http://www.lfd.uci.edu/~gohlke/pythonlibs/](http://www.lfd.uci.edu/~gohlke/pythonlibs/)，页面的主人提供了大部分知名python包的exe版本，直接下载安装即可。

Mac用户可以用Macport，其中也提供了大部分python程序的快捷安装方式。

6、Python的编辑器选择

编辑器之争是个永恒的话题，由于本人不是程序员，日常用python是做一些数据分析相关的工作，因此，推荐使用ipython这个交互的python编程环境（安装请使用pip install ipython）进行代码运行调试，编辑python代码可以使用任意的文本编辑器，只要支持Python的语法提示高亮即可，比如nodepad++，sublime text2；此外，也可以尝试[Enhance Canopy](https://www.enthought.com/products/canopy/)或者[Pythonxy](https://code.google.com/p/pythonxy/)，这两个都是python的集成编程环境，包含了科学计算相关的包。

7、Python的数据分析工具

DataFrame是R的基本数据结构，在处理结构化数据方面非常方便，Python的数据分析包Pandas从R中学习了这个数据结构，并提供了更加Pythonic的语法来进行数据分析，Pandas的逐渐成熟促进了Python在数据分析领域方面应用的发展，因此，掌握了Pandas就也可以在Pandas中使用与R中类似的DataFrame。

Pandas的底层是Numpy是用于多维数组运算的科学计算Python包，此外，还有matplotlib这类二维的图表展现的包。

8、Python的一些便捷语法



	
  * list comprehension（列表推导）


如果我们有一个列表（一组元素），想要对这个列表中的元素进行一定的操作生成新的列表，这个过程就是列表推导（在python2.7中dict和set也支持推导）。其基本的语法形式为：










    
    [expr for val in collection if condition]














	
  * 匿名函数


Python提供了lambda函数，可以用于那些只使用一次的临时函数的定义，其基本的语法形式为：

    
    lambda augs : return values





	
  * Map和Reduce方法


map方法对一个序列的每个元素运行一个函数，并将结果作为一个列表返回。比如，下面的两行代码结合Lambda函数与map方法将l中的每个元素都增加了1。

    
    l = [1,2,3]
    l_add_1 = map(lambda x : x+1,l)


Reduce方法对一个序列的每个元素顺序运行一个函数，前一次运行的结果会作为后一次运行结果的输入，返回的单一一个结果。比如，下面这一行代码就可以将计算l中元素的连加和。

    
     l_sum = reduce(lambda x,y : x+ y,l)


希望有更多的非技术出身的小伙伴可以了解并投入Python编程的行列。

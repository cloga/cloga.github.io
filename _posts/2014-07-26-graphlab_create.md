---
author: cloga
comments: true
layout: post
slug: Graphlab Create
title: 用Graphlab Create构建简易的推荐引擎
categories:
- Graphlab Create
tags:
- Graphlab Create
- recommendation system

---
# Graphlab Create简介
[Graphlab Create](http://graphlab.com/products/create/)是基于图形数据库的数据挖掘工具，底层是由C++编写
以保证最佳性能，同时提供了一个Python接口。

##数据结构

- SFrame：类似于Pandas及R的DataFrame，是由行列构成的表格化数据结构。
- SArray：与Pandas的Series类似的数组结构
- SGraph：Graphlab特有的数据结构，类似于NetWorkx的Graph，由节点和边构成

此外，Graphlab Create对Pandas提供了很好的支持，可以直接读取Pandas的DataFrame来构建模型。

##支持的数据挖掘算法

- recommender：用于构建推荐引擎
- graph_analytics：用于进行网络分析，比如团体发现，寻找有影响力的个体或者虚假交易
- clustering：目前支持K-Means聚类
- regression：目前支持线性回归
- classification：目前支持SVM
- text：文本挖掘模型，目前支持主题模型

这里主要为大家介绍一下如何用Graphlab
Create构建一个推荐引擎，其他的算法其实在其他的Python包里都有很好的支持。比如聚类回归判别这类常规的数据挖掘算法Sklearn也提供了丰富的方法，Graphlab
Create的优势在于性能及可扩展性；对于Graph Analytics而言，networkx也已经给出了全面的算法支持；而主题模型则有gensim。

#用Graphlab Create创建推荐引擎

我这里使用的数据是豆瓣的电影数据，最近刚好与豆瓣的项目有合作，拿到了一部分匿名用户的电影偏好数据。

##数据清洗

```python
import graphlab as gl
import pandas as pd
import numpy as np
movie_data = pd.read_csv('movie_info_v2_gb18030.csv', encoding='gb18030', error_bad_lines=False, warn_bad_lines=True)
```

这部分数据是电影属性数据。

```python
movie_user_data = pd.read_csv('beetle_user_movie_v2_gb18030.csv', encoding='gb18030', error_bad_lines=False, warn_bad_lines=True)
movie_user_data.info()
```

```
<class 'pandas.core.frame.DataFrame'>
Int64Index: 1405556 entries, 0 to 1405555
Data columns (total 6 columns):
用户编号     1405556 non-null int64
 电影ID    1405556 non-null int64
 电影名称    1405556 non-null object
 电影连接    1405556 non-null object
 用户状态    1405556 non-null object
 用户评分    1405556 non-null object
dtypes: int64(2), object(4)
```

这部分数据是电影的偏好数据。

```python
movie_url_id = movie_user_data.drop_duplicates(cols=[u' 电影ID', u' 电影连接'])
movie_data = pd.merge(movie_data, movie_url_id, left_on=u'连接', right_on=u' 电影连接')
movie_data[u' 电影ID'] = movie_data[u' 电影ID'].astype(str)
movie_data.info()
```

```
<class 'pandas.core.frame.DataFrame'>
Int64Index: 52660 entries, 0 to 52659
Data columns (total 15 columns):
片名       52660 non-null object
连接       52660 non-null object
类型       44974 non-null object
国家       52333 non-null object
年份       48303 non-null object
主演       44064 non-null object
导演       50367 non-null object
编剧       36671 non-null object
片长       37592 non-null object
用户编号     52660 non-null int64
 电影ID    52660 non-null object
 电影名称    52660 non-null object
 电影连接    52660 non-null object
 用户状态    52660 non-null object
 用户评分    52660 non-null object
dtypes: int64(1), object(14)
```

```python
movie_rate_data = movie_user_data[[u' 电影ID', u'用户编号', u' 用户评分']]
movie_rate_data.columns = [u'movie_id', u'uid', u'rating']
movie_rate_data.info()
```

```
<class 'pandas.core.frame.DataFrame'>
Int64Index: 1405556 entries, 0 to 1405555
Data columns (total 3 columns):
movie_id    1405556 non-null int64
uid         1405556 non-null int64
rating      1405556 non-null object
dtypes: int64(2), object(1)
```


首先我将电影的偏好数据进行了处理只保留的了电影ID，用户ID及对应的用户偏好分数。简单来说就是人与物的关系，这是构建推荐引擎最基础的数据。

```python
movie_rate_data[u'rating'].ix[movie_rate_data[u'rating']=='None'] = np.nan
movie_rate_data[u'rating'].ix[movie_rate_data[u'rating']=='0'] = np.nan
movie_rate_data = movie_rate_data.ix[~movie_rate_data[u'rating'].isnull()].reset_index(drop=True)
movie_rate_data.info()
```

```
<class 'pandas.core.frame.DataFrame'>
Int64Index: 712200 entries, 0 to 712199
Data columns (total 3 columns):
movie_id    712200 non-null int64
uid         712200 non-null int64
rating      712200 non-null object
dtypes: int64(2), object(1)
```

由于不是每个用户对每一部关注的电影都会评分，因此有一些评分数据是空的，这部分数据对我们来说是没用，这里直接将这些数据删除。

```python
movie_rate_data['movie_id'] = movie_rate_data['movie_id'].astype(str)
movie_rate_data['uid'] = movie_rate_data['uid'].astype(str)
movie_rate_data['rating'] = movie_rate_data['rating'].astype(int)
```

这里对数据的类型进行了处理，将用户及物品标识处理为字符，而评分处理为整数。

##将数据读入Graphlab Create

以上的数据操作都是在Pandas中进行，数据的最终形式是Pandas的DataFrame，接下来将数据读入Graphlab Create。

上面的介绍中提到Graphlab Create是基于图形数据库的，这也就是为什么会叫做Graphlab，图形数据库是No
SQL的一种将数据结构抽象用节点与节点之间的关系（边）来表示的图形。

具体到这里的任务，每个电影与用户都是一个个的节点，而电影与用户直接的关系就是用户对电影的评分。

```python
g = gl.SGraph().add_edges(movie_rate_data, dst_field='uid', src_field='movie_id')
g = g.add_edges(movie_rate_data, src_field='uid', dst_field='movie_id')
```


按照Graphlab Create的Sample代码，通过以上两句代码就可以将DataFrame转化SGraph。这里Graphlab
Create似乎使用的是有向图，因此需要添加两次不同方向的边。

转化为图形之后，我们就可以用Graphlab Create提供的一些图形分析方法对数据进行分析，比如下面我们通过pagerank，找出热门的影片。

```python
pr = gl.pagerank.create(g, max_iterations=10)
stats = pr['pagerank']
stats
```

```
Columns:
	__id	str
	pagerank	float

Rows: 34004

Data:
       __id  pagerank
0  10001444  0.179899
1      1005  9.820545
2  10060293  0.175111
3  10199330  0.215555
4  10332552  0.287221
5  10344747  0.221428
6      1035  3.849069
7  10355329  0.539630
8  10429695  0.530874
...
[34004 rows x 2 columns]
```

```python
stats_pr = stats.to_dataframe()
stats_pr.dtypes
```

```
__id         object
pagerank    float64
dtype: object
```

```python
pd.merge(stats_pr, movie_data, left_on=u'__id', right_on=u' 电影ID').sort('pagerank', ascending=False).head()
```



<div style="max-height:1000px;max-width:1500px;overflow:auto;">
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>__id</th>
      <th>pagerank</th>
      <th>片名</th>
      <th>连接</th>
      <th>类型</th>
      <th>国家</th>
      <th>年份</th>
      <th>主演</th>
      <th>导演</th>
      <th>编剧</th>
      <th>片长</th>
      <th>用户编号</th>
      <th> 电影ID</th>
      <th> 电影名称</th>
      <th> 电影连接</th>
      <th> 用户状态</th>
      <th> 用户评分</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>7899 </th>
      <td>  1295644</td>
      <td> 27.960225</td>
      <td>                     Léon</td>
      <td>  http://movie.douban.com/subject/1295644/</td>
      <td>    犯罪、剧情、惊悚</td>
      <td>    法国</td>
      <td> 1994</td>
      <td>                让·雷诺、娜塔莉·波特曼、加里·奥德曼、丹尼·爱罗、麦温·勒·贝斯柯</td>
      <td>    吕克·贝松</td>
      <td>          吕克·贝松</td>
      <td> 110 分钟</td>
      <td> 2</td>
      <td>  1295644</td>
      <td>                     Léon</td>
      <td>  http://movie.douban.com/subject/1295644/</td>
      <td> 看过</td>
      <td>    5</td>
    </tr>
    <tr>
      <th>5510 </th>
      <td>  1929463</td>
      <td> 26.480632</td>
      <td>               Life of Pi</td>
      <td>  http://movie.douban.com/subject/1929463/</td>
      <td>    剧情、奇幻、冒险</td>
      <td>    美国</td>
      <td> 2012</td>
      <td> 苏拉·沙玛、拉菲·斯波、伊尔凡·可汗、杰拉尔·德帕迪约、塔布、阿迪勒·侯赛因、阿尤什·坦东、...</td>
      <td>       李安</td>
      <td>    扬·马特尔、大卫·麦基</td>
      <td>  127分钟</td>
      <td> 2</td>
      <td>  1929463</td>
      <td>               Life of Pi</td>
      <td>  http://movie.douban.com/subject/1929463/</td>
      <td> 看过</td>
      <td>    5</td>
    </tr>
    <tr>
      <th>18058</th>
      <td>  3541415</td>
      <td> 26.400179</td>
      <td>                Inception</td>
      <td>  http://movie.douban.com/subject/3541415/</td>
      <td> 动作、科幻、悬疑、冒险</td>
      <td> 美国、英国</td>
      <td> 2010</td>
      <td> 莱昂纳多·迪卡普里奥、约瑟夫·高登-莱维特、艾伦·佩吉、渡边谦、汤姆·哈迪、迪利普·劳、玛丽...</td>
      <td> 克里斯托弗·诺兰</td>
      <td>       克里斯托弗·诺兰</td>
      <td>  148分钟</td>
      <td> 2</td>
      <td>  3541415</td>
      <td>                Inception</td>
      <td>  http://movie.douban.com/subject/3541415/</td>
      <td> 看过</td>
      <td>    5</td>
    </tr>
    <tr>
      <th>22812</th>
      <td> 10574622</td>
      <td> 25.470634</td>
      <td>                  人再囧途之泰囧</td>
      <td> http://movie.douban.com/subject/10574622/</td>
      <td>          喜剧</td>
      <td>  中国大陆</td>
      <td> 2012</td>
      <td>                               徐峥、王宝强、黄渤、陶虹、谢楠、范冰冰</td>
      <td>       徐峥</td>
      <td>       徐峥、丁丁、束焕</td>
      <td>  105分钟</td>
      <td> 2</td>
      <td> 10574622</td>
      <td>                  人再囧途之泰囧</td>
      <td> http://movie.douban.com/subject/10574622/</td>
      <td> 看过</td>
      <td>    4</td>
    </tr>
    <tr>
      <th>19130</th>
      <td>  1292052</td>
      <td> 25.349502</td>
      <td> The Shawshank Redemption</td>
      <td>  http://movie.douban.com/subject/1292052/</td>
      <td>       犯罪、剧情</td>
      <td>    美国</td>
      <td> 1994</td>
      <td>                蒂姆·罗宾斯、摩根·弗里曼、鲍勃·冈顿、威廉姆·赛德勒、克兰西·布朗</td>
      <td> 弗兰克·德拉邦特</td>
      <td> 弗兰克·德拉邦特、斯蒂芬·金</td>
      <td> 142 分钟</td>
      <td> 2</td>
      <td>  1292052</td>
      <td> The Shawshank Redemption</td>
      <td>  http://movie.douban.com/subject/1292052/</td>
      <td> 看过</td>
      <td> None</td>
    </tr>
  </tbody>
</table>
</div>



其实这个结果和简单的value_counts结果一致，因为我们数据不是复杂的关系，人与人之间，电影与电影之前其实不存在直接的关系，只是用图形数据库进行了存储，用
微博的关注数据，应该可以找到更有趣的结果。

##创建推荐引擎

```python
m = gl.recommender.create(movie_rate_data, 'uid', 'movie_id', 'rating')
m
```


```
MatrixFactorizationModel

Schema
  user column:   uid
  item column:   movie_id
  target column: rating

Statistics
  Training set:          712200 obs        2465 users       31539 items

Training summary
  training time:       11.938670s
  training_rmse:       0.614150316577

Settings
  sgd step size:         0.048828125                   
  regularization:        0.0001                        
  optimization method:   sgd                           
  sgd convergence threshold: 0.001                         
  step size decrease rate: 0.75                          
  nmf:                   0                             
  binary targets:        0                             
  sgd trial sample size: 10000                         
  sgd convergence interval: 8                             
  n factors:             8                             
  linear regularization: 0                             
  init random sigma:     0.001                         
  max iterations:        50                            
```


只用一行代码我们就构建了推荐引擎，看一下相关的性能数据，我们使用了71W的数据，来自2465个用户，评论了3W+的物品，训练的时间为12s不到，还是相当给力的。

接下来让我们实际做几个推荐看一下。

```python
movie_user_data.info()
```

```
<class 'pandas.core.frame.DataFrame'>
Int64Index: 1405556 entries, 0 to 1405555
Data columns (total 6 columns):
用户编号     1405556 non-null int64
 电影ID    1405556 non-null int64
 电影名称    1405556 non-null object
 电影连接    1405556 non-null object
 用户状态    1405556 non-null object
 用户评分    1405556 non-null object
dtypes: int64(2), object(4)
```

```python
movie_user_data[u'用户编号'].value_counts().head()
```

```
2621    15580
2733     8366
2378     7445
851      7104
2387     6605
dtype: int64
```



我挑选了观看电影较多的用户。

```python
m.recommend(users=['2621'])
```

```
Columns:
	uid	str
	movie_id	str
	score	float
	rank	int

Rows: 10

Data:
    uid  movie_id     score  rank
0  2621   1299932  6.707543     1
1  2621   1310179  6.474720     2
2  2621   1303418  6.424343     3
3  2621   1295287  6.415932     4
4  2621   3713664  6.401849     5
5  2621   2216966  6.384994     6
6  2621   2224447  6.354351     7
7  2621  10558405  6.261696     8
8  2621   3188272  6.260818     9
[10 rows x 4 columns]
```


```python
pd.merge(m.recommend(users=['2621']).to_dataframe(), movie_data , left_on='movie_id',right_on=u' 电影ID').head()
```



<div style="max-height:1000px;max-width:1500px;overflow:auto;">
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>uid</th>
      <th>movie_id</th>
      <th>score</th>
      <th>rank</th>
      <th>片名</th>
      <th>连接</th>
      <th>类型</th>
      <th>国家</th>
      <th>年份</th>
      <th>主演</th>
      <th>导演</th>
      <th>编剧</th>
      <th>片长</th>
      <th>用户编号</th>
      <th> 电影ID</th>
      <th> 电影名称</th>
      <th> 电影连接</th>
      <th> 用户状态</th>
      <th> 用户评分</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td> 2621</td>
      <td> 1299932</td>
      <td> 6.707543</td>
      <td> 1</td>
      <td>                            Le salaire de la peur</td>
      <td> http://movie.douban.com/subject/1299932/</td>
      <td>       剧情、惊悚</td>
      <td> 法国、意大利</td>
      <td> 1953</td>
      <td>           伊夫·蒙当、查尔斯·文恩、彼得·范·埃克、Folco Lulli、薇拉·克劳佐</td>
      <td>                                         亨利-乔治·克鲁佐</td>
      <td>                      亨利-乔治·克鲁佐、Jér?me Géronimi</td>
      <td>                                 131 分钟</td>
      <td>  34</td>
      <td> 1299932</td>
      <td>                            Le salaire de la peur</td>
      <td> http://movie.douban.com/subject/1299932/</td>
      <td> 想看</td>
      <td> None</td>
    </tr>
    <tr>
      <th>1</th>
      <td> 2621</td>
      <td> 1310179</td>
      <td> 6.474720</td>
      <td> 2</td>
      <td>                                         Fantasia</td>
      <td> http://movie.douban.com/subject/1310179/</td>
      <td> 动画、家庭、奇幻、音乐</td>
      <td>     美国</td>
      <td> 1940</td>
      <td> 华特·迪斯尼、列奥波德·斯托科夫斯基、Deems Taylor、Corey Burton、J...</td>
      <td> 詹姆斯·阿尔格、福特·毕比、Samuel Armstrong、Norman Ferguson...</td>
      <td> Lee Blair、Elmer Plummer、Sylvia Moberly-Holland</td>
      <td> USA: 124 分钟(restored roadshow version)</td>
      <td>  47</td>
      <td> 1310179</td>
      <td>                                         Fantasia</td>
      <td> http://movie.douban.com/subject/1310179/</td>
      <td> 看过</td>
      <td> None</td>
    </tr>
    <tr>
      <th>2</th>
      <td> 2621</td>
      <td> 1303418</td>
      <td> 6.424343</td>
      <td> 3</td>
      <td>                               To Be or Not to Be</td>
      <td> http://movie.douban.com/subject/1303418/</td>
      <td>       喜剧、战争</td>
      <td>     美国</td>
      <td> 1942</td>
      <td>           卡洛·朗白、杰克·本尼、罗伯特·斯塔克、菲利克斯·布雷萨特、莱昂内尔·阿特威尔</td>
      <td>                                           恩斯特·刘别谦</td>
      <td>    Edwin Justus Mayer、Melchior Lengyel、恩斯特·刘别谦</td>
      <td>                                  99 分钟</td>
      <td>  32</td>
      <td> 1303418</td>
      <td>                               To Be or Not to Be</td>
      <td> http://movie.douban.com/subject/1303418/</td>
      <td> 想看</td>
      <td> None</td>
    </tr>
    <tr>
      <th>3</th>
      <td> 2621</td>
      <td> 1295287</td>
      <td> 6.415932</td>
      <td> 4</td>
      <td> Intolerance: Love's Struggle Throughout the Ages</td>
      <td> http://movie.douban.com/subject/1295287/</td>
      <td>    剧情、历史、爱情</td>
      <td>     美国</td>
      <td> 1916</td>
      <td>                           梅·马什、罗伯特·哈伦、F.A. Turner</td>
      <td>                                          D·W·格里菲斯</td>
      <td>      Anita Loos、Hettie Grey Baker、D·W·格里菲斯、惠特曼</td>
      <td>                                 163 分钟</td>
      <td>  60</td>
      <td> 1295287</td>
      <td> Intolerance: Love's Struggle Throughout the Ages</td>
      <td> http://movie.douban.com/subject/1295287/</td>
      <td> 看过</td>
      <td>    5</td>
    </tr>
    <tr>
      <th>4</th>
      <td> 2621</td>
      <td> 3713664</td>
      <td> 6.401849</td>
      <td> 5</td>
      <td>                                          一寸河山一寸血</td>
      <td> http://movie.douban.com/subject/3713664/</td>
      <td>         纪录片</td>
      <td>     台湾</td>
      <td> 1997</td>
      <td>                                               NaN</td>
      <td>                                           陈君天、刘侃如</td>
      <td>                                            NaN</td>
      <td>                                    42集</td>
      <td> 230</td>
      <td> 3713664</td>
      <td>                                          一寸河山一寸血</td>
      <td> http://movie.douban.com/subject/3713664/</td>
      <td> 想看</td>
      <td> None</td>
    </tr>
  </tbody>
</table>
</div>



```python
pd.merge(m.recommend(users=['2387']).to_dataframe(), movie_data , left_on='movie_id',right_on=u' 电影ID').head()
```



<div style="max-height:1000px;max-width:1500px;overflow:auto;">
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>uid</th>
      <th>movie_id</th>
      <th>score</th>
      <th>rank</th>
      <th>片名</th>
      <th>连接</th>
      <th>类型</th>
      <th>国家</th>
      <th>年份</th>
      <th>主演</th>
      <th>导演</th>
      <th>编剧</th>
      <th>片长</th>
      <th>用户编号</th>
      <th> 电影ID</th>
      <th> 电影名称</th>
      <th> 电影连接</th>
      <th> 用户状态</th>
      <th> 用户评分</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td> 2387</td>
      <td> 24891524</td>
      <td> 7.613149</td>
      <td> 1</td>
      <td>                                         5月天诺亚方舟</td>
      <td> http://movie.douban.com/subject/24891524/</td>
      <td>   纪录片、音乐</td>
      <td> 台湾</td>
      <td> 2013</td>
      <td>                   陈信宏、刘冠佑、言承旭、林依晨、林晖闵、温尚翊、蔡升晏、石锦航</td>
      <td>             刘名峰</td>
      <td>                               陈信宏、黄中平</td>
      <td> 114分钟</td>
      <td>  35</td>
      <td> 24891524</td>
      <td>                                         5月天诺亚方舟</td>
      <td> http://movie.douban.com/subject/24891524/</td>
      <td> 看过</td>
      <td>    5</td>
    </tr>
    <tr>
      <th>1</th>
      <td> 2387</td>
      <td>  1294132</td>
      <td> 6.223292</td>
      <td> 2</td>
      <td> Wallace &amp; Gromit: The Best of Aardman Animation</td>
      <td>  http://movie.douban.com/subject/1294132/</td>
      <td> 动画、喜剧、家庭</td>
      <td> 英国</td>
      <td> 1996</td>
      <td>                                               NaN</td>
      <td>           尼克·帕克</td>
      <td>                                   NaN</td>
      <td>   NaN</td>
      <td>  47</td>
      <td>  1294132</td>
      <td> Wallace &amp; Gromit: The Best of Aardman Animation</td>
      <td>  http://movie.douban.com/subject/1294132/</td>
      <td> 看过</td>
      <td> None</td>
    </tr>
    <tr>
      <th>2</th>
      <td> 2387</td>
      <td> 25800837</td>
      <td> 6.200432</td>
      <td> 3</td>
      <td>                                  Gangsta Granny</td>
      <td> http://movie.douban.com/subject/25800837/</td>
      <td>    剧情、喜剧</td>
      <td> 英国</td>
      <td> 2013</td>
      <td> India Ria Amarteifio、Tim Bentinck、Miranda Hart...</td>
      <td>     Matt Lipsey</td>
      <td> Kevin Cecil、Andy Riley、David Walliams</td>
      <td>  68分钟</td>
      <td>  55</td>
      <td> 25800837</td>
      <td>                                  Gangsta Granny</td>
      <td> http://movie.douban.com/subject/25800837/</td>
      <td> 看过</td>
      <td>    4</td>
    </tr>
    <tr>
      <th>3</th>
      <td> 2387</td>
      <td>  1926142</td>
      <td> 6.180763</td>
      <td> 4</td>
      <td>                                  Ashes and Snow</td>
      <td>  http://movie.douban.com/subject/1926142/</td>
      <td>   纪录片、剧情</td>
      <td> 美国</td>
      <td> 2005</td>
      <td>                      劳伦斯·菲什伯恩、让娜·莫罗、Enrique Rocha</td>
      <td> Gregory Colbert</td>
      <td>                       Gregory Colbert</td>
      <td>  63分钟</td>
      <td>  16</td>
      <td>  1926142</td>
      <td>                                  Ashes and Snow</td>
      <td>  http://movie.douban.com/subject/1926142/</td>
      <td> 看过</td>
      <td>    4</td>
    </tr>
    <tr>
      <th>4</th>
      <td> 2387</td>
      <td>  4038241</td>
      <td> 6.142380</td>
      <td> 5</td>
      <td>                              The Sunset Limited</td>
      <td>  http://movie.douban.com/subject/4038241/</td>
      <td>       剧情</td>
      <td> 美国</td>
      <td> 2011</td>
      <td>                                   汤米·李·琼斯、塞缪尔·杰克逊</td>
      <td>         汤米·李·琼斯</td>
      <td>                               考麦克·麦卡锡</td>
      <td>  90分钟</td>
      <td> 116</td>
      <td>  4038241</td>
      <td>                              The Sunset Limited</td>
      <td>  http://movie.douban.com/subject/4038241/</td>
      <td> 想看</td>
      <td> None</td>
    </tr>
  </tbody>
</table>
</div>



通过一行代码就可以获得推荐结果。这两位都属于电影发烧友级别，因此推荐出的电影都是相对小众的电影，反正博主基本上都没有看过。

以上就是Graphlab Create构建推荐引擎的介绍，希望对大家有所帮助。

#寻找喜欢一起研究数据的小伙伴

最后打一个广告，博主所在的Team寻找两位喜欢一起研究数据的小伙伴。

我们是一家4A广告公司的Data Team，服务各类的客户：快消、汽车、手机等等，数据项目包含Digital Analytics（网站分析），Social
Listening（舆情监测），CRM 数据分析。因此，在这里你可以了解以上领域的数据分析。

这里会接触到数据分析技术与工具有：

网站分析技术：Google Analytics，WebTrends，Omniture等

数据分析建模：Python，R， SPSS，Excel、Access、SQL Server

在这个Team中，Bussiness，Computer Science，Stastics三个方面的知识你都会需要了解，并且将其中的一个方向作为自己的主攻方向。

我们的要求：

对数据行业感兴趣是第一优先级，其他的方面都是可以培养的。

欢迎各位小伙伴把简历砸过来（Cloga0216@gmail.com）。
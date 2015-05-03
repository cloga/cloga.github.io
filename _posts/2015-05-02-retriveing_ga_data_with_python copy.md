---
author: cloga
comments: true
layout: post
slug: retriving ga data with python
title: 使用Python获取GA数据
categories:
- python
tags:
- python
- ga

---
# 开通GA API访问权限
首先要为你的google账号开通GA API的访问权限，请保证这个账号同时也有GA账号的访问权限，访问https://console.developers.google.com

* 新建一个项目

![png](http://cloga.info/files/creatproject.png)

使用现有的项目也是可以的，点击项目名称，进入项目中，我这里使用的项目是Cloga_GA

* 开启GA API

点击右侧的APIS，在其中找到Analytics API，点击off开启GA API

![png](http://cloga.info/files/enableapi.png)

* 获取Client ID和Client Secret

点击Credentials>creat new client ID，有三种类型可以选择，这里我们选择installed application，记下其中的CLIENT ID和CLIENT SECRET

![png](http://cloga.info/files/Clientid.png)
![png](http://cloga.info/files/Clienttype.png)
![png](http://cloga.info/files/secret.png)

到这里GA的API就开通了。

#找到想要查询数据的view id
在查询GA数据时需要指定对应的view id。对于GA来说每个跟踪代码（UA-XXX）对应的是property，可以理解为一个收集到数据集，在这个数据集上可以做一些过滤，重写等操作，操作后产生的就是一个view，因此，view是一个报告集。

登陆GA账号，点击admin

![png](http://cloga.info/files/admin.png)

点击view setting找到对应的view id

![png](http://cloga.info/files/viewid.png)

# 安装需要的module
读取GA的数据，这里使用的是Google提供的[gdata](http://code.google.com/p/gdata-python-client/)，此外，需要将GA数据保存为excel，这里使用的是Pandas。

```
sudo  pip install --upgrade gdata
sudo pip install --upgrade pandas
```

在http://pandas.pydata.org/ 可以找到pandas的信息

# 认证GA API，获取token

```python
EMAIL = 'google账号的用户名'
PWD = 'google账号的密码'
SOURCE_APP_NAME = 'Cloga_GA'
import gdata.analytics.client
import pandas as pd
my_client = gdata.analytics.client.AnalyticsClient(source=SOURCE_APP_NAME)#实例化GA Client
my_client.client_login(
    EMAIL,
    PWD,
    source=SOURCE_APP_NAME,
    service=my_client.auth_service,
    account_type='GOOGLE'
)
```

# 构建GA查询

```python
data_query = gdata.analytics.client.DataFeedQuery({
    'ids':'ga: viewid', #替换为要查询的view id
    'dimensions':'ga:source',
    'metrics':'ga:pageviews',
    'start-date':'2013-5-18',
    'end-date':'2014-10-10',
    'prettyprint':'true'
    })
```

可以在http://ga-dev-tools.appspot.com/explorer/ 构建好需要的query条件

```python
feed = my_client.GetDataFeed(data_query)
```

feed是从XML中解析的Data feed，具体的数据格式见https://developers.google.com/analytics/devguides/reporting/core/v2/gdataReferenceDataFeed

# 解析Data Feed

```python
results = []
for entry in feed.entry:
    result = {}
    for dim in entry.dimension:
        result[dim.name] = dim.value
    for met in entry.metric:
        result[met.name] = met.value
    results.append(result)
pd.DataFrame(results).to_excel('ga_data.xlsx', index=False)
```

这样就实现了用python调用GA API，并将结果存入了excel，通过改变data_query部分的参数来查询你自己的数据吧～
---
title: "从零开始搭建一个搜索下拉推荐"
author: "cloga"
comments: yes
layout: post
slug: from scatch
tags:
- web service
- python
categories: python
---

最近折腾了一下从零开始在金山云上搭建一个搜索下拉推荐，这里记录一下相关的流程，感谢未来的架构师丁神提供的咨询服务。

使用的数据是github上的bestbuy的产品数据大概4W+，和丁神讨论一下架构，本身数据量很小，其实直接上mysql就可以，因为是个demo为了扩展性，最终定下来的架构是nginx（用来承载搜索框静态页）+ flask（提供搜索建议的web服务）+ es（后端的数据查询）+ redis（用于缓存查询结果）

## 搭建相关环境

首先通过ssh登录服务器

```ssh
ssh root@xxx.xxx.xxx.xxx
```

### 安装python3

一般linux服务器上都有安装python，不过都是python2版本，因为马上都要退休了，所以安装一个python3

我用的这台机器上yum，直接用yum安装python36

```ssh

yum install python36

```

安装完成后可以使用python36启动python3

这里有一个问题是，yum安装的python36没有安装pip，使用pip提示没有这个命令

需要手动安装一个pip

首先下载去 https://pip.pypa.io/en/stable/installing/

```ssh
wget https://bootstrap.pypa.io/get-pip.py
```

运行安装pip

```ssh
python36 get-pip.py
```

安装ipython，pandas，flask，redis，Elasticsearch

```ssh
pip install ipython
pip install pandas
pip install flask
pip install redis
pip install Elasticsearch
```

python的基本环境可以了

### 安装jupyter notebook

这里推荐装一下jupyter notebook 并配置外网访问，这样就可以抛弃shell直接用notebook的web shell

具体的流程可以看一下：http://cloga.info/python/2017/05/13/efficiency-tool

这里只说一下大概：


安装jupyter 

```ssh
pip install jupyter
```
生成配置文件

打开ipython生成密文的密码

```python
from notebook.auth import passwd

passwd()

# 'sha1:xxxxxxxxxxxxxxxxxxxxxxxxxx'
```

记录sha1:xxxxxxxxxxxxxxxxxxxxxxxxxx

修改配置文件

```ssh
vim ~/.jupyter/jupyter_notebook_config.py
```

找到以下的部分

```pre
# 174
c.NotebookApp.ip='*'
# 222
c.NotebookApp.open_browser = False
# 229
c.NotebookApp.password = u'sha:ce...刚才复制的那个密文'
# 240
c.NotebookApp.port =8888 #随便指定一个端口
```

代码上面的数字代表大概的行数，记得去掉注释符号

好了，可以通过浏览器访问jupyter了，不过在此之前，再推荐两个jupyter的插件。

[nbextensions](https://github.com/ipython-contrib/jupyter_contrib_nbextensions)，jupyter notebook扩展，可以有很多有用扩展

[jupyter-themes](https://github.com/dunovank/jupyter-themes)jupyter notebook的主题，改变之前性冷淡的样式。

```ssh
pip install jupyter_contrib_nbextensions
jupyter contrib nbextension install --user
pip install jupyterthemes
# 安装后可以查看安装的主题
jt -l
# 可以指定切换到主题
jt -t monokai
```
好了 让我们启动一下jupyter notebook，使用nohup避免程序中断

```ssh
nohup jupyter notebook& 
```

如果是root用户需要增加 --allow-root后缀

```ssh
nohup jupyter notebook --allow-root&
```

好了 可以访问jupyter来编辑和测试代码了

## nginx承载静态页host

安装nginx

```ssh
yum install nginx

```

修改nginx配置，默认是ipv6的版本，金山云只支持ip v4

```ssh
cd /etc/nginx
vim nginx.config
# 修改39行的数据，删除default server，注释到40行
cd /usr/share/nginx/html
```
将其中index.html文件修改为需要的autocomplete

```js
      $("#search-input").autocomplete({
        source:function(req, rep) {
		$.ajax({
			url : "http://xxx.xx.xx.xx:5000/query?q="+encodeURIComponent($("#search-input").val()),
			type : "get",
			dataType: "json",
			success: function(data){
				console.log(data);
				rep(data);
			}
		});
	}
      });
```
主要是修改这个部分，获取搜索建议的ajax数据

页面上方要引入jquery和jquery_ui

页面的其余内容可以参考：https://github.com/algolia/autocomplete.js/blob/master/examples/basic.html

## 数据处理并存入es

源数据来自这里，https://github.com/BestBuyAPIs/open-data-set ，使用product那个json就可以

创建一个data目录，把数据wget进去

```ssh
mkdir data
cd data

```

处理一下数据

这里要注意一下目前使用的是pytho36，因此要在脚本前增加python36的地址，查看的命令为

```ssh
which python36
# usr/bin/python36
```

数据处理和写入es使用python脚本

```python

#!/usr/bin/python36

# 处理json数据

import json

import pandas as pd


f = open("products.json", encoding='utf-8')

data = json.load(f)

data_df = pd.DataFrame(data)

data_df = data_df[~data_df['name'].isnull()]

# 只有商品名有用其他字段不需要

data_df = data_df[['name']]

data_df = data_df.drop_duplicates()

# 存入es

from elasticsearch import Elasticsearch

# 配置es的接口地址，由于是用到是金山云提供的es，因此es不需要配置
es = Elasticsearch(['xx.xx.xx.xx:9200', 'xx.xx.xx.xx:9200', 'xx.xx.xx.xx:9200'], sniff_on_start=True)

for record in data_df.to_dict('records'):
    es.index( index="product_list", doc_type="product_name", body=record )

```

运行脚本写入数据

```ssh
python36 data_process.py
```

## 搜索下拉建议web服务，使用redis缓存结果

```python
#!/usr/bin/python36

from flask import Flask
from flask import request
import json
import pandas as pd
from flask import make_response
import redis
from elasticsearch import Elasticsearch
# 联接es， 金山云提供现成的paas服务
es = Elasticsearch(['xx.x.x.xx:9200', 'xx.x.x.xx:9200', 'xx.x.x.x:9200'], sniff_on_start=True)
# 联接es， 金山云提供现成的paas服务
r = redis.Redis(host='xx.x.x.xxx', port=6379, decode_responses=True) 

app = Flask(__name__)

@app.route('/query', methods=['POST', 'GET'])
def get_suggestions_es_redis():
    # redis缓存有从redis取
    query = request.args.get('q')
    suggestions = r.get(query)
    if suggestions is None:
        # redis缓存中没有则去es中查询
        query_name_contains = {'query': {'match': {'name': query}}}
        suggestions = es.search(index="product_list", doc_type="product_name", body=query_name_contains)
        suggestions = [s['_source']['name'] for s in suggestions['hits']['hits']]
        suggestions = json.dumps(suggestions)
        r.set(query, suggestions) 
    if suggestions is not None:
        rst = make_response(suggestions)
    else:
        rst = make_response('')
    rst.headers['Access-Control-Allow-Origin'] = '*'
    return rst
```

启动flask服务

```ssh


```

至此一个从0开始的搜索下拉框建议就搭建完成了，同时这个demo也具有一定的扩展性，可以在前面增加load banlance或者在后端增加es的集群来进行扩展



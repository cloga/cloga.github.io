---
title: "使用requests和beautiful soup下载网页数据"
author: "cloga"
comments: yes
layout: post
slug: download_web_data_using_requests_and_beautifulsoup
tags:
- web data
- python
categories: python
---

Python中有很多方便的包，requests和beautiful soup可以很简单将一个网站直接下载下来。

## Requests

requests是一个非常简单的http库，比urllib2要人性化很多。官网很贴心的，对比了用两个模块来做同一件的数据的代码量。

### requests代码样例
```python
import requests

r = requests.get('https://api.github.com', auth=('user', 'pass'))

print r.status_code
print r.headers['content-type']
```

### urllib2代码样例
```python
import urllib2

gh_url = 'https://api.github.com'

req = urllib2.Request(gh_url)

password_manager = urllib2.HTTPPasswordMgrWithDefaultRealm()
password_manager.add_password(None, gh_url, 'user', 'pass')

auth_manager = urllib2.HTTPBasicAuthHandler(password_manager)
opener = urllib2.build_opener(auth_manager)

urllib2.install_opener(opener)

handler = urllib2.urlopen(req)

print handler.getcode()
print handler.headers.getheader('content-type')
```

4 VS 11 哪个更方便简洁，毋庸置疑。

### 安装requests

由于python3生态的成熟，需要库已经在官网上明确力挺python3，requests就是其中之一。

```ssh
pip3 install requests
```

requests可以用来方便的下载网页并保存到本地。

## beautiful soup

beautiful soup是用于解析HTML代码的python库，提供了很多便捷的方法来提取特定的HTML元素。

### 安装beautiful soup

beautiful soup有3和4两个版本，建议直接使用4版本。

```ssh
pip install beautifulsoup4
```

在下载数据任务中，beautiful soup的角色主要是解析需要下载的url及img等资源。具体的下载的任务交给requests来进行。

## 动手下载



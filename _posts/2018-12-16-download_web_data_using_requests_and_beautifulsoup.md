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

第一步需要有个起始的baseurl，从里面获取要下载的url里面。
第二步是下载每个页面，并且记录每个页面的img
第三部下载所有img

### 根据baseurl获取所有要下载的url

```python
import requests
from bs4 import BeautifulSoup
BASE_URL = 'http://baseurl.com'
r = requests.get(BASE_URL)
r.encoding = 'utf-8'
soup = BeautifulSoup(r.text)
urls = []
for link in soup.find_all('a'):
    urls.append(link.get('href'))
EXCLUDE = []
urls = [url for url in urls if url not in EXCLUDE]
```

需要注意一下页面的编码，如果编码不正确会出现乱码。

beautil soup会把html解析成类似嵌套的字典的结构。通过find_all方法可以找到所有特定html标签，通过get方法可以找到特定标签下的对应值。url是放入href属性中。

由于页面上的肯定存在某些url不是我们想要的，所以增加了一个排除的列表。

### 下载每个页面，并且记录所有img

```python
imgs = []
for url in urls:
    r = requests.get(BASE_URL + url)
    # 下载HTML
    with open(url, 'wb') as fd:
        for chunk in r.iter_content(1024):
            fd.write(chunk)
    # 记录下图片
    soup = BeautifulSoup(r.text)
    for img in soup.find_all('img'):
        imgs.append(img.get('src'))
```

iter_content是将html转化为文件流写入文件。

find_all还是用来查找所有的img标签，所不同的是，img地址是放在src属性中。

这里需要注意的是，html中的地址很多的是相对地址，因此，真实的地址需要增加BASE_URL。


### 下载所有img

```python
# 下载图片
for img in imgs:
    r = requests.get(BASE_URL + img)
    if r.status_code == 200:
        with open(img, 'wb') as f:
            for chunk in r.iter_content(1024):
                f.write(chunk)
```

将上面收集到img都下载下来。

这里需要注意一下，img通常都是放入特定目录中，因此，需要先创建对应的文件夹。

好了，找一个你感兴趣的网页试一下吧。
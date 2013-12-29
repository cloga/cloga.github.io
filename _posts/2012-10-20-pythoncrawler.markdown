---
author: admin
comments: true
date: 2012-10-20 15:55:19+00:00
layout: post
slug: 'pythoncrawler'
title: 用Python写简单爬虫
wordpress_id: 1694
categories:
- Python
tags:
- Python
---

Python提供了许多Module，通过这些Module，可以很简单的做一些工作。比如，要获得cloga这个词在百度搜索结果页中的排名结果（排名结果+URL），这就是一个很简单的爬虫需求。

首先，要通过urllib2这个Module获得对应的HTML源码。

    
    import urllib2
    url='http://www.baidu.com/s?wd=cloga'
    content=urllib2.urlopen(url).read()


通过上面这三句就可以将URL的源码存在content变量中，其类型为字符型。

接下来是要从这堆HTML源码中提取我们需要的内容。用Chrome查看一下对应的内容的代码（也可以用Firefox的Firebug）。

[caption id="attachment_1697" align="aligncenter" width="600"][![Java Console](http://www.cloga.info/wp-content/uploads/2012/10/QQ截图20121020214746-1024x367.png)](http://www.cloga.info/wp-content/uploads/2012/10/QQ截图20121020214746.png) Java Console[/caption]

可以看到url的信息存储在span标签中，要获取其中的信息可以用正则式。

    
    import re
    urls_pat=re.compile(r'<span class="g">(.*?)</span>')
    siteUrls=re.findall(results_pat,content)


<!-- more -->
re.compile是将字符串编译为用于python正则式的模式，字符前的r表示是纯字符，这样就不需要对元字符进行两次转义。re.findall返回的是字符串中符合results_pat的列表，由于在results_pat中使用了子表达式，所以results存储的就是子表达式所匹配的内容，即<span>与</span>之间的内容。

此外，也可以用BeautifulSoup这个Module来获得提取同样的信息。直接从源码中用正则式提取信息适用于那些按照标准写的HTML页面，BeautifulSoup则可以处理一些编写不规范的页面。

    
    from BeautifulSoup import BeautifulSoup
    soup=BeautifulSoup(content)
    siteUrls=soup.findAll('span',attrs={'class':'g'})


BeautifulSoup()可以把刚才抓到的字符串转化为Beautiful的对象。这样就可以应用BeautifulSoup提供的一些方法处理HTML。比如，findAll('a')就可以返回一个所有页面的a标签的List，我觉得这个和JS里面的getElementByTagName挺像的。另外也可以指定attrs参数，这个参数就是一个筛选条件，其数据结构是一个字典。findAll('span',attrs={'class':'g'})的意思就是返回所有class='g'的span标签的内容（包括span标签自身）。

用正则式和BeautifulSoup获得内容还需要进一步处理，因为其中包含html标签。类似，hi.baidu.com/<b>cloga</b> 2010-8-29或者<span>  hi.baidu.com/<b>cloga</b> 2010-8-29  </span>，同样可以用正则式的sub方法替换掉这些标签。

    
    strip_tag_pat=re.compile(r'<.*?>')
    file=open('results000.csv','w')
    for i in results:
        i0=re.sub(strip_tag_pat,'',i)
        i0=i0.strip()
        i1=i0.split(' ')
        date=i1[-1]
        siteUrl=''.join(i1[:-1])
        rank+=1
        file.write(date+','+siteUrl+','+str(rank)+'\n')
    file.close()




再来就是把对应的结果输出到文件中，比如，排名、URL、收入日期这样的形式。OK，这样就用Python实现了一个简单的爬虫需求。秀一下上面代码的输出。




[caption id="attachment_1699" align="aligncenter" width="640"][![Result](http://www.cloga.info/wp-content/uploads/2012/10/Result.png)](http://www.cloga.info/wp-content/uploads/2012/10/Result.png) Result[/caption]

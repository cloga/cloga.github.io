---
author: admin
comments: true
date: 2012-11-25 16:52:03+00:00
layout: post
slug: 'weibospreadgraph'
title: 新浪微博传播路径图的制作
wordpress_id: 1722
categories:
- Digital分析
- Python
tags:
- gephi
- gvedit
- Python
- social graph
---

[caption id="attachment_1726" align="aligncenter" width="614"][![微博传播图](http://www.cloga.info/wp-content/uploads/2012/11/Untitled.png)](http://www.cloga.info/wp-content/uploads/2012/11/Untitled.png) 微博传播图[/caption]

经常在微博上看到微博传播路径图。其实只要会一点Python、GVEdit和Gephi，你也可以自己动手制作新浪微博的传播路径图。这篇文章就和大家讲讲如何制作这类传播路径图。下面的内容会涉及到新浪API，Python，GVEdit，Gephi这些工具或知识。


### **通过Python调用新浪API**


在[新浪微博开放平台](http://open.weibo.com/)注册账号，创建应用。

[caption id="attachment_1723" align="aligncenter" width="425"][![创建应用](http://www.cloga.info/wp-content/uploads/2012/11/11.png)](http://www.cloga.info/wp-content/uploads/2012/11/11.png) 创建应用[/caption]

<!-- more -->创建其他应用，客户端-桌面。一个账号可以创建10个应用，建议同时创建10个应用，因为新创建的应用是测试权限，每个应用每个用户每小时只有150次的调用次数，10个应用就可以1500次调用，为什么要保证最大调用次数，我会在后面的内容里讲。

创建完成后，点击管理应用进入创建的应用中，应用信息>高级信息，添加其中的OAuth2.0 授权设置的回调页面，这个地址可以随便填写，但是不能空着，后面需要用到。

我们来看一下新浪API的OAuth流程（即给一个应用授权的过程）。

[caption id="attachment_1725" align="aligncenter" width="620"][![oAuth2_02](http://www.cloga.info/wp-content/uploads/2012/11/oAuth2_02.gif)](http://www.cloga.info/wp-content/uploads/2012/11/oAuth2_02.gif) oAuth2_02[/caption]

1. 引导需要授权的用户到如下地址：

```html
https://api.weibo.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_REGISTERED_REDIRECT_URI
```

2. 如果用户同意授权,页面跳转至 YOUR_REGISTERED_REDIRECT_URI/?code=CODE
3. 换取Access Token

```html
https://api.weibo.com/oauth2/access_token?client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&grant_type=authorization_code&redirect_uri=YOUR_REGISTERED_REDIRECT_URI&code=CODE
```

（其中client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET可以使用basic方式加入header中）
返回值

```json
{ "access_token":"SlAV32hkKG", "remind_in ":3600, "expires_in":3600 }
```
4. 使用获得的OAuth2.0 Access Token调用API

其中client_id和client_secret对应的是应用基本信息中的App_key和App_secret。redirect_url就是授权回调页的URL，如果URL没有填写调用时会报错。

这个流程简单来说就是向新浪的认证服务器发出认证请求（1），新浪会在这个认证页面让用户填写用户名、密码，如果用户同意认证，新浪微博就会把用户重定向到填入的回调URL，URL参数中带有code这个参数（2），然后用这个code和App_key,App_secret这些信息请求新浪的认证服务器就可以获得token（3）。获得了token之后，在url参数中携带这个参数就可以调用API。

这个流程是不是听起来很复杂，不知道如何下手？不过不用担心，廖雪峰同学提供了[新浪微博AP](http://michaelliao.github.com/sinaweibopy/)[I](http://michaelliao.github.com/sinaweibopy/)[Python版SDK](http://michaelliao.github.com/sinaweibopy/)，可以帮我们简化这个过程，同时我在另外的一个文章中看到了如何获得code参数（链接找不到），这样，其实我们只需要一个Python函数就能完成认证流程，不需要再手动登陆认证。

```python
def access_client(app_index):
    APP_KEY= APP_KEYS_SECRETS[app_index][0] #app key
    APP_SECRET = APP_KEYS_SECRETS[app_index][1] # app secret
    CALLBACK_URL = 'http://www.cloga.info' # callback url
    username='XXXXX'
    password='YYYYY'
    client = APIClient(app_key=APP_KEY, app_secret=APP_SECRET, redirect_uri=CALLBACK_URL)
    url = client.get_authorize_url()
    conn = httplib.HTTPSConnection('api.weibo.com')
    postdata = urllib.urlencode({'client_id':APP_KEY,'response_type':'code','redirect_uri':CALLBACK_URL,'action':'submit','userId':username,'passwd':password,'isLoginSina':0,'from':'','regCallback':'','state':'','ticket':'','withOfficalFlag':0})
    conn.request('POST','/oauth2/authorize',postdata,{'Referer':url, 'Content-Type': 'application/x-www-form-urlencoded'})
    res = conn.getresponse()
    page = res.read()
    conn.close()##拿新浪给的code
    code = urlparse.parse_qs(urlparse.urlparse(res.msg['location']).query)['code'][0]
    token = client.request_access_token(code)
    access_token = token.access_token # 新浪返回的token，类似abc123xyz456
    expires_in = token.expires_in # token过期的UNIX时间：http://zh.wikipedia.org/wiki/UNIX%E6%97%B6%E9%97%B4
    # TODO: 在此可保存access token
    client.set_access_token(access_token, expires_in)##生成token
    return client
```

这个函数的参数是app_index，这个参数是用来获得app_key和app_secret，前面已经提到，新浪对测试版的app的调用限制为单用户一个小时150次请求，这个请求数对于转发数比较多的帖子是远远不够的，所以我将申请的10个App放在一个列表中，每次一个app的quota不足，则自动切换到下一个app。

```python    
    #定义供替换的APP Key和Secret
    APP_KEYS_SECRETS=[['KKKKK','SSSSS'],\
                      ['KKKKK','SSSSS'],\
                      ]
    
    ##随机取出一个app index
    current_index=int(random.random()*100 % len(APP_KEYS_SECRETS))
```

这样，通过client=access_client(current_index)就能获得token。

通过client.statuses.repost_timeline.get(id=id,count=count,page=page)就能获得获取指定微博的转发微博列表，新浪的官方说明见：[statuses/repost_timeline](http://open.weibo.com/wiki/2/statuses/repost_timeline)

以这个api为例说明Python SDK的API的调用规则：将"/"替换为"."，如果是get方法就在后面使用get。

client.statuses.repost_timeline.get(id=XXXX,count=200,page=1)就获得了id为XXXX的微博的第一页的2oo个转发的信息。由于新浪返回的是一个json对象。我们可以用类似字典的方式来处理这些数据，比如reposts=client.statuses.repost_timeline.get(id=XXXX,count=200,page=1)，reposts['reposts']就获得了一个列表，这个列表的每个成员是一个转发的信息所构成的字典。

id就是指定的微博id，count是指一页显示的结果数，page是页数。由于目前新浪微博API的Cursor和Max_id都不好用，因此，要获得一条微博的所有reposts只能通过翻页获得。

这样我们通过repost_timeline返回的‘total_number’就能知道这条微博一共有多少转发，将这个转发除以200，取ceil就获得共需翻页的次数，通过循环就可以获得所有的转发。

刚才提到，新浪微博API的调用每个小时都有限制，如果一个app_key quota不足我们就应该用另一个去重新认证。因此，我把client.statuses.repost_timeline.get和client.statuses.show.get的外面包了一层，加了个try，except，因为quota不足会抛异常出来，因此只要捕捉到这个异常，就重新授权，保证程序的连贯性（不过转发太多的帖子依然会超，这个没办法，只能申请更高的权限）。

```python    
def get_repost_timeline(id,count=200,page=1,max_id=0):
    try:
        return client.statuses.repost_timeline.get(id=id,count=count,page=page,max_id=max_id)
    except Exception,e:
        print e
        global client
        global current_index
        global next_index
        print 'current_index',current_index
        next_index=get_app_index(current_index)
        print 'next_index',next_index
        client=access_client(next_index)
        current_index=next_index
        return get_repost_timeline(id=id,count=count,page=page,max_id=max_id)

def get_show(id):
    try:
        return client.statuses.show.get(id=id)
    except Exception,e:
        print e
        global client
        global current_index
        global next_index
        print 'current_index',current_index
        next_index=get_app_index(current_index)
        client=access_client(next_index)
        current_index=next_index
        print 'next_index',next_index
        return get_show(id=id)
```

这里有一点要说明的是，由于采用翻页的方式以及新浪api返回数据的限制（有的微博转发被大量的删除，这部分数据会被过滤掉），这种方式实际获得的转发数可能与页面上看到的不同。


### **生成DOT文件**


前面介绍了新浪微博API Python SDK调用方式。接下来就用Python生成我们需要的数据。

我们需要的是传播路径图，我使用的是[GVEdit](http://www.graphviz.org/)的DOT语言生成图片（几百个节点GVedit可以支持，如果节点量比较大，windows下就崩溃，不知道什么原因，不过我们可以用Gephi代替）。下面是DOT语言的样例：

"joeghwu" -> "刘_黑七" [weibo_id=3506825367989409];

"崔科增" -> "琴瑟樵夫" [weibo_id=3506945706899086];

"琴瑟樵夫" -> "崔科增" [weibo_id=3506944666865337];

可以看到每个DOT文件就是描述一个边（Edge）。形式为起点->终点 标签，每个边的数据就是信息在两个人之间的传播方向。

2013-5-20更新：新浪微博的转发中有一个pid参数，这个参数就是一个微博的上一个微博id，通过这个id就不需要递归获得传播方向。

这里要说明的是，新浪微博的转发接口中提供的是所有转发，不仅仅是第一层的转发，即如果A发了一个微博，B转发这条微博，C转发B的这条微博，则通过新浪的转发接口获取A的转发也会获得C转发的那条微博，只是不知道信息的流动顺序。

如果要获得这种传播的层次关系，一种方式就是定义一个函数进行递归，根据转发微博的发出者与被转发微博的发出者确定传播方向，第一次运行时，认为所有的转发都是原始微博的第一次传播（其实其中可能包含多次的传播），即认为每个边都是由被转发微博的发出者到转发微博的发出者，然后进行递归，第二次将所有带有转发的微博作为参数传给这个函数，同样的逻辑，认为所有的转发都是这些带有转发的微博进一步传播。

举一个最简单的例子来说明一下这个过程：

真实的传播路径：

用户A发出微博a

用户B转发了微博a，发出微博b，b：A>B

用户C转发了微博b，发出微博c，c：B>C

获得真实传播路径的过程：

第一次：传给新浪a(发出者是A)，新浪返回a的转发b(发出者为B)和c(发出者为C)，这时b：A>B，c：A>C

第二次：发现b有转发，把b(发出者为B)传给新浪，新浪返回b的转发c(发出者为C)，这时c：B>C

下面是代码样例：

```python    
def get_edges(post_id,edeges={}):
    total_number=get_repost_timeline(id=post_id,count=200)['total_number']
##    print 'Total Number:',total_number
    reposts=[]
    page_reposts=get_repost_timeline(id=post_id,count=200)['reposts']
    reposts+=page_reposts
    page_number=int(math.ceil(total_number/200))
##    print 'Total Page Number:',page_number
    if page_number>1:
        for i in range(page_number):
##            print 'page_number:',i
            reposts+=get_repost_timeline(id=post_id,count=200,page=i+2)['reposts']
    reposts=[repost for repost in reposts if repost.has_key('reposts_count')]##有些微博是删除的
##    print 'Total Reposts:',len(reposts)
    reposted=get_show(id=post_id)['user']['screen_name']
    if reposted=='':
        reposted=str(get_show(id=post_id)['user']['id'])##存在Screen_name为空的情况
    for repost in reposts:
        if repost['user']['screen_name']=='':
            edges[repost['id']]={'poster':str(repost['user']['id']),'reposted':reposted,'content':repost['text'],'created_at':repost['created_at'],'reposts':repost['reposts_count'],'comments':repost['comments_count']}
        else:
            edges[repost['id']]={'poster':repost['user']['screen_name'],'reposted':reposted,'content':repost['text'],'created_at':repost['created_at'],'reposts':repost['reposts_count'],'comments':repost['comments_count']}##存在Screen_name为空的情况
    reposts=[repost for repost in reposts if repost['reposts_count']>0]
    for repost in reposts:
        get_edges(repost['id'])
    return edges
```

这样就将每一条微博转化为了一个边，其实是edges的一个Item，key是微博的ID，Value是个字典，其中的成员依次是转发的用户名，被转发的用户名，转发微博的内容，微博发布的事件，转发数，评论数。

有了这个函数，使用edges=get_edges(post_id)这个函数就可以将指定的微博转化为边。

接下来，将edges输出为.dot文件。

```python 
def generate_dot(file_name,data):
    OUT = file_name+".dot"
    dot = ['"%s" -> "%s" [weibo_id=%s]' % ( edges[weibo_id]['reposted'].encode('gbk','ignore'),edges[weibo_id]['poster'].encode('gbk','ignore'), weibo_id)for weibo_id in edges.keys()]
    with open(OUT,'w') as f:
        f.write('strict digraph {\nnode [fontname="FangSong"]\n%s\n}' % (';\n'.join(dot),))
        print 'dot file export'
```

strict digraph是用来指定图形的类型为有向图，[fontname="FangSong"]则是指定中文的仿宋字体，不然会是乱码。


### **生成微博传播路径图**


有了DOT文件，只要将DOT文件导入[GVEdit](http://www.graphviz.org/)生成circo类型的图片即可。下载安装[graphviz的windows stable版本](http://www.graphviz.org/Download_windows.php)就能获得GVEdit（Windows下的GVEdit有很多局限性，graphviz对应的Python包pygraphviz也不能用）。

打开GVEdit>file>open，打开刚才生成的DOT文件。点击Graph的setting。

[caption id="attachment_1730" align="aligncenter" width="412"][![Graph Setting](http://www.cloga.info/wp-content/uploads/2012/11/444.png)](http://www.cloga.info/wp-content/uploads/2012/11/444.png) Graph Setting[/caption]

将Layout改成circo，默认是dot。将Output File Name设定为你要保存的路径(不支持中文路径)及文件名，点击保存，传播路径图就会被生成到对应的路径中。

[caption id="attachment_1731" align="aligncenter" width="300"][![传播路径图](http://www.cloga.info/wp-content/uploads/2012/11/555-300x127.png)](http://www.cloga.info/wp-content/uploads/2012/11/555.png) 传播路径图[/caption]

此外，也可以用[Gephi](https://gephi.org/)生成传播路径图，尤其是节点比较多的情况。

打开Gephi，文件>打开，对应的DOT文件。

[caption id="attachment_1732" align="aligncenter" width="300"][![初始状态](http://www.cloga.info/wp-content/uploads/2012/11/6666-300x282.png)](http://www.cloga.info/wp-content/uploads/2012/11/6666.png) 初始状态[/caption]

点击概览(Gephi支持中文，请使用中文版本)，右侧会显示上图的初始的状态。这是一个混乱的状态。流程选择Yifan Hu，点击运行。

[caption id="attachment_1733" align="aligncenter" width="279"][![流程选择](http://www.cloga.info/wp-content/uploads/2012/11/777.png)](http://www.cloga.info/wp-content/uploads/2012/11/777.png) 流程选择[/caption]

Gephi会根据算法进行迭代计算，生成传播图。

[caption id="attachment_1734" align="aligncenter" width="300"][![中间状态中间状态](http://www.cloga.info/wp-content/uploads/2012/11/888-300x292.png)](http://www.cloga.info/wp-content/uploads/2012/11/888.png) 中间状态[/caption]

上面是计算过程中的一个中间状态。

[caption id="attachment_1735" align="aligncenter" width="294"][![最终状态](http://www.cloga.info/wp-content/uploads/2012/11/99999-294x300.png)](http://www.cloga.info/wp-content/uploads/2012/11/99999.png) 最终状态[/caption]

迭代完成后的最终状态可以明显的看到，这次传播有三个二次传播的中心。

要保存Gephi中的图形，点击预览，如果需要中文标签，则在节点标签中勾选显示标签，将字体设置为中文字体（比如，微软雅黑，黑体之类，不然会是乱码），点击刷新，每个节点就会显示对应的中文标签。在预设值这里还可以选择边的类型。点击左下角SVG/PDF/PNG就可以将图形保存下来。

以上就是制作新浪微博传播路径图的简单介绍，有兴趣的同学，可以自己动手尝试一下。如果遇到任何问题，欢迎给我留言。

最后，再给大家分享几个传播路径图。

[caption id="attachment_1737" align="aligncenter" width="300"][![传播路径图001](http://www.cloga.info/wp-content/uploads/2012/11/1233-300x289.png)](http://www.cloga.info/wp-content/uploads/2012/11/1233.png) 传播路径图001[/caption]

[caption id="attachment_1738" align="aligncenter" width="300"][![传播路径图002](http://www.cloga.info/wp-content/uploads/2012/11/22233-300x261.png)](http://www.cloga.info/wp-content/uploads/2012/11/22233.png) 传播路径图002[/caption]

[caption id="attachment_1739" align="aligncenter" width="300"][![传播路径图003](http://www.cloga.info/wp-content/uploads/2012/11/33334-300x242.png)](http://www.cloga.info/wp-content/uploads/2012/11/33334.png) 传播路径图003[/caption]

动手制作属于你自己的传播图吧~

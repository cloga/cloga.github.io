---
author: admin
comments: true
date: 2013-06-25 14:38:57+00:00
layout: post
slug: couchdb&mongodb
title: CouchDB和MongoDB简介
wordpress_id: 1955
categories:
- 数据科学
tags:
- CouchDB
- MongoDB
- 数据科学
---

这篇文章也算是[Introduction of Data Science](https://class.coursera.org/datasci-001)的课程笔记。


# 二者的简单对比


**相同点：**

****CouchDB和MongoDB是两种比较主流的No SQL。

存储方式：二者都是使用JSON格式的文件存储数据，准确的来说，MongoDB使用的是JSON的一个变种BSON存储。在查询语句上二者都是使用Javascript。

二者都支持Map Reduce，似乎Map Reduce是No SQL数据库的标配。

**不同点：**

****CouchDB不支持Index，MongoDB是支持的；

CouchDB支持View，而MongoDB不支持；

查询速度和灵活性上，MongoDB具有明显的优势，我的测试结果是查询一些简单的条件，300W左右的文件MonogDB只需要几秒钟的时间，尽管MongoDB查询灵活性比较高，但也无法与关系型数据库比肩，（通常认为No SQL为了获得更好的可扩展性而采取了Scheme Free，而其代价就是查询的灵活性降低）；CouchDB的查询需要首先通过Map Reduce建立View，对于较大的数据库这个过程是需要较多的时间成本，如果修改查询条件则需要重新创建View。<!-- more -->


# CouchDB的应用笔记




## 安装CouchDB


到[CouchDB官网](http://couchdb.apache.org/)下载对应的版本，Mac也可以选择用[Port](http://www.macports.org/ports.php?by=name&substr=couchdb)进行安装（注：Mac推荐使用官方的DMG，否则就需要在Terminal中运行）


## 运行CouchDB


运行安装后生成CouchDB的启动方式，或者在cmd中输入couchdb（Windows），mac下是在Terminal中输入sudo couchdb。默认情况下，CouchDB会使用http://127.0.0.1:5984/，同时，CouchDB也提供了Web控制台叫做Futon，默认地址为http://127.0.0.1:5984/_utils/index.html（MongoDB官方貌似就只有命令行了）

[caption id="attachment_1965" align="aligncenter" width="763"][![CouchDB Futon Console](http://www.cloga.info/wp-content/uploads/2013/06/Screen-Shot-2013-06-25-at-10.34.52-PM.png)](http://www.cloga.info/wp-content/uploads/2013/06/Screen-Shot-2013-06-25-at-10.34.52-PM.png) CouchDB Futon Console[/caption]

上面就是CouchDB Futon控制台，左侧显示的为其中的数据库（以下划线开头的数据库是系统用的，类似的，以下划线开头的文档也是系统文件），左上的位置可以创建数据库，右侧为相关功能菜单，你可以在这里修改CouchDB的文件存储路径，用户的账号和密码等。

[caption id="attachment_1972" align="aligncenter" width="766"][![CouchDB Document](http://www.cloga.info/wp-content/uploads/2013/06/Screen-Shot-2013-06-25-at-10.52.58-PM.png)](http://www.cloga.info/wp-content/uploads/2013/06/Screen-Shot-2013-06-25-at-10.52.58-PM.png) CouchDB Document[/caption]

CouchDB的数据库是由文件构成的，View也是存储在设计文件（Design Documents）中。每个文件都有一个_id这是一个唯一标示，同时还有一个用于标示版本的_rev，CouchDB的一个突出特性是一个文件可以存储多个版本，即所谓的MVCC（多版本并行控制）。


## 在Futon中查询CouchDB


CouchDB的查询是基于Map Reduce的。Map Reduce是一种并行编程模式，用于处理大规模运算，同样用于大规模运算的还有并行数据库（比如ebay所使用的Teradata），不过因为后者没有开源的解决方案，因此，Map Reduce应用更广泛。Map Reduce出现在Google 2004的论文中，Map和Reduce是这种编程模式的两个阶段。简单来说就是将计算量很大但不是很复杂的任务拆分成两个阶段，Map（映射）阶段是完成一些很基础的计算，而Reduce（化简）阶段则是将Map阶段计算的结果进行归并，从而获得最终需要的结果。

由于CouchDB使用的查询语言是Javascript，因此，需要用JS编写Map和Reduce方法进行查询。

[caption id="attachment_1973" align="aligncenter" width="766"][![Temporary View](http://www.cloga.info/wp-content/uploads/2013/06/Screen-Shot-2013-06-25-at-11.03.04-PM.png)](http://www.cloga.info/wp-content/uploads/2013/06/Screen-Shot-2013-06-25-at-11.03.04-PM.png) Temporary View[/caption]

首先选择Temporary View，然后定义Map方法和Reduce方法。这里我用id为文档建立另一个索引。

Map Function:

    
    function(doc) {
    emit(doc.id, doc);
    }


Map函数接受的参数是单个文件，用emit提交key和对应的一个值给Map Reduce的Shuttle层，Shuffle层会将key对应的一组值输入到Reduce，这里的Reduce方法我使用了CouchDB内置的_count函数（类似的函数还有_sum，相信从名称你就知道他们的用途），这个Map Reduce过程就是统计一下相同id的文档有多少个，并最终形成一个View。点击Save as可以将这个临时的View存储为一个真正的View以便以后进行查询。


## 用Python Driver操作CouchDB


CouchDB提供多种语言的Drive来操作CouchDB，下面以Python为例，说明CouchDB的操作。

使用easy_install或者pip安装couchdb（Python的一个包）。

    
    import couchdb
    server=couchdb.Server()
    db=server['weibo_user']


通过这三行命令就链接到了名称为weibo_user的CouchDB数据库。

如果想要向CouchDB中存储文件，只需要db.save(_document_)，CouchDB支持的文件是JSON，因此，只要document是Python的字典就可以直接存入CouchDB中。个人经验是CouchDB存储同样的数据需要的空间要远小于MongoDB，从新浪微博上抓取了300W的用户数据，存在CouchDB中大概3.5G，而存在MongoDB中则为10G+。

如果要查询特定View的数据，使用view=db.view('index/by_id',reduce=False) ，其中index/by_id对应的是view的名称，reduce参数是指定是否运行reduce运算。

查询的结果是ViewResults的一个实例，返回的结果是一个iterator，你可以循环处理这些结果，也可以使用rows=view.rows将这些结果返回为一个list，这样这个view中的每个结果就成为rows这个列表的一个元素，请注意，这个操作会将所有返回的数据读入内存，对内存的消耗很大。

如果要构建新的View或者使用临时的View来查询数据，你可以将JS函数定义的Map函数作为字符传递给db.query

    
    results = db.query('function(doc) {emit(doc.id, doc);')


你也可以使用Python的函数来构建View，只要在local.ini中增加：

    
    [query_servers]
    python=/usr/bin/couchpy


以上的map函数用python的形式书写则为：

    
    def fun(doc):
            yield doc['id'], doc


需要注意的是Python中使用yield来提交数据。

以上就是CouchDB应用基本介绍。总体来说，CouchDB的使用非常简单，写入和存储数据的速度都很快，但是，查询不够灵活，Map Reduce的处理速度也不是很快。接下来让我们看一下MongoDB的基本应用。


# MongoDB的应用笔记


MongoDB被称为最接近于关系型数据库的No SQL数据库，相比于CouchDB它提供更灵活的查询方式。


## 安装和启动MongoDB


在[MongoDB的官网](http://www.mongodb.org/downloads)上下载对应的版本，首先要指定mongodb的数据文件存储位置，mongodb默认会将数据存储在data文件夹下（windows会是c盘，mac会是系统盘符）。你可以通过--dbpath命令来改变数据文件存储的位置

    
    mongod.exe --dbpath d:\data


以上的命令就将mongodb的数据文件位置修改为d盘的data文件夹。

启动MongoDB首先要启动mongod（windows下在cmd中进入mongodb下的bin文件夹，运行mongod.exe，mac下在terminal中输入sudo mongod），然后再启动mongo（windows下运行mongo.exe，mac下在terminal中输入sudo mongo）请注意需要单独启动一个窗口不要关闭mongod那个窗口，mongod是服务器，mongo是客户端，用于访问mongod。

[caption id="attachment_1980" align="aligncenter" width="918"][![Mongod&Mongo](http://www.cloga.info/wp-content/uploads/2013/06/Screen-Shot-2013-06-26-at-11.06.20-PM.png)](http://www.cloga.info/wp-content/uploads/2013/06/Screen-Shot-2013-06-26-at-11.06.20-PM.png) Mongod&Mongo[/caption]

MongoDB默认使用的是http://127.0.0.1:27017/，你可以访问http://127.0.0.1:28017/查看MongoDB的运行状态，这个控制台与CouchDB相比有一些简陋。

与CouchDB类似，MongoDB中最基本的元素是Document，相当于关系型数据库中的记录，此外，MongoDB还有Collection，Collection是一组Documents，相当于关系型数据库的表。


## 使用MongoDB Shell操作MongoDB


启动MongoDB后默认是链接test数据库，下面是一些简单而实用的MongoDB Shell命令：

show dbs：显示所有数据库

show collections：显示当前数据库中的所有collection

use dbname：切换到指定DB

比如我们切换为weibo_term这个数据库，则需要输入use weibo_term（MongoDB允许联接不存在的数据库和Collection，并在插入第一个文件时创建对应的数据库和Collection。），此时，在shell窗口中输入db，会返回weibo_term，输入db.weibo_term则进入weibo_term数据库的同名Collection中。

[caption id="attachment_1989" align="aligncenter" width="213"][![MongoDB DB Collection](http://www.cloga.info/wp-content/uploads/2013/06/QQ截图20130627125942.jpg)](http://www.cloga.info/wp-content/uploads/2013/06/QQ截图20130627125942.jpg) MongoDB DB Collection[/caption]

MongoDB的数据存储与CouchDB类似也非常简单。假设weibos是一个JSON格式的文件，那么使用db.weibo_term.insert(weibos)就可以在weibo_term数据库下的weibo_term collection中添加这个文件。需要注意的是MongoDB BSON格式存储的单个文件大小的上限是16M，如果需要存储大于16M的文件，则需要使用Gridfs格式。

Insert命令也可以进行批量插入，只要将刚才的weibos换成一个iterator即可，不过这个也受到16M的限制，如果同时传入的文件大于16M，就会报错。

MongoDB提供find和findOne两个方法在MongoDB的Shell中进行查询。比如：db.weibos.find()（相当于SELECT * FROM weibos）就会返回weibos collections中所有的数据，默认是显示top10，输入it会显示后面的10条。而db.weibos.findOne()，则只返回找到的第一条记录。

    
    db.weibo_user.find({"friends_count":{"$gt":1500},'verified_type': -1},{'screen_name':1})


这是一个比较复杂的查询，相当于

    
    SELECT screen_name FROM weibo_user WHERE friend_count>1500 AND verified_type==-1


如果想要count结果的数量则需使用：

    
    db.weibo_user.find({"friends_count":{"$gt":1500},'verified_type': -1},{'screen_name':1}).count()


MongoDB也支持group by操作，不过需要用到reduce函数。

    
    db.weibos.group( {
                       key: { screen_name: 1 },
                       cond: { friends_count: { $gt: 1000 } },
                       reduce: function ( doc, pre ) {
                                   pre.reposts_count +=doc.reposts_count; 
                               }, 
                       initial: {reposts_count: 0 } 
                     } )


以上相当于

    
    SELECT screen_name ,SUM(reposts_count) FROM weibos WHERE friends_count>1000 GROUP BY screen_name


MongoDB的另一个特色是支持Index。

    
    db.weibos.ensureIndex({'screen_name':1})


这样就可以为screen_name构建索引。

构建索引也可以删除重复的记录。

    
    db.weibo_user.ensureIndex({'screen_name':1},{'unique':true,'dropDup':true})


MongoDB也支持Map Reduce以便进行一些聚合操作。与CouchDB类似，MongoDB的Map Reduce方法也是使用JS的方法，只是语法上有一些小差别。

    
    map = function() { emit(this.id,1);}
    reduce = function(key, emits) { 
                                   total = 0; 
                                   for (var i in emits) { total += emits[i].count;}  
                                   return {'user_id':key,'count':total}
                                   }
    mr = db.runCommand({"mapreduce" : "weibo_user", "map" : map, "reduce" : reduce,"output":"user_ids"})


这个Map Reduce方法统计了在weibo_user collection中每个user_id出现的次数，并将结果输出为user_ids的collection。

[caption id="attachment_2001" align="aligncenter" width="571"][![MongoDB Map Reduce](http://www.cloga.info/wp-content/uploads/2013/06/Screen-Shot-2013-07-11-at-7.52.36-AM.png)](http://www.cloga.info/wp-content/uploads/2013/06/Screen-Shot-2013-07-11-at-7.52.36-AM.png) MongoDB Map Reduce[/caption]

MongoDB的Map Reduce的运算过程中我们可以在MongoD的界面中看到实时的运行状态，map阶段的话，每三秒几百文档的样子，900W的文档运行一次的大概需要6个小时，map和reduce各需要三小时，执行的是简单的统计IDF的任务。


## 用Python Driver操作MongoDB


MongoDB也提供了多种语言的Driver，以Python为例说明一下如何操作MongoDB。由于语法上的相似，Python操作MongoDB的方式与在MongoDB Shell中很相似。

通过easy_install和pip安装pymongo

    
    from pymongo import Connection
    db = Connection().weibo


这样就连接到了weibo数据库

如果要向weibo数据库的weibos collection中存入文件则只需要使用：

    
    db.weibos.insert(weibos)


下面是一个查询和更新文件的例子：

    
    f1=db.weibo_user.find({'crawled':{"$ne":1}},{'id':1,'screen_name':1})
    for i in f1:
        db.weibo_user.update(i,{"$set" : {"crawled" : 1}})


以上的语句是查询出所有crawled不为1的文件，然后将crawled的值更新为1。

这些就是关于CouchDB与MongoDB的简短介绍希望对你能有所帮助，如果有任何问题欢迎给我留言。

参考资料：

[MongoDB Manual](http://docs.mongodb.org/manual/)

[CouchDB: The Definitive Book](http://guide.couchdb.org/)



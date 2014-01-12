---
author: 'Cloga'
comments: true
layout: post
slug: 'multiprocessingintro'
title: 'Python多进程模块Multiprocessing介绍'
categories:
- python

tags:
- Multiprocessing
- Python
---

[Multiprocessing](http://docs.python.org/2/library/multiprocessing.html)是Python的
一个标准库，通过这个库，可以实现并行编程，更有效的利用多核CPU。由于Python的GIL的限制，默认情况下Python无法有效利用多核。通过Multiproc
essing，可以创建多个子线程，从而更加有效的利用多核。这篇文件会介绍一下使用Multiprocessing的线程池（Pool）实现简单的并行编程。

Multiprocessing类提供了Pool对象，通过进程池对象来管理和创建多个进程的worker，并收集这些Worker返回的结果。

#简单任务的多进程编程

```python
import multiprocessing as mul
import os
from math import factorial
```
引入multiprocessiing，引入os模块用于查看进程id，引入阶乘计算，用于测试简单任务下的多进程编程。

```python
pool = mul.Pool()
mul.cpu_count()
```

```python
4
```

上面的例子就实例化了一个进程池。Pool接受进程数作为参数，默认情况下，会使用cpu_count()的值作为进程的默认值。比如我的电脑的话，pool =
mul.Pool()等价于pool = mul.Pool(4)

让我们计算1-100的阶乘，返回一个list，用于测试多进程编程的效果。首先定义一个阶乘的函数。

```python
def get_factorial(num, pid = 0):
    if pid:
        print 'pid is', os.getpid()
    return factorial(num)
```
为了显示当前所使用的进程，这里我们需要使用os.getpid()获得进程id。

```python
timeit get_factorial(100, pid=0)
```

```python
100000 loops, best of 3: 29.1 µs per loop
```

```python
f_10 = get_factorial(10, pid=1)
```

```python
pid is 25566
```

可以看到当前进程的PID。

```python
def f_list_serial(num, pid=0):
    results = []
    for n in range(1,num + 1):
        results.append(get_factorial(n,pid=pid))
    return results
results = f_list_serial(5, pid=1)
```

```python
pid is 27047
pid is 27047
pid is 27047
pid is 27047
pid is 27047
```

定义个串行计算的函数，可以看到pid都是一个，说明计算是在一个进程中顺序进行的。

```python
timeit f_list_serial(100, pid=0)
```

```python
1000 loops, best of 3: 594 µs per loop
```

如果不使用并行计算的话，计算1-100的阶乘需要的时间是300-400µs左右。由于计算每个数字的阶乘任务之间都是独立的，因此可以使用简单的进程池来进程并行计算
。对于多个任务之间相互依赖或者需要共享信息的情况不在本文的讨论之中。将前面的串行计算改成用进程池来计算。

Multiprocessing提供了apply，apply_async，map和map_async等多种方法，用于线程池的计算。其中的map和apply与标准模
块中方法用法类似，所不同的是map只接受一个参数，如果需要接受多个参数则最好使用apply，而apply_async和map_async则是map和apply的
异步方法，其结果是异步返回的AsyncResult类型的数据。

```python
def f_list_para_apply_async(num,pid=0,pool=None):
    pool = mul.Pool()
    results_list = []
    results = []
    for n in range(1,num+1):
        results_list.append(
                pool.apply_async(get_factorial, args=(n,pid)))
    pool.close()
    pool.join()
    for result in results_list:
        results.append(result.get())
    return results

r = f_list_para_apply_async(10,pid=1)
```

```python
pid is 27131
pid is 27133
pid is 27132
pid is 27134
pid is 27131
pid is 27133
pid is 27132
pid is 27131
pid is 27133
pid is 27131
```

如上所示，使用multiprocessing的进程池后可以看到不同的任务是在不同的进程中进程。

关于上面的函数有几点说明：

- 在主程序中实例化pool会报错，而在函数中实例化则可以正常运行，这一点在Multiprocessing的官方文档中也有说明，官方文档的说法是这个包需要__m
ain__模块被子模块导入
- apply_async支持多个参数，如果是位置参数，则可以使用args参数，值为tuple，如果是关键字参数，则可以使用kwds参数，值为字典，也可以同时使
用二者
- 当所有任务都执行完之后一定要记得用close()和join()回收进程，不然这些进程会变成僵尸进程，会造成打开文件过多的错误
- 每次apply_async返回的结果都是AsyncResult对象，需要通过get()方法获得其中的值。由于get()是阻塞的方式即同步的方式处理，因此，在
最后统一处理这些结果即可

```python
timeit r = f_list_para_apply_async(100)
```

```python
10 loops, best of 3: 156 ms per loop
```

通过timeit函数可以看到，使用默认的4个进程（基于我电脑目前的配置）计算时间有明显的增加。

```python
timeit r = f_list_para_apply_async(100,pool=50)
```

```python
1 loops, best of 3: 165 ms per loop
```

```python
timeit r = f_list_para_apply_async(100,pool=1)
```

```python
10 loops, best of 3: 152 ms per loop
```

尝试将进程增加到100或者将进程减少到1没有看到时间的明显变化，这可能是因为这个任务过于简单，使用多进程更多的资源浪费在进程切换上。

```python
def f_list_para_map_asyns(num, pool=None):
    results_list = []
    pool = mul.Pool(pool)
    result = pool.map_async(get_factorial,range(1,num+1))
    pool.close()
    pool.join()
    for result in results_list:
        results.append(result.get())
    return result
```

```python
timeit r = f_list_para_map_asyns(100)
```

```python
10 loops, best of 3: 144 ms per loop
```

使用map的异步形式获得计算速度的提升与apply_async相近，不过由于map_async只支持一个参数用途应该没有apply丰富。

```python
def f_list_para_apply(num,pid=0,pool=None):
    pool = mul.Pool()
    results = []
    for n in range(1,num + 1):
        results.append(pool.apply(get_factorial, args=(n,pid)))
    pool.close()
    pool.join()
    return results
```

```python
r = f_list_para_apply(10,pid=1)
```

```python
pid is 27343
pid is 27344
pid is 27345
pid is 27346
pid is 27343
pid is 27344
pid is 27345
pid is 27346
pid is 27343
pid is 27344
```

使用map的非异步方式，仍然可以看到pid的变化，看来每个任务都是在不同的进程中进程，只是各个进程间不是并行进行而是顺序进行，必须要等到前一个进程计算完成返回了
结果，下一个进程才会开始进行计算。

```python
timeit r = f_list_para_apply(100)
```

```python
10 loops, best of 3: 130 ms per loop
```

对于阶乘这个例子，异步方式与同步方式的时间相近，这个应该是与选择的任务有关。

```python
def f_list_para_map(num):
    results_list = []
    pool = mul.Pool()
    result = pool.map(get_factorial,range(1,num+1))
    pool.close()
    pool.join()
    return result
```

```python
r = f_list_para_apply(10,pid=1)
```

```python
pid is 26642
pid is 26643
pid is 26644
pid is 26645
pid is 26642
pid is 26643
pid is 26644
pid is 26645
pid is 26642
pid is 26643
```

```python
timeit r = f_list_para_map(100)
```

```python
10 loops, best of 3: 166 ms per loop
```

使用map的同步方式结果与apply的同步方式相近。

#复杂任务的多进程编程
上面的例子可以看到对于比较简单，计算耗时较少的任务，使用多进程得不偿失，时间主要消耗在进程切换上无法提高计算效率。再来看一下耗时较长的任务使用多进程编程的效果如
何。

我们用抓取微博转发数据作为例子。帖子的例子选取了[关于逸夫楼的一个热门微博](http://weibo.com/1496853872/AqSPp8Pyp)，mi
d为：3664072912104801，token使用微博给到的测试token。首先定义抓取微博转发数据的函数：

```python
token = '2.00Hk5I5B0XUlu4bde500a7f8FHAqIB'
import json,urllib2,urllib
def get_repost_timeline(id, count=200, page=1, pid=0, **keys):
    if pid:
        print 'pid', os.getpid(),'start!'
    query_args = {'id': id, 'count': count, 'page': page,
                  'access_token': token}
    query_args.update(keys)
    url = 'https://api.weibo.com/2/statuses/repost_timeline.json?'
    encoded_args = urllib.urlencode(query_args)
    content = urllib2.urlopen(url + encoded_args).read()
    if pid:
        print 'pid', os.getpid(),'finished!'
    return json.loads(content)
```

具体文档见[http://open.weibo.com/wiki/2/statuses/repost_timeline](http://open.weibo.c
om/wiki/2/statuses/repost_timeline)。按照文档的说明，这个接口只返回最近2000条，每页默认返回200条结果，则可以循环10次
。

```python
timeit get_repost_timeline(3664072912104801)
```

```python
1 loops, best of 3: 828 ms per loop
```

可以看到获得200个转发需要的时间比较长，有1s左右。

接下来再定义两个函数一个是串行的方式抓取2000条转发，一个是异步并行方式抓取2000条转发。

首先是用串行的方式获得2000条转发：

```python
def get_post_reposts(mid):
    reposts = []
    total_number = get_repost_timeline(id=mid)['total_number']
    page_number = total_number / 200 + 1
    if page_number > 10:
        page_number = 10
    for i in range(1,page_number + 1):
        reposts += get_repost_timeline(mid, page=i)['reposts']
    return reposts
```

```python
timeit get_post_reposts(3664072912104801)
```

```python
1 loops, best of 3: 10.2 s per loop
```

如果用串行的方式，抓取10页2000条转发需要的时间基本上是抓取一页转发的10倍，我们再来看一下用多进程编程的效果。这里首先使用异步的apply方式。

```python
def get_post_reposts_para_async(mid, pool_num=None, pid=0):
    reposts = []
    results = []
    pool = mul.Pool(pool_num)
    total_number = get_repost_timeline(id=mid)['total_number']
    page_number = total_number / 200 + 1
    if page_number > 10:
        page_number = 10
    for i in range(1, page_number + 1):
        results.append(pool.apply_async(get_repost_timeline, kwds=dict(id=mid, page=i, pid=pid)))
    pool.close()
    pool.join()
    for result in results:
        reposts += result.get()['reposts']
    return reposts
```

```python
reposts = get_post_reposts_para_async(3664072912104801, pid=1)
```

```python
pid 1687 start!
pid 1689 start!
pid 1688 start!
pid 1690 start!
pid 1687 finished!
pid 1689 finished!
pid 1688 finished!
pid 1690 finished!
pid 1687 start!
pid 1689 start!
pid 1688 start!
pid 1690 start!
pid 1687 finished!
pid 1689 finished!
pid 1688 finished!
pid 1690 finished!
pid 1687 start!
pid 1689 start!
pid 1687 finished!
pid 1689 finished!
```

每个pid是并行进行的，一个进程开始后，其他的进程也可以同步开始。

```python
timeit get_post_reposts_para_async(3664072912104801)
```

```python
1 loops, best of 3: 7.64 s per loop
```

```python
timeit get_post_reposts_para_async(3664072912104801, pool_num=10)
```

```python
1 loops, best of 3: 7.64 s per loop
```

```python
timeit get_post_reposts_para_async(3664072912104801, pool_num=1)
```

```python
1 loops, best of 3: 10.3 s per loop
```

```python
timeit get_post_reposts_para_async(3664072912104801, pool_num=100)
```

```python
1 loops, best of 3: 8.24 s per loop
```

从运行时间来看，似乎是随着进程池的增加而减少，达到10次，即这个任务的每个循环任务都有一个单独的进程达到一个峰值，之后运行时间会减少。但是总体来说，异步的多进程
编程比串行的时间要少。

```python
def get_post_reposts_para(mid, pool_num=None, pid=0):
    reposts = []
    pool = mul.Pool(pool_num)
    total_number = get_repost_timeline(id=mid)['total_number']
    page_number = total_number / 20 + 1
    if page_number > 10:
        page_number = 10
    for i in range(1,page_number):
        reposts += pool.apply(get_repost_timeline,kwds=dict(id=mid, page=i, pid=pid))['reposts']
    pool.close()
    pool.join()
    return reposts
```

```python
reposts = get_post_reposts_para(3664072912104801, pid=1)
```

```python
pid 2206 start!
pid 2206 finished!
pid 2207 start!
pid 2207 finished!
pid 2208 start!
pid 2208 finished!
pid 2209 start!
pid 2209 finished!
pid 2206 start!
pid 2206 finished!
pid 2207 start!
pid 2207 finished!
pid 2208 start!
pid 2208 finished!
pid 2209 start!
pid 2209 finished!
pid 2206 start!
pid 2206 finished!
```

```python
timeit get_post_reposts_para(3664072912104801)
```

```python
1 loops, best of 3: 9.04 s per loop
```

```python
timeit get_post_reposts_para(3664072912104801,pool_num=10)
```

```python
1 loops, best of 3: 9.87 s per loop
```

```python
timeit get_post_reposts_para(3664072912104801,pool_num=1)
```

```python
1 loops, best of 3: 9.71 s per loop
```

由于是非异步的形式，每个进程的任务完成后才会启动新的进程，不过从运行时间上来看，还是要比串行的形式时间要短。
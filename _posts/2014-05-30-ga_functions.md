---
author: cloga
comments: true
layout: post
slug: ga function
title: Google Analytics 不同版本的JS方法介绍
categories:
- GA JS function
tags:
- GA JS function
---

经常有同学会问GA几个版本的方法有什么不同?为什么感觉差异很大?其实这个问题只要了解一点点JS编程基础知识就可以解答。可能有的同学会说我是做网站分析的，了解这些JS编程知识有用吗？我的观点是在没有认知负担的情况下，适当了解一下网站分析的工作原理对职业发展大有裨益。

##常见的几种GA方法

先来看一下市面上常见的几种GA代码：

###最新的UA代码

``` javascript
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-xxxxxx-x');
  ga('send', 'pageview');

</script>

```

###GA异步版本

``` javascript
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-xxxxxx-x']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
```

###更早版本的GA代码－姑且叫它GA同步代码

```javascript
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try{
var pageTracker = _gat._getTracker("UA-xxxxxx-x");
pageTracker._trackPageview();
} catch(err) {}
</script>
```

这三个版本的代码应该是市面上比较常见的GA代码。按照发布时间降序排列。当然不排除还有使用古董级GA代码或者urchin代码的网站，不过那些不在本文的探讨范围以内。

##GA代码的基本结构

三个代码虽然看上去有一些差异，但是代码的基本机构是一致。从大的方面来说，代码分为两个部分。
1、引入GA的JS库，所有的GA方法都是在整个库中定义
2、定义GA账号及其他初始的代码状态，并触发一个页面跟踪（trackPageview）

###引入GA的JS库

```javascript
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
```

```javascript
  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
```

```javascript
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
```

上面这三段代码虽然看上去差异很大，其实相当于在页面中引入一段JS。

```javascript
<script type="text/javascript" src='http://www.google-analytics.com/ga.js'></script>
<script type="text/javascript" async="" src="http://www.google-analytics.com/analytics.js"></script>
```

上面的GA的JS库，下面是UA的JS库。

GA实现的所有方法都是在这个JS库中。

当然Google的工程师也不是没事闲的把简单事情复杂化，非要写各种高大上的版本让大家看不懂，其实不同版本的演化过程也在一定程度上体现了互联网技术的发展的方向。

####GA同步代码

GA同步代码的部分是最好理解的，

```javascript
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
```
这句语句是根据当前URL的协议，定义Google JS的host，如果是http协议就用http协议，如果是https就用https协议。

感兴趣的同学可以使用chrome自带的JS调试工具测试一下这段代码。打开Chrome控制台的快捷键在Windows是F12，Mac下是option＋command＋J。

![png](/files/ga1.png)

```javascript
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
```

这句语句的作用就是在页面上输入:

```javascript
<script type="text/javascript" src='http://www.google-analytics.com/ga.js'></script>
```

要注意的是这里使用的方式是使用document.write直接在页面html代码中输出字符串。

![png](/files/ga2.png)

综上，GA的同步代码通过对当前页面协议对判断，针对http协议和https引用不同版本对JS库，而不是笨拙对采用对不用对协议页面给出不同对跟踪代码的方式，其目的是便利网站管理员的代码部署。不过由于使用的是document.write方式在页面上字符串，如果请求的JS库地址相应比较慢会影响整个网页的加载速度，因此，衍生出异步代码。

####GA异步代码

```javascript
  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
```

GA这里使用的方式是定义一个匿名的方法，方法的作用是在第一个script元素前创建一个script用于引用ga.js。

这里需要简单提一下JS定义方法（函数）的基本语法结构。

```javascript
function 函数名 (参数) {
  函数体
  })
```

上面就是JS定义方法（函数）的基本语法结构，具体来说是有关键字（function），函数的参数，由定界符（大括号）包裹的函数体构成。

先来看函数体的内容一共是三行。

第一行定义了ga这个对象（物品）（var ga = document.createElement('script');），并且为ga这个物品增加了type和async的属性值（ga.type = 'text/javascript'; ga.async = true;）。

第二行定义了ga这个物品的scr属性，src属性值的定义与同步代码类型，不同协议下调用不同的协议。

第三行先搜索了页面上的script数组的第一个元素（var s = document.getElementsByTagName('script')[0];），[0]这种形式叫做下标，用来按位置选取数组的元素，第一个元素的下标是0；将ga插入到了s的前面（s.parentNode.insertBefore(ga, s)）

![png](/files/ga3.png)

再来看一下完整的代码。这个函数没有函数名，而且在后面还有()，这种方式定义的方式定义了一个没用名字的函数，并且在调用后马上调用它（匿名函数闭包有木有）。

####UA代码

有了上面的JS函数基础知识，我们再来看一下UA代码，为了便于理解我整理了一下代码：

```javascript
(function(i,s,o,g,r,a,m){
    i['GoogleAnalyticsObject']=r;
    i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();
    a=s.createElement(o), m=s.getElementsByTagName(o)[0];
    a.async=1; a.src=g;
    m.parentNode.insertBefore(a,m)
})
(window,document,'script','//www.google-analytics.com/analytics.js','ga');
```

可以看到这段JS最外层也是匿名函数，所不同的是这个匿名函数是有参数的。

i：window

s：document

o：'script'

g：'//www.google-analytics.com/analytics.js'

r：'ga'

函数体的第一句是定义了i的GoogleAnalyticsObject属性等于r，这里的i是window，window是一个对象代表的使整个页面。获取对象属性的方式可以使用下标的数字（前面提到过获取数组第一个元素是通过下标0，好吧，数组也是对象），也可以使用对应属性的字符串。这里是使用后者。翻译过来后第一行变成：window['GoogleAnalyticsObject']='ga'

函数体的第二句这里是用一个逻辑或二元操作对i[r]进行，其实就是对window['ga']进行赋值，||表示的是逻辑与，如果表达式前面为真，则返回前一个表达式，否则返回后一个表达式的值。这种表达方式其实JS的小技巧，为函数指定默认值。||右侧的表达式其实就是默认值。a ＝ a||表达式，这种表达式翻译过来就是如果a不存在就给定义一个a＝表达式。

正如你注意到的逻辑或表达式的右侧即参数的默认值又是一个匿名函数，函数体里面还有默认值赋值的方式。看起来有一些小复杂，还好我们有上面的基础。function(){(i[r].q=i[r].q||[]).push(arguments)}这里也是定义匿名函数，不过没有马上调用，实际上是将i[r]定义为了一个函数。函数体中i[r].q=i[r].q||[]是i[r].q默认值定义一个数组（[]代表的是空数组）。push方式是以先进先出的方式向数组中添加元素。后面的是将当前时间转化为数字赋值给i[r]的r属性。

这里其实定义了一个ga对象，其实是一个方法，其的作用就是向i[r].q（window['ga'].q）中添加元素。

后面的三句与前面的GA代码功能一致，找到script的对象的第一个元素，在其前面插入一个src为analtics.js的script。

###定义GA账号及其他初始的代码状态，并触发一个页面跟踪（trackPageview）

引入了GA|UA的JS库后，一些基本的对象方法函数就都定义好了。下一步就是实例化跟踪对象，监测网站数据。

####GA同步代码

```javascript
try{
var pageTracker = _gat._getTracker("UA-xxxxxx-x");
pageTracker._trackPageview();
} catch(err) {}
```

首先介绍一下JS里面的try，catch机制。其基本的语法形式为:

```javascript
try{
    要运行的语句
}
catch (错误变量)
{}
```

其作用是运行try语法块中的语句，如果报错则，将作为记录在错误变量中，同时也可以运行catch语法块的语句。

GA使用这个语句主要是为了容错处理，也没有后续做任何的处理。

对于同步代码做这个容错处理，主要是因为使用document.write这种同步方式加载js，如果GA JS加载较慢，GA的基本对象方法还没有加载就调用跟踪对象的实例化代码会报错。

```
ReferenceError: _gat is not defined
```
try中的第一行语句是实例化了一个跟踪对象，并且定义GA账号为UA-xxxxxx-x，跟踪对象的名称为pageTracker。这里要说一下一个页面上如果使用多个GA账号，则需要为每个跟踪对象指定不同的名称，否则，调用数据只会收集到最后定义的跟踪对象中。

try中的第二行语句触发一个PV计数。

####GA异步代码

```javascript
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-xxxxxx-x']);
_gaq.push(['_trackPageview']);
```

可以看到异步代码没有使用try catch做错误处理。因为在GA异步代码中做了一些特殊的处理，如果ga.js没有加载成功，定义的ga方法只会是_gaq这个数组的一个元素而已。

第一行代码是验证_gaq这个数组是否存在，如果不存在则初始化为一个数组。

第二行代码是将定义收集数据的GA账号的方法作为数组元素添加到_gaq中。

第三行代码是将收集PV数据的方法作为数组元素添加到_gaq中。

如果需要部署多个GA代码的话，同样也需要定义不同跟踪器名称，默认的跟踪器为匿名的。

####UA代码

```javascript
  ga('create', 'UA-xxxxxx-x');
  ga('send', 'pageview');
```

通过前面对UA代码加载UA JS库对分析我们已经知道ga已经是一个方法其作用就是向window['ga'].q中添加元素，也就是说其实UA与GA的异步代码没有本质上的差别，都是在JS库未加载前，用数组的元素在存储相关的跟踪方法及参数，等到JS库加载完毕，就转化为实际的方法向GA服务器提交数据。

关于Google Analytics不同版本的方法介绍就到这里，希望对各位的工作有所帮助，如果你还有问题欢迎给我留言，也可以通过cloga在路上@新浪微博找到我。

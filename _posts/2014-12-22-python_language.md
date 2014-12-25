---
author: cloga
comments: true
layout: post
slug: Python Scientific Lecture Notes 1.2
title: 1.2Python语言-Python科学讲座笔记
categories:
- Python_Scientific_Lecture_Notes
tags:
- Python

---
Cloga：这份文档是euroscipy关于Python科学计算资源的一个教程。英文版地址为：[http://scipy-lectures.github.io/](http://scipy-lectures.github.io/)，是学习Python科学计算生态体系很好的资料，因此，我会陆续将它翻译为中文，相关Gitbub地址为：[https://github.com/cloga/scipy-lecture-notes_cn](https://github.com/cloga/scipy-lecture-notes_cn)，[完整的中文目录](http://cloga.info/python_scientific_lecture_notes/2014/12/14/python_scientific_lecture_notes_cn/)

---

[本文的IPython版本](http://nbviewer.ipython.org/github/cloga/scipy-lecture-notes_cn/blob/master/1.2Python%E8%AF%AD%E8%A8%80.ipynb)
>作者 Chris Burns, Christophe Combelles, Emmanuelle Gouillart, Gaël Varoquaux

>**Python中的科学计算**
>这里我们介绍Python语言。这里只会仅仅解决可以用于Numpy和Scipy的最低要求。想要更多的了解这门语言，请参考http://docs.python.o
rg/tutorial 这个非常好的教程。也可以借助专门的图书，比如：http://diveintopython.org/.

Python是一门**编程语言**，与C、Fortran、BASIC和PHP等等类似。Python的一些特性如下：

- 一种*解释性*（不是编译）语言。与C或者Fortran等不同，Python代码在执行前不会编译。另外，Python可以**交互**使用：有许多的Python
解释器，命令和脚本可以在其中执行。
- 在**开源**证书下发布的免费软件：Python可以免费使用和分发，即使用于商用。
- **多平台**：Python可以用于所有的主流操作系统，Windows、Linux/Unix、MacOS X, 甚至可能是你有手机操作系统等等。
- 可读性很强的语言，有清晰不罗嗦的语法
- 拥有大量高质量的包，可以应用于多种多样的应用，从网站框架到科学计算。
- 非常简单的接口与其他语言交互，特别是C和C++
- 稍后会介绍一些语言的其他特性。例如Python是面向对象的语言，包含动态类型（一个变量可以在程序过程中，可以包含不同的对象类型）。

Python的特有特性的更多信息，请见：http://www.python.org/about/

## 1.2.1 第一步
启动**IPython** Shell(一个增强的Python交互Shell)：

- 在Linux/Mac终端中输入“ipython”，或者在Windows cmd sheell，
- 或者从菜单启动程序，即在[Python(x,y)](http://www.pythonxy.com/)或[EPD](http://www.enthought
.com/products/epd.php)，如果你已经安装这些Python科学套装之一。

如果你的电脑上还没有安装IPython，也可以选择其他Python shells，比如在终端中输入“Python”启动纯Python
shell，或者Idle解释器。但是，我们建议使用IPython Shell，因为它增强特性，特别是对于科学计算。

如果你已经启动了解释器，输入


    print "Hello, world!"

    Hello, world!


接下来就会显示信息"Hello, world!"。你已经执行了你的第一条Python命令，恭喜！

你自己开始吧，输入下列命令

```python
a = 3
b = 2*a
type(b)
int
print b
6
a*b
18
b = 'hello'
type(b)
str
b + b
'hellohello'
2*b
'hellohello'
```


上面定义了*a*和*b*两个变量。注意这里在赋值前没有声明变量类型。相反，在C中，应该写为：
```C
int a=3;
```

另外，变量的类型可以改变，在一个时间点它可以等于一个特定类型，在接下来的时间里，他可以等于另外的类型。*b*首先等于整数，但是当它被赋值为*"hello"*时他
变成等于字符。在Python中，整数的运算符（b＝2\*a）原生支持的，一些字符上的操作符例如相加和相乘也是支持的，相当于串联和重复。
## 1.2.2 基础类型
### 1.2.2.1 数值类型

Python支持如下的数值、标量类型：

**整型：**

```python
1 + 1
2
a = 4
type(a)
int
```

**浮点型：**

```python
c = 2.1
type(c)
float
```


**复数：**

```python
a = 1.5 + 0.5j
a.real
1.5
a.imag
0.5
type(1. + 0j )
complex
```


**布尔：**

```python
3 > 4
False
test = (3 > 4)
test
False
type(test)
bool
```


因此，Python shell可以代替你的口袋计算器，因为基本的代数操作符 +、-、\*、/、%（模）都已经原生实现了。

```python
7 * 3.
21.0
2**10
1024
8 % 3
2
```



类型转化（投射）：

```python
float(1)
1.0
```


---
**注意**：整数相除

```python
3 / 2
1
```


**技巧**：使用浮点：

```python
3 / 2.
1.5
a = 3
b = 2
a / b
1
a / float(b)
1.5
```


如果你明确想要整除，请使用//：

```python
3.0 // 2
1.0
```



Python3改变了除运算符行为。细节请看[python3porting](http://python3porting.com/preparing.html
#use-instead-of-when-dividing-integers)网站.

---

### 1.2.2.2 容器
Python提供了许多有效的容器类型，其中存储了对象集合。
#### 1.2.2.2.1 列表
列表是一个有序的对象集合，对象可以有多种类型。例如：

```python
L = ['red', 'blue', 'green', 'black', 'white']
type(L)
list
```

索引：访问包含在列表中的单个对象：

```python
L[2]
'green'
```


使用负索引，从结尾开始计数：

```python
L[-1]
'white'
L[-2]
'black'
```

**注意：索引从0开始**（和C中一样），而不是1（像在Fortran或Matlab）！

切片：获得规律分布元素的子列表：

```python
L
['red', 'blue', 'green', 'black', 'white']
L[2:4]
['green', 'black']
```


**注意**：L[start:stop]包含索引start<= i <
stop的元素（i的范围从start到stop-1）。因此，L[start:stop]包含（stop-start）个元素。

**切片语法**：```L[start:stop:stride]```

所有切片参数都是可选的：

```python
L
['red', 'blue', 'green', 'black', 'white']
L[3:]
['black', 'white']
L[:3]
['red', 'blue', 'green']
```


列表是可变对象，可以被改变：

```python
L[0] = 'yellow'
L 
['yellow', 'blue', 'green', 'black', 'white']
L[2:4] = ['gray', 'purple']
L
['yellow', 'blue', 'gray', 'purple', 'white']
```


**注：**一个列表的元素可以有不同的类型：

```python
L = [3, -200, 'hello']
L
[3, -200, 'hello']
L[1], L[2]
(-200, 'hello')
```


对于一个所有类型都相同的数值数据集合，使用Numpy模块提供的数组类型通常更有效。Numpy数组是包含固定大小项目的内存组块。使用Numpy数组，元素上的操作可
以非常快速，因为元素均匀分布在内存上并且更多的操作是通过特殊的C函数而不是Python循环。

Python提供了一大组函数来修改或查询列表。这里是一些例子，更多内容，请见：http://docs.python.org/tutorial/datastruc
tures.html#more-on-lists

添加和删除元素：

```python
L = ['red', 'blue', 'green', 'black', 'white']
L.append('pink')
L
['red', 'blue', 'green', 'black', 'white', 'pink']
L.pop() # 删除并返回最后一个项目
'pink'
L
['red', 'blue', 'green', 'black', 'white']
L.extend(['pink', 'purple']) # 扩展列表L，原地
L
L = L[:-2]
L
['red', 'blue', 'green', 'black', 'white']
```


反转：

```python
r = L[::-1]
r
['white', 'black', 'green', 'blue', 'red']
r2 = list(L)
r2
['red', 'blue', 'green', 'black', 'white']
r2.reverse() # 原对象
r2
['white', 'black', 'green', 'blue', 'red']
```


串联和重复列表：

```python
r + L
['white',
 'black',
 'green',
 'blue',
 'red',
 'red',
 'blue',
 'green',
 'black',
 'white']
r * 2
['white',
 'black',
 'green',
 'blue',
 'red',
 'white',
 'black',
 'green',
 'blue',
 'red']
```


排序：

```python
sorted(r) # 新对象
['black', 'blue', 'green', 'red', 'white']
r
['white', 'black', 'green', 'blue', 'red']
r.sort() # 原对象
r
['black', 'blue', 'green', 'red', 'white']
```


---
**方法和面向对象编程**

符号r.method() (即 r.append(3) and L.pop())
是我们第一个关于面向对象编程的例子（OOP）。作为列表，对象r有可以以这种方式调用的方法函数。对于这篇教程不需要关于面向对象编程的更多知识，只需要理解这种符号。

---
**发现方法**：

提醒：在IPython中：tab完成 (按tab)

```python
In [28]: r.<TAB>
r.__add__           r.__iadd__        r.__setattr__
r.__class__         r.__imul__        r.__setitem__
r.__contains__      r.__init__        r.__setslice__
r.__delattr__       r.__iter__        r.__sizeof__
r.__delitem__       r.__le__          r.__str__
r.__delslice__      r.__len__         r.__subclasshook__
r.__doc__           r.__lt__          r.append
r.__eq__            r.__mul__         r.count
r.__format__        r.__ne__          r.extend
r.__ge__            r.__new__         r.index
r.__getattribute__  r.__reduce__      r.insert
r.__getitem__       r.__reduce_ex__   r.pop
r.__getslice__      r.__repr__        r.remove
r.__gt__            r.__reversed__    r.reverse
r.__hash__          r.__rmul__        r.sort
```


#### 1.2.2.2.2 字符

不同的字符语法（单引号、双引号或三个引号）：

```python
s = 'Hello, how are you?'
s = "Hi, what's up"
s = '''Hello,                 
       how are you'''         # 三个引号可以允许字符跨行
s = """Hi,
what's up?"""
'Hi, what's up?'
File "<ipython-input-58-dfe00f996c26>", line 7
    'Hi, what's up?'
              ^
SyntaxError: invalid syntax
```


如果在字符中要是使用引号，那么应该嵌套使用，或者使用"\"进行转义，否则会报错。

换行的符号为 \n，tab符号是\t。

字符也是类似与列表的结合。因此，也可以使用相同的语法和规则索引和切片。

索引：

```python
a = "hello"
a[0]
'h'
a[1]
'e'
a[-1]
'o'
```


（记住负索引从右侧开始计数。）

切片：

```python
a = "hello, world!"
a[3:6] # 第三到第六个（不包含）元素：元素3、4、5
'lo,'
a[2:10:2] # 语法：a[开始：结束：步幅]
'lo o'
a[::3] # 从开始到结尾，每隔3个字母
'hl r!'
```


重音符号和特殊字符也可以被处理为Unicode字符（请见 http://docs.python.org/tutorial/introduction.html#unicode-strings）。

字符是**不可变**对象，不可能修改内容。不过可以从原始的字符中创建一个新的字符。

	a = "hello, world!"
	a[2] = 'z'
	-----------------------------------------------------	----------------------
    TypeError                                 Traceback (most recent call last)
    <ipython-input-68-8f124c87c8cf> in <module>()
          1 a = "hello, world!"
    ----> 2 a[2] = 'z'
    TypeError: 'str' object does not support item assignment
    a.replace('l', 'z', 1)
    'hezlo, world!'
    a.replace('l', 'z')
    'hezzo, worzd!'

字符有许多有用的方法，比如上面的a.replace。回忆一下a.面向对象的符号，并且使用tab完成或者help(str)来搜索新的方法。and use tab
completion or

**更多内容** Python提供了操作的字符的高级可能性，看一下模式或格式。感兴趣的读者请参考：http://docs.python.org/library/
stdtypes.html#string-methods 和 http://docs.python.org/library/string.html#new-
string-formatting。

字符格式：


    'An integer: %i; a float: %f; another string: %s' % (1, 0.1, 'string')

    'An integer: 1; a float: 0.100000; another string: string'

    i = 102
    filename = 'processing_of_dataset_%d.txt' % i
    filename
    
    'processing_of_dataset_102.txt'



#### 1.2.2.2.3. Dictionaries

字典本质上是一个**映射键值**的高效表格。它是一个**无序**的容器

    tel = {'emmanuelle': 5752, 'sebastian': 5578}
    tel['francis'] = 5915
    tel

    {'emmanuelle': 5752, 'francis': 5915, 'sebastian': 5578}

    tel['sebastian']
    
    5578

    tel.keys()

    ['sebastian', 'francis', 'emmanuelle']

    tel.values()

    [5578, 5915, 5752]

它可以方便的以名字（日期的字符和名称等）存储和获取值。更多信息见
http://docs.python.org/tutorial/datastructures.html#dictionaries。

一个字典的键（代表值）可以有不同的类型：

    d = {'a':1, 'b':2, 3:'hello'}
    d

    {3: 'hello', 'a': 1, 'b': 2}

#### 1.2.2.2.4. More container types

**元组**

元组本质上是不可变列表。元组的元素用括号包起来，或者只是用逗号分割：

    t = 12345, 54321, 'hello!'
    t[0]

    12345

    t

    (12345, 54321, 'hello!')

    u = (0, 2)

**集合**：无序，惟一项目：

    s = set(('a', 'b', 'c', 'a'))
    s

    {'a', 'b', 'c'}

    s.difference(('a', 'b'))

    {'c'}

#### 1.2.2.3. 赋值运算

[Python类库参考：](http://docs.python.org/reference/simple_stmts.html#assignment-
statements)

>赋值语句被用于（重）绑定名称与值，以及修改可变对象的项目或属性。

简单来说，它这样工作（简单赋值）：

1. 右侧表达式被评估，创建或获得产生的对象

2. 左侧的名字被赋值或绑定到右侧的对象

需要注意的事情：

- 单个对象可以有多个绑定的名称：

	    a = [1, 2, 3]
    	b = a
	    a

    	[1, 2, 3]

    	b

	    [1, 2, 3]

	    a is b

    	True

	    b[1] = 'hi!'
	    a

    	[1, 'hi!', 3]

- 要在**原地**改变列表，请使用索引或切片：

	    a = [1, 2, 3]
    	a

	    [1, 2, 3]

	    a = ['a', 'b', 'c'] # 创建另一个对象
    	a

	    ['a', 'b', 'c']

	    id(a)

	    4394695640

	    a[:] = [1, 2, 3] # 在原地修改对象
    	a

	    [1, 2, 3]

	    id(a)

	    4394695640

与上一个id相同，你的可能有所不同...

- 这里的关键观点是可变 vs. 不可变

    - 可变对象可以在原地修改
    - 不可变对象一旦被创建就不可修改

**更多内容**在David M. Beazley的文章[Python中的类型和对象](http://www.informit.com/articles/art
icle.aspx?p=453682)中也可以找到关于以上问题非常不错的详尽解释。
## 1.2.3 流程控制

控制代码执行顺序。

### 1.2.3.1 if/elif/else

    if 2**2 == 4:
        print 'Obvious!'

    Obvious!

**代码块用缩进限定**

---

**小技巧**：在你的Python解释器内输入下列行，并且注意保持缩进深度。IPython shell会在一行的 :
符号后自动增加缩进，如果要减少缩进，向左侧移动4个空格使用后退键。按两次回车键离开逻辑块。

---

    a = 10
    if a == 1:
        print(1)
    elif a == 2:
        print(2)
    else:
        print('A lot')

    A lot

在脚本中也是强制缩进的。作为练习，在condition.py脚本中以相同的缩进重新输入之前几行，并在IPython中用```run
condition.py```执行脚本。

### 1.2.3.2 for/range

在索引上迭代：

    for i in range(4):
        print(i)

    0
    1
    2
    3

但是最经常使用，也更易读的是在值上迭代：

    for word in ('cool', 'powerful', 'readable'):
        print('Python is %s' % word)

    Python is cool
    Python is powerful
    Python is readable

### 1.2.3.3 while/break/continue

典型的C式While循环（Mandelbrot问题）：

    z = 1 + 1j
    while abs(z) < 100: 
        z = z**2 + 1
    z

    (-134+352j)

**更高级的功能**

bread 跳出for/while循环：

    z = 1 + 1j
    while abs(z) < 100:
        if z.imag == 0:
            break
        z = z**2 + 1
        print z

    (1+2j)
    (-2+4j)
    (-11-16j)
    (-134+352j)

continue 继续下一个循环迭代：

    a = [1, 0, 2, 4]
    for element in a:
        if element == 0:
            continue
        print 1. / element

    1.0
    0.5
    0.25

### 1.2.3.4 条件表达式

**if [OBJECT]：**

评估为False：
    - 任何等于0的数字 (0、0.0、0+0j)
    - 空容器（列表、元组、集合、字典, ...）
    - False，None

评估为True：
    - 任何其他的东西

**a == b：**

判断逻辑是否相等：

    1 == 1

    True

**a is b：**

测试同一性：两边是相同的对象：

    1 is 1
    True
    
    a = 1
    b = 1
    a is b

    True

**a in b：**

对于任何集合b：b包含a

    b = [1, 2, 3]
    2 in b

    True

    5 in b

    False

如果b是字典，这个语法测试a是否是b的一个键。

### 1.2.3.5. 高级循环

#### 1.2.3.5.1 序列循环

你可以在任何序列上进行循环（字符、列表、字典的键，文件的行...）：

    vowels = 'aeiouy'
    for i in 'powerful':
        if i in vowels:
            print(i),
            
    o e u

    message = "Hello how are you?"
    message.split() # 返回一个列表

    ['Hello', 'how', 'are', 'you?']

    for word in message.split():
        print word

    Hello
    how
    are
    you?

很少有语言（特别是科学计算语言）允许在整数或索引之外的循环。在Python中，可以在感兴趣的对象上循环，而不用担心你通常不关心的索引。这个功能通常用来让代码更易
读。

**警告**：改变正在循环的序列是不安全的。

#### 1.2.3.5.2 跟踪列举数

通常任务是在一个序列上循环，同时跟踪项目数。
    - 可以像上面，使用带有计数器的while循环。或者一个for循环：

    words = ('cool', 'powerful', 'readable')
    for i in range(0, len(words)):
        print i, words[i]

    0 cool
    1 powerful
    2 readable

但是，Python为这种情况提供了enumerate关键词：

    for index, item in enumerate(words):
        print index, item

    0 cool
    1 powerful
    2 readable

#### 1.2.3.5.3 字典循环

使用**iteritems**：

    d = {'a': 1, 'b':1.2, 'c':1j}
    for key, val in d.iteritems():
        print('Key: %s has value: %s' % (key, val))

    Key: a has value: 1
    Key: c has value: 1j
    Key: b has value: 1.2

#### 1.2.3.5.4 列表理解

    [i**2 for i in range(4)]

    [0, 1, 4, 9]

---
**练习**

用Wallis公式，计算π的小数

![Wallis公式](http://scipy-lectures.github.io/_images/math/31913b3982be13ed2063b0ffccbcab9cf4931fdb.png)

---

## 1.2.4. 定义函数

### 1.2.4.1 函数的定义

    def test():
        print('in test function')
    
    test()

    in test function

**注意**：函数块必须像其他流程控制块一样缩进

### 1.2.4.2 返回语句

函数**可以选择**返回值。

    def disk_area(radius):
        return 3.14 * radius * radius
    
    disk_area(1.5)

    7.0649999999999995


**注意**：默认函数返回`None`。

**注意**：注意定义函数的语法：

- def关键字：
- 接下来是函数的名称，然后
- 在冒号后是在括号中的函数的参数。
- 函数体；
- 以及可选返回值的返回对象

### 1.2.4.3 参数

必选参数（位置参数）

    def double_it(x):
        return x * 2
    
    double_it(3)

    6

    double_it()
    ---------------------------------------------------------------------------
    TypeError                                 Traceback (most recent call last)

    <ipython-input-25-51cdedbb81b0> in <module>()
    ----> 1 double_it()

    TypeError: double_it() takes exactly 1 argument (0 given)


可选参数（关键词和命名参数）

    def double_it(x=2):
        return x * 2
    
    double_it()

    4

    double_it(3)
    
    6

关键词参数允许你设置特定默认值。

**警告：**默认值在函数定义时被评估，而不是在调用时。如果使用可变类型（即字典或列表）并在函数体内修改他们，这可能会产生问题，因为这个修改会在函数被引用的时候
一直持续存在。

在关键词参数中使用不可变类型：

    bigx = 10
    def double_it(x=bigx):
        return x * 2
    bigx = 1e9  # 现在真的非常大
    double_it()

    20

在关键词参数中使用可变类型（并且在函数体内修改它）：

    def add_to_dict(args={'a': 1, 'b': 2}):
        for i in args.keys():
            args[i] += 1
        print args
    
    add_to_dict

    <function __main__.add_to_dict>

    add_to_dict()

    {'a': 2, 'b': 3}

    add_to_dict()

    {'a': 3, 'b': 4}

    add_to_dict()

    {'a': 4, 'b': 5}

更复杂的例子，实现Python的切片：

    def slicer(seq, start=None, stop=None, step=None):
        """Implement basic python slicing."""
        return seq[start:stop:step]
    
    rhyme = 'one fish, two fish, red fish, blue fish'.split()
    
    rhyme

    ['one', 'fish,', 'two', 'fish,', 'red', 'fish,', 'blue', 'fish']
    
    slicer(rhyme)

    ['one', 'fish,', 'two', 'fish,', 'red', 'fish,', 'blue', 'fish']

    slicer(rhyme, step=2)

    ['one', 'two', 'red', 'blue']

    slicer(rhyme, 1, step=2)

    ['fish,', 'fish,', 'fish,', 'fish']

    slicer(rhyme, start=1, stop=4, step=2)

    ['fish,', 'fish,']

关键词参数的顺序**不**重要：

    slicer(rhyme, step=2, start=1, stop=4)

    ['fish,', 'fish,']

但是，最好是使用与函数定义相同的顺序。

*关键词参数*是特别方便的功能，可以用可变数量的参数来定义一个函数，特别是当函数据绝大多数调用都会使用默认值时。

### 1.2.4.4 值传递

可以在一个函数内部改变变量的值吗？大多数语言（C、Java...）区分了“值传递“和”引用传递“。在Python中，没有严格的这种区分，并且视你的变量是否会修改
而有一些不同。幸运的是，这些情况存在明确的规则。

函数的参数是对象的引用，传递的是值。当你像一个函数传递了一个变量，Python传递的是对象的引用，这个对象引用的变量（值）。而不是变量本身。

如果**值**传递给函数的值是不可变的，那么这个函数并不会改变调用者的变量。如果**值**是可变的，那么函数将可能在原地修改调用者的变量。

    def try_to_modify(x, y, z):
        x = 23
        y.append(42)
        z = [99] # 新引用
        print(x)
        print(y)
        print(z)
    
    a = 77    # 不可变变量
    b = [99]  # 可变变量
    c = [28]
    try_to_modify(a, b, c)

    23
    [99, 42]
    [99]

    print(a)

    77

    print(b)

    [99, 42]

    print(c)

    [28]

函数有名为*local namespace*的本地变量表。

变量X只存在于函数try_to_modify内部。

### 1.2.4.5 全局变量

在函数外定义的变量可以在函数内引用：

    x = 5
    def addx(y):
        return x + y
    
    addx(10)

    15


但是，这些全局变量不能在函数内修改，除非在函数内声明**global**。

这样没用：

    def setx(y):
        x = y
        print('x is %d' % x)
    
    setx(10)

    x is 10

    x

    5

这样可以：

    def setx(y):
        global x
        x = y
        print('x is %d' % x)
    
    setx(10)

    x is 10

    x

    10

### 1.2.4.6 可变数量参数

函数的特殊形式：
    - *args：封装成元组的任意数量的位置参数
    - **kwargs：封装成字典的任意数量的关键词参数

    def variable_args(*args, **kwargs):
        print 'args is', args
        print 'kwargs is', kwargs
    
    variable_args('one', 'two', x=1, y=2, z=3)

    args is ('one', 'two')
    kwargs is {'y': 2, 'x': 1, 'z': 3}

### 1.2.4.7 Docstrings

关于函数作用及参数的文档。通常惯例：

    def funcname(params):
        """Concise one-line sentence describing the function.
        Extended summary which can contain multiple paragraphs.
        """
        # 函数体
        pass
    
    funcname?

```python
Type:           function
Base Class:     type 'function'>
String Form:    <function funcname at 0xeaa0f0>
Namespace:      Interactive
File:           <ipython console>
Definition:     funcname(params)
Docstring:
    Concise one-line sentence describing the function.
    Extended summary which can contain multiple paragraphs.
```

**注 Docstring 指导**

为了标准化，Docstring 惯例页面为Python Docstring相关的含义及惯例提供了文档。

Numpy和Scipy模块也为科学计算函数定义了清晰的标准，你可能想要在自己的函数中去遵循，这个标准有参数部分，例子部分等。见http://projects.s
cipy.org/numpy/wiki/CodingStyleGuidelines#docstring-standard 及
http://projects.scipy.org/numpy/browser/trunk/doc/example.py#L37

### 1.2.4.8 函数作为对象

函数是一级对象，这意味着他们可以是：

- 可以被赋值给变量
- 列表的一个项目（或任何集合）
- 作为参数传递给另一个函数

	    va = variable_args
    
	    va('three', x=1, y=2)

	    args is ('three',)
	    kwargs is {'y': 2, 'x': 1}

### 1.2.4.9 方法

方法是对象的函数。你已经在我们关于列表、字典和字符等...的例子上看到了。

### 1.2.4.10. 练习

**练习：斐波那契数列**

写一个函数来展示斐波那契数列的前n个项目，定义如下：
    - u_0 = 1; u_1 = 1
    - u\_(n+2) = u_(n+1) + u_n

**练习：快速排序**

实现快速排序算法，定义来自wikipedia：

```python
function quicksort(array)
    var list less, greater if length(array) < 2
        return array
    select and remove a pivot value pivot from array for each x in array
        if x < pivot + 1 then append x to less else append x to greater
    return concatenate(quicksort(less), pivot, quicksort(greater))
```
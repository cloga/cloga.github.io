---
author: cloga
comments: true
layout: post
slug: build_a_simple_python_app_on_heroku
title: 在Heroku上搭建简单的Python Web 应用
categories:
- python
tags:
- python
- heroku

---
开发一个小应用放在互联网上给大家使用是一件成就感很高的事情，不过支持Python的免费空间不是很多，虽然GAE支持Python，不过由于众所周知的原因，在国内是很难打开GAE，这篇文章为大家介绍一下[Heroku](https://www.heroku.com/)，heroku是支持Python在数据量不大的情况下是免费。

# 涉及到的工具
* [git](http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)：分布式版本管理工具，这里推荐大家看一下[廖雪峰的GIT教程]((http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000))

* [Virtualenv](http://www.virtualenv.org/en/latest/)，Python的虚拟环境模块

* [Virtualenvwrapper](http://virtualenvwrapper.readthedocs.org/en/latest/)，在Virtualenv之上封装了一些更简便的方法

* [Flask](http://flask.pocoo.org/)，Python的web框架

* [Heroku Toolbelt](https://devcenter.heroku.com/articles/getting-started-with-python#set-up)，Heroku提供的命令行工具

# 搭建本地的环境

* 安装Virtualenv和Virtualenvwrapper

```
sudo pip install Virtualenv
sudo pip install Virtualenvwrapper
```

* 安装之后需要在.bash_profile中添加如下两行代码：

```
export WORKON_HOME=$HOME/.virtualenvs
source /Library/Frameworks/Python.framework/Versions/2.7/bin/virtualenvwrapper.sh
```
这里source的路径可以通过：```which virtualenvwrapper.sh```来确定

* 创建一个叫做toyapp的文件夹，用于存放这个项目相关的文件

* 进入toyapp，初始化一个git仓库

```
cd toyapp
git init
```

* 用Virtualenvwrapper创建一个名为toyapp虚拟环境

```
mkvirtualenv toyapp
```

创建一个虚拟环境好处在于：每个App都有其依赖的特定版本Python模块，不同版本的模块可能导致App无法运行，而在本地的Python主环境中只能安装一个版本的模块，并且不同的App也并不会需要安装主环境中的所有模块。

通过虚拟环境，我们可以为不同的环境安装不同版本的模块，同时也可以为App只安装需要必须模块的纯净环境。

通过mkvirtualenv命令创建虚拟环境后会默认进行这个虚拟环境

* 通过[postactivate](http://virtualenvwrapper.readthedocs.org/en/latest/scripts.html#scripts-postactivate)文件添加一些进入虚拟环境的初始命令

postactivate中的变量可以在运行workon(virtualenvwrapper提供的切换虚拟环境命令)后运行，比如，对于我们的项目，我们可以在postactivate添加cd命令，这样当我们切换到虚拟就可以进入到项目的目录中

```
vi $VIRTUAL_ENV/bin/postactivate
```

在虚拟环境中运行上面的命令，就可以编辑postactivate文件，在vim编辑器中，英文模式下输入i进入插入模式，添加cd 项目的路径，比如cd /Users/cloga/Documents/clogatoyapp，添加完毕后，按ESC键退出插入模式，英文模式下输入:wq保存修改并退出vim

用deactivate命令退出虚拟环境，再用workon toyapp命令进入虚拟环境，这时你会发现目录也会自动进入到项目的路径

* 如果要删除一个虚拟环境，需要使用

```
deactivate
rmvirtualenv 虚拟环境
```

但是这个命令不会删除安装的模块，如果要删除所有按照的模块需要使用

```
rm -r 虚拟环境的文件夹
```

比如对于我的情况，需要使用

```
rm -r /Users/cloga/.virtualenvs/toyapp/
```

# 创建一个简单的Flask项目

* 安装Flask，并把当前环境中依赖的python模块输入到requirements.txt

```
pip install flask
pip freeze > requirements.txt
```

requirements.txt里面记录了当前环境中安装的各种模块及其对应版本，当上传到Heroku时，Heroku会按照这个文件安装对应的模块，如果以后有新增的模块，也需要及时通过pip freeze命令将模块版本信息添加到这个文件中

* 创建app.py，并在其中添加如下代码

``` python
from flask import Flask
app = Flask(__name__)
@app.route('/')
def hello():
	return "Hello World!"
if __name__ == 	'__main__':
	app.run()
```

在terminal中运行 python app.py，这样一个最简单的Flask web app就开始运行了，访问http://localhost:5000/试一下吧

如果要关闭服务器，按CTRL+C

* 简单解释一下app.py中的代码作用
	1. 首先，引入了Flask类
	2. 接下来创建了一个Flask类的实例。参数是这个模块或包的名称。当将app.py直接运行时__name\_\_等于\_\_main\_\_，如果将app作为一个模块引用则等于引用时为app指定的名字。Flask需要这个名字来了解去哪里查找模板，静态文件等等
	3. 用route修饰器来告诉Flask哪些URL应该触发下面方法
	4. 定义一个hello_world方法，当方法运行时返回‘Hello World!’字符串
	5. 最后是一个Python中很常见的用法，如果这个脚本文件是在python解释器直接运行则运行app()
	
所以简单来说，app.py的作用就是当有人访问/页面时返回‘Hello World!’字符串

# 将项目部署到Heroku

* 注册[Herok账号](https://www.heroku.com/)

免费的Heroku支持一个Dynos和10K以下记录的PgSQL

* 下载并安装Heroku [Toolbelt](https://toolbelt.heroku.com/)

Toolbelt提供了Heroku的命令行工具

* 定义 Profile

```
touch Procfile
```

在其中输入以下语句

```
web:gunicorn app:app
```

Profile是一个在应用根目录的文本文件，用于声明用于启动应用的语句

上面的一行语句生命了一个单一的进程类型：web以及运行它需要的语句。Web在这里很重要，它表明这个进程类型将隶属于Heroku的HTTP路由栈，并且在部署时接受web流量

* 安装gunicoin，并将版本信息计入requirements.txt

```
pip install gunicorn
pip freeze > requirements.txt
```

* 登陆Heroku

```
heroku login
```

输入用户名和密码


* 在Heroku上创建一个App

```
heroku create toyapp
```

* 将本地的App推送到Heroku上

```
git add -A
git commot -m 'init'
git push heroku master
```

* 你也可以为这个git库同时绑定一个github仓库

假设你创建了一个名字为test的github仓库，那么你可以通过下面的代码将本地的代码库与远程的Github库关联

```
git remote add origin https://github.com/cloga/test.git
```
通过`git push orgin master`，就可以将本地的代码库推送到github。


* enjoy你的第一个web app吧

```
heroku open
```

PS:我在Heroku上放了两个小项目：

[生成页面标签云](http://app.cloga.info/)

[对应分析](http://app.cloga.info/ca)












 

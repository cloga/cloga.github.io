---
author: admin
comments: true
layout: post
slug: 'Markdown_in_sublime_text'
title: sublime text中的markdown
categories:
- 工具技巧

tags:
- sublime text
- markdown
---

经过[徐爷](http://weibo.com/placeless)推荐，我也开始用sublime text作为文本编辑器使用，之前用TextMate其实也不错，不过TextMate读取大文本文件时的速度实在不能忍受，而sublime text则完全无压力。不过，sublime text在处理中文编码的txt文件方面就没有texemate给力了。不过安装了convertToUTF8和了EncodeingHelper以后，问题也不是很大了。好了闲话就到这里，来说一下Markdown的语法高亮。

由于我将blog从wordpress改成了jekyll，写文章的环境也自然变成了用Markdown，文本编辑器仍然是sublime text，为了更方便的在sublime text中使用Markdown自然少不了各种package的安装。

+ 安装markdown preview

使用sublime text的Package install搜索markdown preview。这个包提供在python markdown和github markdown两种语法，支持在浏览器中对markdown进行预览，也支持将markdown直接转化为html。

+ 安装markdown的语法高亮主题

默认的sublime主题都不支持markdown的语法高亮。我经过一顿Google之后，发现了[Monokai extended](https://github.com/jonschlinkert/sublime-monokai-extended)这个color scheme支持Markdown语法高亮。同样也是使用sublime text的Package install搜索Monokai Extended，安装之后通过Preferences>Color Scheme>Monokai Extended启用。

+ 为markdown文件中引用的其他语法也添加语法高亮效果

Monokai extended对于代码的处理使用的是markdown的默认高亮，即缩进的内容处理为代码，但是代码部分则是没有针对不同的语言处理语法高亮的。经过Google之后，我又发现了[Markdown Extended](https://github.com/jonschlinkert/sublime-markdown-extended#examples)，也是通过sublime text的Package install搜索Monokai Extended进行安装。安装后，打开一个markdown文件在右下角的语言栏选择Markdown Extended激活这种语言高亮，也可以在ctrl + shift + p启用set syntax:markdown extended。

将Monokai extended作为markdown文件的默认语言。通过导航栏，View -> Syntax -> Open all with current extension as... -> Markdown Extended。

Markdown Extended使用GitHub Flavored Markdown(GFM)"fenced" code blocks的方式进行语法高亮。
比如如下的python代码。

	```python
	print 'hello world!'
	```
	
需要注意的是代码块的前需要有空格，才能正确识别代码块。

---
author: cloga0216
comments: true
date: 2012-03-25 12:10:25+00:00
layout: post
slug: '%e7%bf%bb%e8%af%91%e5%88%a9%e5%99%a8google-translate-toolki'
title: 翻译利器Google Translator Toolkit介绍
wordpress_id: 1486
categories:
- 默认
tags:
- Google translator toolkit
- GTT
---

由于近期可能会启动[网站分析图书翻译共享计划](https://code.google.com/p/advanced-web-metrics-with-google-analytics-3rd/)，因此，准备了这一篇工具介绍文章。

**一、Google Translator Toolkit概述**

****Google Translator Toolkit（谷歌翻译工具包简称GTT）是Google提供免费翻译工具，它的主要优势有：

1、支持多种文件格式的全文翻译。支持的文件格式（可惜不支持PDF）如下：

AdWords Editor Archive (.aea)

HTML (.html)

Microsoft Word (.doc)

OpenDocument Text (.odt)

Plain Text (.txt) Rich Text (.rtf)

SubRip (.srt)

SubViewer (.sub)

2、支持术语库和记忆库保持专有数据和翻译风格的一致性

[caption id="attachment_1490" align="aligncenter" width="725" caption="术语库"][![](http://www.cloga.info/wp-content/uploads/2012/03/123123.png)](http://www.cloga.info/wp-content/uploads/2012/03/123123.png)[/caption]

3、中英文对照，翻译起来很方便，同时各种格式也会以GTT的形式保留，比如超链接是{0}文字{/0}。<!-- more -->

[caption id="attachment_1489" align="aligncenter" width="911" caption="翻译界面"][![](http://www.cloga.info/wp-content/uploads/2012/03/QQ20120323002031.png)](http://www.cloga.info/wp-content/uploads/2012/03/QQ20120323002031.png)[/caption]

4、分享功能使团队协作成为可能。

[caption id="attachment_1491" align="aligncenter" width="433" caption="分享界面"][![](http://www.cloga.info/wp-content/uploads/2012/03/2222.png)](http://www.cloga.info/wp-content/uploads/2012/03/2222.png)[/caption]

**二、Google Translator Toolkit的使用说明**

1、创建Google Translator Toolkit账号

访问Google Translator Toolkit网站：[http://translate.google.com/toolkit](http://translate.google.com/toolkit)，只需要使用Google账号登录即可，如果没有则需要申请一个Google账号。

2、GTT主界面菜单介绍

[caption id="attachment_1494" align="alignright" width="205" caption="左侧工具栏"][![](http://www.cloga.info/wp-content/uploads/2012/03/right-toolbar.png)](http://www.cloga.info/wp-content/uploads/2012/03/right-toolbar.png)[/caption]

上传：上传文件或指定URL地址，创建翻译文件 所有翻译：显示所有的翻译文件。

我的标签：可以为翻译文件打标签从而进行分组管理。

共享者：显示与你共享过文件的其他Google用户。

翻译工具：由翻译记忆库与术语库两个工具组成。通过创建和应用翻译记忆库，GTT可以应用你之前的翻译内容到新的翻译文件，而术语库则可以根据其中的内容对术语进行翻译，从而保证术语翻译的一致性，在协同作业的时候尤其好用。这两个工具都需要主动创建，并在翻译任务开始前或进行中指定。

3、创建翻译文件

选定所有翻译菜单下的内容，然后，点击上传，就会进入创建翻译文件的流程。同理，选定翻译记忆库/术语库，点击上传则为上传或创建翻译记忆库/术语库。

[caption id="attachment_1497" align="alignleft" width="338" caption="上传界面"][![](http://www.cloga.info/wp-content/uploads/2012/03/upload1.png)](http://www.cloga.info/wp-content/uploads/2012/03/upload1.png)[/caption]



目前GTT中支持三个来源的翻译文件，本地文件、网页和Wikipedia（其实和网页是一致的）。

这里我以GA Blog介绍流可视化的文章为例。

我选择的是网页，输入这个Blog的文件URL，不需要包含不必要的参数或锚点，包含这部分信息可能导致翻译文件创建失败，同时也会造成自动的命名混乱。为这个翻译文件指定名称，默认会以URL的最后的一部分命名，如果包含参数或锚点，则会以这部分内容命名。

选择源语言和目标语言。

点击共享，指定使用的翻译记忆库及术语库，如果不指定，翻译记忆库会使用全球共享的翻译记忆库，不会使用任何术语库。

点击上传待译文件。GTT就会开始创建翻译文件，这个过程视文件大小而略有差异，这个URL只用了10几秒。

通过本地文件创建翻译文件的过程与通过网页类似。

创建翻译文件完成后会跳转到翻译编辑器界面。

4、翻译编辑器界面

翻译编辑器界面是中英文对照的形式，左侧为英文原文（内容的原始文字），右侧为中文（带翻译的文字）。默认的翻译内容为Google机器翻译后的结果。

当前选定的翻译内容所对应的原文，会以黄色底色显示。

[caption id="attachment_1502" align="aligncenter" width="950" caption="翻译编辑器"][![](http://www.cloga.info/wp-content/uploads/2012/03/translate-editor.png)](http://www.cloga.info/wp-content/uploads/2012/03/translate-editor.png)[/caption]

这其中包含两个工具栏，右上工具栏和编辑栏工具栏。

5、翻译界面右上工具栏

右上工具栏依次包含共享、显示工具包、编辑、查看、保存、保存并关闭，这几个工具。

共享：包含邀请他人、下载、用Google文档打开和发布到原页面。邀请他人即可以为其他Google用户分配对这个翻译文件的权限，权限包括所有者、修改和分享、编辑、评论和阅读。通过为其他用户共享翻译文件可以较方便的进行协同合作。

显示工具包：工具包即在应用于这个翻译文件上翻译记忆库和术语库。点击之后，会在页面下方显示相关信息。

[caption id="attachment_1504" align="aligncenter" width="941" caption="显示工具包"][![](http://www.cloga.info/wp-content/uploads/2012/03/toolkit.png)](http://www.cloga.info/wp-content/uploads/2012/03/toolkit.png)[/caption]

这里我们可以看到，自动显示了术语库中输入的流可视化。

编辑：包含撤销、重做、查询和替换、合并和拆分语句、添加评论、资源、翻译完成以及拼写检查。这里只说一下资源，资源的作用是修改在翻译文件创建之初指定的翻译工具（翻译记忆库和翻译数据库），如果在文件创建之初没有指定，则可以在这里进行修改。

查看：可以编辑一些与显示相关的属性。包括显示评论，同步滚动、弹出还原编辑栏、横向显示面板等。其中值得注意的一个功能是自定义颜色，可以指定不同匹配条件的翻译内容指定不同的颜色。将上下文完全匹配的内容标注为蓝色，将占位符错误的内容标注为红色等。

保存和保存并关闭的作用与它们的名字相同。

6、翻译编辑器的编辑栏工具栏

[caption id="attachment_1505" align="aligncenter" width="532" caption="编辑栏工具栏"][![](http://www.cloga.info/wp-content/uploads/2012/03/editor.png)](http://www.cloga.info/wp-content/uploads/2012/03/editor.png)[/caption]

第一个按钮是用来插入html标签，比如上面的内容中包含一个超链接，因此以{0}这个占位符表示。

第二个按钮是用来显示文章中的重复内容，可以将当前的翻译应用于所有的重复内容。可用的按钮以灰色底色显示，上面的例子没有重复的内容。

第三个按钮是清空翻译框。

第四个按钮是将原文复制到翻译框

第五和第六个按钮是用来切换上一句和下一句。

**三、翻译记忆库和翻译术语库的创建及维护**

[caption id="attachment_1506" align="alignright" width="484" caption="翻译记忆库"][![](http://www.cloga.info/wp-content/uploads/2012/03/tralate-memory.png)](http://www.cloga.info/wp-content/uploads/2012/03/tralate-memory.png)[/caption]

最后，再来简单说一下这两个库的创建与维护。

1、翻译记忆库

翻译记忆库是记忆你以前翻译的内容并应用于以后的翻译任务中，如果翻译的内容相近则机器翻译则会采用这个翻译。它的创建过程比较简单，选中翻译记忆库，点击上传。

由于是新建，因此不需要选择文件，只要输入翻译记忆库的名称，指定是否公用即可。

翻译记忆库的内容会在以后翻译指定使用这个翻译记忆库的文件时，添加到翻译记忆库中。

2、翻译术语库

翻译术语库的创建与维护比翻译记忆库都要繁琐。

[caption id="attachment_1508" align="alignleft" width="332" caption="翻译术语库"][![](http://www.cloga.info/wp-content/uploads/2012/03/translate-glossary.png)](http://www.cloga.info/wp-content/uploads/2012/03/translate-glossary.png)[/caption]

基本的流程与翻译记忆库一致。选定翻译术语库点击上传进行翻译术语库创建页面。

翻译记忆库是在翻译过程中自动生成的，而翻译术语库则是需要手动输入的。格式为.CSV，字符编码为UTF-8。创建术语库的方式之一使用Google文档，创建一个对应的文档，主要包含三列内容：

en：英文术语

zh-Hans：对应的中文

description：关于术语的简短解释。

使用Google文档的一个原因是翻译术语库要求UTF-8编码的.CSV，从Google文档中导出的文件就是UTF-8编码的。同时，Google文档也可以进行分享，多人进行术语表的维护。

[caption id="attachment_1510" align="aligncenter" width="421" caption="翻译术语库格式样例"][![](http://www.cloga.info/wp-content/uploads/2012/03/google-doc.png)](http://www.cloga.info/wp-content/uploads/2012/03/google-doc.png)[/caption]

创建好的术语表，可以查看其中的内容并进行更新，更新的流程与创建的流程类似，导入新的术语表即可。

话说，同样作为Google的产品，应该有一天可以直接将Google文档作为GTT的翻译术语库，我希望这一天能早点到来~

好了，以上就是关于GTT的一些介绍，欢迎您将日常使用GTT的经验与我分享，如果您在使用过程中遇到任何问题也欢迎与我讨论。

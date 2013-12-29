---
author: cloga0216
comments: true
date: 2010-09-28 14:55:24+00:00
layout: post
slug: '%e8%b7%9f%e8%b8%aaflash%e4%ba%8b%e4%bb%b6'
title: 跟踪Flash事件
wordpress_id: 509
tags:
- Flash
---

除非你用Flash建立全站的内容（你会这样吗？），否则，大多数Flash用户交互应被视为事件而不是虚拟综合浏览量。但是，这不是一个硬性规定。在实施前，考虑一下二者的优势和劣势。在这里我仅解释了如何将Flash用户交互追踪为Google Analytics事件。本章的前面部分讨论了虚拟综合浏览量的使用。
你用来跟踪Flash事件的技术由下面两个因素决定：
•用来创建Flash FLA文件的软件，更具体一点，你所使用的ActionScript版本
•你所进行的Flash开发的类型，作为大型网站项目一部分的临时Flash开发，或者专注于Flash的专业人员
**不同的ActionScript版本**
跟踪Flash事件的方法的不同取决于你用旧的ActionScript2还是最新的ActionScript3编码。ActionScript最早包含在Flash Player5中，并且在2006年引入版本3作为Flash Player9或更高版本的一部分。如果你在Flash CS3或更高版本中开发Flash应用，那么，你正在使用的ActionScript3。我建议你尽量使用ActionScript3，因为，它能更好的处理Flash-浏览器交互，因此，更有利于事件追踪。
**使用旧的ActionScript2**
在这个例子中，我假设你在HTML页面上使用了标准的GATC，在这些页面上嵌入了带有播放按钮的Flash SWF动画文件。你想要跟踪播放按钮的点击作为一个事件，类别名是视频、操作名是播放，标签名为唐山大地震。
在你的Flash应用程序中，用getURL调用trackEvent对象，并且将相关的类别、操作和标签参数发送到报告中：
旧的ga.js：
`on (release) {
getURL (“javascript:(function(){pageTracker._trackEvent(‘视频’, ‘播放’,‘唐山大地震’);})()”);
}
`异步代码：
`on (release) {
getURL (“javascript:(function(){_gaq.push([‘_trackEvent’,‘视频’,‘播放’,‘唐山大地震’]);})()”);
}
`就是这么简单！其他的Flash按钮比如停止、暂停也可以以同样的方式定义。多个视频可以通过不同的标签跟踪。因此，为了跟踪三个电影，报告的视频Flash对象的示意图应如图7.9。


[![](http://www.cloga.info/wp-content/uploads/2010/09/7-9.bmp)](http://www.cloga.info/wp-content/uploads/2010/09/7-9.bmp)


进一步扩展这个Flash例子，当视频放在网页上时，你能使用FlashVars参数（Flash MX或更新版本）来提供个性化标签和价值的输入值。FlashVars是Flash所对应的URL查询字符串。也就是说，是一种从HTML向Flash动画传递参数的方式，通过FlashVars传递的变量被放置为Flash动画的_root级别，如下面的例子所示：
`<object classid=”clsid:D27CDB6E-AE6D-11cf-96B8-444553540000” --
codebase=”http://download.macromedia.com/pub/shockwave/
cabs/flash/swflash.cab#version=7,0,19,0” width=”300” height=”400”>
<param name=”FlashVars” value=”label=The%20Incredibles&value=9”/>
<param name=”movie” value=”movie1.swf”/>
<param name=”quality” value=”high”/>
<embed src=”movie1.swf” -- FlashVars=”label=The%20Incredibles&value=9”
quality=”high” -- pluginspage=”http://www.macromedia.com/go/getflashplayer”
type=”application/x-shockwave-flash” width=”300”-- height=”400”></embed>
</object>
`这样播放器中的ActionScript代码就是通用的、可重复使用的——你能为带有来自FlashVars的必要参数的每个动画使用相同的代码。如果你有成百上千个视频文件，但是你不想为每个文件创建个性化的SWF文件时，这是一个相当有用的技术。
在你的Flash应用中，调用如下的_trackEvent对象：
旧的ga.js：
`on (release) {
getURL (“javascript:(function(){pageTracker._trackEvent(‘Video’, ‘Play’, “+label+ “, “ +value+ “);})()”);
}
`异步代码：
`on (release) {
getURL (“javascript:(function(){_gaq.push([‘_trackEvent’,‘Video’,‘Play’,“+label+“,“+value+“)];})()”);
}
`对于同样的三个动画，所报告的视频Flash对象示意图如图7.10。


**[![](http://www.cloga.info/wp-content/uploads/2010/09/7-10.bmp)](http://www.cloga.info/wp-content/uploads/2010/09/7-10.bmp)**


**ActionScript3的使用**
当使用ActionScript3需要多一点代码，尽管原则是一样的。与上一个例子，我假设你在HTML页面上使用了标准的GATC，在这些页面上嵌入了带有播放按钮的Flash SWF动画文件。你想要跟踪播放按钮的点击作为一个事件，类别名是视频、操作名是播放，标签名为唐山大地震。必要的三个步骤如下：
1.在你的FLA文件中添加额外的类引用。这是一次的调用：
`import flash.external.ExternalInterface`
2.修改FLA文件中的按钮和链接，并且将相关的操作、标签和价值参数传递到报告中：
`myBtn.addEventListener(MouseEvent.CLICK, ExternalInterface.call(‘pageTracker._trackEvent’,‘视频’,‘播放’,‘唐山大地震’,‘9’));`
3.修改SWF文件嵌入的HTML：
`<object ...
<param name=”allowScriptAccess” value=”always” />
<!-- {...REMAINING OBJECT CONTENT...} -->
<embed ...
allowScriptAccess=”always”
<!-- {...REMAINING EMBED CONTENT...} -->
</embed>
</object>`
与ActionScript2的使用一样，你也可以使用FlashVars参数来为你的SWF文件提供标签与价值的输入值，将其作为通用的、易于重复使用。在你的HTML文件中，FlashVars的使用与前面所描述的ActionScript一样：
`<param name=”FlashVars” value=”label=The%20唐山大地震&value=9”/>`
但是，对于ActionScript3，引入的FlashVars变量在主时间线中不再作为一个松散集合。相反，这些变量存储在与DisplayObject相关的类LoaderInfo的属性parameters中。在你的FLA文件中使用这些值，使用下列的格式：
`myBtn.addEventListener(MouseEvent.CLICK, ExternalInterface.call(‘pageTracker._trackEvent’,’Video’, ‘Play’, root.loaderInfo.parameters.label,root.loaderInfo.parameters.value));`

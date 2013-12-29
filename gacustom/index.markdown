---
author: cloga0216
comments: true
date: 2011-06-20 15:42:56+00:00
layout: page
slug: gacustom
title: GATC定制
wordpress_id: 1128
---






  

输入你的网络资源ID
    
形式为UA-XXXXX-YY
  







             







是否跨域  


不跨域  


跨子域  


跨主域  






 

 
  
  
  

输入你的主域
    
假如你的域名为www.abc.com，则请输入abc.com
  










			 
             







  

下面是你的GA代码，把它放置到</head>的前面  




<script type="text/javascript">  

var _gaq = _gaq || [];  

_gaq.push(['_setAccount', 'UA-XXXXX-YY']);  


_gaq.push(['_setDomainName','abc.com']);  

_gaq.push(['_addIgnoredRef','.abc.com']);  





_gaq.push(['_setAllowHash',false]);  

_gaq.push(['_setAllowLinker',true]);  



_gaq.push(['_addOrganic','baidu','word']);  

_gaq.push(['_addOrganic','soso','w']);  

_gaq.push(['_addOrganic','sogou','query']);  

_gaq.push(['_trackPageview']);  

_gaq.push(['_trackPageLoadTime']);  


(function() {  

var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;  

ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';  

var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);  

})();  

</script>

---
layout: page
title: Cloga的互联网笔记
tagline: 
---
{% include JB/setup %}

花了点时间将Blog从Wordpress切换到Jekyll，用markdown和github写文章感觉还不错，不过就是以前老文章中的图片整理出来比较麻烦，⊙﹏⊙b汗

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
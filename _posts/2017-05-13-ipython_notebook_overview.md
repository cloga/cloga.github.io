---
title: "服务器脚本开发效率神器jupyter notebook"
author: "cloga"
comments: yes
output: pdf_document
layout: post
slug: multivariate data visualization
tags:
- notebook
- python
categories: python
---

在本地上写python脚本通常使用的效率工具组合ipython + sublimetext，但是，当需要将本地开发的脚本部署到服务器上时，流程就略显复杂，一般的流程是先通过跳板机ssh上去，再从跳板机ssh到服务器，编写好的脚本则需要两次scp才能上传到服务器上，在服务器上调试脚本和修改脚本也相对麻烦，前者可以用ipython，后者则可以是在本地重新scp两次或者在服务器上通过vim来直接修改服务器文件，可能因为我不习惯这种编程模型一直觉得流程不是那么顺。刚好最近在服务器上打一个jupyter notebook，发现使用notebook会是整个流程顺畅很多，这里记录一下相关的一些经验。

## 安装python

一般linux服务器上都有安装python，不过版本可能较低，可以自己手动安装最新版本。

一般的流程是wget下载最新的python包，tar xvf解压tar包
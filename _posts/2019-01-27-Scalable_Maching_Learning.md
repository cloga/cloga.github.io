---
title: "大规模机器学习-2018的DataOps/MLOps"
author: "cloga"
comments: yes
layout: post
slug: SCALABLE_MACHINE_LEARNING
tags:
- machine_learning
categories: 他山之石
---

## 动机

数据科学可以被概括为两个工作流：

- 模型开发
- 模型服务

![image-20190127174538706](/files/image-20190127174538706.png)

当数据科学团队较小的时候，不会面临太多的问题，所有事情都相对较好。

- 需要维护的模型较少
- 关于模型的知识在数据科学家的头脑中
- 每个人有跟踪流程的方法

但是，随着数据科学需求的增长，将面临新的问题

- 数据流的复杂度增加
  - 大量的数据处理工作流
  - 数据没有在标准化的流程中修改
  - 管理复杂的流和定时任务变得不可管理

![classification_large](https://axsauze.github.io/scalable-data-science/images/crontab.jpg)

- 每个数据科学家有他们自己的工具集

  - 一些喜欢tensorflow
  - 一些喜欢R
  - 一些喜欢Spark
  - 一些喜欢所有

  ![classification_large](https://axsauze.github.io/scalable-data-science/images/mlibs.jpg)

- 模型服务变得越来越难

  - 不同的模板版本跑在不同的环境中
  - 部署和回滚模型变得越来越复杂

- 问题出现很难回溯

  - 数据科学家说是数据管道上的bug
  - 数据工程师说是模型出了问题
  - 变成了猫鼠游戏

  ![classification_large](https://axsauze.github.io/scalable-data-science/images/gitblame.jpg)

  幸运的是，许多同行都面临这些的问题有段时间了，这是一个大家都要解决的问题。

  数据科学家：负责模型的开发

  数据工程师：负责数据管道的开发

  DevOps/DataOps/MLOps工程师：负责模型、数据管道和产品的生产化（由原型阶段部署到大规模的生产环境）

  ## 概念

  因为技术功能变化了，因此基础设施也该对应的进化。

  ![image-20190127132900291](/files/image-20190127132900291.png)

  ![image-20190127171943291](/files/image-20190127171943291.png)

ML-OPS的两个原则：

- 重现性（Reproducibility）
- 编排

![image-20190127172718350](/files/image-20190127172718350.png)

原则1:模型和数据的版本

![image-20190127173229710](/files/image-20190127173229710.png)

数据科学重现性的古老问题。

解藕管道中每一步。

![image-20190127173703528](/files/image-20190127173703528.png)

每一步都包含代码/配置，以及特定的数据数据输入和输出。

每一步的抽象：

![image-20190127174155242](/files/image-20190127174155242.png)

- 数据输入

```shell
$ cat data-input.csv

>            Date    Open    High     Low   Close     Market Cap
> 1608 2013-04-28  135.30  135.98  132.10  134.21  1,500,520,000
> 1607 2013-04-29  134.44  147.49  134.00  144.54  1,491,160,000
> 1606 2013-04-30  144.00  146.93  134.05  139.00  1,597,780,000
```

- 代码/配置

```shell
$ cat feature-extractor.py

> def open_norm_feature_extractor(df):
>     feature = some_lib.get_open(df)
>     return feature
```

- 数据输出

```shell
$ cat data-output.csv

>   Open 
>   0.57 
>   0.59 
>   0.47 
```
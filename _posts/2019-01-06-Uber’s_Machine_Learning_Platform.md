---
title: "Uber机器学习平台简介"
author: "cloga"
comments: yes
layout: post
slug: machine_learning_platform
tags:
- machine_learning
categories: 他山之石
---

Uber在自家的博客上用两篇文章的篇幅介绍了他们自己的机器学习平台(Michelangelo)[Meet Michelangelo: Uber’s Machine Learning Platform](https://eng.uber.com/michelangelo/) 和 [Michelangelo PyML: Introducing Uber’s Platform for Rapid Python ML Model Development](https://eng.uber.com/michelangelo-pyml/)。最近看了一下这两篇文章，相关的内容节选如下。

![](https://eng.uber.com/wp-content/uploads/2017/09/Featured-Image.png)

## 系统架构

Michelangelo由开源系统和内置的组件混合组成。使用的主要的开源组件有[HDFS](http://hadoop.apache.org/), [Spark](https://spark.apache.org/), [Samza](http://samza.apache.org/), [Cassandra](http://cassandra.apache.org/), [MLLib](https://spark.apache.org/mllib/), [XGBoost](https://github.com/dmlc/xgboost), and [TensorFlow](https://www.tensorflow.org/)。Uber通常倾向于使用可能的成熟开源选项，并且将会fork，自定义预计反向贡献，如果没有合适的开源项目，则会自主开发。

Michelangelo是构筑在Uber的数据和计算基础设置之上，这些基础设施提供了存储Uber所有交易和日志数据的数据湖，从所有Uber服务聚合日志数据的kafka broker，Samza流式计算引擎，Cassandra 集群和Uber自建的服务编排和部署工具。

## 机器学习工作流

几乎所有的Uber机器学习用例都存在相似的通用工作流，无论是分类还是回归问题，还是时间序列预测。这个工作流通常对实现是无感知的，因此可以很简单的扩展新算法类型和框架，例如更新的深度学习框架。也支持不同的不是模型，例如在线和离线的预测用例。

Michelangelo被设计为提供可扩展，可靠，可复制，易于使用和自动化的工具来解决以下六个步骤的工作流：

1. 管理数据
2. 训练模型
3. 评估模型
4. 部署模型
5. 作出预测
6. 监控预测

### 管理数据

寻找好的特征是机器学习最难的部分，构建和管理数据pipeline通常是完整机器学习方案成本最高的部分。

机器学习平台应该提供标准工具，用于构建数据pipeline来生成特征和标记数据集用于训练（再训练）以及只包含特征的数据集用于预测。这些工具应该与公司的数据湖或数据仓库，以及公司的自身数据服务系统深度整合。pipeline需要高效和可扩展，需要与数据流和数据质量的监控整合在一起，同时支持在线和离线训练与预测。理想的话，也应该有一种方式在团队内可共享的生成特征，以减少重复性工作和提高数据矢量。也应该提供强壮的警戒线和控制来鼓励和武装用户来接受最佳实践（即，很方便的保证训练和预测时，数据生成和准备流程是相同的。）

Michelangelo的数据管理组件被拆分为在线和离线pipeline。目前，离线pipeline被用于批量模型训练和批量预测任务，而在线pipeline用于在线低延迟的预测（未来会用于在线学习系统）。

另外，在数据管理层增加了一层，特征库，允许团队分享、发现以及在他们的机器学习任务上使用精心设计特征集。Uber的许多建模问题使用相同或类似的特征，使团队在内部项目间共享特征以及不同组织间的团队间分享特征很有价值。

![数据准备pipeline推送数据到特征库和训练数据仓库](http://eng.uber.com/wp-content/uploads/2017/09/image5.png)

图1 数据准备pipeline推送数据到特征库和训练数据仓库

#### 离线

Uber的交易和日志数据流入HDFS数据湖，可以方便的用Spark和Hive SQL来计算任务。Uber提供了容器，并且调度常规任务来计算特征，这些特征可以被用于特征项目或发布到特征库（见下面）在团队间共享，通过批量任务在调度器或触发器上运行并且与数据质量监控工具整合起来，可以快速的识别pipeline的数据质量下降，无论是因为本地或者上游的代码或者数据问题。

#### 在线

在线部署的模型不能访问存储在HDFS中的数据，通常考虑性能的情况下直接从后端生产服务计算模型特征是很困难（例如，不可能直接查询UberEATS订单服务计算一个饭店一定时间的平均餐食准备时间）。反之，我们预计算允许在线模型需要的特征，并且存储在Cassandra，在预测时以很低的延迟读取出来。


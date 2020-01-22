---
title: "使用s2i封装Python模型-Seldon Core"
author: "cloga"
comments: yes
layout: post
slug: Packaging_a_Python_model_for_Seldon_Core_using_s2i
tags:
- Seldon
- model serving
categories: 
- Seldon
- model serving
- 他山之石
---

[原文联接](https://github.com/SeldonIO/seldon-core/blob/master/docs/wrappers/python.md)

在这个指南中，将演示将python模型封装在docker镜像中，以便Seldon Core随时使用[source-to-image app s2i](https://github.com/openshift/source-to-image)来部署，所需的步骤。

如果对s2i不熟悉，先读一下[s2i的基本说明](https://github.com/SeldonIO/seldon-core/blob/master/docs/wrappers/s2i.md)，然后遵循如下步骤。

## 步骤1-安装s2i

[下载安装s2i](https://github.com/openshift/source-to-image#installation)

- 使用s2i的前提条件是：
    - Docker
    - Git（如果从远程的git仓库building）

要检查一下所有东西是否就绪，可以运行

```shell
s2i usage seldonio/seldon-core-s2i-python3:0.4
```

## 步骤2-创建源码

要使用s2i创建镜像来封装python模型需要：

- 带有一个运行模型类的python文件
- requirements.txt或setup.py
- .s2i/environment - 使用s2i building的模型定义，来正确封装模型

下面是每个步骤的详细步骤：

### Python文件

源码需要包含在一个python文件中，这个文件定义了与文件相同名称的类。例如，看一下wrappers/s2i/python/test/model-template-app/MyModel.py的python模型文件框架：

```python
class MyModel(object):
    """
    Model template. You can load your model parameters in __init__ from a location accessible at runtime
    """
 
    def __init__(self):
        """
        Add any initialization parameters. These will be passed at runtime from the graph definition parameters defined in your seldondeployment kubernetes resource manifest.
        """
        print("Initializing")
 
    def predict(self,X,features_names):
        """
        Return a prediction.
 
        Parameters
        ----------
        X : array-like
        feature_names : array of feature names (optional)
        """
        print("Predict called - will run identity function")
        return X
 
 
    def send_feedback(self,features,feature_names,reward,truth,routing=None):
 
        print("Send feedback called")
 
        return []
     
    def class_names(self) -> Iterable[str]:
```

- 这个文件名称为MyModel.py，它定义了一个MyModel类
- 这个类包含一个predict方法，接受数组（numpy）X和feature_names（特征名称，必须包含这个参数），并且返回一个预测的数组。
- 可以在类的init方法添加任何需要的初始化
- 返回的数组最少是2维
- feedback提供反馈信息
- class_names方法：标签后处理

### requrirment.txt

针对代码需要的依赖生成一个requirements.txt。当创建镜像时，这将通过pip安装。如果你喜欢也可以提供一个setup.py。

### .s2i/environment

定义python builder 镜像封装模型需要的关键参数。例如：

```sh
MODEL_NAME=MyModel
API_TYPE=REST
SERVICE_TYPE=MODEL
PERSISTENCE=0
```

这些值也可以通过创建镜像时的命令行提供或者覆盖。

MODEL_NAME需要保证与model.py一致

### 步骤3-创建镜像

使用s2i build从源代码创建Docker镜像。需要机器上安装Docker，如果源代码是公开的git仓库还需要安装git。可以从下面三个python builder 镜像选择一个

- Python2：seldonio/seldon-core-s2i-python2:0.4
- Python3.6：seldonio/seldon-core-s2i-python36:0.4, seldonio/seldon-core-s2i-python3:0.4
    - 注意[在Python3.7下运行Tensorflow有一些问题](https://github.com/tensorflow/tensorflow/issues/20444)（2018 11月），TensorFlow官方并不支持Python3.7（2018 12月）。
- Python 3.6 加上 通过[Intel nGraph](https://github.com/NervanaSystems/ngraph)提供的ONNX支持：seldonio/seldon-core-s2i-python3-ngraph-onnx:0.1

- 使用s2i你可以直接从git仓库或本地源文件夹创建镜像。查看[s2i文档](https://github.com/openshift/source-to-image/blob/master/docs/cli.md#s2i-build)了解详情。通用的格式是：

```sh
s2i build <git-repo> seldonio/seldon-core-s2i-python2:0.4 <my-image-name>
s2i build <src-folder> seldonio/seldon-core-s2i-python2:0.4 <my-image-name>
```

使用使用python3，修改为seldonio/seldon-core-s2i-python3。

使用seldon-core内部的测试模板模型的样例：

```sh
s2i build https://github.com/seldonio/seldon-core.git --context-dir=wrappers/s2i/python/test/model-template-app seldonio/seldon-core-s2i-python2:0.4 seldon-core-template-model
```

以上s2i build命令：

- 使用Github仓库：https://github.com/seldonio/seldon-core.git 以及这个仓库中的目录wrappers/s2i/python/test/model-template-app
- 使用builder image seldonio/seldon-core-s2i-python2
- 创建doker镜像seldon-core-template-model

要从本地的源文件夹创建镜像，这个例子是从seldon-core复制：

```sh
git clone https://github.com/seldonio/seldon-core.git
cd seldon-core
s2i build wrappers/s2i/python/test/model-template-app seldonio/seldon-core-s2i-python2:0.4 seldon-core-template-model
```

更多的帮助参见：

```sh
s2i usage seldonio/seldon-core-s2i-python2:0.4
s2i usage seldonio/seldon-core-s2i-python3:0.4
s2i build --help
```
### 预测数据格式

输入格式参考：https://docs.seldon.io/projects/seldon-core/en/latest/reference/apis/internal-api.html

seldon支持两种数据格式，一种是ndarray，另一种为tensor，二者是等价的，ndarray可以直接输出，tensor的话，需要指定shape和values

输入的数据包含的key如下：

data：数据的值，其下包含：

ndarray / tensor：具体的数据，如果是tensor则需要指定shape和values

names：列名，可选

meta：其他元数据，可选

增加其他的key请求不受影响

数据请求是form中，key为json

```python

headers = {'Content-Type': 'application/x-www-form-urlencoded'}
import json
r = requests.post('http://0.0.0.0:5000/predict', data=f'json={data.to_json()}', headers=headers)
print(r.json())
```

```json
{"data":{"names":["alcohol", "chlorides", "citric acid", "density", "fixed acidity", "free sulfur dioxide", "pH", "residual sugar", "sulphates", "total sulfur dioxide", "volatile acidity"],"ndarray":[[12.8, 0.029, 0.48, 0.98, 6.2, 29, 3.33, 1.2, 0.39, 75, 0.66]]}}
```

```sh
!curl -H "Content-Type: application/x-www-form-urlencoded" -g 0.0.0.0:5000/predict -d 'json={"data":{"names":["alcohol", "chlorides", "citric acid", "density", "fixed acidity", "free sulfur dioxide", "pH", "residual sugar", "sulphates", "total sulfur dioxide", "volatile acidity"],"ndarray":[[12.8, 0.029, 0.48, 0.98, 6.2, 29, 3.33, 1.2, 0.39, 75, 0.66]]}}'
```

```sh
{"data":{"names":["a","b"],"tensor":{"shape":[2,2],"values":[0,0,1,1]}}}
```

```sh
curl -v 0.0.0.0:8003/seldon/mymodel/api/v0.1/predictions -d '{"data":{"names":["a","b"],"tensor":{"shape":[2,2],"values":[0,0,1,1]}}}' -H "Content-Type: application/json"
```

## 使用Keras/Tensorflow模型

要保证后端使用Tensorflow的Keras模型正常工作，需要在模型加载后调用_make_predict_function()。这是因为Flask将从与初始化模型不同的线程来调用预测请求。更多的讨论看一下[这里](https://github.com/keras-team/keras/issues/6462)。

## 参考

### 环境变量
builder iamge可以理解的必要环境变量解释如下。可以在.s2i/environment环境文件或s2i build提供这些变量。

#### MODEL_NAME
包含模型的类名。也是将要导入的python文件的名称。

#### API_TYPE
要创建的API类型。可以是REST或者GRPC。

#### SERVICE_TYPE
创建的服务类型。可选项为：

- MODEL，模型
- ROUTER，路由
- TRANSFORMER，转换器
- COMBINER，合并器
- OUTLIER_DETECTOR，异常识别器

#### PERSISTENCE
设置为0或1。默认是0。如果设置为1，那么模型将被周期保存到redis，并且从redis加载（如果存在的话）或者不存在的话，重新创建。

### 创建不同的服务类型

#### 模型
- [A minimal skeleton for model source code](https://github.com/cliveseldon/seldon-core/tree/s2i/wrappers/s2i/python/test/model-template-app)
- [Example models](https://github.com/SeldonIO/seldon-core/tree/master/examples/models)

#### 路由
- [Description of routers in Seldon Core](https://github.com/SeldonIO/seldon-core/blob/master/components/routers/README.md)
- [A minimal skeleton for router source code](https://github.com/cliveseldon/seldon-core/tree/s2i/wrappers/s2i/python/test/router-template-app)
- [Example routers](https://github.com/SeldonIO/seldon-core/tree/master/examples/routers)

#### 转换器
[A minimal skeleton for transformer source code](https://github.com/cliveseldon/seldon-core/tree/s2i/wrappers/s2i/python/test/transformer-template-app)
[Example transformers](https://github.com/SeldonIO/seldon-core/tree/master/examples/transformers)

## 高级用法
### 模型类参数
当把镜像部署到K8s可以为组件添加参数（arguments），这些参数从定义在SeldonDeloyment的（parameters）生成。例如，[Python TFServing proxy](https://github.com/SeldonIO/seldon-core/tree/master/integrations/tfserving)有个类init函数，形式如下：

```python
class TfServingProxy(object):
 
def __init__(self,rest_endpoint=None,grpc_endpoint=None,model_name=None,signature_name=None,model_input=None,model_output=None):
```

这些参数在部署一个Seldon Deployment时设置。可以在[MNIST TFServing example](https://github.com/SeldonIO/seldon-core/blob/master/examples/models/tfserving-mnist/tfserving-mnist.ipynb)找到样例，参数在[SeldonDeployment](https://github.com/SeldonIO/seldon-core/blob/master/examples/models/tfserving-mnist/mnist_tfserving_deployment.json.template)中定义，一部分内容如下：

```json

"graph": {
            "name": "tfserving-proxy",
            "endpoint": { "type" : "REST" },
            "type": "MODEL",
            "children": [],
            "parameters":
            [
            {
                "name":"grpc_endpoint",
                "type":"STRING",
                "value":"localhost:8000"
            },
            {
                "name":"model_name",
                "type":"STRING",
                "value":"mnist-model"
            },
            {
                "name":"model_output",
                "type":"STRING",
                "value":"scores"
            },
            {
                "name":"model_input",
                "type":"STRING",
                "value":"images"
            },
            {
                "name":"signature_name",
                "type":"STRING",
                "value":"predict_images"
            }
            ]
},
```

允许的参数type值是在[proto buffer definition](https://github.com/SeldonIO/seldon-core/blob/44f7048efd0f6be80a857875058d23efc4221205/proto/seldon_deployment.proto#L117-L131)定义。

### 本地Python依赖

from version 0.5-SNAPSHOT

要使用私有仓库来安装Python依赖，使用如下build命令：

```sh
s2i build -i <python-wheel-folder>:/whl <src-folder> seldonio/seldon-core-s2i-python2:0.5-SNAPSHOT <my-image-name>
```

这个命令将优先查看在<python-wheel-folder> 本地的Python Wheels，并使用这些文件而不是在PyPI搜索。

### 自定义指标

from version 0.3

要为响应添加自定义指标，可以在类中定义可选的方法 metrics 返回一个 metric 字典的列表。例子如下：

```python
class MyModel(object):
 
    def predict(self,X,features_names):
        return X
 
    def metrics(self):
        return [{"type":"COUNTER","key":"mycounter","value":1}]
```

更多自定义指标和和指标字典的格式见[这里](https://github.com/SeldonIO/seldon-core/blob/master/docs/custom_metrics.md)。

这是一个[解释使用python自定义指标模型的notebook例子](https://github.com/SeldonIO/seldon-core/blob/master/examples/models/template_model_with_metrics/modelWithMetrics.ipynb)。

### 自定义元数据

from version 0.3

要添加自定义元数据，可以添加可选 tags 方法，这个方法将返回自定义元数据的字典，如下面的例子所示：

```python
class UserObject(object):
 
    def predict(self,X,features_names):
        return X
 
    def tags(self):
        return {"mytag":1}
```
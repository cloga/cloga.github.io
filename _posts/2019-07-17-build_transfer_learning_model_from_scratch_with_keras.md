---
title: "使用keras从0开始搭建迁移学习模型"
author: "cloga"
comments: yes
layout: post
slug: build_transfer_learning_model_from_scratch_with_keras
tags:
- python
- deep learning
- keras
categories: 
- python
- deep learning
- keras

---

人工智能领域目前最火的莫过于深度学习了，但是，由于深度学习与传统的机器学习从原理和技术上有一些明显的不同，对于一些新人来说，往往有些不知如何入手。本文准备通过keras官方的fine tune代码样例，解释一下搭建迁移学习模型的流程。

## 深度学习的基本介绍

这里简单介绍一下深度学习相关知识，为了方便大家理解，我会与传统机器学习的一些知识进行类比。深度学习本质上是对人脑视觉生物工作原理上的类比。人脑在处理视觉信息时，最小的处理单元是视神经元，一个视神经元会有某些刺激作出反应，对于视觉来说，神经元会有不同的层次来进行组织，不同的层来处理不同的刺激（特征），上层神经元接受的信息来自下层神经元。例如，最底层的光感受细胞，感受原始的光学刺激，初级视觉皮层的神经元，从光感受细胞的刺激中经过处理获得边缘、方向等信息。再经过更高级的神经网络层，进一步抽取更抽象的特征，例如轮廓、形状等，最终由大脑作出物体类型的判断。

在上面这个过程描述中，引入了神经元、网络层（layer）、网络结构这些深度学习的重要概念。深度学习过程中，是要在一个网络结构上训练对应权重文件，权重文件就是层与层之间神经元传输信息的权重。对应到机器学习领域，网络结构可以理解为一种算法，权重文件是算法经过数据训练后得到的模型。

而我们经常听到的DNN、CNN和RNN这些属于更大的一类网络类型。DNN是深度神经网络，是较早的一类神经网络类型，比如线性感知器多层感知器，主要应用于解决传统的机器学习任务。而CNN是卷积神经网络，是根据人类视觉的流程而模拟出来的，在计算机视觉中有广泛的应用。著名的VGG，mobileNet，inception都是CNN的一种具体网络结构；而RNN则是循环神经网络，主要用于时间序列方面的建模，对于自然语言处理这类带有时间上下文的任务效果显著，著名的LSTM就是RNN的代表，LSTM也是来自于对人类记忆系统的模拟，全称叫做长短时记忆。同样从人类得到其他的还有注意门等等。这类网络类型和机器学习中的算法类别很像。比如机器学习算法类别有广义线性模型，其中有logistic回归，线性回归等。这些具体的算法就像inception，vgg这类网络结构。

其实从人工智能总体的发展流程来看，人工智能的终极目标是使机器产生与人类一样的智能，在具体实现方式上存在两个流派，一类是功能类比，一类是结构类比。前者是不关心具体的实现方式，只要机器可以与人类作出相同的事情，那么就认为机器在相关问题上具有了人类的智能。后者的隐含假设是结构相同的物体也会有相同的功能，如果人类设计的智能体的结构能够和人脑一样，那么也可以表现出与人脑一样的智能。两种流派各有优劣，功能类比面临的问题是无法找到通用智能，在某类任务上表现出的智能未必会适用于其他任务，今年打败各国围棋高手的alpha go也仅仅是适用于围棋类任务，而结构类比，多少有些不可知论的意味。当然随着研究的深入，二者也有逐渐融合的趋势。而深度学习恰恰是二者融合的一个证明，人工智能在用想拖到结构在处理类似的功能，实际效果目前来看也比较乐观。

## 迁移学习的基本介绍

了解了深度学习的基本知识，接下来看一下本篇文章的主题之一迁移学习。迁移学习本身也是认知/教育心理学的概念。其基本含义是当人类掌握了某项技能或知识后，再学习相近领域的时候时，由于有先前的经验，可以加速学习过程，即先前相近任务的知识经验迁移到新的任务上。如果从生理学角度去思考的话，神经元的放电模型来激活相关神经元，相近任务的神经元的联接拓扑结构更近，更容易得到激活。比如，本身会滑旱冰的人，学习滑冰会很快。

具体到深度学习的任务，在视觉任务中，前面提到的CNN卷积神经网络，在不同的图片分类任务上，用于识别具体像素的网络层，用于学习边缘、方向这些更高一级的网络层，以及用于学习更抽象特征，轮廓、形状的网络层，这些层的作用都是相近的，可以迁移到的不同图片分类任务上，所需要作出修改的通常只是模型最后几层。

下面以keras为例，来说明如何进行深度的学习的迁移学习。keras是比tensorflow更高级（更简单）的深度学习工具，它提供了更很多方便的工具，底层可以使用多种深度学习框架。它与tensorflow的关系，可以用pandas与numpy的关系来类比。

这里与keras官方迁移学习（fine tune）的例子代码作为示例。

```python
from keras.applications.inception_v3 import InceptionV3
from keras.preprocessing import image
from keras.models import Model
from keras.layers import Dense, GlobalAveragePooling2D
from keras import backend as K
```

首先加载相关的依赖。application是keras集成的预训练的模型。这些模型可以直接拿来进行推理，可以进行迁移学习。


```python
base_model = InceptionV3(weights='imagenet', include_top=False)
# base_model = InceptionV3(weights='inception_v3_weights_tf_dim_ordering_tf_kernels.h5', include_top=False)
```

这里是加载预训练的权重文件即深度学习中的模型。在深度学习领域，模型与权重文件是等价的。

weights：接受三类参数，imgaenet是从网络下载在imagenet上训练好的权重文件；None，则是进行随机初始化，通常是要从头训练一个权重文件时使用，这需要大量的训练数据，不推荐；具体的权重文件地址，可以使用自己训练的权重文件。

include_top：是是否包含最后的分类层，如果是要进行迁移学习，使用False，如果直接使用预训练的模型进行推理，则使用True。

如果你对模型的网络结构很感兴趣，你可以通过一些命令查看每个层的具体配置。

```python
len(base_model.layers)
for l in base_model.layers[:3]:
    print(l.name)
    print(l.get_config())
```

你会看到这是一个311层的网络。
前三层是输入层、conv2d、batch_normalization
```js
input_2
{'batch_input_shape': (None, None, None, 3), 'dtype': 'float32', 'sparse': False, 'name': 'input_2'}
conv2d_95
{'name': 'conv2d_95', 'trainable': True, 'filters': 32, 'kernel_size': (3, 3), 'strides': (2, 2), 'padding': 'valid', 'data_format': 'channels_last', 'dilation_rate': (1, 1), 'activation': 'linear', 'use_bias': False, 'kernel_initializer': {'class_name': 'VarianceScaling', 'config': {'scale': 1.0, 'mode': 'fan_avg', 'distribution': 'uniform', 'seed': None}}, 'bias_initializer': {'class_name': 'Zeros', 'config': {}}, 'kernel_regularizer': None, 'bias_regularizer': None, 'activity_regularizer': None, 'kernel_constraint': None, 'bias_constraint': None}
batch_normalization_95
{'name': 'batch_normalization_95', 'trainable': True, 'axis': 3, 'momentum': 0.99, 'epsilon': 0.001, 'center': True, 'scale': False, 'beta_initializer': {'class_name': 'Zeros', 'config': {}}, 'gamma_initializer': {'class_name': 'Ones', 'config': {}}, 'moving_mean_initializer': {'class_name': 'Zeros', 'config': {}}, 'moving_variance_initializer': {'class_name': 'Ones', 'config': {}}, 'beta_regularizer': None, 'gamma_regularizer': None, 'beta_constraint': None, 'gamma_constraint': None}
```

接下来让我们增加最后分类层。

```python
# add a global spatial average pooling layer
x = base_model.output
x = GlobalAveragePooling2D()(x)
# let's add a fully-connected layer
x = Dense(1024, activation='relu')(x)
# and a logistic layer -- let's say we have 200 classes
predictions = Dense(2, activation='softmax')(x)
```

这里增加了三层，GlobalAveragePooling2D用于降维，再增加两个全联接层，第一个是1024维，第二个的维度取决于分类任务的数量，我这边是一个2分类任务就改为了2。

接下来是进行模型的实例化，类似sklearn中对具体的算法进行实例化。

```python
# this is the model we will train
model = Model(inputs=base_model.input, outputs=predictions)
# first: train only the top layers (which were randomly initialized)
# i.e. freeze all convolutional InceptionV3 layers
for layer in base_model:
    layer.trainable = False
# compile the model (should be done *after* setting layers to non-trainable)
model.compile(optimizer='rmsprop', loss='sparse_categorical_crossentropy')
```

由于我们要进行迁移学习，只有我们后加的三层需要训练，其他的层直接使用inception原有的权重即可，因此，需要将其他层（原有inception的网络层）的trainable属性设置为False，在模型训练过程中只会训练trainable为True的网络层。

接下来构建用于训练的数据集，keras提供了很多的方法来直接从图片转换为numpy ndarray。

```python
from keras.preprocessing import image
train_datagen = image.ImageDataGenerator()
```

深度学习与大部分机器学习训练任务不同，大部分机器学习任务都是一次将所有训练数据加载到内存中（无论是单机内存还是分布式内存），而深度学习都是不断的进行迭代增量学习的，每次学习都会对网络上的权重进行更新。

这里面还要解释几个深度学习训练的参数：
- epoch：一个时代，其实就是一次迭代，所有训练集都从深度网络过了一遍就是时代。
- batch：一次训练使用多大的样本量，batch size的大小会影响训练的效率，过大的batch size可能会导致错过全局最优解，损失函数无法收敛，而过小的batch size会加大一个epoch所耗时间
- step：一个epoch需要多少次训练，通常steps = len(train_data) // batch size

由于深度学习的训练本身就是以batch的方式进行，因此不需要将所有的数据一次性load到内存/显存中，通常的深度学习任务都会有大量的训练数据，一次性加载到内存/显存中也并不现实。因此，keras提供的datagenerator，以生成器的方式，在每个batch中，只将这个step需要的数据加载到内存中。

当然ImageDataGenerator也提供了数据增强的功能，提供了很多的计算机视觉方法来进行数据增强，数据增强这个话题可以单独开一篇文章来探讨一下，这里就不过多做展开，在我给出的demo代码中，也仅仅是将图片作为生成器，而没有使用数据增强。

```python
batch_size=50
directory='/Users/cloga/Documents/jupyter_notebook/autokeras/train_img'
labels=pd.read_csv('/Users/cloga/Documents/jupyter_notebook/autokeras/label-train.csv')
test_data_dir='/Users/cloga/Documents/jupyter_notebook/autokeras/test_img'
```
这里定义了训练数据的位置，还说有batch_size以及标签文件。

```python
train_generator = train_datagen.flow_from_dataframe(
    labels,
#     target_size=(img_height, img_width),
    directory=directory,
    x_col='File Name',
    y_col='Label',
    batch_size=batch_size,
    class_mode='binary')
```

flow_from_dataframe方法可以从特定文件夹的标签文件中生成训练数据流。

标签数据中只需要有两列，一列为文件名，需要保证文件名可以在directory路径可以找到，另一列为标签。

```
    File Name   Label
0   n02106382_3856.jpg  dog
1   bubbles1.jpg    dog
2   n02099849_3753.jpg  dog
3   n02115913_1622.jpg  dog
4   n02096177_9880.jpg  dog
```


```python
test_generator = datagen.flow_from_directory(
    test_data_dir,
#     target_size=(img_height, img_width),
    batch_size=batch_size,
    class_mode='binary')
```

flow_from_directory方法是直接从文件夹来生成训练数据流。这种方式要求每个分类在一个子文件夹中。

无论哪种方法最终都是返回一个样本的生成器。每次调用next方法返回一个batch的数据和label的tuple。这里要解释一下分类label的定义，flow方法可以传入classes参数，参数形式为类的列表，默认会从文件名或标签文件df中按照字母降序进行编码。例如，你的样本标签如果是cat和dog，那么0代表cat，1代表dog

```
Found 200 validated image filenames belonging to 2 classes.
```

两种方式无论哪种如果格式正确都会返回读取到的文件数以及类别数。我这里使用200张图片，100张为猫，100张为狗进行训练。

```python
model.fit_generator(train_generator, steps_per_epoch=10, epochs=100)
```
训练完成后，可以使用下列的代码进行预测。

```python
def get_predict(img_path):
    img = image.load_img(img_path)
    # print(type(img))
    x = image.img_to_array(img)
    # 扩展数据维度
    x = image.img_to_array(img)
    return model.predict(np.expand_dims(x, axis=0))
get_predict(img_path)
```

首先通过keras提供的图片预处理方法将图片转换为array，之后再将图片扩展一个维度。至此，基于keras搭建一个迁移学习的demo流程就完整了。
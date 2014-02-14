---
author: 'Cloga'
comments: true
layout: post
slug: 'classify_use_Sklearn'
title: 用Sklearn做判别分析(分类)
categories:
- python

tags:
- Sklearn
- Python
---

# 加载数据集
这里我使用pandas来加载数据集，数据集采用[kaggle的titanic的数据集](https://www.kaggle.com/c/titanic-
gettingStarted/data)，下载train.csv。

{% highlight python %}
import pandas as pd
df = pd.read_csv('train.csv')
df = df.fillna(0) #将缺失值都替换为0
df.head()
{% endhighlight %}

<div style="max-height:1000px;max-width:1500px;overflow:auto;">
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td> 1</td>
      <td> 0</td>
      <td> 3</td>
      <td>                           Braund, Mr. Owen Harris</td>
      <td>   male</td>
      <td> 22</td>
      <td> 1</td>
      <td> 0</td>
      <td>        A/5 21171</td>
      <td>  7.2500</td>
      <td>    0</td>
      <td> S</td>
    </tr>
    <tr>
      <th>1</th>
      <td> 2</td>
      <td> 1</td>
      <td> 1</td>
      <td> Cumings, Mrs. John Bradley (Florence Briggs Th...</td>
      <td> female</td>
      <td> 38</td>
      <td> 1</td>
      <td> 0</td>
      <td>         PC 17599</td>
      <td> 71.2833</td>
      <td>  C85</td>
      <td> C</td>
    </tr>
    <tr>
      <th>2</th>
      <td> 3</td>
      <td> 1</td>
      <td> 3</td>
      <td>                            Heikkinen, Miss. Laina</td>
      <td> female</td>
      <td> 26</td>
      <td> 0</td>
      <td> 0</td>
      <td> STON/O2. 3101282</td>
      <td>  7.9250</td>
      <td>    0</td>
      <td> S</td>
    </tr>
    <tr>
      <th>3</th>
      <td> 4</td>
      <td> 1</td>
      <td> 1</td>
      <td>      Futrelle, Mrs. Jacques Heath (Lily May Peel)</td>
      <td> female</td>
      <td> 35</td>
      <td> 1</td>
      <td> 0</td>
      <td>           113803</td>
      <td> 53.1000</td>
      <td> C123</td>
      <td> S</td>
    </tr>
    <tr>
      <th>4</th>
      <td> 5</td>
      <td> 0</td>
      <td> 3</td>
      <td>                          Allen, Mr. William Henry</td>
      <td>   male</td>
      <td> 35</td>
      <td> 0</td>
      <td> 0</td>
      <td>           373450</td>
      <td>  8.0500</td>
      <td>    0</td>
      <td> S</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 12 columns</p>
</div>

```python
len(df)
```

```
891
```


可以看到训练集中共有891条记录，有12个列（其中一列Survived是目标分类）。将数据集分为特征集和目标分类集，两个DataFrame。

```python
exc_cols = [u'PassengerId', u'Survived', u'Name']
cols = [c for c in df.columns if c not in exc_cols]
x = df.ix[:,cols]
y = df['Survived'].values
```

由于Sklearn为了效率，接受的特征数据类型是dtype=np.float32以便获得最佳的算法效率。因此，对于类别类型的特征就需要转化为向量。Sklearn
提供了DictVectorizer类将类别的特征转化为向量。DictVectorizer接受记录的形式为字典的列表。因此需要用pandas的to_dict方法转
换DataFrame。

```python
from sklearn.feature_extraction import DictVectorizer
v = DictVectorizer()
x = v.fit_transform(x.to_dict(outtype='records')).toarray()
```

让我们比较一下同一个实例的原始信息及向量化后的结果。

```python
print 'Vectorized:', x[10]
print 'Unvectorized:', v.inverse_transform(x[10])
```

```
Vectorized: [ 4.  0.  0. ...,  0.  0.  0.]
Unvectorized: [{'Fare': 16.699999999999999, 'Name=Sandstrom, Miss. Marguerite Rut': 1.0, 'Embarked=S': 1.0, 'Age': 4.0, 'Sex=female': 1.0, 'Parch': 1.0, 'Pclass': 3.0, 'Ticket=PP 9549': 1.0, 'Cabin=G6': 1.0, 'SibSp': 1.0, 'PassengerId': 11.0}]
```

如果分类的标签也是字符的，那么就还需要用[LabelEncoder](http://scikit-learn.org/stable/modules/genera
ted/sklearn.preprocessing.LabelEncoder.html)方法进行转化。

将数据集分成训练集和测试集。

```python
from sklearn.cross_validation import train_test_split
data_train, data_test, target_train, target_test = train_test_split(x, y)
len(data_train)
```

```
668
```

```python
len(data_test)
```

```
223
```


默认是以数据集的25%作为测试集。到这里为止，用于训练和测试的数据集都已经准备好了。
# 用Sklearn做判别分析

##Sklearn训练模型的基本流程

```
Model = EstimatorObject()
Model.fit(dataset.data, dataset.target)
dataset.data = dataset
dataset.target = labels
Model.predict(dataset.data)
```

这里选择[朴素贝叶斯](http://scikit-learn.org/stable/modules/naive_bayes.html#gaussian-
naive-bayes)、[决策树](http://scikit-
learn.org/stable/modules/tree.html#classification)、[随机森林](http://scikit-learn.or
g/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html)和[SVM](h
ttp://scikit-learn.org/stable/modules/svm.html#classification)来做一个对比。

```python
from sklearn import cross_validation
from sklearn.naive_bayes import GaussianNB
from sklearn import tree
from sklearn.ensemble import RandomForestClassifier
from sklearn import svm
import datetime
estimators = {}
estimators['bayes'] = GaussianNB()
estimators['tree'] = tree.DecisionTreeClassifier()
estimators['forest_100'] = RandomForestClassifier(n_estimators = 100)
estimators['forest_10'] = RandomForestClassifier(n_estimators = 10)
estimators['svm_c_rbf'] = svm.SVC()
estimators['svm_c_linear'] = svm.SVC(kernel='linear')
estimators['svm_linear'] = svm.LinearSVC()
estimators['svm_nusvc'] = svm.NuSVC()
```

首先是定义各个model所用的算法。

```python
for k in estimators.keys():
    start_time = datetime.datetime.now()
    print '----%s----' % k
    estimators[k] = estimators[k].fit(data_train, target_train)
    pred = estimators[k].predict(data_test)
    print("%s Score: %0.2f" % (k, estimators[k].score(data_test, target_test)))
    scores = cross_validation.cross_val_score(estimators[k], data_test, target_test, cv=5)
    print("%s Cross Avg. Score: %0.2f (+/- %0.2f)" % (k, scores.mean(), scores.std() * 2))
    end_time = datetime.datetime.now()
    time_spend = end_time - start_time
    print("%s Time: %0.2f" % (k, time_spend.total_seconds()))
```

```
----svm_c_rbf----
svm_c_rbf Score: 0.63
svm_c_rbf Cross Avg. Score: 0.54 (+/- 0.18)
svm_c_rbf Time: 1.67
----tree----
tree Score: 0.81
tree Cross Avg. Score: 0.75 (+/- 0.09)
tree Time: 0.90
----forest_10----
forest_10 Score: 0.83
forest_10 Cross Avg. Score: 0.80 (+/- 0.10)
forest_10 Time: 0.56
----forest_100----
forest_100 Score: 0.84
forest_100 Cross Avg. Score: 0.80 (+/- 0.14)
forest_100 Time: 5.38
----svm_linear----
svm_linear Score: 0.74
svm_linear Cross Avg. Score: 0.65 (+/- 0.18)
svm_linear Time: 0.15
----svm_nusvc----
svm_nusvc Score: 0.63
svm_nusvc Cross Avg. Score: 0.55 (+/- 0.21)
svm_nusvc Time: 1.62
----bayes----
bayes Score: 0.44
bayes Cross Avg. Score: 0.47 (+/- 0.07)
bayes Time: 0.16
----svm_c_linear----
svm_c_linear Score: 0.83
svm_c_linear Cross Avg. Score: 0.79 (+/- 0.14)
svm_c_linear Time: 465.57
```

这里通过算法的score方法及cross_validation来计算预测的准确性。

可以看到准确性比较高的算法需要的时间也会增加。性价比较高的算法是随机森林。
让我们用kaggle给出的test.csv的数据集测试一下。

```python
test = pd.read_csv('test.csv')
test = test.fillna(0) 
test_d = test.to_dict(outtype='records')
test_vec = v.transform(test_d).toarray()
```

这里需要注意的是test的数据也需要经过同样的DictVectorizer转换。

```python
for k in estimators.keys():
    estimators[k] = estimators[k].fit(x, y)
    pred = estimators[k].predict(test_vec)
    test['Survived'] = pred
    test.to_csv(k + '.csv', cols=['Survived', 'PassengerId'], index=False)
```

好了，向Kaggle提交你的结果吧~

你可以查看[本文的ipython notebook版本]
[本文的ipython notebook版本]:http://nbviewer.ipython.org/gist/cloga/8862733
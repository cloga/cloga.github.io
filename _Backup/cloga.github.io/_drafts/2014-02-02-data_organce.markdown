
---
author: cloga
comments: true
layout: post
slug: data_Orange_Tutorial
title: 数据-Orange教程
categories:
- Python
tags:
- Python
- Orange
---
这个部分描述了如何加载和保存数据。我们也将展示如何探索数据，数据的域描述，如何报告基本的数据集统计值，以及如何抽样数据。

# 数据输入

Orange can read files in native and other data formats. Native format starts with feature (attribute) names, their type (continuous, discrete, string). The third line contains meta information to identify dependent features (class), irrelevant features (ignore) or meta features (meta). Here are the first few lines from a data set lenses.tab on prescription of eye lenses [CJ1987]:

age       prescription  astigmatic    tear_rate     lenses
discrete  discrete      discrete      discrete      discrete
                                                    class
young     myope         no            reduced       none
young     myope         no            normal        soft
young     myope         yes           reduced       none
young     myope         yes           normal        hard
young     hypermetrope  no            reduced       none
Values are tab-limited. The data set has four attributes (age of the patient, spectacle prescription, notion on astigmatism, and information on tear production rate) and an associated three-valued dependent variable encoding lens prescription for the patient (hard contact lenses, soft contact lenses, no lenses). Feature descriptions could use one letter only, so the header of this data set could also read:

age       prescription  astigmatic    tear_rate     lenses
d         d             d             d             d
                                                    c
The rest of the table gives the data. Note that there are 5 instances in our table above (check the original file to see other). Orange is rather free in what attribute value names it uses, so they do not need all to start with a letter like in our example.

You may download lenses.tab to a target directory and there open a python shell. Alternatively, just execute the code below; this particular data set comes with Orange instalation, and Orange knows where to find it:

>>>>>> import Orange
>>> data = Orange.data.Table("lenses")
>>>
Note that for the file name no suffix is needed; as Orange checks if any files in the current directory are of the readable type. The call to Orange.data.Table creates an object called data that holds your data set and information about the lenses domain:

>>>>>> print data.domain.features
<Orange.feature.Discrete 'age', Orange.feature.Discrete 'prescription', Orange.feature.Discrete 'astigmatic', Orange.feature.Discrete 'tear_rate'>
>>> print data.domain.class_var
Orange.feature.Discrete 'lenses'
>>> for d in data[:3]:
   ...:     print d
   ...:
['young', 'myope', 'no', 'reduced', 'none']
['young', 'myope', 'no', 'normal', 'soft']
['young', 'myope', 'yes', 'reduced', 'none']
>>>
The following script wraps-up everything we have done so far and lists first 5 data instances with soft perscription:

import Orange
data = Orange.data.Table("lenses")
print "Attributes:", ", ".join(x.name for x in data.domain.features)
print "Class:", data.domain.class_var.name
print "Data instances", len(data)

target = "soft"
print "Data instances with %s prescriptions:" % target
for d in data:
    if d.get_class() == target:
        print " ".join(["%-15s" % str(v) for v in d])
Note that data is an object that holds both the data and information on the domain. We show above how to access attribute and class names, but there is much more information there, including that on feature type, set of values for categorical features, and other.

Saving the Data

Data objects can be saved to a file:

>>>>>> data.save("new_data.tab")
>>>
This time, we have to provide the extension for Orange to know which data format to use. An extension for native Orange’s data format is ”.tab”. The following code saves only the data items with myope perscription:

import Orange
data = Orange.data.Table("lenses")
print "N1=%d" % len(data)
new_data = Orange.data.Table([d for d in data if d["prescription"]=="myope"])
print "N2=%d" %len(new_data)
new_data.save("lenses-subset.tab")
Exploration of Data Domain

Data table object stores information on data instances as well as on data domain. Domain holds the names of features, optional classes, their types and, if categorical, value names.

import Orange

data = Orange.data.Table("imports-85.tab")
m = len(data.domain.features)
m_cont = sum(1 for x in data.domain.features if x.var_type==Orange.feature.Type.Continuous)
m_disc = sum(1 for x in data.domain.features if x.var_type==Orange.feature.Type.Discrete)
m_disc = len(data.domain.features)
print "%d features, %d continuous and %d discrete" % (m, m_cont, m-m_cont)

print "First three features:"
for i in range(3):
    print "   ", data.domain.features[i].name

print "First three features (again):"
for x in data.domain.features[:3]:
    print "   ", x.name

print "Class:", data.domain.class_var.name
Orange’s objects often behave like Python lists and dictionaries, and can be indexed or accessed through feature names.

print "Name of the first feature:", data.domain[0].name
name = 'fuel-type'
print "Values of feature '%s'" % name,
print data.domain[name].values
Data Instances

Data table stores data instances (or examples). These can be index or traversed as any Python list. Data instances can be considered as vectors, accessed through element index, or through feature name.

import Orange

data = Orange.data.Table("iris")
print "First three data instances:"
for d in data[:3]:
    print d

print "25-th data instance:"
print data[24]

name = "sepal width"
print "Value of '%s' for the first instance:" % name, data[0][name]
print "The 3rd value of the 25th data instance:", data[24][2]
The script above displays the following output:

First three data instances:
[5.1, 3.5, 1.4, 0.2, 'Iris-setosa']
[4.9, 3.0, 1.4, 0.2, 'Iris-setosa']
[4.7, 3.2, 1.3, 0.2, 'Iris-setosa']
25-th data instance:
[4.8, 3.4, 1.9, 0.2, 'Iris-setosa']
Value of 'sepal width' for the first instance: 3.5
The 3rd value of the 25th data instance: 1.9
Iris data set we have used above has four continous attributes. Here’s a script that computes their mean:

average = lambda xs: sum(xs)/float(len(xs))

data = Orange.data.Table("iris")
print "%-15s %s" % ("Feature", "Mean")
for x in data.domain.features:
    print "%-15s %.2f" % (x.name, average([d[x] for d in data]))
Above also illustrates indexing of data instances with objects that store features; in d[x] variable x is an Orange object. Here’s the output:

Feature         Mean
sepal length    5.84
sepal width     3.05
petal length    3.76
petal width     1.20
Slightly more complicated, but more interesting is a code that computes per-class averages:

average = lambda xs: sum(xs)/float(len(xs))

data = Orange.data.Table("iris")
targets = data.domain.class_var.values
print "%-15s %s" % ("Feature", " ".join("%15s" % c for c in targets))
for x in data.domain.features:
    dist = ["%15.2f" % average([d[x] for d in data if d.get_class()==c]) for c in targets]
    print "%-15s" % x.name, " ".join(dist)
Of the four features, petal width and length look quite discriminative for the type of iris:

Feature             Iris-setosa Iris-versicolor  Iris-virginica
sepal length               5.01            5.94            6.59
sepal width                3.42            2.77            2.97
petal length               1.46            4.26            5.55
petal width                0.24            1.33            2.03
Finally, here is a quick code that computes the class distribution for another data set:

import Orange
from collections import Counter

data = Orange.data.Table("lenses")
print Counter(str(d.get_class()) for d in data)
Missing Values

Consider the following exploration of senate voting data set:

>>>>>> data = Orange.data.Table("voting.tab")
>>> data[2]
['?', 'y', 'y', '?', 'y', 'y', 'n', 'n', 'n', 'n', 'y', 'n', 'y', 'y', 'n', 'n', 'democrat']
>>> data[2][0].is_special()
1
>>> data[2][1].is_special()
0
The particular data instance included missing data (represented with ‘?’) for first and fourth feature. We can use the method is_special() to detect parts of the data which is missing. In the original data set file, the missing values are, by default, represented with a blank space. We use the method is_special() below to examine each feature and report on proportion of instances for which this feature was undefined:

import Orange

data = Orange.data.Table("voting.tab")
for x in data.domain.features:
    n_miss = sum(1 for d in data if d[x].is_special())
    print "%4.1f%% %s" % (100.*n_miss/len(data), x.name)
First few lines of the output of this script are:

 2.8% handicapped-infants
11.0% water-project-cost-sharing
 2.5% adoption-of-the-budget-resolution
 2.5% physician-fee-freeze
 3.4% el-salvador-aid
A single-liner that reports on number of data instances with at least one missing value is:

>>>>>> sum(any(d[x].is_special() for x in data.domain.features) for d in data)
203
Data Subsetting

Orange.data.Table accepts a list of data items and returns a new data set. This is useful for any data subsetting:

data = Orange.data.Table("iris.tab")
new_data = Orange.data.Table([d for d in data if d["petal length"]>3.0])
print "Subsetting from %d to %d instances." % (len(data), len(new_data))
The code outputs:

Subsetting from 150 to 99 instances.
and inherits the data description (domain) from the original data set. Changing the domain requires setting up a new domain descriptor. This feature is useful for any kind of feature selection:

data = Orange.data.Table("iris.tab")
new_domain = Orange.data.Domain(data.domain.features[:2] + [data.domain.class_var])
new_data = Orange.data.Table(new_domain, data)

print data[0]
print new_data[0]
By default, Orange.data.Domain assumes that last feature in argument feature list is a class variable. This can be changed with an optional argument:

>>>>>> nd = Orange.data.Domain(data.domain.features[:2], False)
>>> print nd.class_var
None
>>> nd = Orange.data.Domain(data.domain.features[:2], True)
>>> print nd.class_var
Orange.feature.Continuous 'sepal width'
The first call to Orange.data.Domain constructed the classless domain, while the second used the last feature and constructed the domain with one input feature and a continous class.

References

[CJ1987]	Cendrowska J (1987) PRISM: An algorithm for inducing modular rules, International Journal of Man-Machine Studies, 27, 349-370.
For documentation suggestions or questions please use our forum.
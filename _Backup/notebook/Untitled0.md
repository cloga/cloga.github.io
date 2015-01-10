

    import pandas as pd
    d = [{'one' : 1,'two':1},{'one' : 2,'two' : 2},{'one' : 3,'two' : 3},{'two' : 4}]
    df = pd.DataFrame(d,index=['a','b','c','d'],columns=['one','two'])
    df.index.name='index'


    df.head()




<div style="max-height:1000px;max-width:1500px;overflow:auto;">
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>one</th>
      <th>two</th>
    </tr>
    <tr>
      <th>index</th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>a</th>
      <td>  1</td>
      <td> 1</td>
    </tr>
    <tr>
      <th>b</th>
      <td>  2</td>
      <td> 2</td>
    </tr>
    <tr>
      <th>c</th>
      <td>  3</td>
      <td> 3</td>
    </tr>
    <tr>
      <th>d</th>
      <td>NaN</td>
      <td> 4</td>
    </tr>
  </tbody>
</table>
<p>4 rows × 2 columns</p>
</div>




    df.tail()




<div style="max-height:1000px;max-width:1500px;overflow:auto;">
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>one</th>
      <th>two</th>
    </tr>
    <tr>
      <th>index</th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>a</th>
      <td>  1</td>
      <td> 1</td>
    </tr>
    <tr>
      <th>b</th>
      <td>  2</td>
      <td> 2</td>
    </tr>
    <tr>
      <th>c</th>
      <td>  3</td>
      <td> 3</td>
    </tr>
    <tr>
      <th>d</th>
      <td>NaN</td>
      <td> 4</td>
    </tr>
  </tbody>
</table>
<p>4 rows × 2 columns</p>
</div>




    df.describe()




<div style="max-height:1000px;max-width:1500px;overflow:auto;">
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>one</th>
      <th>two</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>count</th>
      <td> 3.0</td>
      <td> 4.000000</td>
    </tr>
    <tr>
      <th>mean</th>
      <td> 2.0</td>
      <td> 2.500000</td>
    </tr>
    <tr>
      <th>std</th>
      <td> 1.0</td>
      <td> 1.290994</td>
    </tr>
    <tr>
      <th>min</th>
      <td> 1.0</td>
      <td> 1.000000</td>
    </tr>
    <tr>
      <th>25%</th>
      <td> 1.5</td>
      <td> 1.750000</td>
    </tr>
    <tr>
      <th>50%</th>
      <td> 2.0</td>
      <td> 2.500000</td>
    </tr>
    <tr>
      <th>75%</th>
      <td> 2.5</td>
      <td> 3.250000</td>
    </tr>
    <tr>
      <th>max</th>
      <td> 3.0</td>
      <td> 4.000000</td>
    </tr>
  </tbody>
</table>
<p>8 rows × 2 columns</p>
</div>




    df.T




<div style="max-height:1000px;max-width:1500px;overflow:auto;">
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th>index</th>
      <th>a</th>
      <th>b</th>
      <th>c</th>
      <th>d</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>one</th>
      <td> 1</td>
      <td> 2</td>
      <td> 3</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>two</th>
      <td> 1</td>
      <td> 2</td>
      <td> 3</td>
      <td>  4</td>
    </tr>
  </tbody>
</table>
<p>2 rows × 4 columns</p>
</div>




    

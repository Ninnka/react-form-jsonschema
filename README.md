# form2jsonschema(temporary)

> ## 一个简单的 [React](http://facebook.github.io/react/) 组件，利用Form表单的形式来构造[JSON schema](http://jsonschema.net/)，UI使用 [Ant Design](https://ant.design/index-cn)。

## Schema

- 最外层是一个唯一的object
  - 可以建立properties
  - 设置required
  - 设置title
  - 设置description
  - 设置definitions
- 可建立以下类型的property
  - string类型
    - 选择所属的对象
    - 设置key
    - 设置title
    - 设置description
    - 设置default
    - 选择ui
    - 设置format形式
  - object类型
    - 选择所属的对象
    - 添加properties
    - 设置key
    - 设置title
    - 设置description
    - 设置default
    - 选择ui
    - 设置required
  - number类型
    - 选择所属的对象
    - 设置title
    - 设置description
    - 设置default
    - 设置最大值
    - 设置最小值
    - 选择ui
    - 使用enum
      - 使用enum时可设置uniqueItems(成员是否唯一)
  - boolean类型
    - 选择所属的对象
    - 设置title
    - 设置description
    - 设置default
    - 选择ui
  - array类型
    - 选择所属的对象
    - 设置title
    - 设置description
    - 设置default
    - 设置固定成员（items为数组）
      - 可删除固定成员
    - 设置可选成员（items为对象）
      - 可以重置已设置的items
      - items可设置一下key
        - default
        - enum
          - 使用enum时可设置uniqueItems(成员是否唯一)
    - 设置items，一个对象，成员都按照对象内的描述来创建

## Update Log

### 2018-01-21

- 完善构造array类型的表单，完善重置schema和单部分表单的功能
- 完善各种类型表单的重置功能
- 有关表单数值的输入均限制为数字输入（整型与浮点型）
- 调整表单代码结构

### 2018-01-20

- 完善构造array类型的表单
- 完善新增固定成员
- 完善设置可选成员
- 小部分代码优化

### 2018-01-19

- 初步建立构造object类型的表单
- 初步建立构造string类型的表单
- 初步建立构造number类型的表单
- 初步建立构造boolean类型的表单
- 初步建立构造array类型的表单

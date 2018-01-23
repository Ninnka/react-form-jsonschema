# Form2JsonSchema

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
    - 使用enum
    - 设置format
      - email
      - uri
      - data-url(与设置ui:widget file效果相同)
      - date
      - date-time
    - 选择ui
      - ui:widget
        - text(default)
        - textarea
          - ui:options
            - row
        - password
        - color
        - file(与设置format file效果相同)
      - ui:placeholder
      - ui:autofocus
      - ui:emptyValue
      - ui:help
      - ui:enumDisabled
      - ui:disabled
      - ui:readonly
      - ui:title
      - ui:description
  - object类型
    - 选择所属的对象
    - 添加properties
    - 设置key
    - 设置title
    - 设置description
    - 设置default
    - 设置required
    - 选择ui
      - ui:order
      - ui:disabled
      - ui:readonly
  - number(integer)类型
    - 选择所属的对象
    - 设置title
    - 设置description
    - 设置default
    - 设置最大值
    - 设置最小值
    - 使用enum
      - 使用enum时可设置uniqueItems(成员是否唯一)
    - 选择ui
      - ui:widget
        - text(default)
        - updown
        - range
        - radio
      - ui:autofocus
      - ui:placeholder
      - ui:emptyValue
      - ui:help
      - ui:enumDisabled
      - ui:disabled
      - ui:readonly
      - ui:title
      - ui:description
  - boolean类型
    - 选择所属的对象
    - 设置title
    - 设置description
    - 设置default
    - 选择ui
      - ui:widget
        - checkbox(default)
        - radio
        - select
      - ui:disabled
      - ui:readonly
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
    - 设置ui
      - ui:options
        - orderable
        - addable
        - removeable
      - ui:disabled
      - ui:readonly
- 已下特性未支持
  - Schema definitions and references（未来支持）
  - Custom widget components（未来支持）
  - Custom CSS class names（未来支持）
  - Custom labels for enum fields（未来支持）
  - HTML5 Input Types（未来支持）
  - Id prefix（未来支持）
  - Custom validation（未来支持）
  - Custom error messages（未来支持）
  - Advanced customization (编程式)
    - Field template
    - Array Field Template
    - Object Field Template
    - Error List template
    - Custom SchemaField
    - Customizing the default fields and widgets
    - Custom titles
    - Custom descriptions

## Update Log

### 2018-01-24

- 完善优化创建UISchema的方法

### 2018-01-23

- 优化选择所属对象列表，修复无法获取嵌套array中的object和array类型的bug
- 增加number类型中的integer属性，integer只能使用整型数字，如果有已输入的数值，例如，最大最小值，则会将其中的浮点型转化为整型
- 增加功能，创建uischema
  - 增加禁用功能
  - 增加只读功能
  - 增加隐藏功能（boolean，string，number，integer）

### 2018-01-22

- 调整array类型的表单构造schema方式，隐藏创建items和fixedItems(现在用不到)
- 调整可选择的父元素，父元素可选择为array
- 父元素设置为array时，可以选择将元素添加为fixedItems或items（视情况而定可能为additionalItems）

### 2018-01-21

- 完善构造array类型的表单，完善重置schema和单部分表单的功能
- 完善各种类型表单的重置功能
- 有关表单数值的输入均限制为数字输入（整型与浮点型）
- 调整表单代码结构
- 调整获取所属对象列表的方法

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

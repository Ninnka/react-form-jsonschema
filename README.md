# Form2JsonSchema

> ## 一个简单的 [React](http://facebook.github.io/react/) 组件，利用Form表单的形式来构造[JSON Schema](http://jsonschema.net/)，UI使用 [Ant Design](https://ant.design/index-cn)。

[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)

## Schema

### 已下特性支持

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
    - 设置enumNames
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
        - alt-datatime(与设置format data-time效果相同)
      - ui:placeholder
      - ui:autofocus
      - ui:emptyValue
      - ui:help
      - ui:enumDisabled
      - ui:disabled
      - ui:readonly
      - ui:title
      - ui:description
      - ui:placeholder
      - ui:options
        - label
        - inputType
      - classNames
  - number(integer)类型
    - 选择所属的对象
    - 设置title
    - 设置description
    - 设置default
    - 设置最大值
    - 设置最小值
    - 使用enum
    - 设置enumNames
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
      - ui:placeholder
      - ui:options
        - label
        - inputType
      - classNames
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
      - ui:inline
      - ui:placeholder
      - ui:options
        - label
        - inputType
      - classNames
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
    - classNames
  - array类型
    - 选择所属的对象
    - 设置title
    - 设置description
    - 设置default（数组类型）
    - 设置minItems
    - 设置uniqueItems(生成的表单成员是否唯一)
    - 设置固定成员（items为数组）
      - 可删除固定成员
    - 设置可选成员（items为对象）
      - 可以重置已设置的items
      - items可设置一下key
        - default
        - enum
    - 设置items，一个对象，成员都按照对象内的描述来创建
    - 设置ui
      - ui:options
        - orderable
        - addable
        - removeable
      - ui:disabled
      - ui:readonly
      - classNames
  - Schema definitions and references
  - Property dependency
  - schema dependency
  - HTML5 Input Types
  - Custom labels for enum fields
  - Custom CSS class names

### 以下特性不支持

- Advanced customization
  - Custom validation
  - Custom error messages
  - Custom widget components
  - Id prefix
  - Field template
  - Array Field Template
  - Object Field Template
  - Error List template
  - Custom SchemaField
  - Customizing the default fields and widgets
  - Custom titles
  - Custom descriptions

## Change Log

- 调整添加jsonschema的属性的方法
- jsonSchema数据预览的搜索功能
  - 可以对搜索出的项进行删除和修改
    - 支持key值修改
    - 搜索的得到的元素只允许删除子元素
  - 增加可选的搜索类型
- 修复已知问题
  - 重置时没有清空input和select

### 2018-02-04

- jsonSchema数据预览中加入新功能
  - 搜索特定项
  - 全部展开
  - 全部收起

### 2018-02-02

- 数据预览中修改或删除jsonSchema的属性时，可以自动修改uiSchema和formdata中对应的数据
  - 一般属性可修改
    - 修改属性为key
      - 将jsonSchema中的对应key切换为新的key
        - 如果namespace最后一个是数字或者是additionalItems则修改无效
      - 将uiSchema中的对应key切换为新的key
      - 将formData中的对应key切换为新的key
  - type属性不可修改
  - 一般属性可删除
    - 删除的是key或整个对象时
      - 将jsonSchema中的对应key删除
      - 将uiSchema中的对应key删除
      - 将formData中的对应key删除
  - properties不可删除
  - items不可删除
- 修复已知问题
  - 创建uiSchema时，数组中的成员的ui属性key值有误
  - 创建formData时，数组中的items如果是fixed时，未正确添加对应的值

### 2018-02-01

- 数据预览增加编辑功能和删除功能
- 增加数据预览功能
- 增加SchemaCreator的High-Order组件
- 使用SchemaCreatorHOC返回object和array的表单构造器
- 根目录的名称有global改为root
- 删除无用的文件

### 2018-01-31

- array类型的schema构造器加入minItems设置
- 使用minItems时，formData会根据default值判断是否需要填充空值
- 完善HTML5 Input Types功能
- 完善Custom labels for enum fields功能
- 修复已知问题
  - 根目录type为对象时，无法正确生成properties的uiSchema
  - 根目录type为数组时，生成的formData成员重复

### 2018-01-30

- 新增Custom CSS class names功能
- 完善预览生成的表单功能
- 优化添加properties功能
- 新增primitive类型的ui:options
- 抽离message方法到utils库

### 2018-01-29

- 完善schema dependency功能
- 新增HTML5 Input Types功能
- 新增Custom labels for enum fields功能

### 2018-01-28

- 新增property dependency和schema dependency功能
- 数组类型schema构造表单的选择所属对象增加清空功能
- 修复已知问题(根目录为数组且指定位置为根目录时，添加的ui位置错误；清空所属对象时错误的bug)
- 删除无用的注释

### 2018-01-27

- 完善创建为definitions的功能
- 调整添加property的方法，增加对应使用$ref的情况
- 完善预览生成的表单功能

### 2018-01-26

- 修复添加元素的方法在根目录类型为array的一个bug
- Array类型增加uniqueItems选项
- 增加获取definations列表的功能

### 2018-01-25

- 优化jsonschema数据结构
- Number、Array、Object类型加入UI选择和输入
- 增加创建根目录为非object类型的jsonschema(string|number|boolean|array),此功能会覆盖global的object
- 当根目录为数组时，完善添加元素的方法
- 加入defination功能的雏形

### 2018-01-24

- 完善优化创建UISchema的方法
- 增加创建FormData的功能
- 设定子组件中的基本的uiSchema创建条件

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

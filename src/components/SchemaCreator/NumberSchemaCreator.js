import React from 'react';

// * 样式

import NumberUICreator from '@components/SchemaCreator/UICreator/NumberUICreator';

// * antd组件
import {
  Form,
  Input,
  Select,
  Button,
  Checkbox,
  Modal
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
const confirm = Modal.confirm;

class NumberSchemaCreator extends React.Component {

  state = {
    ownerList: [],
    defList: [],
    refList: [],
    numberTypeList: [],
    enumStatus: false,
    ownerTypeStatus: 'object',
    asFixedItems: false,
    coverFixedItems: false,
    asInteger: false,
    asCreateDefinition: false,
    asDefinition: false,
    asDefault: false,
    asModify: false,
    editTargetKey: '',
    editTargetIndex: '',
    numberSchema: {
      key: '',
      title: '',
      description: '',
      owner: '',
      $ref: '',
      defOwner: 'definitions'
    },
    numberSchemaAddition: {
      default: '',
      enum: '',
      enumNames: '',
      minimum: '',
      maximum: '',
      multipleOf: ''
    }
  }

  uiCreator = null;

  componentWillReceiveProps (nextProps) {
    console.log('o nextProps', nextProps);
    let res = nextProps.compuListPrepare(nextProps);
    this.setState({
      ownerList: res.ownerList,
      defList: res.defList,
      refList: res.refList,
      numberTypeList: res.sameTypeListObj.tmpNumberList
    });
  }

  componentDidMount () {
    console.log('o properties: ', this.props.properties);
    let res = this.props.compuListPrepare(this.props);
    this.setState({
      ownerList: res.ownerList,
      defList: res.defList,
      refList: res.refList,
      numberTypeList: res.sameTypeListObj.tmpNumberList
    });
  }

  // * ------------

  showConfirm = () => {
    confirm({
      title: '提示',
      content: '所属对象为空时将会覆盖根目录对象中的属性',
      onOk: () => {
        this.submitForm();
      },
      onCancel: () => {}
    });
  }

  resetForm = () => {
    this.setState({
      enumStatus: false,
      ownerTypeStatus: 'object',
      asFixedItems: false,
      coverFixedItems: false,
      asInteger: false,
      asDefinition: false,
      asCreateDefinition: false,
      asDefault: false,
      asModify: false,
      numberSchema: {
        key: '',
        title: '',
        description: '',
        owner: '',
        $ref: '',
        defOwner: 'definitions'
      },
      numberSchemaAddition: {
        default: '',
        enum: '',
        minimum: '',
        maximum: '',
        multipleOf: ''
      }
    });
    this.uiCreator.setState({
      ui: {},
      enumStatus: false
    });
  }

  confirmForm = () => {
    console.log('confirmForm');
    if (!this.state.numberSchema.key) {
      return;
    }
    if (this.state.numberSchema.owner || this.state.numberSchema.asCreateDefinition) {
      this.submitForm();
    } else {
      this.showConfirm();
    }
  }

  objectFilter = (obj = {}) => {
    if (!obj) {
      return;
    }
    let data = {};
    for (let item of Object.entries(obj)) {
      if (item[1] !== ''|| item[0] === 'owner') {
        data[item[0]] = item[1];
      }
    }
    return data;
  }

  submitForm = () => {
    let numberSchemaAddition = this.objectFilter(this.state.numberSchemaAddition);
    let numberSchema = this.objectFilter(this.state.numberSchema);
    if (!this.state.asCreateDefinition) {
      numberSchema.defOwner && delete numberSchema.defOwner;
    } else {
      numberSchema.owner !== undefined && delete numberSchema.owner;
    }
    let data = {
      ...numberSchemaAddition,
      ...numberSchema,
      type: this.state.asInteger ? 'integer' : 'number'
    };

    if (this.state.ownerTypeStatus === 'array' && this.state.asFixedItems) {
      data.asFixedItems = true;
    } else if (this.state.ownerTypeStatus === 'array' && this.state.coverFixedItems) {
      data.coverFixedItems = true;
    }

    if (this.state.asDefinition) {
      let refData = {
        owner: data.owner,
        $ref: data.$ref,
        key: data.key,
        refStatus: true
      }
      this.props.addNewProperties(refData);
    } else if (this.state.asCreateDefinition) {
       delete data.$ref;
       this.props.addNewDefinition(data);
    } else {
      delete data.$ref;
      // * 如果有设置ui，则将ui添加到UISchema
      if (Object.keys(this.uiCreator.state.ui).length > 0) {
        if (this.uiCreator.state.ui.options && Object.keys(this.uiCreator.state.ui.options).length < 0) {
          delete this.uiCreator.state.ui.options;
        }
        data.ui = this.objectFilter(this.uiCreator.state.ui);
      }
      this.props.addNewProperties(data);
    }
    // this.props.addNewProperties(data);
    setTimeout(this.resetForm, 0);
  }

  // * ------------

  ownerChange = (value) => {
    console.log('ownerChange value:', value);
    this.setState((prevState, props) => {
      return {
        numberSchema: {
          ...prevState.numberSchema,
          owner: prevState.ownerList[value].path
        },
        ownerTypeStatus: prevState.ownerList[value].type
      };
    });
  }

  keyInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        numberSchema: {
          ...prevState.numberSchema,
          key: tmpValue
        }
      };
    });
  }

  titleInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        numberSchema: {
          ...prevState.numberSchema,
          title: tmpValue
        }
      };
    });
  }

  descriptionInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        numberSchema: {
          ...prevState.numberSchema,
          description: tmpValue
        }
      };
    });
  }

  defaultInput = (event) => {
    let tmpValue = event.target.value;
    let lastDot = false;
    if (tmpValue !== '' && !isNaN(Number(tmpValue))) {
      if (!this.state.asInteger && this.checkNumberDotOnly(tmpValue)) {
        lastDot = true;
      }
      this.setState((prevState, props) => {
        let data = {
          ...prevState.numberSchemaAddition,
        };
        lastDot ? (data.default = Number(tmpValue) + '.') : (data.default = Number(tmpValue));
        return {
          numberSchemaAddition: data
        };
      });
    } else if (tmpValue === '') {
      this.setState((prevState, props) => {
        return {
          numberSchemaAddition: {
            ...prevState.numberSchemaAddition,
            default: ''
          }
        };
      })
    }
  }

  enumStatusChange = (event) => {
    let checked = event.target.checked;
    this.setState((prevState, props) => {
      let data = {
        ...prevState.numberSchemaAddition
      };
      if (!checked) {
        delete data.enum;
        delete data.enumNames
      } else {
        data.enum = '';
        data.enumNames = '';
      }
      return {
        numberSchemaAddition: data,
        enumStatus: checked
      }
    });
  }

  filterCreateNumberList (param) {
    let value = param.value;
    if (!value) {
      return {
        list: []
      }
    }
    let hasNaN = false;
    let tmpValueList = value.split(',');
    let list = tmpValueList.map((ele, index) => {
      hasNaN = false;
      isNaN(parseFloat(ele)) && (hasNaN = true);
      let lastDot = false;
      if (hasNaN) {
        return '';
      } else {
        this.checkNumberDotOnly(ele) && !this.state.asInteger && (lastDot = true);
        let res = lastDot ? parseFloat(ele) + '.' : parseFloat(ele);
        return res;
      }
    });
    return {
      list
    }
  }

  filterCreateArray = (param) => {
    let value = param.value;
    if (!value) {
      return {
        list: []
      }
    }
    let list = value.split(',');
    return {
      list
    };
  }

  enumValueInput = (event) => {
    event.persist()
    let res = {};
    let tmpRes = [];
    let tmpValue = event.target.value;

    if (tmpValue !== '') {
      res = this.filterCreateNumberList({
        value: tmpValue
      });
      tmpRes = res.list;
    } else {
      tmpRes = [];
    }

    this.setState((prevState, props) => {
      return {
        numberSchemaAddition: {
          ...prevState.numberSchemaAddition,
          enum: tmpRes
        }
      }
    });
  }

  enumNamesValueInput = (event) => {
    event.persist();
    let res = {};
    let tmpRes = [];
    let tmpValue = event.target.value;
    if (tmpValue !== '') {
      res = this.filterCreateArray({
        value: tmpValue
      })
      tmpRes = res.list;
    } else {
      tmpRes = [];
    }

    this.setState((prevState, props) => {
      return {
        numberSchemaAddition: {
          ...prevState.numberSchemaAddition,
          enumNames: tmpRes
        }
      }
    })
  }

  minimumInput = (event) => {
    let tmpValue = event.target.value;
    let lastDot = false;
    if (tmpValue !== '' && !isNaN(Number(tmpValue))) {
      if (!this.state.asInteger && this.checkNumberDotOnly(tmpValue)) {
        lastDot = true;
      }
      this.setState((prevState, props) => {
        let data = {
          ...prevState.numberSchemaAddition,
        };
        lastDot ? (data.minimum = Number(tmpValue) + '.') : (data.minimum = Number(tmpValue));
        return {
          numberSchemaAddition: data
        };
      });
    } else if (tmpValue === '') {
      this.setState((prevState, props) => {
        return {
          numberSchemaAddition: {
            ...prevState.numberSchemaAddition,
            minimum: ''
          }
        };
      })
    }
  }

  maximumInput = (event) => {
    let tmpValue = event.target.value;
    let lastDot = false;
    if (tmpValue !== '' && !isNaN(Number(tmpValue))) {
      if (!this.state.asInteger && this.checkNumberDotOnly(tmpValue)) {
        lastDot = true;
      }
      this.setState((prevState, props) => {
        let data = {
          ...prevState.numberSchemaAddition,
        };
        lastDot ? (data.maximum = Number(tmpValue) + '.') : (data.maximum = Number(tmpValue));
        return {
          numberSchemaAddition: data
        };
      });
    } else if (tmpValue === '') {
      this.setState((prevState, props) => {
        return {
          numberSchemaAddition: {
            ...prevState.numberSchemaAddition,
            maximum: ''
          }
        };
      })
    }
  }

  multipleOfInput = (event) => {
    let tmpValue = event.target.value;
    let lastDot = false;
    if (tmpValue !== '' && !isNaN(Number(tmpValue))) {
      if (!this.state.asInteger && this.checkNumberDotOnly(tmpValue)) {
        lastDot = true;
      }
      this.setState((prevState, props) => {
        let data = {
          ...prevState.numberSchemaAddition,
        };
        lastDot ? (data.multipleOf = Number(tmpValue) + '.') : (data.multipleOf = Number(tmpValue));
        return {
          numberSchemaAddition: data
        };
      });
    } else if (tmpValue === '') {
      this.setState((prevState, props) => {
        return {
          numberSchemaAddition: {
            ...prevState.numberSchemaAddition,
            multipleOf: ''
          }
        };
      })
    }
  }

  // * ------------

  asFixedItemsStatusChange = (event) => {
    let checked = event.target.checked;
    this.setState({
      asFixedItems: checked,
      coverFixedItems: false
    });
  }

  coverFixedItemsStatusChange = (event) => {
    let checked = event.target.checked;
    this.setState({
      coverFixedItems: checked,
      asFixedItems: false
    });
  }

  asIntegerStatusChange = (event) => {
    let checked = event.target.checked;
    let data = {
      asInteger: checked
    };
    if (checked) {
      data.numberSchemaAddition = {};
      for (let item of Object.entries(this.state.numberSchemaAddition)) {
         data.numberSchemaAddition[item[0]] = item[1] !== '' ? parseInt(item[1], 10) : '';
      }
    }
    this.setState({
      ...data
    });
  }

  // * ------------

  checkNumberDotOnly = (value) => {
    return value.indexOf('.') !== 0
           && value.indexOf('.') === value.lastIndexOf('.')
           && value.indexOf('.') === value.length - 1;
  }

  checkNumberCommaOnly = (value) => {
    console.log('value', value);
    return value.indexOf(',') !== 0
           && value.indexOf(',') === value.lastIndexOf(',')
           && value.indexOf(',') === value.length - 1;
  }

  asDefinitionStatusChange = (e) => {
    let checked = e.target.checked;
    this.setState((prevState, props) => {
      return {
        asDefinition: checked,
        asCreateDefinition: false,
        asModify: false
      };
    });
  }

  asCreateDefinitionStatusChange = (e) => {
   let checked = e.target.checked;
   this.setState((prevState, props) => {
     return {
       asDefinition: false,
       asModify: false,
       asCreateDefinition: checked
     };
   }); 
  }

  // * 选择的definition创建位置路径变化时
  defOwnerChange = (value) => {
    this.setState((prevState, props) => {
      return {
        numberSchema: {
          ...prevState.numberSchema,
          defOwner: prevState.defList[value].path
        }
      };
    });
  }

  refChange = (ref) => {
    this.setState((prevState, props) => {
      return {
        numberSchema: {
          ...prevState.numberSchema,
          $ref: prevState.refList[ref].path
        }
      }
    });
  }

  asDefaultChange = (event) => {
    let checked = event.target.checked;
    if (!checked) {
      this.setState((prevState, props) => {
        prevState.numberSchemaAddition.default && delete prevState.numberSchemaAddition.default;
        return {
          numberSchemaAddition: {
            ...prevState.numberSchemaAddition
          }
        }
      })
    }
    this.setState({
      asDefault: checked
    })
  }

  // 选择要编辑的对象
  asModifyStatusChange = (event) => {
    let checked = event.target.checked;
    this.setState({
      editTargetKey: '',
      editTargetIndex: '',
      numberSchema: {
        key: '',
        title: '',
        description: '',
        owner: '',
        $ref: '',
        defOwner: 'definitions'
      }
    });
    if (!checked) {
      this.setState({
        asModify: checked
      })
    } else {
      this.setState({
        asModify: checked,
        asCreateDefinition: !checked,
        asDefinition: !checked,
      })
    }
  }

  modifyTargetChange = (value) => {
    console.log(value);
    this.setState((prevState, props) => {
      console.log(prevState.numberTypeList);
      let editTarget = value !== undefined ? prevState.numberTypeList[value] : null;
      let tmpObjectSchema = {
        ...prevState.numberSchema
      };

      // * 获取目标对象的值
      for (let item of Object.keys(tmpObjectSchema)) {
        tmpObjectSchema[item] = editTarget !== null && editTarget[item] !== undefined ? editTarget[item] : '';
      }

      // * 如果选中的目标有$ref属性
      if (editTarget && editTarget.$ref) {
        // * 转换为$ref模式
      }

      return {
        editTargetIndex: value !== undefined ? value : '',
        editTargetKey: editTarget !== null ? editTarget.key : '',
        numberSchema: tmpObjectSchema
      }
    })
  }

  // * ------------

  render () {
    return (
      <Form>
        {
          !(this.state.asCreateDefinition || this.state.asModify) &&
          <FormItem label="$ref">
            <Checkbox checked={this.state.asDefinition} onChange={this.asDefinitionStatusChange}>设置ref</Checkbox>
            {
              this.state.asDefinition &&
              <Select allowClear value={ this.state.numberSchema.$ref } onChange={ this.refChange }>
                {
                  this.state.refList.map((ele, index, arr) => {
                    return (
                      <Option key={ ele.path + index } value={ index }>
                        { ele.path }
                      </Option>
                    )
                  })
                }
              </Select>
            }
          </FormItem>
        }
        {
          !(this.state.asDefinition || this.state.asModify) &&
          <FormItem label="选择创建的definition的位置">
            <Checkbox checked={this.state.asCreateDefinition} onChange={this.asCreateDefinitionStatusChange}>创建为definition，选择definition的创建位置</Checkbox>
            {
              this.state.asCreateDefinition &&
              <Select value={ this.state.numberSchema.defOwner } onChange={ this.defOwnerChange }>
                {
                  this.state.defList.map((ele, index, arr) => {
                    return (
                      <Option key={ ele.path + index } value={ index }>
                        { ele.path }
                      </Option>
                    )
                  })
                }
              </Select>
            }
          </FormItem>
        }
        {
          !(this.state.asDefinition || this.state.asCreateDefinition) &&
          <FormItem label="编辑模式">
            <Checkbox checked={this.state.asModify} onChange={this.asModifyStatusChange}>编辑模式</Checkbox>
            { this.state.asModify &&
              <Select allowClear value={ this.state.editTargetKey } onChange={ this.modifyTargetChange }>
                { this.state.numberTypeList && this.state.numberTypeList.length >0 &&
                  this.state.numberTypeList.map((ele, index, arr) => {
                    return (
                      <Option key={ ele.key } value={ index }>
                        <div>
                          { 'key: ' + ele.key }
                        </div>
                        <div>
                          owner: { ele.owner ? ele.owner : 'JSONSchema' }
                        </div>
                      </Option>
                    )
                  })
                }
              </Select>
            }
          </FormItem>
        }

        {
          !this.state.asCreateDefinition &&
          <FormItem label="选择所属对象">
            <Select allowClear value={ this.state.numberSchema.owner } onChange={ this.ownerChange }>
              {
                this.state.ownerList.map((ele, index, arr) => {
                  return (
                    <Option key={ ele.path + index } value={ index }>
                      <div style={ {
                        position: 'relative'
                      } }>
                        <span style={ {
                          position: 'absolute',
                          top: '0',
                          left: '0'
                        } }>{ ele.type + ' : ' }</span>
                        <span style={ {
                          marginLeft: '70px'
                        } }>{ ele.path }</span>
                      </div>
                    </Option>
                  )
                })
              }
            </Select>
            { this.state.ownerTypeStatus === 'array' &&
              <div>
                <Checkbox checked={ this.state.asFixedItems } onChange={ this.asFixedItemsStatusChange }>使用fixedItems</Checkbox>
                <Checkbox checked={ this.state.coverFixedItems } onChange={ this.coverFixedItemsStatusChange }>覆盖fixedItems</Checkbox>
                <p>选择的目标为数组，可以作为items或fixedItems(如果使用了fixedItems，目标已有items会自动变成addtionalItems，如果不使用fixedItems，则会把已有的items)</p>
              </div>
            }
          </FormItem>
        }

        <FormItem label="key">
          <Input value={ this.state.numberSchema.key } onInput={ this.keyInput }></Input>
        </FormItem>
        
        {
          !this.state.asDefinition && 
          <div>
            <FormItem label="限制为integer">
              <Checkbox checked={ this.state.asInteger } onChange={ this.asIntegerStatusChange }>选中后，会将数值强制转换为整型</Checkbox>
            </FormItem>

            <FormItem label="title">
              <Input value={ this.state.numberSchema.title } onInput={ this.titleInput }></Input>
            </FormItem>

            <FormItem label="description">
              <Input value={ this.state.numberSchema.description } onInput={ this.descriptionInput }></Input>
            </FormItem>

            <FormItem label="default">
              <Checkbox checked={ this.state.asDefault } onChange={ this.asDefaultChange }>使用default</Checkbox>
              <Input disabled={ !this.state.asDefault } value={ this.state.numberSchemaAddition.default ? this.state.numberSchemaAddition.default : '' } onInput={ this.defaultInput }></Input>
            </FormItem>

            <FormItem label="enum">
              <Checkbox checked={ this.state.enumStatus } onChange={ this.enumStatusChange }>使用enum</Checkbox>
              <TextArea disabled={ !this.state.enumStatus } value={ this.state.numberSchemaAddition.enum ? this.state.numberSchemaAddition.enum.join(',') : '' } onInput={ this.enumValueInput }></TextArea>
              enumNames:
              <TextArea disabled={ !this.state.enumStatus } value={ this.state.numberSchemaAddition.enumNames ? this.state.numberSchemaAddition.enumNames.join(',') : '' } onInput={ this.enumNamesValueInput }></TextArea>
            </FormItem>

            <FormItem label="最小值">
              <Input value={ this.state.numberSchemaAddition.minimum } onInput={ this.minimumInput }></Input>
            </FormItem>

            <FormItem label="最大值">
              <Input value={ this.state.numberSchemaAddition.maximum } onInput={ this.maximumInput }></Input>
            </FormItem>

            <FormItem label="值差">
              <Input value={ this.state.numberSchemaAddition.multipleOf } onInput={ this.multipleOfInput }></Input>
            </FormItem>
            {
              !this.state.asCreateDefinition &&
              <FormItem label="设置ui">
                <div className="nested-form-item">
                  <NumberUICreator ref={
                    (uiCreator) => {
                      this.uiCreator = uiCreator;
                    }
                  }></NumberUICreator>
                </div>
              </FormItem>
            }
          </div>
        }

        <FormItem className="form-buttons">
          <Button type="danger" onClick={ this.resetForm }>重置</Button>
          <Button type="primary" onClick={ this.confirmForm }>确认</Button>
        </FormItem>
      </Form>
    );
  }
}

export default NumberSchemaCreator;

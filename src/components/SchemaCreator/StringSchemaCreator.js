import React from 'react';

// * 样式

import StringUICreator from '@components/SchemaCreator/UICreator/StringUICreator';

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

class StringSchemaCreator extends React.Component {

  state = {
    formatStatus: false,
    ownerTypeStatus: 'object',
    asFixedItems: false,
    coverFixedItems: false,
    refStatus: false,
    asDefinition: false,
    asDefault: false,
    enumStatus: false,
    ownerList: [],
    defList: [],
    refList: [],
    stringSchema: {
      key: '',
      title: '',
      description: '',
      owner: '',
      defOwner: 'definitions',
      $ref: ''
    },
    stringSchemaAddition: {
      default: '',
      enum: '',
      enumNames: '',
      format: ''
    }
  }

  uiCreator = null;

  static formatList = [
    'email',
    'uri',
    'data-url',
    'date',
    'date-time'
  ]

  componentWillReceiveProps (nextProps) {
    let res = nextProps.compuListPrepare(nextProps);
    this.setState({
      ownerList: res.ownerList,
      defList: res.defList,
      refList: res.refList
    });
  }

  componentDidMount () {
    let res = this.props.compuListPrepare(this.props);
    this.setState({
      ownerList: res.ownerList,
      defList: res.defList,
      refList: res.refList
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
      formatStatus: false,
      ownerTypeStatus: 'object',
      asFixedItems: false,
      coverFixedItems: false,
      refStatus: false,
      asDefinition: false,
      asDefault: false,
      enumStatus: false,
      stringSchema: {
        key: '',
        title: '',
        description: '',
        owner: '',
        defOwner: 'definitions',
        $ref: ''
      },
      stringSchemaAddition: {
        default: '',
        enum: '',
        format: ''
      }
    });
    this.uiCreator.setState({
      ui: {},
      options: {},
      enumStatus: false,
      enumNamesStatus: false
    });
  }

  confirmForm = () => {
    if (!this.state.stringSchema.key) {
      return;
    }
    if (this.state.stringSchema.owner || this.state.asDefinition) {
      this.submitForm();
    } else {
      this.showConfirm();
    }
  }

  submitForm = () => {
    let stringSchema = this.objectFilter(this.state.stringSchema);
    if (!this.state.asDefinition) {
      stringSchema.defOwner && delete stringSchema.defOwner
    } else {
      stringSchema.owner !== undefined && delete stringSchema.owner
    }
    let data = {
      ...stringSchema,
      type: 'string'
    };

    this.state.formatStatus && (data.format = this.state.stringSchemaAddition.format);
    this.state.asDefault && (data.default = this.state.stringSchemaAddition.default);
    if (this.state.enumStatus) {
      data.enum = this.state.stringSchemaAddition.enum
      data.enumNames = this.state.stringSchemaAddition.enumNames;
    }

    if (this.state.ownerTypeStatus === 'array' && this.state.asFixedItems) {
      data.asFixedItems = true;
    } else if (this.state.ownerTypeStatus === 'array' && this.state.coverFixedItems) {
      data.coverFixedItems = true;
    }

    if (this.state.asDefinition) {
      delete data.$ref;
      this.props.addNewDefinition(data);
    } else if (this.state.refStatus) {
      let tmpData= {
        owner: data.owner,
        $ref: data.$ref,
        key: data.key,
        refStatus: true
      }
      tmpData.$ref && this.props.addNewProperties(tmpData);
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
    setTimeout(this.resetForm, 0);
  }

  // * ------------

  ownerChange = (value) => {
    console.log('ownerChange value:', value);
    this.setState((prevState, props) => {
      return {
        stringSchema: {
          ...prevState.stringSchema,
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
        stringSchema: {
          ...prevState.stringSchema,
          key: tmpValue
        }
      };
    });
  }

  titleInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        stringSchema: {
          ...prevState.stringSchema,
          title: tmpValue
        }
      };
    });
  }

  descriptionInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        stringSchema: {
          ...prevState.stringSchema,
          description: tmpValue
        }
      };
    });
  }

  defaultInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        stringSchemaAddition: {
          ...prevState.stringSchemaAddition,
          default: tmpValue
        }
      };
    });
  }

  minLengthInput = (event) => {
    let tmpValue = event.target.value;
    if (tmpValue !== '' && !isNaN(Number(tmpValue)) &&  Number(tmpValue) < Number.MAX_SAFE_INTEGER) {
      this.setState((prevState, props) => {
        return {
          stringSchema: {
            ...prevState.stringSchema,
            minLength: Number(tmpValue)
          }
        };
      });
    } else {
      if (tmpValue === '') {
        this.setState((prevState, props) => {
          delete prevState.minLength;
          return {
            stringSchema: ''
          };
        });
      } else {
        this.setState((prevState, props) => {
          delete prevState.minLength;
          return {
            stringSchema: prevState.stringSchema
          };
        });
      }
    }
  }

  enumStatusChange = (event) => {
    let checked = event.target.checked;
    this.setState((prevState, props) => {
      let data = {
        ...prevState.stringSchemaAddition,
      };
      if (!checked) {
        data.enum = '';
        data.enumNames = '';
      }
      return {
        stringSchemaAddition: data,
        enumStatus: checked
      };
    });
  }

  enumInput = (event) => {
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
        stringSchemaAddition: {
          ...prevState.stringSchemaAddition,
          enum: tmpRes
        }
      }
    });
  }

  enumNamesInput = (event) => {
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
        stringSchemaAddition: {
          ...prevState.stringSchemaAddition,
          enumNames: tmpRes
        }
      }
    })
  }

  filterCreateArray (param) {
    let value = param.value;
    if (!value) {
      return {
        list: []
      }
    }
    let tmpValueList = value.split(',');
    return {
      list: tmpValueList
    }
  }

  formatStatusChange = (event) => {
    let checked = event.target.checked;
    this.setState((prevState, props) => {
      let data = {
        ...prevState.stringSchemaAddition,
      };
      if (!checked) {
        data.format = '';
      }
      return {
        stringSchemaAddition: data,
        formatStatus: checked
      };
    });
  }

  formatTypeChange = (value) => {
    // if (value) {
    this.setState((prevState, props) => {
      return {
        stringSchemaAddition: {
          ...prevState.stringSchemaAddition,
          format: value
        }
      };
    });
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

  refStatusChange = (event) => {
    let checked = event.target.checked;
    this.setState((prevState, props) => {
      return {
        refStatus: checked,
        asDefinition: false
      };
    });
  }

  // * 选择的definition引用路径变化时
  refChange = (value) => {
    this.setState((prevState, props) => {
      return {
        stringSchema: {
          ...prevState.stringSchema,
          $ref: prevState.refList[value].path
        }
      };
    });
  }

  defStatusChange = (event) => {
    let checked = event.target.checked;
    this.setState((prevState, props) => {
      return {
        asDefinition: checked,
        refStatus: false
      };
    });
  }

  // * 选择的definition创建位置路径变化时
  defOwnerChange = (value) => {
    this.setState((prevState, props) => {
      return {
        stringSchema: {
          ...prevState.stringSchema,
          defOwner: prevState.defList[value].path
        }
      };
    });
  }

  asDefaultChange = (event) => {
    let checked = event.target.checked;
    if (!checked) {
      this.setState((prevState, props) => {
        delete prevState.stringSchemaAddition.default
        return {
          stringSchemaAddition: {
            ...prevState.stringSchemaAddition
          }
        }
      })
    }
    this.setState({
      asDefault: checked
    })
  }

  objectFilter = (obj = {}) => {
    if (!obj) {
      return;
    }
    let data = {};
    for (let item of Object.entries(obj)) {
      if (item[1] !== '' || item[0] === 'owner') {
        data[item[0]] = item[1];
      }
    }
    return data;
  }

  // * ------------

  render () {
    return (
      <Form>

        <FormItem label="$ref">
          <Checkbox checked={this.state.refStatus} onChange={
            this.refStatusChange
          }>
            引用definition
          </Checkbox>
          { this.state.refStatus &&
            <Select allowClear value={ this.state.stringSchema.$ref } onChange={ this.refChange }>
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

        { !this.state.refStatus &&
            <FormItem label="选择创建的definition的位置">
              <Checkbox checked={this.state.asDefinition} onChange={
                  this.defStatusChange
                }>
                  创建为definition，选择definition的创建位置
              </Checkbox>
              { this.state.asDefinition &&
                <Select value={ this.state.stringSchema.defOwner } onChange={ this.defOwnerChange }>
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
          !this.state.asDefinition &&
          <FormItem label="选择所属对象">
            <Select allowClear value={ this.state.stringSchema.owner } onChange={ this.ownerChange }>
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
          <Input value={ this.state.stringSchema.key } onInput={ this.keyInput }></Input>
        </FormItem>

        { !this.state.refStatus &&
          <div>
            <FormItem label="title">
              <Input value={ this.state.stringSchema.title } onInput={ this.titleInput }></Input>
            </FormItem>

            <FormItem label="description">
              <Input value={ this.state.stringSchema.description } onInput={ this.descriptionInput }></Input>
            </FormItem>

            <FormItem label="default">
              <Checkbox checked={ this.state.asDefault } onChange={ this.asDefaultChange }>使用default</Checkbox>
              <Input disabled={ !this.state.asDefault } value={ this.state.stringSchemaAddition.default } onInput={ this.defaultInput }></Input>
            </FormItem>

            <FormItem label="最小长度">
              <Input value={ this.state.stringSchema.minLength } onInput={ this.minLengthInput }></Input>
            </FormItem>

            <FormItem label="enum">
              <Checkbox checked={ this.state.enumStatus } onChange={ this.enumStatusChange }>使用enum</Checkbox>
              <TextArea disabled={ !this.state.enumStatus } value={ this.state.stringSchemaAddition.enum } onChange={ this.enumInput }></TextArea>
              enumNames:
              <TextArea disabled={ !this.state.enumStatus } value={ this.state.stringSchemaAddition.enumNames ? this.state.stringSchemaAddition.enumNames.join(',') : '' } onInput={ this.enumNamesInput }></TextArea>
            </FormItem>

            <FormItem label="format">
              <Checkbox checked={ this.state.formatStatus } onChange={ this.formatStatusChange }>使用format</Checkbox>
              <Select allowClear disabled={ !this.state.formatStatus } value={ this.state.stringSchemaAddition.format } onChange={ this.formatTypeChange }>
                {
                  StringSchemaCreator.formatList.map((ele, index, arr) => {
                    return <Option key={ ele + index } value={ ele }>{ ele }</Option>
                  })
                }
              </Select>
            </FormItem>
            {
              !this.state.asDefinition &&
              <FormItem label="设置ui">
                <div className="nested-form-item">
                  <StringUICreator ref={
                    (uiCreator) => {
                      this.uiCreator = uiCreator;
                    }
                  } filterCreateArray={this.filterCreateArray}></StringUICreator>
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

export default StringSchemaCreator;

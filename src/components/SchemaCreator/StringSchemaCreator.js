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
    ownerList: [],
    stringSchema: {
      key: '',
      title: '',
      description: '',
      owner: ''
    },
    stringSchemaAddition: {
      default: '',
      enum: '',
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
    console.log('o nextProps', nextProps);
    let tmpOwnerList = [];
    if (nextProps.properties) {
      tmpOwnerList = [{path: 'global', type: 'object'}].concat(this.compuOwnerList('global', nextProps.properties));
    } else if (nextProps.jsonSchema && nextProps.jsonSchema.type === 'array') {
      tmpOwnerList = this.compuOwnerListArray('', ['global', this.props.jsonSchema]);
    }
    this.setState({
      ownerList: tmpOwnerList
    });
  }

  componentDidMount () {
    console.log('o properties: ', this.props.properties);
    let tmpOwnerList = [];
    if (this.props.properties) {
      tmpOwnerList = [{path: 'global', type: 'object'}].concat(this.compuOwnerList('global', this.props.properties));
    } else if (this.props.jsonSchema && this.props.jsonSchema.type === 'array') {
      tmpOwnerList = this.compuOwnerListArray('', ['global', this.props.jsonSchema]);
    }
    this.setState({
      ownerList: tmpOwnerList
    });
  }

  // * ------------

  compuOwnerList = (path, properties) => {
    let tmpOwnerList = [];
    let propertiesEntryList = Object.entries(properties);
    for (let item of propertiesEntryList) {
      if (item[1].type === 'object') {
        tmpOwnerList = tmpOwnerList.concat(this.compuOwnerListObject(path, item));
      } else if (item[1].type === 'array') {
        tmpOwnerList = tmpOwnerList.concat(this.compuOwnerListArray(path, item));
      }
    }
    return tmpOwnerList;
  }

  compuOwnerListObject = (path, item, exclude = false) => {
    let tmpOwnerList = [];
    !exclude && tmpOwnerList.push({
      path: (path + '~/~' + item[0]).replace(/(^~\/~)|(~\/~$)/g, ''),
      type: 'object'
    });
    tmpOwnerList = tmpOwnerList.concat(this.compuOwnerList(path + '~/~' + item[0], item[1].properties));
    return tmpOwnerList;
  }

  compuOwnerListArray = (path, item, exclude = false) => {
    let tmpOwnerList = [];
    let tmpPath = path + '~/~' + item[0];
    !exclude && tmpOwnerList.push({
      path: tmpPath.replace(/(^~\/~)|(~\/~$)/g, ''),
      type: 'array'
    });
    if (item[1].items && Object.prototype.toString.call(item[1].items).indexOf('Array') !== -1) {
      let len = item[1].items.length;
      for (let i = 0; i < len; i++) {
        let tarr = this.compuOwnerListHelper(tmpPath, ['items~/~' + i, item[1].items[i]]);
        tmpOwnerList = tmpOwnerList.concat(tarr);
      }
      if (item[1].additionalItems && item[1].additionalItems.type !== undefined) {
        let tarr = this.compuOwnerListHelper(tmpPath, ['additionalItems', item[1].additionalItems]);
        tmpOwnerList = tmpOwnerList.concat(tarr);
      }
    } else if (item[1].items && Object.prototype.toString.call(item[1].items).indexOf('Object') !== -1) {
      let tarr = this.compuOwnerListHelper(tmpPath, ['items', item[1].items]);
      tmpOwnerList = tmpOwnerList.concat(tarr);
    }
    return tmpOwnerList;
  }

  compuOwnerListHelper = (path, item) => {
    let tmpOwnerList = [];
    if (item[1].type === 'object') {
      tmpOwnerList = tmpOwnerList.concat(this.compuOwnerListObject(path, item));
    } else if (item[1].type === 'array') {
      tmpOwnerList = tmpOwnerList.concat(this.compuOwnerListArray(path, item));
    }
    return tmpOwnerList;
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
      stringSchema: {
        key: '',
        title: '',
        description: '',
        owner: ''
      },
      stringSchemaAddition: {
        default: '',
        enum: '',
        format: ''
      }
    });
    this.uiCreator.setState({
      ui: {}
    });
  }

  confirmForm = () => {
    if (!this.state.stringSchema.key) {
      return;
    }
    if (this.state.stringSchema.owner) {
      this.submitForm();
    } else {
      this.showConfirm();
    }
  }

  submitForm = () => {
    let data = {
      ...this.state.stringSchema,
      type: 'string'
    };

    this.state.formatStatus && (data.format = this.state.stringSchemaAddition.format);
    this.state.enumStatus && (data.enum = this.state.stringSchemaAddition.enum);
    this.state.stringSchemaAddition.default && (data.default = this.state.stringSchemaAddition.default);

    if (this.state.ownerTypeStatus === 'array' && this.state.asFixedItems) {
      data.asFixedItems = true;
    } else if (this.state.ownerTypeStatus === 'array' && this.state.coverFixedItems) {
      data.coverFixedItems = true;
    }
    // * 如果有设置ui，则将ui添加到UISchema
    if (Object.keys(this.uiCreator.state.ui).length > 0) {
      data.ui = this.uiCreator.state.ui;
    }
    this.props.addNewProperties(data);
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
    if (tmpValue !== '' && !isNaN(Number(tmpValue))) {
      this.setState((prevState, props) => {
        return {
          stringSchema: {
            ...prevState.stringSchema,
            minLength: Number(tmpValue)
          }
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

  enumStatusChange = (event) => {
    let checked = event.target.checked;
    this.setState((prevState, props) => {
      let data = {
        ...prevState.stringSchemaAddition,
      };
      if (!checked) {
        data.enum = '';
      }
      return {
        stringSchemaAddition: data,
        enumStatus: checked
      };
    });
  }

  enumInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        stringSchemaAddition: {
          ...prevState.stringSchemaAddition,
          enum: tmpValue
        }
      }
    });
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

  // * ------------

  render () {
    return (
      <Form>
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

        <FormItem label="key">
          <Input value={ this.state.stringSchema.key } onInput={ this.keyInput }></Input>
        </FormItem>

        <FormItem label="title">
          <Input value={ this.state.stringSchema.title } onInput={ this.titleInput }></Input>
        </FormItem>

        <FormItem label="description">
          <Input value={ this.state.stringSchema.description } onInput={ this.descriptionInput }></Input>
        </FormItem>

        <FormItem label="default">
          <Input value={ this.state.stringSchemaAddition.default } onInput={ this.defaultInput }></Input>
        </FormItem>

        <FormItem label="最小长度">
          <Input value={ this.state.stringSchema.minLength } onInput={ this.minLengthInput }></Input>
        </FormItem>

        <FormItem label="enum">
          <Checkbox checked={ this.state.enumStatus } onChange={ this.enumStatusChange }>使用enum</Checkbox>
          <TextArea disabled={ !this.state.enumStatus } value={ this.state.stringSchemaAddition.enum } onChange={ this.enumInput }></TextArea>
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

        <FormItem label="设置ui">
          <div className="nested-form-item">
            <StringUICreator ref={
              (uiCreator) => {
                this.uiCreator = uiCreator;
              }
            }></StringUICreator>
          </div>
        </FormItem>

        <FormItem className="form-buttons">
          <Button type="danger" onClick={ this.resetForm }>重置</Button>
          <Button type="primary" onClick={ this.confirmForm }>确认</Button>
        </FormItem>
      </Form>
    );
  }
}

export default StringSchemaCreator;

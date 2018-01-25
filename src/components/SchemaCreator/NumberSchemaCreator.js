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
    enumStatus: false,
    ownerTypeStatus: 'object',
    asFixedItems: false,
    coverFixedItems: false,
    asInteger: false,
    numberSchema: {
      key: '',
      title: '',
      description: '',
      owner: ''
    },
    numberSchemaAddition: {
      default: '',
      enum: '',
      minimum: '',
      maximum: '',
      multipleOf: ''
    }
  }

  uiCreator = null;

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
      enumStatus: false,
      ownerTypeStatus: 'object',
      asFixedItems: false,
      coverFixedItems: false,
      asInteger: false,
      numberSchema: {
        key: '',
        title: '',
        description: '',
        owner: ''
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
      ui: {}
    });
  }

  confirmForm = () => {
    console.log('confirmForm');
    if (!this.state.numberSchema.key) {
      return;
    }
    if (this.state.numberSchema.owner) {
      this.submitForm();
    } else {
      this.showConfirm();
    }
  }

  submitForm = () => {
    let data = {
      ...this.state.numberSchema,
      type: this.state.asInteger ? 'integer' : 'number'
    };
    for (let item of Object.entries(this.state.numberSchemaAddition)) {
      if (item[1] !== '') {
        data[item[0]] = item[1];
      }
    }
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
        ...prevState.numberSchema
      };
      if (!checked) {
        delete data.enum;
      } else {
        data.enum = '';
      }
      return {
        numberSchema: data,
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
      tmpRes = '';
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

  // * ------------

  render () {
    return (
      <Form>
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

        <FormItem label="限制为integer">
          <Checkbox checked={ this.state.asInteger } onChange={ this.asIntegerStatusChange }>选中后，会将数值强制转换为整型</Checkbox>
        </FormItem>

        <FormItem label="key">
          <Input value={ this.state.numberSchema.key } onInput={ this.keyInput }></Input>
        </FormItem>

        <FormItem label="title">
          <Input value={ this.state.numberSchema.title } onInput={ this.titleInput }></Input>
        </FormItem>

        <FormItem label="description">
          <Input value={ this.state.numberSchema.description } onInput={ this.descriptionInput }></Input>
        </FormItem>

        <FormItem label="default">
          <Input value={ this.state.numberSchemaAddition.default } onInput={ this.defaultInput }></Input>
        </FormItem>

        <FormItem label="enum">
          <Checkbox checked={ this.state.enumStatus } onChange={ this.enumStatusChange }>使用enum</Checkbox>
          <TextArea disabled={ !this.state.enumStatus } value={ this.state.numberSchemaAddition.enum ? this.state.numberSchemaAddition.enum.join(',') : '' } onInput={ this.enumValueInput }></TextArea>
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

        <FormItem label="设置ui">
          <div className="nested-form-item">
            <NumberUICreator ref={
              (uiCreator) => {
                this.uiCreator = uiCreator;
              }
            }></NumberUICreator>
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

export default NumberSchemaCreator;

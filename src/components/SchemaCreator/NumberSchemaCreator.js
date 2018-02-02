import React from 'react';

// * 样式

import NumberUICreator from '@components/SchemaCreator/UICreator/NumberUICreator';

// * 功能库
import utilFund from '@utils/functions';

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
    enumStatus: false,
    ownerTypeStatus: 'object',
    asFixedItems: false,
    coverFixedItems: false,
    asInteger: false,
    asCreateDefinition: false,
    asDefinition: false,
    asDefault: false,
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
    this.compuListPrepare(nextProps);
  }

  componentDidMount () {
    console.log('o properties: ', this.props.properties);
    this.compuListPrepare(this.props);
  }

  // * ------------

  compuListPrepare = (props) => {
    let tmpOwnerList = [];
    if (props.properties) {
      tmpOwnerList = [{path: 'global', type: 'object'}].concat(this.compuOwnerList('global', props.properties));
    } else if (props.jsonSchema && props.jsonSchema.type === 'array') {
      tmpOwnerList = this.compuOwnerListArray('', ['global', props.jsonSchema]);
    }
    let tmpDefList = [];
    if (props.definitions) {
      tmpDefList = this.compuDefList('', props.definitions);
    }
    let tmpRefList = [];
    for (let index = 0; index < tmpDefList.length; index++) {
      let tmpList = tmpDefList[index].path.split('~/~');
      if (tmpList.length > 0 && tmpList[tmpList.length - 1] !== 'definitions') {
        tmpRefList.push(tmpDefList[index]);
      }
    }
    this.setState({
      ownerList: tmpOwnerList,
      defList: tmpDefList,
      refList: tmpRefList
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

  compuDefList = (path, item) => {
    // console.log('compuDefList');
    let tmpDefList = [];

    let prePath = path ? path + '~/~definitions' : 'definitions';
    tmpDefList.push({
      path: prePath,
      type: 'object'
    });

    let defEntriesList = Object.entries(item);
    // console.log('defEntriesList', defEntriesList);

    for (let item of defEntriesList) {
      let tmpPath = prePath + '~/~' + item[0];
      tmpDefList.push({
        path: tmpPath,
        type: 'object'
      });
      tmpDefList = this.compuDefListPure(tmpPath, item[1], tmpDefList);
    }
    return tmpDefList;
  }

  compuDefListObj = (path, param) => {
    console.log('compuDefListObj');
    let tmpDefList = [];

    let prePath = path ? path + '~/~definitions' : 'definitions';
    let tmpPath = prePath + '~/~' + param.key;
    console.log('tmpPath', tmpPath);
    tmpDefList.push({
      path: tmpPath,
      type: 'object'
    });
    tmpDefList = this.compuDefListPure(tmpPath, param.item, tmpDefList);
    return tmpDefList;
  }

  compuDefListArray = (path, item) => {
    console.log('compuDefListArray');
    let tmpDefList = [];

    let prePath = path + '~/~items';
    let len = item.length;
    for (let i = 0; i < len; i++) {
      let tmpPath = prePath + '~/~' + i;
      tmpDefList.push({
        path: tmpPath,
        type: 'object'
      });
      console.log('item[i]', item[i]);
      tmpDefList = this.compuDefListPure(tmpPath, item[i], tmpDefList);
    }
    return tmpDefList;
  }

  compuDefListPure = (path, item, list) => {
    let tmpDefList = list;
    let tmpPath = path;
    let tmpItem = item;

    if (tmpItem.definitions) {
      tmpDefList = tmpDefList.concat(this.compuDefList(tmpPath, tmpItem.definitions));
    }
    if (tmpItem.properties && Object.keys(tmpItem.properties).length > 0) {
      tmpDefList = tmpDefList.concat(this.compuDefList(tmpPath, tmpItem.properties));
    }
    if (tmpItem.items && utilFund.getPropertyJsType(tmpItem.items).indexOf('Object') !== -1) {
      tmpDefList = tmpDefList.concat(this.compuDefListObj(tmpPath, {key: 'items', item: tmpItem.items}));
    }
    if (tmpItem.items && utilFund.getPropertyJsType(tmpItem.items).indexOf('Array') !== -1 && tmpItem.items.length > 0) {
      tmpDefList = tmpDefList.concat(this.compuDefListArray(tmpPath, tmpItem.items));
    }
    if (tmpItem.additionalItems && utilFund.getPropertyJsType(tmpItem.additionalItems).indexOf('Object') !== -1) {
      tmpDefList = tmpDefList.concat(this.compuDefListObj(tmpPath, {key: 'additionalItems', item: tmpItem.additionalItems}));
    }
    return tmpDefList;
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
      if (item[1] !== '') {
        data[item[0]] = item[1];
      }
    }
    return data;
  }

  submitForm = () => {
    let numberSchemaAddition = this.objectFilter(this.state.numberSchemaAddition);
    let numberSchema = this.objectFilter(this.state.numberSchema);
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
        asCreateDefinition: false
      };
    });
  }

  asCreateDefinitionStatusChange = (e) => {
   let checked = e.target.checked;
   this.setState((prevState, props) => {
     return {
       asDefinition: false,
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

  // * ------------

  render () {
    return (
      <Form>
        <FormItem label="$ref">
          <Checkbox checked={this.state.asDefinition} onChange={this.asDefinitionStatusChange}>设置ref</Checkbox>
        </FormItem>
        {
          this.state.asDefinition &&
          <FormItem label="选择definition" className="nested-form-item">
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
          </FormItem>
        }
        {
          !this.state.asDefinition &&
          <FormItem>
            <Checkbox checked={this.state.asCreateDefinition} onChange={this.asCreateDefinitionStatusChange}>创建为definition，选择definition的创建位置</Checkbox>
          </FormItem>
        }
        {
          this.state.asCreateDefinition && 
          <FormItem label="选择所属definition" className="nested-form-item">
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

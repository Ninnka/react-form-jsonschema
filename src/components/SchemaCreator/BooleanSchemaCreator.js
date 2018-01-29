import React from 'react';
import UISchema from '@components/SchemaCreator/UICreator/BooleanUICreator'

// * 功能库
import utilFund from '@utils/functions';
// * 样式


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
const confirm = Modal.confirm;

class BooleanSchemaCreator extends React.Component {

  state = {
    ownerList: [],
    defList: [],
    refList: [],
    ownerTypeStatus: 'object',
    asFixedItems: false,
    coverFixedItems: false,
    asDefinition: false,
    asCreateDefinition: false,
    booleanSchema: {
      key: '',
      title: '',
      description: '',
      default: '',
      owner: '',
      '$ref': '',
      defOwner: 'definitions'
    }
  }

  UIschema = {}

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

  resetForm = () => {
    this.setState({
      ownerTypeStatus: 'object',
      asFixedItems: false,
      coverFixedItems: false,
      asDefinition: false,
      asCreateDefinition: false,
      booleanSchema: {
        key: '',
        title: '',
        description: '',
        default: '',
        owner: '',
        '$ref': '',
        defOwner: 'definitions'
      }
    });
    this.UIschema.setState({
      ui: {}
    });
  }

  confirmForm = () => {
    console.log('confirmForm');
    let data = {
      ...this.state.booleanSchema,
      asDefinition: this.state.asDefinition,
      type: 'boolean'
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
      console.log('添加asDefinition');
    } else if (this.state.asCreateDefinition) {
       delete data.$ref;
       this.props.addNewDefinition(data);
       console.log('创建Definition');
    } else {
      delete data.$ref;
      if (this.UIschema.state && Object.keys(this.UIschema.state.ui).length > 0) {
        data.ui = this.UIschema.state.ui;
      }
      this.props.addNewProperties(data);
      console.log('普通添加');
    }
    console.log(this.state.ownerList);
    setTimeout(this.resetForm, 0);
  }

  ownerChange = (value) => {
    console.log('ownerChange value:', value);
    this.setState((prevState, props) => {
      return {
        booleanSchema: {
          ...prevState.booleanSchema,
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
        booleanSchema: {
          ...prevState.booleanSchema,
          key: tmpValue
        }
      };
    });
  }

  titleInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        booleanSchema: {
          ...prevState.booleanSchema,
          title: tmpValue
        }
      };
    });
  }

  descriptionInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        booleanSchema: {
          ...prevState.booleanSchema,
          description: tmpValue
        }
      };
    });
  }

  defaultInput = (value) => {
    // let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        booleanSchema: {
          ...prevState.booleanSchema,
          default: !(value === 'false')
        }
      };
    });
  }

  uiChange = (value) => {
    this.setState((prevState, props) => {
      return {
        booleanSchema: {
          ...prevState.booleanSchema,
          ui: value
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

  handleConfirm = () => {
    if (!this.state.booleanSchema.key) {
      return;
    }
    if (this.state.booleanSchema.owner === '' && !this.state.asCreateDefinition){
      this.showMessage();
    } else {
      this.confirmForm();
    }
  }

  showMessage = () => {
    confirm({
      title: '消息提示',
      content: '提示：所属对象为空将覆盖根目录已有的属性，是否继续？',
      onOk: () => {
        this.confirmForm();
      }
    });
  }

  asDefinitionStatusChange = (e) => {
    let checked = e.target.checked;
    if (!checked) {
      this.setState({
        asDefinition: checked,
      })
    } else {
      this.setState({
        asDefinition: checked,
        asCreateDefinition: !checked
      })
    }
    
  }

  asCreateDefinitionStatusChange = (e) => {
    let checked = e.target.checked;
    if (!checked) {
      this.setState({
        asCreateDefinition: checked,
      })
    } else {
      this.setState({
        asCreateDefinition: checked,
        asDefinition: !checked
      })      
    }
  }

  refChange = (ref) => {
    this.setState((prevState, props) => {
      return {
        booleanSchema: {
          ...prevState.booleanSchema,
          $ref: prevState.refList[ref].path
        }
      }
    });
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

  // * 选择的definition创建位置路径变化时
  defOwnerChange = (value) => {
    this.setState((prevState, props) => {
      return {
        objectSchema: {
          ...prevState.objectSchema,
          defOwner: prevState.defList[value].path
        }
      };
    });
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
            <Select allowClear value={ this.state.booleanSchema.$ref } onChange={ this.refChange }>
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
        <FormItem>
          <Checkbox checked={this.state.asCreateDefinition} onChange={this.asCreateDefinitionStatusChange}>创建Definition</Checkbox>
        </FormItem>
        {
          this.state.asCreateDefinition && 
          <FormItem label="选择所属definition" className="nested-form-item">
            <Select value={ this.state.booleanSchema.defOwner } onChange={ this.defOwnerChange }>
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
            <Select value={ this.state.booleanSchema.owner } onChange={ this.ownerChange }>
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
          <Input value={ this.state.booleanSchema.key } onInput={ this.keyInput }></Input>
        </FormItem>
        {
          !this.state.asDefinition && 
          <div>
            <FormItem label="title">
              <Input value={ this.state.booleanSchema.title } onInput={ this.titleInput }></Input>
            </FormItem>

            <FormItem label="description">
              <Input value={ this.state.booleanSchema.description } onInput={ this.descriptionInput }></Input>
            </FormItem>

            <FormItem label="default">
              <Select value={ this.state.booleanSchema.default.toString() } onChange={ this.defaultInput }>
                <Option value="true">true</Option>
                <Option value="false">false</Option>
              </Select>
            </FormItem>
            {
              !this.state.asCreateDefinition &&
              <FormItem label="设置ui：">
                <div className="nested-form-item">
                  <UISchema ref={ (ui) => {
                    this.UIschema = ui;
                  }}/>
                </div>
              </FormItem>
            }
          </div>
        }
        <FormItem className="form-buttons">
          <Button type="danger" onClick={ this.resetForm }>重置</Button>
          <Button type="primary" onClick={ this.handleConfirm }>确认</Button>
        </FormItem>
      </Form>
    );
  }
}

export default BooleanSchemaCreator;

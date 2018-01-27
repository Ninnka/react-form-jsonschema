import React from 'react';

// * 样式


import ArrayUICreator from '@components/SchemaCreator/UICreator/ArrayUICreator';

// * 功能库
import utilFund from '@utils/functions';

import { cloneDeep } from 'lodash';

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
const InputGroup = Input.Group;
const confirm = Modal.confirm;

class ArraySchemaCreator extends React.Component {

  state = {
    additionalItemsStatus: false,
    fixedItemStatus: false,
    itemEnumStatus: false,
    ownerTypeStatus: 'object',
    asFixedItems: false,
    coverFixedItems: false,
    refStatus: false,
    asDefinition: false,
    ownerList: [],
    defList: [],
    refList: [],
    uniqueItemsStatus: false,
    arraySchema: {
      key: '',
      title: '',
      description: '',
      default: [],
      owner: '',
      defOwner: 'definitions',
      $ref: ''
    },
    additionalItems: {},
    fixedItemsList: [],
    newFixedItem: {
      key: '',
      type: '',
      title: '',
      description: ''
    },
    fixItemSelected: ''
  }

  uiCreator = null

  typeList = [
    'string',
    'number',
    'boolean',
    'object'
  ]

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
      // if (item[1].definitions) {
      //   tmpDefList = tmpDefList.concat(this.compuDefList(tmpPath, item[1].definitions));
      // }
      // if (item[1].properties) {
      //   tmpDefList = tmpDefList.concat(this.compuDefList(tmpPath, item[1].properties));
      // }
      // if (item[1].items && utilFund.getPropertyJsType(item[1].items).indexOf('Object') !== -1) {
      //   tmpDefList = tmpDefList.concat(this.compuDefListObj(tmpPath, {key: 'items', item: item[1].items}));
      // }
      // if (item[1].items && utilFund.getPropertyJsType(item[1].items).indexOf('Array') !== -1 && item[1].items.length > 0) {
      //   tmpDefList = tmpDefList.concat(this.compuDefListArray(tmpPath, item[1].items));
      // }
      // if (item[1].additionalItems && utilFund.getPropertyJsType(item[1].additionalItems).indexOf('Object') !== -1) {
      //   tmpDefList = tmpDefList.concat(this.compuDefListObj(tmpPath, {key: 'additionalItems', item: item[1].additionalItems}));
      // }
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
    // let tmpItem = param.item;
    // if (tmpItem.definitions) {
    //   tmpDefList = tmpDefList.concat(this.compuDefList(tmpPath, tmpItem.definitions));
    // }
    // if (tmpItem.properties) {
    //   tmpDefList = tmpDefList.concat(this.compuDefList(tmpPath, tmpItem.properties));
    // }
    // if (tmpItem.items && utilFund.getPropertyJsType(tmpItem.items).indexOf('Object') !== -1) {
    //   tmpDefList = tmpDefList.concat(this.compuDefListObj(tmpPath, {key: 'items', item: tmpItem.items}));
    // }
    // if (tmpItem.items && utilFund.getPropertyJsType(tmpItem.items).indexOf('Array') !== -1 && tmpItem.items.length > 0) {
    //   tmpDefList = tmpDefList.concat(this.compuDefListArray(tmpPath, tmpItem.items));
    // }
    // if (tmpItem.additionalItems && utilFund.getPropertyJsType(tmpItem.additionalItems).indexOf('Object') !== -1) {
    //   tmpDefList = tmpDefList.concat(this.compuDefListObj(tmpPath, {key: 'additionalItems', item: tmpItem.additionalItems}));
    // }
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
      console.log('tmpDefList', tmpDefList);
      // let tmpItem = item[i];
      // if (tmpItem.definitions) {
      //   tmpDefList = tmpDefList.concat(this.compuDefList(tmpPath, tmpItem.definitions));
      // }
      // if (tmpItem.properties) {
      //   tmpDefList = tmpDefList.concat(this.compuDefList(tmpPath, tmpItem.properties));
      // }
      // if (tmpItem.items && utilFund.getPropertyJsType(tmpItem.items).indexOf('Object') !== -1) {
      //   tmpDefList = tmpDefList.concat(this.compuDefListObj(tmpPath, {key: 'items', item: tmpItem.items}));
      // }
      // if (tmpItem.items && utilFund.getPropertyJsType(tmpItem.items).indexOf('Array') !== -1 && tmpItem.items.length > 0) {
      //   tmpDefList = tmpDefList.concat(this.compuDefListArray(tmpPath, tmpItem.items));
      // }
      // if (tmpItem.additionalItems && utilFund.getPropertyJsType(tmpItem.additionalItems).indexOf('Object') !== -1) {
      //   tmpDefList = tmpDefList.concat(this.compuDefListObj(tmpPath, {key: 'additionalItems', item: tmpItem.additionalItems}));
      // }
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
      additionalItemsStatus: false,
      fixedItemStatus: false,
      itemEnumStatus: false,
      ownerTypeStatus: 'object',
      asFixedItems: false,
      coverFixedItems: false,
      refStatus: false,
      asDefinition: false,
      uniqueItemsStatus: false,
      arraySchema: {
        key: '',
        title: '',
        description: '',
        default: [],
        owner: '',
        defOwner: 'definitions',
        $ref: ''
      },
      additionalItems: {},
      fixedItemsList: [],
      newFixedItem: {
        key: '',
        type: '',
        title: '',
        description: ''
      },
      fixItemSelected: ''
    });
    this.uiCreator.setState({
      ui: {},
      uiOptions: {}
    });
  }

  confirmForm = () => {
    console.log('confirmForm');
    if (!this.state.arraySchema.key) {
      return;
    }
    if (this.state.arraySchema.owner) {
      this.submitForm();
    } else {
      this.showConfirm();
    }
  }

  submitForm = () => {
    let data = {
      ...this.state.arraySchema,
      type: 'array',
      items: {}
    };
    if (this.state.ownerTypeStatus === 'array' && this.state.asFixedItems) {
      data.asFixedItems = true;
    } else if (this.state.ownerTypeStatus === 'array' && this.state.coverFixedItems) {
      data.coverFixedItems = true;
    }
    if (Object.keys(this.uiCreator.state.ui).length > 0) {
      data.ui = this.uiCreator.state.ui;
    }
    if (Object.keys(this.uiCreator.state.uiOptions).length > 0) {
      data.ui = {
        ...data.ui
      };
      data.ui['options'] = this.uiCreator.state.uiOptions;
    }
    this.props.addNewProperties(data);
    setTimeout(this.resetForm, 0);
  }

  // * ------------

  ownerChange = (value) => {
    console.log('ownerChange value:', value);
    this.setState((prevState, props) => {
      return {
        arraySchema: {
          ...prevState.arraySchema,
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
        arraySchema: {
          ...prevState.arraySchema,
          key: tmpValue
        }
      };
    });
  }

  titleInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        arraySchema: {
          ...prevState.arraySchema,
          title: tmpValue
        }
      };
    });
  }

  descriptionInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        arraySchema: {
          ...prevState.arraySchema,
          description: tmpValue
        }
      };
    });
  }

  defaultInput = (event) => {
    let tmpValue = event.target.value;
    let tmpValueList = tmpValue.split(',').map((ele) => {
      return isNaN(Number(ele)) ? ele : Number(ele);
    });
    this.setState((prevState, props) => {
      return {
        arraySchema: {
          ...prevState.arraySchema,
          default: tmpValueList
        }
      };
    });
  }

  uiChange = (value) => {
    console.log('uiChange value:', value);
    this.setState((prevState, props) => {
      return {
        arraySchema: {
          ...prevState.arraySchema,
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
      asFixedItems: false,
    });
  }

  uniqueItemsStatusChange = (event) => {
    let checked = event.target.checked;
    this.setState((prevState, props) => {
      let data = {
        ...prevState.arraySchema
      };
      if (!checked) {
        delete data.uniqueItems;
      } else {
        data.uniqueItems = checked;
      }
      return {
        arraySchema: data,
        uniqueItemsStatus: checked
      }
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
        arraySchema: {
          ...prevState.arraySchema,
          $ref: prevState.refList[value].path
        }
      };
    });
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

  itemAttrsChange = (param) => {
    this.setState((prevState, props) => {
      return {
        additionalItems: {
          ...prevState.additionalItems,
          [param.attr]: param.value
        }
      }
    })
  }

  confirmFormItem = () => {
  }

  resetFormItem = () => {
    this.setState({
      additionalItems: {}
    });
  }

  resetItemSetted = () => {
    this.setState((prevState, props) => {
      let tmpArraySchema = cloneDeep(prevState.arraySchema);
      delete tmpArraySchema.additionalItems;
      if (!prevState.fixedItemStatus) {
        delete tmpArraySchema.items;
      }
      return {
        arraySchema:tmpArraySchema
      }
    });
  }

  itemEnumStatusChange = (event) => {
    let checked = event.target.checked;
    this.setState({
      itemEnumStatus: checked
    });
  }

  itemEnumInput = (event) => {
    let tmpValue = event.target.value;
    if (tmpValue !== '') {
      let tmpRes = tmpValue.split(',').map((ele) => {
        return Number(ele);
      });
      this.setState((prevState, props) => {
        return {
          additionalItems: {
            ...prevState.additionalItems,
            enum: tmpRes
          }
        }
      });
    } else {
      this.setState((prevState, props) => {
        delete prevState.additionalItems.enum;
        return {
          additionalItems: prevState.additionalItems
        };
      });
    }
  }

  // * ------------

  fixedItemStatusChange = (event) => {
    let checked = event.target.checked;
    console.log('checked', checked);
    this.setState({
      fixedItemStatus: checked,
      additionalItemsStatus: checked
    });
  }

  deleteFixedItem = () => {
    if (this.state.fixedItemsList[this.state.fixItemSelected]) {
      let tmpFixedItemsList = cloneDeep(this.state.fixedItemsList);
      tmpFixedItemsList.splice(this.state.fixItemSelected, 1);
      this.setState({
        fixedItemsList: tmpFixedItemsList
      });
    }
  }

  selectDeleteFixedItem = (value) => {
    console.log('value', value);
    this.setState({
      fixItemSelected: value
    });
  }

  confirmFormFixedItem = () => {
    this.setState((prevState, props) => {
      return {
        fixedItemsList: prevState.fixedItemsList.concat([prevState.newFixedItem])
      }
    }, this.resetFormFixedItem);
  }

  resetFormFixedItem = () => {
    this.setState({
      newFixedItem: {
        key: '',
        type: '',
        title: '',
        description: ''
      },
      fixItemSelected: ''
    })
  }

  fixedItemAttrsChange = (param) => {
    this.setState((prevState, props) => {
      return {
        newFixedItem: {
          ...prevState.newFixedItem,
          [param.attr]: param.value
        }
      }
    })
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
            <Select allowClear value={ this.state.arraySchema.$ref } onChange={ this.refChange }>
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

        <FormItem label="key">
          <Input value={ this.state.arraySchema.key } onInput={ this.keyInput }></Input>
        </FormItem>

        { !this.state.asDefinition &&
          <FormItem label="选择所属对象">
            <Select value={ this.state.arraySchema.owner } onChange={ this.ownerChange }>
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

        { !this.state.refStatus &&
          <div>
            <FormItem label="选择创建的definition的位置">
              <Checkbox checked={this.state.asDefinition} onChange={
                  this.defStatusChange
                }>
                  创建为definition，选择definition的创建位置
              </Checkbox>
              { this.state.asDefinition &&
                <Select value={ this.state.arraySchema.defOwner } onChange={ this.defOwnerChange }>
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
            <FormItem label="title">
              <Input value={ this.state.arraySchema.title } onInput={ this.titleInput }></Input>
            </FormItem>

            <FormItem label="description">
              <Input value={ this.state.arraySchema.description } onInput={ this.descriptionInput }></Input>
            </FormItem>

            <FormItem label="default">
              <TextArea value={ this.state.arraySchema.default.join(',') } onInput={ this.defaultInput }></TextArea>
            </FormItem>

            <FormItem label="uniqueItems">
              <Checkbox checked={ this.state.uniqueItemsStatus } onChange={ this.uniqueItemsStatusChange }>成员唯一（成员只有一个）</Checkbox>
            </FormItem>

            <FormItem label="设置ui">
              <div className="nested-form-item">
                <ArrayUICreator ref={
                  (uiCreator) => {
                    this.uiCreator = uiCreator;
                  }
                }></ArrayUICreator>
              </div>
            </FormItem>
          </div>
        }

        {
          false &&
          <FormItem label="items">
            <InputGroup>
              <div className="nested-form-item">
                <p>(如果使用了fixedItems，确认建立arraySchema时，设置的items会自动变成addtionalItems)</p>
                <FormItem label="type">
                  <Select style={ {
                    width: '100%'
                  } } onChange={ (value) => {
                    this.itemAttrsChange({attr: 'type', value})
                  } } value={
                    this.state.additionalItems.type
                  }>
                    {
                      this.typeList.map((ele, index, arr) => {
                        return <Option key={ ele + index } value={ ele }>{ ele }</Option>
                      })
                    }
                  </Select>
                </FormItem>

                <FormItem label="title">
                  <Input value={ this.state.additionalItems.title } onInput={ (event) => {
                    let tmpValue = event.target.value;
                    this.itemAttrsChange({attr: 'title', value: tmpValue})
                  } }></Input>
                </FormItem>

                <FormItem label="default">
                  <Input value={ this.state.additionalItems.default } onInput={ (event) => {
                    let tmpValue = event.target.value;
                    this.itemAttrsChange({attr: 'default', value: tmpValue})
                  } }></Input>
                </FormItem>

                <FormItem label="description">
                  <Input value={ this.state.additionalItems.description } onInput={ (event) => {
                    let tmpValue = event.target.value;
                    this.itemAttrsChange({attr: 'description', value: tmpValue})
                  } }></Input>
                </FormItem>

                <FormItem label="enum">
                  <Checkbox checked={ this.state.itemEnumStatus } onChange={ this.itemEnumStatusChange }>使用enum</Checkbox>
                  <TextArea value={ this.state.additionalItems.enum && typeof this.state.additionalItems.enum === 'object' ? this.state.additionalItems.enum.join(',') : '' } disabled={ !this.state.itemEnumStatus } onInput={ this.itemEnumInput }></TextArea>
                </FormItem>

                <FormItem className="form-buttons">
                  <Button type="danger" onClick={ this.resetItemSetted }>删除非固定items（additionalItems）</Button>
                  <Button type="danger" onClick={ this.resetFormItem }>重置表单</Button>
                  <Button type="primary" onClick={ this.confirmFormItem }>添加为items</Button>
                </FormItem>
              </div>
            </InputGroup>
          </FormItem>
        }

        {
          false &&
          <FormItem label="fixedItems">
            <InputGroup>
              <Checkbox checked={ this.state.fixedItemStatus } onChange={ this.fixedItemStatusChange }>添加固定的item</Checkbox>

              {
                this.state.fixedItemStatus &&
                <div className="nested-form-item">
                  <FormItem label="选择需要删除的固定item">
                    <Select style={ {
                      width: '100%'
                    } } onChange={ this.selectDeleteFixedItem } value={ this.state.fixedItemsList[this.state.fixItemSelected] ? this.state.fixedItemsList[this.state.fixItemSelected].title : '' }>
                      {
                        this.state.fixedItemsList.map((ele, index) => {
                          return <Option key={ ele.type + ele.title + index } value={ index }>{ ele.title }</Option>
                        })
                      }
                    </Select>
                    <Button type="danger" onClick={ this.deleteFixedItem }>删除</Button>
                  </FormItem>

                  <FormItem label="type">
                    <Select style={ {
                      width: '100%'
                    } } onChange={ (value) => {
                      this.fixedItemAttrsChange({attr: 'type', value})
                    } } value={ this.state.newFixedItem.type }>
                      {
                        this.typeList.map((ele, index, arr) => {
                          return <Option key={ ele + index } value={ ele }>{ ele }</Option>
                        })
                      }
                    </Select>
                  </FormItem>

                  <FormItem label="title">
                    <Input value={ this.state.newFixedItem.title } onInput={ (event) => {
                      let tmpValue = event.target.value;
                      this.fixedItemAttrsChange({attr: 'title', value: tmpValue})
                    } }></Input>
                  </FormItem>

                  <FormItem label="default">
                    <Input value={ this.state.newFixedItem.default } onInput={ (event) => {
                      let tmpValue = event.target.value;
                      this.fixedItemAttrsChange({attr: 'default', value: tmpValue})
                    } }></Input>
                  </FormItem>

                  <FormItem label="description">
                    <Input value={ this.state.newFixedItem.description } onInput={ (event) => {
                      let tmpValue = event.target.value;
                      this.fixedItemAttrsChange({attr: 'description', value: tmpValue})
                    } }></Input>
                  </FormItem>

                  <FormItem className="form-buttons">
                    <Button type="danger" onClick={ this.resetFormFixedItem }>重置</Button>
                    <Button type="primary" onClick={ this.confirmFormFixedItem }>添加</Button>
                  </FormItem>
                </div>
              }


            </InputGroup>
          </FormItem>
        }

        <FormItem className="form-buttons">
          <Button type="danger" onClick={ this.resetForm }>重置</Button>
          <Button type="primary" onClick={ this.confirmForm }>确认</Button>
        </FormItem>
      </Form>
    )
  }
}

export default ArraySchemaCreator;

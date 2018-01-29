import React from 'react';

// * 样式

import ObjectUICreator from '@components/SchemaCreator/UICreator/ObjectUICreator';

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
const confirm = Modal.confirm;
const TextArea = Input.TextArea;

class ObjectSchemaCreator extends React.Component {

  state = {
    ownerList: [],
    defList: [],
    refList: [],
    ownerTypeStatus: 'object',
    asFixedItems: false,
    coverFixedItems: false,
    refStatus: false,
    asDefinition: false,
    newDep: {
      key: '',
      value: ''
    },
    newDependencies: [],
    objectSchema: {
      key: '',
      title: '',
      description: '',
      required: [],
      owner: '',
      defOwner: 'definitions',
      $ref: ''
    }
  }

  uiCreator = null

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
      ownerTypeStatus: 'object',
      asFixedItems: false,
      coverFixedItems: false,
      refStatus: false,
      asDefinition: false,
      newDep: {
        key: '',
        value: ''
      },
      newDependencies: [],
      objectSchema: {
        key: '',
        title: '',
        description: '',
        required: [],
        owner: '',
        defOwner: 'definitions',
        $ref: ''
      }
    });
    this.uiCreator.setState({
      ui: {}
    });
  }

  confirmForm = () => {
    if (!this.state.objectSchema.key) {
      return;
    }
    if (this.state.objectSchema.owner || this.state.asDefinition) {
      this.submitForm();
    } else {
      this.showConfirm();
    }
  }

  submitForm = () => {
    let data = {
      ...this.state.objectSchema,
      type: 'object',
      properties: {}
    };
    if (this.state.ownerTypeStatus === 'array' && this.state.asFixedItems) {
      data.asFixedItems = true;
    } else if (this.state.ownerTypeStatus === 'array' && this.state.coverFixedItems) {
      data.coverFixedItems = true;
    }

    // * 判断是否应该加入依赖
    if (this.state.newDependencies.length > 0) {
      data.dependencies = {
        ...data.dependencies
      }
      for (let item of this.state.newDependencies) {
        data.dependencies[item.key] = [...item.value];
      }
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
        data.ui = this.uiCreator.state.ui;
      }
      this.props.addNewProperties(data);
    }
    setTimeout(this.resetForm, 0);
  }

  // * ------------

  refStatusChange = (event) => {
    let checked = event.target.checked;
    this.setState((prevState, props) => {
      return {
        refStatus: checked,
        asDefinition: false
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

  ownerChange = (value) => {
    console.log('ownerChange value:', value);
    this.setState((prevState, props) => {
      return {
        objectSchema: {
          ...prevState.objectSchema,
          owner: value !== undefined ? prevState.ownerList[value].path : ''
        },
        ownerTypeStatus: value !== undefined ? prevState.ownerList[value].type : ''
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

  // * 选择的definition引用路径变化时
  refChange = (value) => {
    this.setState((prevState, props) => {
      return {
        objectSchema: {
          ...prevState.objectSchema,
          $ref: prevState.refList[value].path
        }
      };
    });
  }

  keyInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        objectSchema: {
          ...prevState.objectSchema,
          key: tmpValue
        }
      };
    });
  }

  titleInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        objectSchema: {
          ...prevState.objectSchema,
          title: tmpValue
        }
      };
    });
  }

  descriptionInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        objectSchema: {
          ...prevState.objectSchema,
          description: tmpValue
        }
      };
    });
  }

  requiredInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        objectSchema: {
          ...prevState.objectSchema,
          required: tmpValue.split(',')
        }
      };
    });
  }

  dependenciesInput = (event, name) => {
    if (event === undefined) {
      return;
    }
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        newDep: {
          ...prevState.newDep,
          [name]: tmpValue
        }
      };
    })
  }

  deleteDep = (key) => {
    let len = this.state.newDependencies.length;
    let data = [];
    for (let i = 0; i < len; i++) {
      if (this.state.newDependencies[i].key !== key) {
        data.push(this.state.newDependencies[i]);
      }
    }
    this.setState((prevState, props) => {
      return {
        newDependencies: data
      }
    });
  }

  addDep = () => {
    this.setState((prevState, props) => {
      return {
        newDependencies: [
          ...prevState.newDependencies,
          {
            key: prevState.newDep.key,
            value: prevState.newDep.value.split(',')
          }
        ]
      }
    })
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
    console.log('render');
    return (
      <Form>

        <FormItem label="$ref">
          <Checkbox checked={this.state.refStatus} onChange={
            this.refStatusChange
          }>
            引用definition
          </Checkbox>
          { this.state.refStatus &&
            <Select allowClear value={ this.state.objectSchema.$ref } onChange={ this.refChange }>
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
          <Input value={ this.state.objectSchema.key } onInput={ this.keyInput }></Input>
        </FormItem>

        { !this.state.asDefinition &&
          <FormItem label="选择所属对象">
            <Select allowClear value={ this.state.objectSchema.owner } onChange={ this.ownerChange }>
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
                <Select value={ this.state.objectSchema.defOwner } onChange={ this.defOwnerChange }>
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
              <Input value={ this.state.objectSchema.title } onInput={ this.titleInput }></Input>
            </FormItem>

            <FormItem label="description">
              <Input value={ this.state.objectSchema.description } onInput={ this.descriptionInput }></Input>
            </FormItem>

            <FormItem label="required">
              <Input value={ this.state.objectSchema.required ? this.state.objectSchema.required.join(',') : '' } onInput={ this.requiredInput }></Input>
            </FormItem>

            <FormItem label="properties dependencies">
              <div>
              <div>
                  <span>依赖对象</span>
                  <Input value={ this.state.newDep.key } onChange={ (e) => {
                    this.dependenciesInput(e, 'key')
                  } }></Input>
                </div>
                <div>
                  <span>被依赖对象</span>
                  <TextArea value={ this.state.newDep.value } onChange={ (e) => {
                    this.dependenciesInput(e, 'value');
                  } }></TextArea>
                </div>
                <Button type="primary" onClick={ this.addDep }>添加</Button>
              </div>
              {
                this.state.newDependencies.map((ele, index, arr) => {
                  return (
                    <div key={ ele.key + ele.vlaue + index } className="flex-lfix mg-top-middle">
                      <Button type="danger" onClick={ () => {
                        this.deleteDep(ele.key);
                      } }>删除</Button>
                      <div style={ {
                        marginLeft: '24px',
                        lineHeight: '32px'
                      } }>
                        <span style={ {
                          color: 'red'
                        } }>{ ele.key + ': '}</span>
                        <span>{ ele.value.join(',') }</span>
                      </div>
                    </div>
                  )
                })
              }
            </FormItem>

            <FormItem label="schema dependencies"></FormItem>

            <FormItem label="设置ui">
              <div className="nested-form-item">
                <ObjectUICreator ref={
                  (uiCreator) => {
                    this.uiCreator = uiCreator;
                  }
                }></ObjectUICreator>
              </div>
            </FormItem>
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

export default ObjectSchemaCreator;

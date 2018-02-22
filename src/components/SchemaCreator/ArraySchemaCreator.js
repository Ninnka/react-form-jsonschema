import React from 'react';

// * 样式


import ArrayUICreator from '@components/SchemaCreator/UICreator/ArrayUICreator';

// * 功能库
import utilFunc from '@utils/functions';

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
    arrayTypeList: [],
    editPattern: false,
    editTargetIndex: '',
    editTargetKey: '',
    additionalItemsStatus: false,
    fixedItemStatus: false,
    itemEnumStatus: false,
    ownerTypeStatus: 'object',
    asFixedItems: false,
    coverFixedItems: false,
    refStatus: false,
    useDefault: false,
    asDefinition: false,
    ownerList: [],
    defList: [],
    refList: [],
    uniqueItemsStatus: false,
    newDep: {
      key: '',
      value: ''
    },
    newDependencies: [],
    arraySchema: {
      key: '',
      title: '',
      description: '',
      default: [],
      owner: '',
      defOwner: 'definitions',
      $ref: ''
    },
    arraySchemaOptions: {
      default: [],
      minItems: ''
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
    let res = nextProps.compuListPrepare(nextProps);
    this.setState({
      ownerList: nextProps.ownerList ? nextProps.ownerList : [],
      defList: nextProps.defList ? nextProps.defList : [],
      refList: nextProps.refList ? nextProps.refList : [],
      arrayTypeList: res.sameTypeListObj.tmpArrayList
    });
  }

  componentDidMount () {
    console.log('o properties: ', this.props.properties);
    let res = this.props.compuListPrepare(this.props);
    this.setState({
      ownerList: this.props.ownerList ? this.props.ownerList : [],
      defList: this.props.defList ? this.props.defList : [],
      refList: this.props.refList ? this.props.refList : [],
      arrayTypeList: res.sameTypeListObj.tmpArrayList
    });
  }

  // * ------------

  resetForm = () => {
    this.setState({
      editPattern: false,
      editTargetIndex: '',
      editTargetKey: '',
      additionalItemsStatus: false,
      fixedItemStatus: false,
      itemEnumStatus: false,
      ownerTypeStatus: 'object',
      asFixedItems: false,
      coverFixedItems: false,
      refStatus: false,
      useDefault: false,
      asDefinition: false,
      uniqueItemsStatus: false,
      newDep: {
        key: '',
        value: ''
      },
      newDependencies: [],
      arraySchema: {
        key: '',
        title: '',
        description: '',
        owner: '',
        defOwner: 'definitions',
        $ref: ''
      },
      arraySchemaOptions: {
        default: [],
        minItems: ''
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

  confirmForm = () => {
    if (!this.state.arraySchema.key) {
      utilFunc.messageWarning({
        message: 'key值不能为空'
      });
      return;
    }
    if (this.state.arraySchema.owner || this.state.asDefinition) {
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

    // * 判断是否应该加入default
    if (this.state.useDefault) {
      data.default = this.state.arraySchemaOptions.default;
    }

    // * 判断是否应该加入minItems
    if (this.state.arraySchemaOptions.minItems !== '') {
      data.minItems = this.state.arraySchemaOptions.minItems;
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
      delete data.defOwner;
      // * 如果有设置ui，则将ui添加到UISchema
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
    }
    setTimeout(this.resetForm, 0);
  }

  // * ------------

    // * 编辑模式的变化(每次点击都会清空表单中已经填写的值)
    editPatternChange = (event) => {
      let checked = event.target.checked;
      this.setState((prevState, props) => {
        let tmpData = {};
        for (let item of Object.keys(prevState.arraySchema)) {
          tmpData[item] = '';
        }
        return {
          editPattern: checked,
          editTargetIndex: '',
          editTargetKey: '',
          arraySchema: tmpData,
          newDependencies: []
        }
      });
    }

    // * 编辑对象变化
    editTargetChange = (value) => {
      this.setState((prevState, props) => {
        let resData = {};
        let editTarget = value !== undefined ? prevState.arrayTypeList[value] : null;
        let tmpArraySchema = {
          ...prevState.arraySchema
        };

        // * 获取目标对象的值
        for (let item of Object.keys(tmpArraySchema)) {
          tmpArraySchema[item] = editTarget !== null && editTarget[item] !== undefined ? editTarget[item] : '';
        }

        let newDependencies = [];
        // * 如果选中的目标有dependencies
        if (editTarget && editTarget.dependencies) {
          for (let dependency of Object.entries(editTarget.dependencies)) {
            // * properties dependencies
            utilFunc.getPropertyJsType(dependency[1]).indexOf('Array') !== -1 && (
              newDependencies.push(this.editTargetPropDependency(dependency))
            );
          }
        }

        // * 如果选中的目标有$ref属性
        if (editTarget && editTarget.$ref) {
          // * 转换为$ref模式
          tmpArraySchema.$ref = editTarget.$ref;
          resData.refStatus = true;
        }

        resData.editTargetIndex = value !== undefined ? value : '';
        resData.editTargetKey = editTarget !== null ? editTarget.key : '';
        resData.arraySchema = tmpArraySchema;
        resData.newDependencies = newDependencies;

        return {
          ...resData
        }
      })
    }

    // * 编辑模式的对象的dependency为props dependency时
    editTargetPropDependency = (dependency) => {
      return {
        key: dependency[0],
        value: dependency[1] ? dependency[1] : []
      };
    }

  // * ------------

  ownerChange = (value) => {
    console.log('ownerChange value:', value);
    this.setState((prevState, props) => {
      return {
        arraySchema: {
          ...prevState.arraySchema,
          owner: value !== undefined ? prevState.ownerList[value].path : ''
        },
        ownerTypeStatus: value !== undefined ? prevState.ownerList[value].type : ''
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
        arraySchemaOptions: {
          ...prevState.arraySchemaOptions,
          default: tmpValueList
        }
      };
    });
  }

  useDefaultChange = (event) => {
    let checked = event.target.checked;
    this.setState((prevState, props) => {
      let data = {
        ...prevState.arraySchemaOptions
      };
      if (!checked) {
        data.default = [];
      }
      return {
        arraySchemaOptions: data,
        useDefault: checked
      }
    });
  }

  minItemsInput = (event) => {
    let tmpValue = event.target.value;
    if (isNaN(Number(tmpValue))) {
      return;
    }
    this.setState((prevState, props) => {
      return {
        arraySchemaOptions: {
          ...prevState.arraySchemaOptions,
          minItems: tmpValue === '' ? '' : Number(tmpValue)
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

  defStatusChange = (event) => {
    let checked = event.target.checked;
    this.setState((prevState, props) => {
      return {
        asDefinition: checked,
        refStatus: false
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
        arraySchema: {
          ...prevState.arraySchema,
          defOwner: prevState.defList[value].path
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

        { !this.state.editPattern &&
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
        }

        <FormItem label="key">
          <Input value={ this.state.arraySchema.key } onInput={ this.keyInput }></Input>
        </FormItem>

        { !this.state.asDefinition &&
          <FormItem label="选择所属对象">
            <Select allowClear disabled={ this.state.editPattern } value={ this.state.arraySchema.owner } onChange={ this.ownerChange }>
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
            { !this.state.editPattern &&
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
            }

            <FormItem label="编辑模式">
              <Checkbox checked={ this.state.editPattern } onChange={ this.editPatternChange }>编辑模式</Checkbox>
              { this.state.editPattern &&
                <Select allowClear value={ this.state.editTargetKey } onChange={ this.editTargetChange }>
                  { this.state.arrayTypeList && this.state.arrayTypeList.length >0 &&
                    this.state.arrayTypeList.map((ele, index, arr) => {
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

            <FormItem label="title">
              <Input value={ this.state.arraySchema.title } onInput={ this.titleInput }></Input>
            </FormItem>

            <FormItem label="description">
              <Input value={ this.state.arraySchema.description } onInput={ this.descriptionInput }></Input>
            </FormItem>

            <FormItem label="uniqueItems">
              <Checkbox checked={ this.state.uniqueItemsStatus } onChange={ this.uniqueItemsStatusChange }>成员唯一（成员只有一个）</Checkbox>
            </FormItem>

            <FormItem label="default">
              <Checkbox checked={ this.state.useDefault !== undefined ? this.state.useDefault : false } onChange={ this.useDefaultChange }>使用default</Checkbox>
              <TextArea disabled={ this.state.useDefault !== undefined ? !this.state.useDefault : false } value={ this.state.arraySchemaOptions.default !== undefined ? this.state.arraySchemaOptions.default.join(',') : '' } onInput={ this.defaultInput }></TextArea>
            </FormItem>

            <FormItem label="minItems">
              <Input value={ this.state.arraySchemaOptions.minItems } onInput={ this.minItemsInput }></Input>
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

            <FormItem label="设置ui">
              <div className="nested-form-item">
                <ArrayUICreator ref={
                  (uiCreator) => {
                    this.uiCreator = uiCreator;
                  }
                } uiFromProps={
                  this.state.editPattern
                  && this.state.arrayTypeList[this.state.editTargetIndex]
                  && this.state.arrayTypeList[this.state.editTargetIndex].ui
                  ? this.state.arrayTypeList[this.state.editTargetIndex].ui : {}
                } editTargetIndex={ this.state.editTargetIndex } />
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
                    <Select style={ { width: '100%' } } onChange={ this.selectDeleteFixedItem } value={ this.state.fixedItemsList[this.state.fixItemSelected] ? this.state.fixedItemsList[this.state.fixItemSelected].title : '' }>
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

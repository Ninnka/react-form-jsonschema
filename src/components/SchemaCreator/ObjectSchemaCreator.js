import React from 'react';

// * 样式

import ObjectUICreator from '@components/SchemaCreator/UICreator/ObjectUICreator';

// * 功能库
import utilFunc from '@utils/functions';

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
    objectTypeList: [],
    ownerList: [],
    defList: [],
    refList: [],
    ownerTypeStatus: 'object',
    asFixedItems: false,
    coverFixedItems: false,
    refStatus: false,
    asDefinition: false,
    editPattern: false,
    editTargetIndex: '',
    editTargetKey: '',
    newDep: {
      key: '',
      value: ''
    },
    newDependencies: [],
    schemaDepList: [],
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
    let res = nextProps.compuListPrepare(nextProps);
    this.setState({
      ownerList: res.ownerList,
      defList: res.defList,
      refList: res.refList,
      objectTypeList: res.sameTypeListObj.tmpObjectList
    });
  }

  componentDidMount () {
    console.log('o properties: ', this.props.properties);
    let res = this.props.compuListPrepare(this.props);
    this.setState({
      ownerList: res.ownerList,
      defList: res.defList,
      refList: res.refList,
      objectTypeList: res.sameTypeListObj.tmpObjectList
    });
  }

  // * ------------

  resetForm = () => {
    this.setState({
      ownerTypeStatus: 'object',
      asFixedItems: false,
      coverFixedItems: false,
      refStatus: false,
      asDefinition: false,
      editPattern: false,
      editTargetIndex: '',
      editTargetKey: '',
      newDep: {
        key: '',
        value: ''
      },
      newDependencies: [],
      schemaDepList: [],
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
    if (!this.state.objectSchema.key) {
      utilFunc.messageWarning({
        message: 'key值不能为空'
      });
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
      // properties: {}
    };
    data.properties = this.state.editPattern ? (this.state.objectTypeList[this.state.editTargetIndex].properties) : ({});
    if (this.state.ownerTypeStatus === 'array' && this.state.asFixedItems) {
      data.asFixedItems = true;
    } else if (this.state.ownerTypeStatus === 'array' && this.state.coverFixedItems) {
      data.coverFixedItems = true;
    }

    // * 判断是否应该加入property依赖
    if (this.state.newDependencies.length > 0) {
      data.dependencies = {
        ...data.dependencies
      };
      for (let item of this.state.newDependencies) {
        data.dependencies[item.key] = [...item.value];
      }
    }

    // * 判断是否应该加入schema依赖
    if (this.state.schemaDepList.length > 0) {
      data.dependencies = {
        ...data.dependencies
      };
      for (let item of this.state.schemaDepList) {
        if (item.useOneOfDep) {
          // * 创建的schema dependency使用的是oneOf模式
          let tmpData = {
            oneOf: []
          };
          item.key && (data.dependencies[item.key] = tmpData);
          for (let i of item.depItemOneOfList) {
            tmpData.oneOf.push(i);
          }
        } else {
          // * 创建的schema dependency使用的是一般模式
          item.key && (data.dependencies[item.key] = {
            properties: {
              ...item.properties
            },
            required: [
              ...item.required
            ]
          })
        }
      }
    }

    if (this.state.asDefinition) {
      // * 作为一个新的definition
      delete data.$ref;
      this.props.addNewDefinition(data);
    } else if (this.state.refStatus) {
      // * 引用了definition
      let tmpData = {
        owner: data.owner,
        $ref: data.$ref,
        key: data.key,
        refStatus: true
      }
      tmpData.$ref && this.props.addNewProperties(tmpData);
    } else {
      // * 正常模式
      delete data.$ref;
      delete data.defOwner;
      // * 如果有设置ui，则将ui添加到UISchema
      if (Object.keys(this.uiCreator.state.ui).length > 0) {
        data.ui = this.uiCreator.state.ui;
      }
      this.state.editPattern && (data.editPattern = true);
      this.props.addNewProperties(data);
    }
    // setTimeout(this.resetForm, 0);
    utilFunc.nextTick(() => {
      this.resetForm();
    });
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

  // * 编辑模式的变化(每次点击都会清空表单中已经填写的值)
  editPatternChange = (event) => {
    let checked = event.target.checked;
    this.setState((prevState, props) => {
      let tmpData = {};
      for (let item of Object.keys(prevState.objectSchema)) {
        tmpData[item] = '';
      }
      return {
        editPattern: checked,
        editTargetIndex: '',
        editTargetKey: '',
        objectSchema: tmpData,
        newDependencies: [],
        schemaDepList: [],
      }
    });
  }

  // * 编辑对象变化
  editTargetChange = (value) => {
    this.setState((prevState, props) => {
      let resData = {};
      let editTarget = value !== undefined ? prevState.objectTypeList[value] : null;
      let tmpObjectSchema = {
        ...prevState.objectSchema
      };

      // * 获取目标对象的值
      for (let item of Object.keys(tmpObjectSchema)) {
        tmpObjectSchema[item] = editTarget !== null && editTarget[item] !== undefined ? editTarget[item] : '';
      }

      let newDependencies = [];
      let schemaDepList = [];
      // * 如果选中的目标有dependencies
      if (editTarget && editTarget.dependencies) {
        for (let dependency of Object.entries(editTarget.dependencies)) {
          // * properties dependencies
          utilFunc.getPropertyJsType(dependency[1]).indexOf('Array') !== -1 && (
            newDependencies.push(this.editTargetPropDependency(dependency))
          );
          // * schema dependencies
          utilFunc.getPropertyJsType(dependency[1]).indexOf('Object') !== -1 && (
            schemaDepList.push(this.editTargetSchemaDependency(dependency))
          );
        }
      }

      // * 如果选中的目标有$ref属性
      if (editTarget && editTarget.$ref) {
        // * 转换为$ref模式
        tmpObjectSchema.$ref = editTarget.$ref;
        resData.refStatus = true;
      }

      resData.editTargetIndex = value !== undefined ? value : '';
      resData.editTargetKey = editTarget !== null ? editTarget.key : '';
      resData.objectSchema = tmpObjectSchema;
      resData.newDependencies = newDependencies;
      resData.schemaDepList = schemaDepList;

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

  // * 编辑模式的对象的dependency为schema dependency时
  editTargetSchemaDependency = (dependency) => {
    let tmpDepItemOneOfList = [];
    let tmpId = utilFunc.createRandomId();
    let tmpKey = dependency[0];
    let tmpNewDep = {
      description: '',
      key: '',
      type: ''
    };
    let tmpNewOneOfDep = {
      enum: [],
      properties: {},
      required: []
    };
    let tmpNewOneOfDepProp = {
      key: '',
      type: ''
    };
    let tmpProperties = {

    };
    let tmpRequired = [];
    let tmpUseOneOfDep = false;

    if (!dependency[1].oneOf) {
      // * normal模式schema dependency
      tmpUseOneOfDep = false;
      // * 创建properties对象
      for (let item of Object.entries(dependency[1].properties)) {
        tmpProperties[item[0]] = item[1];
      }
      // * 创建required
      tmpRequired = dependency[1].required;
    } else {
      // * oneof模式schema dependency
      tmpUseOneOfDep = true;
      tmpDepItemOneOfList = dependency[1].oneOf;
    }

    return {
      depItemOneOfList: tmpDepItemOneOfList,
      id: tmpId,
      key: tmpKey,
      newDep: tmpNewDep,
      newOneOfDep: tmpNewOneOfDep,
      newOneOfDepProp: tmpNewOneOfDepProp,
      properties: tmpProperties,
      required: tmpRequired,
      useOneOfDep: tmpUseOneOfDep
    };
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

  addSchemaDep = () => {
    let data = {
      id: utilFunc.createRandomId(),
      useOneOfDep: false,
      depItemOneOfList: [], // * need
      key: '', // * need
      properties: {}, // * needz
      required: [], // * need
      newDep: {
        key: '',
        type: '',
        description: ''
      },
      newOneOfDep: {
        properties: {},
        required: [],
        enum: []
      },
      newOneOfDepProp: {
        type: '',
        key: ''
      }
    };
    this.setState((prevState, props) => {
      return {
        schemaDepList: [
          ...prevState.schemaDepList,
          data
        ]
      }
    });
  }

  delSchemaDep = (index) => {
    this.setState((prevState, props) => {
      let data = [...prevState.schemaDepList];
      data.splice(index, 1);
      return {
        schemaDepList: data
      }
    });
  }

  depItemOriKeyInput = (event, index) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      let data = [...prevState.schemaDepList];
      data[index].key = tmpValue;
      return {
        schemaDepList: data
      }
    })
  }

  depItemOriRequiredChange = (event, index) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      let data = [...prevState.schemaDepList];
      data[index].required = tmpValue !== undefined ? tmpValue.split(',') : [];
      return {
        schemaDepList: data
      }
    })
  }

  depItemNewTypeChange = (value, index) => {
    this.setState((prevState, props) => {
      let data = [...prevState.schemaDepList];
      data[index].newDep.type = value;
      return {
        schemaDepList: data
      }
    })
  }

  depItemNewValueChange = (event, key, index) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      let data = [...prevState.schemaDepList];
      data[index].newDep[key] = tmpValue;
      return {
        schemaDepList: data
      }
    })
  }

  addSchemaDepItemProperty = (index, newDep) => {
    if (this.state.schemaDepList[index].key === '') {
      return '';
    }
    this.setState((prevState, props) => {
      let data = [...prevState.schemaDepList];
      data[index].properties[newDep.key] = newDep;
      data[index].newDep = {
        key: '',
        type: '',
        description: ''
      };
      return {
        schemaDepList: data
      }
    }, () => {
      utilFunc.messageSuccess({
        message: '添加成功'
      })
    })
  }

  delSchemaDepItemProperty = (index, key) => {
    this.setState((prevState, props) => {
      let data = [...prevState.schemaDepList];
      delete data[index].properties[key]
      return {
        schemaDepList: data
      }
    })
  }

  depItemOneOfChange = (event, index) => {
    let checked = event.target.checked;
    this.setState((prevState, props) => {
      let data = [...prevState.schemaDepList];
      data[index].useOneOfDep = checked;
      return {
        schemaDepList: data
      }
    });
  }

  newOneOfDepAttrChange = (event, key, index) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      let data = [...prevState.schemaDepList];
      data[index].newOneOfDep[key] = tmpValue.split(',');
      return {
        schemaDepList: data
      };
    });
  }

  depOneOfItemNewTypeChange = (value, index) => {
    this.setState((prevState, props) => {
      let data = [...prevState.schemaDepList];
      data[index].newOneOfDepProp.type = value;
      return {
        schemaDepList: data
      };
    });
  }

  depOneOfItemNewKeyInput = (event, index) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      let data = [...prevState.schemaDepList];
      data[index].newOneOfDepProp.key = tmpValue;
      return {
        schemaDepList: data
      };
    })
  }

  addOneOfDepItemProperties = (index) => {
    this.setState((prevState, props) => {
      let data = [...prevState.schemaDepList];
      let key = data[index].newOneOfDepProp.key;

      data[index].newOneOfDep.properties[key] = {
        type: data[index].newOneOfDepProp.type
      };
      data[index].newOneOfDepProp = {
        type: '',
        key: ''
      };
      return {
        schemaDepList: data
      };
    }, () => {
      utilFunc.messageSuccess({
        message: '添加成功'
      })
    });
  }

  delOneOfDepItemProperties = (index, key) => {
    this.setState((prevState, props) => {
      let data = [...prevState.schemaDepList];
      delete data[index].newOneOfDep.properties[key]
      return {
        schemaDepList: data
      };
    });
  }

  addOneOfListDepItem = (event, index) => {
    this.setState((prevState, props) => {
      let data = [...prevState.schemaDepList];
      let oriKey = data[index].key;

      data[index].depItemOneOfList.push({
        properties: {
          [oriKey]: {
            enum: data[index].newOneOfDep.enum
          },
          ...data[index].newOneOfDep.properties
        },
        required: data[index].newOneOfDep.required
      });

      // * 清空子表单值
      data[index].newOneOfDep = {
        properties: {},
        required: [],
        enum: []
      };

      return {
        schemaDepList: data
      };
    });
  }

  delOneOfDepItem = (index) => {
    this.setState((prevState, props) => {
      let data = [...prevState.schemaDepList];
      data[index].depItemOneOfList.splice(index, 1);
      return {
        schemaDepList: data
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
    console.log('render');
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
        }

        <FormItem label="key">
          <Input value={ this.state.objectSchema.key } onInput={ this.keyInput }></Input>
        </FormItem>

        { !this.state.asDefinition &&
          <FormItem label="选择所属对象">
            <Select disabled={ this.state.editPattern } allowClear value={ this.state.objectSchema.owner } onChange={ this.ownerChange }>
              {
                this.state.ownerList.map((ele, index, arr) => {
                  return (
                    <Option key={ ele.path + index } value={ index }>
                      <div style={ { position: 'relative' } }>
                        <span style={ { position: 'absolute', top: '0', left: '0' } }>{ ele.type + ' : ' }</span>
                        <span style={ { marginLeft: '70px' } }>{ ele.path }</span>
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
            }

            <FormItem label="编辑模式">
              <Checkbox checked={ this.state.editPattern } onChange={ this.editPatternChange }>编辑模式</Checkbox>
              { this.state.editPattern &&
                <Select allowClear value={ this.state.editTargetKey } onChange={ this.editTargetChange }>
                  { this.state.objectTypeList && this.state.objectTypeList.length >0 &&
                    this.state.objectTypeList.map((ele, index, arr) => {
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
                      <div style={ { marginLeft: '24px', lineHeight: '32px' } }>
                        <span style={ { color: 'red' } }>{ ele.key + ': '}</span>
                        <span>{ ele.value.join(',') }</span>
                      </div>
                    </div>
                  )
                })
              }
            </FormItem>

            <FormItem label="schema dependencies">
              <div>
                {
                  this.state.schemaDepList.map((ele, index, arr) => {
                    return (
                      <div key={ ele.id } className="flex-lfix diving-line">
                        <Button type="danger" className="mg-top-middle" onClick={ () => {
                          this.delSchemaDep(index)
                        } }>删除</Button>
                        <div className="flex-item-grow mg-left-middle">
                          <Checkbox checked={ ele.useOneOfDep } onChange={ (e) => {
                            this.depItemOneOfChange(e, index)
                          } }>oneOf模式</Checkbox>

                          <FormItem label="依赖者的key">
                            <Input value={ ele.key } onChange={ (e) => {
                              this.depItemOriKeyInput(e, index)
                            } }></Input>
                          </FormItem>

                          { !ele.useOneOfDep &&
                            <div>
                              <FormItem label="依赖者的required">
                                <Input value={ ele.required ? ele.required.join(',') : '' } onChange={ (e) => {
                                  this.depItemOriRequiredChange(e, index)
                                } }></Input>
                              </FormItem>

                              <div style={ { boxSizing: 'border-box', paddingLeft: '36px', marginBottom: '16px' } }>
                                <FormItem label="type">
                                  <Select allowClear value={ ele.newDep.type } onChange={ (value) => {
                                    this.depItemNewTypeChange(value, index)
                                  } }>
                                    <Option value="string">string</Option>
                                    <Option value="number">number</Option>
                                    <Option value="integer">integer</Option>
                                    <Option value="boolean">boolean</Option>
                                  </Select>
                                </FormItem>
                                <FormItem label="被依赖者的key">
                                  <Input value={ ele.newDep.key } onChange={ (e) => {
                                    this.depItemNewValueChange(e, 'key', index)
                                  } }></Input>
                                </FormItem>
                                <FormItem label="被依赖者的description">
                                  <Input value={ ele.newDep.description } onChange={ (e) => {
                                    this.depItemNewValueChange(e, 'description', index)
                                  } }></Input>
                                </FormItem>
                                <Button type="primary" onClick={ () => {
                                  this.addSchemaDepItemProperty(index, ele.newDep)
                                } }>添加properties</Button>
                                { ele.properties &&
                                  Object.entries(ele.properties).map((item, i, arr) => {
                                    return (
                                      <div key={ item[1].key } className="flex-lfix mg-top-thin" style={ { lineHeight: '32px' } }>
                                        <Button type="danger" onClick={ (e) => {
                                          this.delSchemaDepItemProperty(index, item[0])
                                        } }>删除</Button>
                                        <div className="mg-left-middle">
                                          <span style={ { color: 'red' } }>{ item[0] + ':  ' }</span>
                                          <span>{ JSON.stringify(item[1]) }</span>
                                        </div>
                                      </div>
                                    )
                                  })
                                }
                              </div>
                            </div>
                          }

                          { ele.useOneOfDep &&
                            <div>
                              <div>
                                <FormItem label="required">
                                  <TextArea value={ ele.newOneOfDep.required ? ele.newOneOfDep.required.join(',') : '' } onChange={ (e) => {
                                    this.newOneOfDepAttrChange(e, 'required', index)
                                  } }></TextArea>
                                </FormItem>
                                <FormItem label="enum">
                                  <TextArea value={ ele.newOneOfDep.enum ? ele.newOneOfDep.enum.join(',') : '' } onChange={ (e) => {
                                    this.newOneOfDepAttrChange(e, 'enum', index)
                                  } }></TextArea>
                                </FormItem>
                                <FormItem label="properties">
                                  <div className="borderbox-padleft">
                                    <FormItem label="type">
                                      <Select allowClear value={ ele.newOneOfDepProp.type } onChange={ (value) => {
                                        this.depOneOfItemNewTypeChange(value, index)
                                      } }>
                                        <Option value="string">string</Option>
                                        <Option value="number">number</Option>
                                        <Option value="integer">integer</Option>
                                        <Option value="boolean">boolean</Option>
                                      </Select>
                                    </FormItem>
                                    <FormItem label="key">
                                      <Input value={ ele.newOneOfDepProp.key } onChange={ (e) => {
                                        this.depOneOfItemNewKeyInput(e, index)
                                      } }></Input>
                                    </FormItem>
                                    <Button type="primary" onClick={ () => {
                                      this.addOneOfDepItemProperties(index)
                                    } }>添加properties</Button>
                                    {
                                      ele.newOneOfDep && ele.newOneOfDep.properties &&
                                      Object.entries(ele.newOneOfDep.properties).map((item, i) => {
                                        return (
                                          <div key={ i } className="flex-lfix">
                                            <Button type="danger" onClick={ () => {
                                              this.delOneOfDepItemProperties(index, item[0])
                                            } }>删除</Button>
                                            <div className="mg-left-middle">
                                              <span style={ {color: 'red'} }>{ item[0] + ':  ' }</span>
                                              <span>{ JSON.stringify(item[1]) }</span>
                                            </div>
                                          </div>
                                        )
                                      })
                                    }
                                    <div></div>
                                  </div>
                                </FormItem>
                              </div>
                              <Button type="primary" style={ { marginBottom: '12px' } } onClick={ (e) => {
                                this.addOneOfListDepItem(e, index)
                              } }>确认创建oneOf的item</Button>
                              {
                                ele.depItemOneOfList && ele.depItemOneOfList.length > 0 &&
                                ele.depItemOneOfList.map((item, i, arr) => {
                                  return (
                                    <div key={ i } className="flex-lfix">
                                      <Button type="danger" onClick={ () => {
                                        this.delOneOfDepItem(index)
                                      } }>删除</Button>
                                      <div className="mg-left-middle">
                                        <span style={ {color: 'red'} }>{ JSON.stringify(item) }</span>
                                      </div>
                                    </div>
                                  )
                                })
                              }
                            </div>
                          }

                        </div>
                      </div>
                    )
                  })
                }
                <Button type="primary" className="mg-top-middle" onClick={ this.addSchemaDep }>添加Schema Dependency</Button>
              </div>
            </FormItem>

            <FormItem label="设置ui">
              <div className="nested-form-item">
                <ObjectUICreator ref={
                  (uiCreator) => {
                    this.uiCreator = uiCreator;
                  }
                } uiFromProps={
                  this.state.editPattern
                  && this.state.objectTypeList[this.state.editTargetIndex]
                  && this.state.objectTypeList[this.state.editTargetIndex].ui
                  ? this.state.objectTypeList[this.state.editTargetIndex].ui : {}
                } editTargetIndex={ this.state.editTargetIndex } />
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

import React from 'react';
import UISchema from '@components/SchemaCreator/UICreator/BooleanUICreator'

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
    booleanTypeList: [],
    ownerList: [],
    defList: [],
    refList: [],
    ownerTypeStatus: 'object',
    asFixedItems: false,
    coverFixedItems: false,
    asDefinition: false,
    asCreateDefinition: false,
    asModify: false,
    editTargetKey: '',
    editTargetIndex: '',
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

  UIschema = {} // UISchema的ref对象

  componentWillReceiveProps (nextProps) {
    console.log('o nextProps', nextProps);
    // this.compuListPrepare(nextProps);
    // let res = nextProps.compuListPrepare(nextProps);
    this.setState({
      ownerList: nextProps.ownerList ? nextProps.ownerList : [],
      defList: nextProps.defList ? nextProps.defList : [],
      refList: nextProps.refList ? nextProps.refList : [],
      booleanTypeList: nextProps.booleanTypeList ? nextProps.booleanTypeList : []
    });
  }

  componentDidMount () {
    console.log('o properties: ', this.props.properties);
    // this.compuListPrepare(this.props);
    // let res = this.props.compuListPrepare(this.props);
    this.setState({
      ownerList: this.props.ownerList ? this.props.ownerList : [],
      defList: this.props.defList ? this.props.defList : [],
      refList: this.props.refList ? this.props.refList : [],
      booleanTypeList: this.props.booleanTypeList ? this.props.booleanTypeList : []
    });
  }

  resetForm = () => {
    this.setState({
      ownerTypeStatus: 'object',
      asFixedItems: false,
      coverFixedItems: false,
      asDefinition: false,
      asCreateDefinition: false,
      asModify: false,
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
      ui: {},
      options: {}
    });
  }

  confirmForm = () => {
    console.log('confirmForm');
    let booleanSchema = this.objectFilter(this.state.booleanSchema);
    if (!this.state.asCreateDefinition) {
      booleanSchema.defOwner && delete booleanSchema.defOwner;
    } else {
      booleanSchema.owner !== undefined && delete booleanSchema.owner;
    }
    let data = {
      ...booleanSchema,
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
    } else if (this.state.asCreateDefinition) {
       delete data.$ref;
       this.props.addNewDefinition(data);
    } else {
      delete data.$ref;
      if (this.UIschema.state.ui && Object.keys(this.UIschema.state.ui).length > 0) {
        if (this.UIschema.state.ui.options && Object.keys(this.UIschema.state.ui.options).length < 0) {
          delete this.UIschema.state.ui.options;
        }
        data.ui = this.objectFilter(this.UIschema.state.ui);
      }
      this.props.addNewProperties(data);
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
          owner: typeof value === 'number' ? prevState.ownerList[value].path : ''
        },
        ownerTypeStatus: typeof value === 'number' ? prevState.ownerList[value].type : ''
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
        asCreateDefinition: !checked,
        asModify: !checked,
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
        asModify: !checked,
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

  // * 选择的definition创建位置路径变化时
  defOwnerChange = (value) => {
    this.setState((prevState, props) => {
      return {
        booleanSchema: {
          ...prevState.booleanSchema,
          defOwner: prevState.defList[value].path
        }
      };
    });
  }

  asModifyStatusChange = (event) => {
    let checked = event.target.checked;
    this.setState({
      editTargetKey: '',
      editTargetIndex: '',
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
    if (!checked) {
      this.setState({
        asModify: checked
      })
    } else {
      this.setState({
        asModify: checked,
        asCreateDefinition: !checked,
        asDefinition: !checked
      })
    }
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

  // * 编辑对象变化
  modifyTargetChange = (value) => {
    console.log(value);
    this.setState((prevState, props) => {
      console.log(prevState.booleanTypeList);
      let editTarget = value !== undefined ? prevState.booleanTypeList[value] : null;
      let tmpObjectSchema = {
        ...prevState.booleanSchema
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
        booleanSchema: tmpObjectSchema
      }
    })
  }

  // * ------------

  render () {
    return (
      <Form>
        {
          !(this.state.asModify || this.state.asCreateDefinition) &&
          <FormItem label="$ref">
            <Checkbox checked={this.state.asDefinition} onChange={this.asDefinitionStatusChange}>设置ref</Checkbox> 
          </FormItem>
        }
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
        {
          !(this.state.asDefinition || this.state.asModify) &&
          <FormItem label="创建Definition">
            <Checkbox checked={this.state.asCreateDefinition} onChange={this.asCreateDefinitionStatusChange}>创建Definition</Checkbox>
          </FormItem>
        }
        {
          this.state.asCreateDefinition && 
          <FormItem label="选择创建的definition的位置" className="nested-form-item">
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
          !(this.state.asDefinition || this.state.asCreateDefinition) &&
          <FormItem label="编辑模式">
            <Checkbox checked={this.state.asModify} onChange={this.asModifyStatusChange}>编辑模式</Checkbox>
            { this.state.asModify &&
              <Select allowClear value={ this.state.editTargetKey } onChange={ this.modifyTargetChange }>
                { this.state.booleanTypeList && this.state.booleanTypeList.length >0 &&
                  this.state.booleanTypeList.map((ele, index, arr) => {
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
            <Select value={ this.state.booleanSchema.owner } onChange={ this.ownerChange } disabled={this.state.asModify} allowClear>
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
              <Select value={ this.state.booleanSchema.default ? this.state.booleanSchema.default.toString() : '' } onChange={ this.defaultInput }>
                <Option value="true">true</Option>
                <Option value="false">false</Option>
              </Select>
            </FormItem>
            {
              !this.state.asCreateDefinition &&
              <FormItem label="设置ui：">
                <div className="nested-form-item">
                  <UISchema 
                    ref={ (ui) => {
                      this.UIschema = ui;
                    }}
                    modifyUi={
                      this.state.asModify &&
                      this.state.booleanTypeList[this.state.editTargetIndex] &&
                      this.state.booleanTypeList[this.state.editTargetIndex].ui ?
                      this.state.booleanTypeList[this.state.editTargetIndex].ui : {}
                    }
                    index={
                      this.state.editTargetIndex                      
                    }
                  />
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

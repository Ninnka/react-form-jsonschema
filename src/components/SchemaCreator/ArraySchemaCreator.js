import React from 'react';

// * 样式


import { cloneDeep } from 'lodash';

// * antd组件
import {
  Form,
  Input,
  Select,
  Button,
  Checkbox,
  Col
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
const InputGroup = Input.Group;

class ArraySchemaCreator extends React.Component {

  state = {
    additionalItemsStatus: false,
    fixedItemStatus: false,
    itemEnumStatus: false,
    ownerList: [],
    arraySchema: {
      key: '',
      title: '',
      description: '',
      default: [],
      owner: '',
      ui: ''
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

  typeList = [
    'string',
    'number',
    'boolean',
    'object'
  ]

  componentWillReceiveProps (nextProps) {
    console.log('nextProps', nextProps);
    let tmpOwnerList = ['global'].concat(this.compuOwnerList('global', nextProps.properties));
    this.setState({
      ownerList: tmpOwnerList
    });
  }

  componentDidMount () {
    console.log('properties: ', this.props.properties);
    let tmpOwnerList = ['global'].concat(this.compuOwnerList('global', this.props.properties));
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
        tmpOwnerList.push(path + '~/~' + item[0]);
        tmpOwnerList.concat(this.compuOwnerList(path + '~/~' + item[0], item[1].properties));
      }
    }
    return tmpOwnerList;
  }

  resetForm = () => {
    this.setState({
      additionalItemsStatus: false,
      fixedItemStatus: false,
      itemEnumStatus: false,
      arraySchema: {
        key: '',
        title: '',
        description: '',
        default: [],
        owner: '',
        ui: ''
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
  }

  confirmForm = () => {
    console.log('confirmForm');
    if (!this.state.arraySchema.key) {
      return;
    }
    let data = {
      ...this.state.arraySchema,
      type: 'array'
    };
    if (this.state.fixedItemStatus) {
      data.additionalItems = this.state.additionalItems;
      data.items = this.state.fixedItemsList;
    } else {
      data.items = this.state.additionalItems;
    }
    this.props.addNewProperties(data);
    setTimeout(this.resetForm, 0);
  }

  ownerChange = (value) => {
    console.log('ownerChange value:', value);
    this.setState((prevState, props) => {
      return {
        arraySchema: {
          ...prevState.arraySchema,
          owner: value
        }
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
    // this.setState((prevState, props) => {
    //   let data = {
    //     ...prevState.arraySchema
    //   }
    //   if (this.state.additionalItemsStatus) {
    //     data.additionalItems = prevState.additionalItems;
    //   } else {
    //     data.items = prevState.additionalItems;
    //   }
    //   return {
    //     arraySchema: data
    //   }
    // });
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
        <FormItem label="选择所属对象">
          <Select value={ this.state.arraySchema.owner } onChange={ this.ownerChange }>
            {
              this.state.ownerList.map((ele, index, arr) => {
                return <Option key={ ele + index } value={ ele }>{ ele }</Option>
              })
            }
          </Select>
        </FormItem>

        <FormItem label="key">
          <Input value={ this.state.arraySchema.key } onInput={ this.keyInput }></Input>
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

        <FormItem label="">

        </FormItem>

        <FormItem className="form-buttons">
          <Button type="danger" onClick={ this.resetForm }>重置</Button>
          <Button type="primary" onClick={ this.confirmForm }>确认</Button>
        </FormItem>
      </Form>
    )
  }
}

export default ArraySchemaCreator;

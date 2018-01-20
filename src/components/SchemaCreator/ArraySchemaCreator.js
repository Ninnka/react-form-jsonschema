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
    additionalItem: {},
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
      arraySchema: {
        key: '',
        title: '',
        description: '',
        default: [],
        owner: '',
        ui: ''
      },
      additionalItem: {},
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
    this.props.addNewProperties({
      ...this.state.arraySchema,
      type: 'array'
    });
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

  fixedItemStatusChange = (event) => {
    let checked = event.target.checked;
    this.setState({
      fixedItemStatus: checked
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
        additionalItem: {
          ...prevState.additionalItem,
          [param.attr]: param.value
        }
      }
    })
  }

  confirmFormItem = () => {
    this.setState((prevState, props) => {
      return {
        arraySchema: {
          ...prevState.arraySchema,
          items: prevState.additionalItem
        }
      }
    });
  }

  resetFormItem = () => {

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
          additionalItem: {
            ...prevState.additionalItem,
            enum: tmpRes
          }
        }
      });
    } else {
      this.setState((prevState, props) => {
        delete prevState.additionalItem.enum;
        return {
          additionalItem: prevState.additionalItem
        };
      });
    }
  }

  // * ------------

  deleteFixedItem = () => {
    // let tmpFixedItemsList = cloneDeep(this.state.fixedItemsList);
    // this.setState((prevState, props) => {
    //   tmpFixedItemsList.splice(prevState.fixItemSelected.index, 1);
    //   return {
    //     fixedItemsList: tmpFixedItemsList
    //   };
    // });
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
          <Select defaultValue={ this.state.arraySchema.owner } onChange={ this.ownerChange }>
            {
              this.state.ownerList.map((ele, index, arr) => {
                return <Option key={ ele + index } value={ ele }>{ ele }</Option>
              })
            }
          </Select>
        </FormItem>

        <FormItem label="key">
          <Input onInput={ this.keyInput }></Input>
        </FormItem>

        <FormItem label="title">
          <Input onInput={ this.titleInput }></Input>
        </FormItem>

        <FormItem label="description">
          <Input onInput={ this.descriptionInput }></Input>
        </FormItem>

        <FormItem label="default">
          <TextArea onInput={ this.defaultInput }></TextArea>
        </FormItem>

        <FormItem label="item">
          <InputGroup>
            <div className="nested-form-item">
              <FormItem label="type">
                <Select style={ {
                  width: '100%'
                } } onChange={ (value) => {
                  this.itemAttrsChange({attr: 'type', value})
                } }>
                  {
                    this.typeList.map((ele, index, arr) => {
                      return <Option key={ ele + index } value={ ele }>{ ele }</Option>
                    })
                  }
                </Select>
              </FormItem>

              <FormItem label="title">
                <Input onInput={ (event) => {
                  let tmpValue = event.target.value;
                  this.itemAttrsChange({attr: 'title', value: tmpValue})
                } }></Input>
              </FormItem>

              <FormItem label="default">
                <Input onInput={ (event) => {
                  let tmpValue = event.target.value;
                  this.itemAttrsChange({attr: 'default', value: tmpValue})
                } }></Input>
              </FormItem>

              <FormItem label="description">
                <Input onInput={ (event) => {
                  let tmpValue = event.target.value;
                  this.itemAttrsChange({attr: 'description', value: tmpValue})
                } }></Input>
              </FormItem>

              <FormItem label="enum">
                <Checkbox defaultValue={ this.state.itemEnumStatus } onChange={ this.itemEnumStatusChange }>使用enum</Checkbox>
                <TextArea disabled={ !this.state.itemEnumStatus } onInput={ this.itemEnumInput }></TextArea>
              </FormItem>

              <FormItem className="form-buttons">
                <Button type="danger" onClick={ this.resetFormItem }>重置</Button>
                <Button type="primary" onClick={ this.confirmFormItem }>确定</Button>
              </FormItem>
            </div>
          </InputGroup>
        </FormItem>

        <FormItem label="fixedItem">
          <InputGroup>
            <Checkbox defaultValue={ this.state.fixedItemStatus } onChange={ this.fixedItemStatusChange }>添加固定的item</Checkbox>

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

import React from 'react';

// * 样式


// * antd组件
import {
  Form,
  Input,
  Select,
  Button,
  Checkbox
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class StringSchemaCreator extends React.Component {

  state = {
    formatStatus: false,
    ownerList: [],
    stringSchema: {
      key: '',
      title: '',
      description: '',
      default: '',
      formDataValue: '',
      owner: '',
      ui: ''
    }
  }

  static formatList = [
    'email',
    'uri',
    'data-url',
    'date',
    'date-time'
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
      stringSchema: {
        key: '',
        title: '',
        description: '',
        default: '',
        formDataValue: '',
        owner: '',
        ui: ''
      }
    });
  }

  confirmForm = () => {
    console.log('confirmForm');
    this.props.addNewProperties({
      ...this.state.stringSchema,
      type: 'string'
    });
  }

  ownerChange = (value) => {
    console.log('ownerChange value:', value);
    this.setState((prevState, props) => {
      return {
        stringSchema: {
          ...prevState.stringSchema,
          owner: value
        }
      };
    });
  }

  keyInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        stringSchema: {
          ...prevState.stringSchema,
          key: tmpValue
        }
      };
    });
  }

  titleInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        stringSchema: {
          ...prevState.stringSchema,
          title: tmpValue
        }
      };
    });
  }

  descriptionInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        stringSchema: {
          ...prevState.stringSchema,
          description: tmpValue
        }
      };
    });
  }

  defaultInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        stringSchema: {
          ...prevState.stringSchema,
          default: tmpValue
        }
      };
    });
  }

  formDataValueInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        stringSchema: {
          ...prevState.stringSchema,
          formDataValue: tmpValue
        }
      };
    });
  }

  minLengthInput = (event) => {
    let tmpValue = event.target.value;
    if (tmpValue !== '' && !isNaN(Number(tmpValue))) {
      this.setState((prevState, props) => {
        return {
          stringSchema: {
            ...prevState.stringSchema,
            minLength: tmpValue
          }
        };
      });
    } else {
      this.setState((prevState, props) => {
        delete prevState.minLength;
        return {
          stringSchema: prevState
        };
      });
    }
  }

  formatStatusChange = (event) => {
    let checked = event.target.checked;
    this.setState((prevState, props) => {
      let data = {
        ...prevState.stringSchema
      }
      if (!checked) {
        delete data.format;
      } else {
        data.format = '';
      }
      return {
        stringSchema: data,
        formatStatus: checked
      };
    });
  }

  formatTypeChange = (value) => {
    if (value) {
      this.setState((prevState, props) => {
        return {
          stringSchema: {
            ...prevState.stringSchema,
            format: value
          }
        };
      });
    } else {
      this.setState((prevState, props) => {
        delete prevState.stringSchema.format;
        return {
          stringSchema: prevState.stringSchema
        };
      });
    }
  }

  uiChange = (value) => {
    console.log('uiChange value:', value);
    this.setState((prevState, props) => {
      return {
        stringSchema: {
          ...prevState.stringSchema,
          ui: value
        }
      };
    });
  }

  // * ------------

  render () {
    return (
      <Form>
        <FormItem label="选择所属对象">
          <Select defaultValue={ this.state.stringSchema.owner } onChange={ this.ownerChange }>
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
          <Input onInput={ this.defaultInput }></Input>
        </FormItem>
        <FormItem label="formDataValue">
          <Input onInput={ this.formDataValueInput }></Input>
        </FormItem>
        <FormItem label="ui">
          <Select defaultValue={ this.state.stringSchema.ui } onChange={ this.uiChange }>
            {/* { */}
            <Option value="ui">UI</Option>
            {/* } */}
          </Select>
        </FormItem>
        <FormItem label="最小长度">
          <Input onInput={ this.minLengthInput }></Input>
        </FormItem>
        <FormItem label="format">
          <Checkbox defaultValue={ this.state.formatStatus } onChange={ this.formatStatusChange }>使用format</Checkbox>
          {
            this.state.formatStatus ?
            <Select value={ this.state.stringSchema.format } onChange={ this.formatTypeChange } allowClear>
              {
                StringSchemaCreator.formatList.map((ele, index, arr) => {
                  return <Option key={ ele + index } value={ ele }>{ ele }</Option>
                })
              }
            </Select> :
            <Select disabled value={ this.state.stringSchema.format } onChange={ this.formatTypeChange } allowClear>
              {
                StringSchemaCreator.formatList.map((ele, index, arr) => {
                  return <Option key={ ele + index } value={ ele }>{ ele }</Option>
                })
              }
            </Select>
          }
        </FormItem>
        <FormItem className="form-buttons">
          <Button type="danger" onClick={ this.resetForm }>重置</Button>
          <Button type="primary" onClick={ this.confirmForm }>确认</Button>
        </FormItem>
      </Form>
    );
  }
}

export default StringSchemaCreator;

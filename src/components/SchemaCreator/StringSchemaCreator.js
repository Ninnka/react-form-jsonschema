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
      owner: '',
      ui: ''
    },
    stringSchemaAddition: {
      format: ''
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
      formatStatus: false,
      stringSchema: {
        key: '',
        title: '',
        description: '',
        default: '',
        owner: '',
        ui: ''
      },
      stringSchemaAddition: {
        format: ''
      }
    });
  }

  confirmForm = () => {
    console.log('confirmForm');
    if (!this.state.stringSchema.key) {
      return;
    }
    let data = {
      ...this.state.stringSchema,
      type: 'string'
    };
    if (this.state.formatStatus) {
      data.format = this.state.stringSchemaAddition.format;
    }
    this.props.addNewProperties(data);
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

  minLengthInput = (event) => {
    let tmpValue = event.target.value;
    if (tmpValue !== '' && !isNaN(Number(tmpValue))) {
      this.setState((prevState, props) => {
        return {
          stringSchema: {
            ...prevState.stringSchema,
            minLength: Number(tmpValue)
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
        ...prevState.stringSchemaAddition,
      };
      if (!checked) {
        data.format = '';
      }
      return {
        stringSchemaAddition: data,
        formatStatus: checked
      };
    });
  }

  formatTypeChange = (value) => {
    // if (value) {
    this.setState((prevState, props) => {
      return {
        stringSchemaAddition: {
          ...prevState.stringSchemaAddition,
          format: value
        }
      };
    });
    // }
    //  else {
    //   this.setState((prevState, props) => {
    //     delete prevState.stringSchema.format;
    //     return {
    //       stringSchema: prevState.stringSchema
    //     };
    //   });
    // }
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
          <Select value={ this.state.stringSchema.owner } onChange={ this.ownerChange }>
            {
              this.state.ownerList.map((ele, index, arr) => {
                return <Option key={ ele + index } value={ ele }>{ ele }</Option>
              })
            }
          </Select>
        </FormItem>
        <FormItem label="key">
          <Input value={ this.state.stringSchema.key } onInput={ this.keyInput }></Input>
        </FormItem>
        <FormItem label="title">
          <Input value={ this.state.stringSchema.title } onInput={ this.titleInput }></Input>
        </FormItem>
        <FormItem label="description">
          <Input value={ this.state.stringSchema.description } onInput={ this.descriptionInput }></Input>
        </FormItem>
        <FormItem label="default">
          <Input value={ this.state.stringSchema.default } onInput={ this.defaultInput }></Input>
        </FormItem>
        <FormItem label="ui">
          <Select value={ this.state.stringSchema.ui } onChange={ this.uiChange }>
            <Option value="ui">UI</Option>
          </Select>
        </FormItem>
        <FormItem label="最小长度">
          <Input value={ this.state.stringSchema.minLength } onInput={ this.minLengthInput }></Input>
        </FormItem>
        <FormItem label="format">
          <Checkbox checked={ this.state.formatStatus } onChange={ this.formatStatusChange }>使用format</Checkbox>
          <Select disabled={ !this.state.formatStatus } value={ this.state.stringSchemaAddition.format } onChange={ this.formatTypeChange } allowClear>
            {
              StringSchemaCreator.formatList.map((ele, index, arr) => {
                return <Option key={ ele + index } value={ ele }>{ ele }</Option>
              })
            }
          </Select>
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

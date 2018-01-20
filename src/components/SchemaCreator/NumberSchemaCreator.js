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
const TextArea = Input.TextArea;

class NumberSchemaCreator extends React.Component {

  state = {
    ownerList: [],
    enumStatus: false,
    numberSchema: {
      key: '',
      title: '',
      description: '',
      default: '',
      formDataValue: '',
      owner: '',
      ui: ''
    }
  }


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
      numberSchema: {
        key: '',
        title: '',
        description: '',
        default: '',
        formDataValue: '',
        owner: '',
        ui: ''
      }
    })
  }

  confirmForm = () => {
    console.log('confirmForm');
    this.props.addNewProperties({
      ...this.state.numberSchema,
      type: 'number'
    });
  }

  ownerChange = (value) => {
    console.log('ownerChange value:', value);
    // this.numberSchema.owner = value;
    this.setState((prevState, props) => {
      return {
        numberSchema: {
          ...prevState.numberSchema,
          owner: value
        }
      };
    });
  }

  keyInput = (event) => {
    // this.numberSchema.key = event.target.value;
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        numberSchema: {
          ...prevState.numberSchema,
          key: tmpValue
        }
      };
    });
  }

  titleInput = (event) => {
    // this.numberSchema.title = event.target.value;
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        numberSchema: {
          ...prevState.numberSchema,
          title: tmpValue
        }
      };
    });
  }

  descriptionInput = (event) => {
    // this.numberSchema.description = event.target.value;
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        numberSchema: {
          ...prevState.numberSchema,
          description: tmpValue
        }
      };
    });
  }

  defaultInput = (event) => {
    // this.numberSchema.default = event.target.value;
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        numberSchema: {
          ...prevState.numberSchema,
          default: tmpValue
        }
      };
    });
  }

  formDataValueInput = (event) => {
    // this.numberSchema.formDataValue = event.target.value;
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        numberSchema: {
          ...prevState.numberSchema,
          formDataValue: tmpValue
        }
      };
    });
  }

  enumStatusChange = (event) => {
    let checked = event.target.checked;
    this.setState((prevState, props) => {
      let data = {
        ...prevState.numberSchema
      };
      if (!checked) {
        delete data.enum;
      } else {
        data.enum = '';
      }
      return {
        numberSchema: data,
        enumStatus: checked
      }
    });
  }

  enumValueInput = (event) => {
    let tmpValue = event.target.value;
    if (tmpValue !== '') {
      let tmpRes = tmpValue.split(',').map((ele) => {
        return Number(ele);
      });
      // this.numberSchema.enum = tmpRes;
      this.setState((prevState, props) => {
        return {
          numberSchema: {
            ...prevState.numberSchema,
            enum: tmpRes
          }
        }
      });
    } else {
      // delete this.numberSchema.enum;
      this.setState((prevState, props) => {
        delete prevState.numberSchema.enum;
        return {
          numberSchema: prevState.numberSchema
        };
      });
    }
  }

  minimumInput = (event) => {
    let tmpValue = event.target.value;
    if (tmpValue !== '' && !isNaN(Number(tmpValue))) {
      // this.numberSchema.minimum = Number(tmpValue);
      this.setState((prevState, props) => {
        return {
          numberSchema: {
            ...prevState.numberSchema,
            minimum: tmpValue
          }
        }
      });
    } else {
      // delete this.numberSchema.minimum;
      this.setState((prevState, props) => {
        delete prevState.numberSchema.minimum;
        return {
          numberSchema: prevState.numberSchema
        };
      });
    }
  }

  maximumInput = (event) => {
    let tmpValue = event.target.value;
    if (tmpValue !== '' && !isNaN(Number(tmpValue))) {
      this.setState((prevState, props) => {
        return {
          numberSchema: {
            ...prevState.numberSchema,
            maximum: tmpValue
          }
        }
      });
    } else {
      this.setState((prevState, props) => {
        delete prevState.numberSchema.maximum;
        return {
          numberSchema: prevState.numberSchema
        };
      });
    }
  }

  multipleOfInput = (event) => {
    let tmpValue = event.target.value;
    if (tmpValue !== '' && !isNaN(Number(tmpValue))) {
      this.setState((prevState, props) => {
        return {
          numberSchema: {
            ...prevState.numberSchema,
            multipleOf: tmpValue
          }
        }
      });
    } else {
      this.setState((prevState, props) => {
        delete prevState.numberSchema.multipleOf;
        return {
          numberSchema: prevState.numberSchema
        };
      });
    }
  }

  uiChange = (value) => {
    console.log('uiChange value:', value);
    // this.numberSchema.ui = value;
    this.setState((prevState, props) => {
      return {
        numberSchema: {
          ...prevState.numberSchema,
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
          <Select defaultValue={ this.state.numberSchema.owner } onChange={ this.ownerChange }>
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
          <Select defaultValue={ this.state.numberSchema.ui } onChange={ this.uiChange }>
            <Option value="ui">UI</Option>
          </Select>
        </FormItem>
        <FormItem label="enum">
          <Checkbox defaultValue={ this.state.enumStatus } onChange={ this.enumStatusChange }>使用enum</Checkbox>
          <TextArea disabled={ !this.state.enumStatus } value={ this.state.numberSchema.enum } onInput={ this.enumValueInput }></TextArea>
        </FormItem>
        <FormItem label="最小值">
          <Input onInput={ this.minimumInput }></Input>
        </FormItem>
        <FormItem label="最大值">
          <Input onInput={ this.maximumInput }></Input>
        </FormItem>
        <FormItem label="值差">
          <Input onInput={ this.multipleOfInput }></Input>
        </FormItem>
        <FormItem className="form-buttons">
          <Button type="danger" onClick={ this.resetForm }>重置</Button>
          <Button type="primary" onClick={ this.confirmForm }>确认</Button>
        </FormItem>
      </Form>
    );
  }
}

export default NumberSchemaCreator;

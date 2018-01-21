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

      owner: '',
      ui: ''
    },
    numberSchemaAddition: {
      default: '',
      enum: '',
      minimum: '',
      maximum: '',
      multipleOf: ''
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

  checkNumberDotOnly = (value) => {
    return value.indexOf('.') !== 0
           && value.indexOf('.') === value.lastIndexOf('.')
           && value.indexOf('.') === value.length - 1;
  }

  checkNumberCommaOnly = (value) => {
    console.log('value', value);
    return value.indexOf(',') !== 0
           && value.indexOf(',') === value.lastIndexOf(',')
           && value.indexOf(',') === value.length - 1;
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
      enumStatus: false,
      numberSchema: {
        key: '',
        title: '',
        description: '',
        owner: '',
        ui: ''
      },
      numberSchemaAddition: {
        default: '',
        enum: '',
        minimum: '',
        maximum: '',
        multipleOf: ''
      }
    })
  }

  confirmForm = () => {
    console.log('confirmForm');
    if (!this.state.numberSchema.key) {
      return;
    }
    let data = {
      ...this.state.numberSchema,
      type: 'number'
    };
    for (let item of Object.entries(this.state.numberSchemaAddition)) {
      if (item[1] !== '') {
        data[item[0]] = item[1];
      }
    }
    this.props.addNewProperties(data);
    setTimeout(this.resetForm);
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
    let tmpValue = event.target.value;
    let lastDot = false;
    if (tmpValue !== '' && !isNaN(Number(tmpValue))) {
      if (this.checkNumberDotOnly(tmpValue)) {
        lastDot = true;
      }
      this.setState((prevState, props) => {
        let data = {
          ...prevState.numberSchemaAddition,
        };
        lastDot ? (data.default = Number(tmpValue) + '.') : (data.default = Number(tmpValue));
        return {
          numberSchemaAddition: data
        };
      });
    } else if (tmpValue === '') {
      this.setState((prevState, props) => {
        return {
          numberSchemaAddition: {
            ...prevState.numberSchemaAddition,
            default: ''
          }
        };
      })
    }
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

  filterCreateNumberList (param) {
    let value = param.value;
    if (!value) {
      return {
        list: []
      }
    }
    let hasNaN = false;
    let tmpValueList = value.split(',');
    let list = tmpValueList.map((ele, index) => {
      hasNaN = false;
      isNaN(parseFloat(ele)) && (hasNaN = true);
      let lastDot = false;
      if (hasNaN) {
        return '';
      } else {
        this.checkNumberDotOnly(ele) && (lastDot = true);
        let res = lastDot ? parseFloat(ele) + '.' : parseFloat(ele);
        return res;
      }
    });
    return {
      list
    }
  }

  enumValueInput = (event) => {
    event.persist()
    let res = {};
    let tmpRes = [];
    let tmpValue = event.target.value;

    if (tmpValue !== '') {
      res = this.filterCreateNumberList({
        value: tmpValue
      });
      tmpRes = res.list;
    } else {
      tmpRes = '';
    }

    this.setState((prevState, props) => {
      return {
        numberSchemaAddition: {
          ...prevState.numberSchemaAddition,
          enum: tmpRes
        }
      }
    });
  }

  minimumInput = (event) => {
    let tmpValue = event.target.value;
    let lastDot = false;
    if (tmpValue !== '' && !isNaN(Number(tmpValue))) {
      if (this.checkNumberDotOnly(tmpValue)) {
        lastDot = true;
      }
      this.setState((prevState, props) => {
        let data = {
          ...prevState.numberSchemaAddition,
        };
        lastDot ? (data.minimum = Number(tmpValue) + '.') : (data.minimum = Number(tmpValue));
        return {
          numberSchemaAddition: data
        };
      });
    } else if (tmpValue === '') {
      this.setState((prevState, props) => {
        return {
          numberSchemaAddition: {
            ...prevState.numberSchemaAddition,
            minimum: ''
          }
        };
      })
    }
  }

  maximumInput = (event) => {
    let tmpValue = event.target.value;
    let lastDot = false;
    if (tmpValue !== '' && !isNaN(Number(tmpValue))) {
      if (this.checkNumberDotOnly(tmpValue)) {
        lastDot = true;
      }
      this.setState((prevState, props) => {
        let data = {
          ...prevState.numberSchemaAddition,
        };
        lastDot ? (data.maximum = Number(tmpValue) + '.') : (data.maximum = Number(tmpValue));
        return {
          numberSchemaAddition: data
        };
      });
    } else if (tmpValue === '') {
      this.setState((prevState, props) => {
        return {
          numberSchemaAddition: {
            ...prevState.numberSchemaAddition,
            maximum: ''
          }
        };
      })
    }
  }

  multipleOfInput = (event) => {
    let tmpValue = event.target.value;
    let lastDot = false;
    if (tmpValue !== '' && !isNaN(Number(tmpValue))) {
      if (this.checkNumberDotOnly(tmpValue)) {
        lastDot = true;
      }
      this.setState((prevState, props) => {
        let data = {
          ...prevState.numberSchemaAddition,
        };
        lastDot ? (data.multipleOf = Number(tmpValue) + '.') : (data.multipleOf = Number(tmpValue));
        return {
          numberSchemaAddition: data
        };
      });
    } else if (tmpValue === '') {
      this.setState((prevState, props) => {
        return {
          numberSchemaAddition: {
            ...prevState.numberSchemaAddition,
            multipleOf: ''
          }
        };
      })
    }
  }

  uiChange = (value) => {
    console.log('uiChange value:', value);
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
          <Select value={ this.state.numberSchema.owner } onChange={ this.ownerChange }>
            {
              this.state.ownerList.map((ele, index, arr) => {
                return <Option key={ ele + index } value={ ele }>{ ele }</Option>
              })
            }
          </Select>
        </FormItem>
        <FormItem label="key">
          <Input value={ this.state.numberSchema.key } onInput={ this.keyInput }></Input>
        </FormItem>
        <FormItem label="title">
          <Input value={ this.state.numberSchema.title } onInput={ this.titleInput }></Input>
        </FormItem>
        <FormItem label="description">
          <Input value={ this.state.numberSchema.description } onInput={ this.descriptionInput }></Input>
        </FormItem>
        <FormItem label="default">
          <Input value={ this.state.numberSchemaAddition.default } onInput={ this.defaultInput }></Input>
        </FormItem>
        {/* <FormItem label="formDataValue">
          <Input onInput={ this.formDataValueInput }></Input>
        </FormItem> */}
        <FormItem label="ui">
          <Select value={ this.state.numberSchema.ui } onChange={ this.uiChange }>
            <Option value="ui">UI</Option>
          </Select>
        </FormItem>
        <FormItem label="enum">
          <Checkbox checked={ this.state.enumStatus } onChange={ this.enumStatusChange }>使用enum</Checkbox>
          <TextArea disabled={ !this.state.enumStatus } value={ this.state.numberSchemaAddition.enum ? this.state.numberSchemaAddition.enum.join(',') : '' } onInput={ this.enumValueInput }></TextArea>
        </FormItem>
        <FormItem label="最小值">
          <Input value={ this.state.numberSchemaAddition.minimum } onInput={ this.minimumInput }></Input>
        </FormItem>
        <FormItem label="最大值">
          <Input value={ this.state.numberSchemaAddition.maximum } onInput={ this.maximumInput }></Input>
        </FormItem>
        <FormItem label="值差">
          <Input value={ this.state.numberSchemaAddition.multipleOf } onInput={ this.multipleOfInput }></Input>
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

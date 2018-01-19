import React from 'react';

// * 样式


// * antd组件
import {
  Form,
  Input,
  Select,
  Button
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class BooleanSchemaCreator extends React.Component {

  state = {
    formatStatus: false,
    ownerList: [],
    booleanSchema: {
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
      booleanSchema: {
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
      ...this.state.booleanSchema,
      type: 'boolean'
    });
  }

  ownerChange = (value) => {
    console.log('ownerChange value:', value);
    this.setState((prevState, props) => {
      return {
        booleanSchema: {
          ...prevState.booleanSchema,
          owner: value
        }
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

  defaultInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        booleanSchema: {
          ...prevState.booleanSchema,
          default: tmpValue
        }
      };
    });
  }

  formDataValueInput = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        booleanSchema: {
          ...prevState.booleanSchema,
          formDataValue: tmpValue
        }
      };
    });
  }

  uiChange = (value) => {
    console.log('uiChange value:', value);
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

  render () {
    return (
      <Form>
        <FormItem label="选择所属对象">
          <Select defaultValue={ this.state.booleanSchema.owner } onChange={ this.ownerChange }>
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
          <Select defaultValue={ this.state.booleanSchema.ui } onChange={ this.uiChange }>
            {/* { */}
            <Option value="ui">UI</Option>
            {/* } */}
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

export default BooleanSchemaCreator;

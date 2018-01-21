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

class ObjectSchemaCreator extends React.Component {

  state = {
    ownerList: [],
    objectSchema: {
      key: '',
      title: '',
      description: '',
      required: '',
      owner: ''
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
      objectSchema: {
        key: '',
        title: '',
        description: '',
        required: '',
        owner: ''
      }
    });
  }

  confirmForm = () => {
    if (!this.state.objectSchema.key) {
      return;
    }
    this.props.addNewProperties({
      ...this.state.objectSchema,
      type: 'object',
      properties: {}
    });
    setTimeout(this.resetForm);
  }

  ownerChange = (value) => {
    console.log('ownerChange value:', value);
    this.setState((prevState, props) => {
      return {
        objectSchema: {
          ...prevState.objectSchema,
          owner: value
        }
      };
    });
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
          required: tmpValue
        }
      };
    });
  }

  // * ------------

  render () {
    return (
      <Form>
        <FormItem label="选择所属对象">
          <Select value={ this.state.objectSchema.owner } onChange={ this.ownerChange }>
            {
              this.state.ownerList.map((ele, index, arr) => {
                return <Option key={ ele + index } value={ ele }>{ ele }</Option>
              })
            }
          </Select>
        </FormItem>
        <FormItem label="key">
          <Input value={ this.state.objectSchema.key } onInput={ this.keyInput }></Input>
        </FormItem>
        <FormItem label="title">
          <Input value={ this.state.objectSchema.title } onInput={ this.titleInput }></Input>
        </FormItem>
        <FormItem label="description">
          <Input value={ this.state.objectSchema.description } onInput={ this.descriptionInput }></Input>
        </FormItem>
        <FormItem label="required">
          <Input value={ this.state.objectSchema.required } onInput={ this.requiredInput }></Input>
        </FormItem>
        <FormItem className="form-buttons">
          <Button type="danger" onClick={ this.resetForm }>重置</Button>
          <Button type="primary" onClick={ this.confirmForm }>确认</Button>
        </FormItem>
      </Form>
    );
  }
}

export default ObjectSchemaCreator;

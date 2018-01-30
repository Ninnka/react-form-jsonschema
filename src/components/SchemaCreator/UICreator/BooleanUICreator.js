import React from 'react';

// * antd组件
import {
  Input,
  Form,
  Checkbox,
  Button,
  Select
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class BooleanUI extends React.Component {
  state = {
    ui: {},
    options: {}
  }

  optionstypeList = ['label', 'inputType'];

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
  }

  forItemChange = (value) => {
    this.setState((prevState, props) => {
      return {
        ui: {
          ...prevState.ui,
          [value.key]: value.value
        }
      }
    })
  }

  addOptions = (e) =>{
    this.setState((prevState, props) => {
      return {
        ui: {
          ...prevState.ui,
          options: {
            ...prevState.ui.options,
            [prevState.options.name]: prevState.options.value
          }
        }
      }
    })
  }

  optionsChange = (value) => {
    this.setState((prevState, props) => {
      return {
        options: {
          ...prevState.options,
          [value.key]: value.value
        }
      }
    })
  }

  delOptions = (key) => {
    let options = this.state.ui.options;
    delete options[key];
    this.setState((prevState, props) => {
      return {
        ui: {
          ...prevState.ui,
          options: {
            ...options
          }
        }
      }
    })
  }

  render() {
    // const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <FormItem label = "className">
          <Input value={ this.state.ui.className ? this.state.ui.className : '' } onInput={ (e) => {
            this.forItemChange({
              key: 'className',
              value: e.target.value
            })
          } }></Input>
        </FormItem>
        <FormItem label="widget">
          <Input value={ this.state.ui.widget ? this.state.ui.widget : '' } onInput={
            (e) => {
              this.forItemChange({
                key: 'widget',
                value: e.target.value
              })
            }
          } />
        </FormItem>
        <FormItem label = "disabled">
          <Checkbox
            checked={this.state.ui.disabled ? this.state.ui.disabled : false }
            onChange={
              (e) => {
                this.forItemChange({
                  key: 'disabled',
                  value: e.target.checked
                })
              }
            }
          >
            disabled
          </Checkbox>
        </FormItem>
        <FormItem label = "readonly">
          <Checkbox
            checked={this.state.ui.readonly ? this.state.ui.readonly : false }
            onChange={
              (e) => {
                this.forItemChange({
                  key: 'readonly',
                  value: e.target.checked
                })
              }
            }
          >
            readonly
          </Checkbox>
        </FormItem>
        <FormItem label="添加options">
          name:
          <Select value={this.state.options.name} onChange={
            (value) => {
              this.optionsChange({
                key: 'name',
                value: value
              })
            }
          }>
            {
              this.optionstypeList.map((value) => {
                return <Option key={value} value={value}>{value}</Option>
              })
            }
          </Select>
          value:
          <Input value={ this.state.options.value ? this.state.options.value : '' } onInput={
            (e) => {
              this.optionsChange({
                key: 'value',
                value: e.target.value
              })
            }
          } />
          <Button onClick={this.addOptions}>添加</Button>
          <div>
            {
              this.state.ui.options &&
              Object.keys(this.state.ui.options).map((item) => {
                return (
                  <p key={item}>
                    <span>{item} : {this.state.ui.options[item]}</span>
                    <Button type="danger" onClick={
                        () => {
                          this.delOptions(item);
                        }
                      }>删除
                    </Button>
                  </p>
                )
              })
            }
          </div>
        </FormItem>
      </div>
    );
  }
}
export default BooleanUI
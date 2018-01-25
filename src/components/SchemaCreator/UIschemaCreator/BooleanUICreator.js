import React from 'react';

// * antd组件
import {
  Input,
  Form,
  Checkbox
} from 'antd';

const FormItem = Form.Item;

class BooleanUI extends React.Component {
  state = {
    ui: {}
  }

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

  render() {
    // const { getFieldDecorator } = this.props.form;
    return (
      <div>
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
      </div>
    );
  }
}
export default BooleanUI
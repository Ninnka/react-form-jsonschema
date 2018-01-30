import React from 'react';

// * antd组件
import {
  Form,
  Checkbox,
  Input
} from 'antd';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

class ObjectUICreator extends React.Component {

  state = {
    ui: {}
  }

  // * ------------

  componentDidMount() {

  }

  // * ------------

  uiClassNamesChange = (event) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      return {
        ui: {
          ...prevState.ui,
          classNames: tmpValue
        }
      }
    });
  }

  orderChange = (value = '') => {
    this.setState((prevState, props) => {
      return {
        ui: {
          ...prevState.ui,
          order: value.split(',')
        }
      }
    });
  }

  uiWidgetChange = (value) => {
    this.setState((prevState, props) => {
      return {
        ui: {
          ...prevState.ui,
          widget: value
        }
      }
    });
  }

  uiDisabledChange = (event) => {
    let checked = event.target.checked;
    this.setState((prevState, props) => {
      return {
        ui: {
          ...prevState.ui,
          disabled: checked
        }
      }
    });
  }

  uiReadOnlyChange = (event) => {
    let checked = event.target.checked;
    this.setState((prevState, props) => {
      return {
        ui: {
          ...prevState.ui,
          readonly: checked
        }
      }
    });
  }

  // * ------------

  render () {
    return (
      <>
        <FormItem label="classNames">
          <Input value={ this.state.ui.classNames ? this.state.ui.classNames : '' } onChange={ (e) => {
            this.uiClassNamesChange(e)
          } }></Input>
        </FormItem>

        <FormItem label="order">
          <TextArea value={ this.state.ui.order ? this.state.ui.order : '' } onInput={ (event) => {
            this.orderChange(event.target.value);
          } }></TextArea>
        </FormItem>

        <FormItem label="disabled">
          <Checkbox checked={ this.state.ui.disabled !== undefined ? this.state.ui.disabled : false } onChange={ this.uiDisabledChange }>
            勾选后，将禁用此Object属性生成的表单成员
          </Checkbox>
        </FormItem>

        <FormItem label="readonly">
          <Checkbox checked={ this.state.ui.readonly !== undefined ? this.state.ui.readonly : false } onChange={ this.uiReadOnlyChange }>
            勾选后，此Object属性生成的表单成员只能读
          </Checkbox>
        </FormItem>
      </>
    )
  }
}

export default ObjectUICreator;

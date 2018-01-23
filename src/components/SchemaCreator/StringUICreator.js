import React from 'react';

// * antd组件
import {
  Select,
  Input,
  Form,
  Checkbox
} from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;
const TextArea = Input.TextArea;

class StringUICreator extends React.Component {

  state = {
    ui: {},
    widgetList: [
      'text',
      'textarea',
      'password',
      'color',
      'file'
    ]
  }

  // * ------------

  componentDidMount() {

  }

  // * ------------

  uiChange = (param = {}) => {
    if (Object.keys(param).length === 0) {
      return;
    }
    this.setState((prevState, props) => {
      return {
        ui: {
          ...prevState.ui,
          [param.key]: param.value
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

  uiAutoFocusChange = (event) => {
    let checked = event.target.checked;
    this.setState((prevState, props) => {
      return {
        ui: {
          ...prevState.ui,
          autofocus: checked
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
        <FormItem label="widget">
          <Select value={ this.state.ui.widget ? this.state.ui.widget : '' } onChange={ this.uiWidgetChange }>
            {
              this.state.widgetList.map((widget, index, arr) => {
                return <Option key={ widget } value={ widget }>{ widget }</Option>
              })
            }
          </Select>
        </FormItem>

        <FormItem label="placeholder">
          <Input value={ this.state.ui.placeholder ? this.state.ui.placeholder : '' } onInput={ (event) => {
            this.uiChange({
              key: 'placeholder',
              value: event.target.value
            })
          } }></Input>
        </FormItem>

        <FormItem label="emptyValue">
          <Input value={ this.state.ui.emptyValue ? this.state.ui.emptyValue : '' } onInput={ (event) => {
            this.uiChange({
              key: 'emptyValue',
              value: event.target.value
            })
          } }></Input>
        </FormItem>

        <FormItem label="help">
          <Input value={ this.state.ui.help ? this.state.ui.help : '' } onInput={ (event) => {
            this.uiChange({
              key: 'help',
              value: event.target.value
            })
          } }></Input>
        </FormItem>

        <FormItem label="enumDisabled">
          <TextArea value={ this.state.ui.enumDisabled ? this.state.ui.enumDisabled : '' } onInput={ (event) => {
            this.uiChange({
              key: 'enumDisabled',
              value: event.target.value
            })
          } }></TextArea>
        </FormItem>

        <FormItem label="autofocus">
          <Checkbox checked={ this.state.ui.autofocus !== undefined ? this.state.ui.autofocus : false } onChange={ this.uiAutoFocusChange }>
            勾选后，此string属性生成的表单成员将自动获取焦点
          </Checkbox>
        </FormItem>

        <FormItem label="disabled">
          <Checkbox checked={ this.state.ui.disabled !== undefined ? this.state.ui.disabled : false } onChange={ this.uiDisabledChange }>
            勾选后，将禁用此string属性生成的表单成员
          </Checkbox>
        </FormItem>

        <FormItem label="readonly">
          <Checkbox checked={ this.state.ui.readonly !== undefined ? this.state.ui.readonly : false } onChange={ this.uiReadOnlyChange }>
          勾选后，此string属性生成的表单成员只能读
          </Checkbox>
        </FormItem>
      </>
    )
  }
}

export default StringUICreator;

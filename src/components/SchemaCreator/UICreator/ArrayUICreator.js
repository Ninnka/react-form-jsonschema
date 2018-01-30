import React from 'react';

// * antd组件
import {
  Select,
  Form,
  Checkbox,
  Input
} from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;

class ArrayUICreator extends React.Component {

  state = {
    ui: {},
    uiOptions: {},
    widgetList: [
      'checkboxes'
    ]
  }

  // * ------------

  componentDidMount() {

  }

  // * ------------

  uiOptionsChange = (param = {}) => {
    if (Object.keys(param).length === 0) {
      return;
    }
    this.setState((prevState, props) => {
      return {
        uiOptions: {
          ...prevState.uiOptions,
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

  uiClassNameChang = (event) => {
    let value = event.target.value;
    this.setState((prevState, props) => {
      return {
        ui: {
          ...prevState.ui,
          className: value
        }
      }
    });
  }
  // * ------------

  render () {
    return (
      <>
        <FormItem label = "className">
          <Input value={ this.state.ui.className ? this.state.ui.className : '' } onInput={ this.uiClassNameChang }></Input>
        </FormItem>
        <FormItem label="widget">
          <Select allowClear value={ this.state.ui.widget ? this.state.ui.widget : '' } onChange={ this.uiWidgetChange }>
            {
              this.state.widgetList.map((widget, index, arr) => {
                return <Option key={ widget } value={ widget }>{ widget }</Option>
              })
            }
          </Select>
        </FormItem>

        <FormItem label="options">

          <Checkbox checked={ this.state.uiOptions.orderable !== undefined ? this.state.uiOptions.orderable : false } onChange={ (event) => {
            this.uiOptionsChange({
              key: 'orderable',
              value: !(event.target.checked)
            });
          } }>
            禁止数组成员排序
          </Checkbox>
          <Checkbox checked={ this.state.uiOptions.addable !== undefined ? this.state.uiOptions.addable : false } onChange={ (event) => {
            this.uiOptionsChange({
              key: 'addable',
              value: !(event.target.checked)
            });
          } }>
            禁止添加数组成员
          </Checkbox>
          <Checkbox checked={ this.state.uiOptions.removeable !== undefined ? this.state.uiOptions.removeable : false } onChange={ (event) => {
            this.uiOptionsChange({
              key: 'removeable',
              value: !(event.target.checked)
            });
          } }>
            禁止移除数组成员是否可
          </Checkbox>
        </FormItem>

        <FormItem label="disabled">
          <Checkbox checked={ this.state.ui.disabled !== undefined ? this.state.ui.disabled : false } onChange={ this.uiDisabledChange }>
            勾选后，将禁用此Array属性生成的表单成员
          </Checkbox>
        </FormItem>

        <FormItem label="readonly">
          <Checkbox checked={ this.state.ui.readonly !== undefined ? this.state.ui.readonly : false } onChange={ this.uiReadOnlyChange }>
            勾选后，此Array属性生成的表单成员只能读
          </Checkbox>
        </FormItem>
      </>
    )
  }
}

export default ArrayUICreator;

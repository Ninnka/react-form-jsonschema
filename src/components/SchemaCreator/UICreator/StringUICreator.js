import React from 'react';

// * antd组件
import {
  Select,
  Input,
  Form,
  Checkbox,
  Button
} from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;
const TextArea = Input.TextArea;

class StringUICreator extends React.Component {

  state = {
    ui: {},
    options: {},
    enumStatus: false,
    widgetList: [
      'text',
      'textarea',
      'password',
      'color',
      'file',
      "alt-datetime"
    ]
  }

  optionstypeList = ['label', 'inputType']; 

  // * ------------

  componentDidMount() {

  }

  // * ------------

  uiChange = (param = {}) => {
    if (Object.keys(param).length === 0) {
      return;
    }
    if (param.value === '') {
      let ui = this.state.ui;
      ui[param.key] && delete ui[param.key];
      console.log(ui);
      this.setState((prevState, props) => {
        return {
          ui
        }
      });
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

  addOptions = (e) =>{
    this.setState((prevState, props) => {
      return {
        ui: {
          ...prevState.ui,
          options: {
            ...prevState.ui.options,
            [prevState.options.name]: prevState.options.value
          }
        },
        options: {}
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

  enumDisabledChange = (event) => {
    let tmpValue = event.target.value;
    let res = {}
    let tmpRes = [];
    if (tmpValue !== '') {
      res = this.props.filterCreateArray({
        value: tmpValue
      })
      tmpRes = res.list;
    } else {
      tmpRes = [];
    }
    
    this.setState((prevState, props) => {
      return {
        ui: {
          ...prevState.ui,
          enumDisabled: tmpRes
        }
      }
    })
  }

  enumStatusChange = (event) => {
    let checked = event.target.checked;
    let ui = this.state.ui;
    delete ui.enumDisabled;
    if (!checked) {
      this.setState((prevState, props) => {
        return {
          ui: {
            ...ui
          }
        }
      })
    }
    this.setState((prevState, props) => {
      return {
        enumStatus: checked
      }
    })
  }

  // * ------------

  render () {
    return (
      <>
        <FormItem label = "className">
          <Input value={ this.state.ui.className ? this.state.ui.className : '' } onInput={ (event) => {
            this.uiChange({
              key: 'className',
              value: event.target.value
            })
          } }></Input>
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
          <Checkbox checked={ this.state.enumStatus } onChange={ this.enumStatusChange }>设置enumDisabled</Checkbox>
          <TextArea disabled={ !this.state.enumStatus } value={ this.state.ui.enumDisabled ? this.state.ui.enumDisabled : '' } onInput={ this.enumDisabledChange }></TextArea>
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

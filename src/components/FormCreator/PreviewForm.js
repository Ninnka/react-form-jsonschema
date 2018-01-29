import React from 'react';

import { Input } from 'antd';

class PreviewForm extends React.Component {

  state = {
    list: [{name: ''}, {name: ''}]
  };

  // * ------------

  componentWillReceiveProps (nextProps) {

  }

  componentDidMount () {

  }

  // * ------------

  inputChange = (event, index) => {
    let tmpValue = event.target.value;
    this.setState((prevState, props) => {
      let data = [...prevState.list];
      data[index].name = tmpValue;
      return {
        list: data
      };
    })
  }

  // * ------------

  render () {
    return (
      <div>
        这是一个假的表单，暂时别管
        {
          this.state.list.map((ele, index) => {
            return <Input key={ index } defaultValue={ ele.name } onChange={ (e) => {
              this.inputChange(e, index);
            } }></Input>
          })
        }
      </div>
    )
  }
}

export default PreviewForm;

import React from 'react';

// * jsonschema的form
import Form from "react-jsonschema-form";

class PreviewForm extends React.Component {

  state = {
    FormData: null
  };

  // * ------------

  componentWillReceiveProps (nextProps) {
    console.log('preview componentWillReceiveProps');
    console.log('JSONSchema:', nextProps.JSONSchema);
    console.log('UISchema:', nextProps.UISchema);
    console.log('FormData:', nextProps.FormData);
    this.prepareData(nextProps);
  }

  componentDidMount () {
    console.log('preview componentDidMount');
    console.log('JSONSchema:', this.props.JSONSchema);
    console.log('UISchema:', this.props.UISchema);
    console.log('FormData:', this.props.FormData);
    this.prepareData(this.props);
  }

  // * ------------

  prepareData = (props) => {
    let data = null;
    if (props.JSONSchema.type === 'object') {
      data = {
        ...props.FormData
      };
    } else if (props.JSONSchema.type === 'array') {
      data = [
        ...props.FormData
      ]
    } else {
      data = '';
    }
    this.setState({
      FormData: data
    });
  }

  // * ------------

  render () {
    return (
      <div className="borderbox padding-middle">
        <Form schema={ this.props.JSONSchema }
              uiSchema={ this.props.UISchema }
              formData={ this.state.FormData }
              liveValidate={ true }/>
      </div>
    )
  }
}

export default PreviewForm;

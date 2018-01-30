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
    let data = null;
    if (nextProps.JSONSchema.type === 'object') {
      data = {
        ...nextProps.FormData
      };
    } else if (nextProps.JSONSchema.type === 'array') {
      data = [
        ...nextProps.FormData
      ]
    } else {
      data = '';
    }
    this.setState({
      FormData: data
    });
  }

  componentDidMount () {
    console.log('preview componentDidMount');
    console.log('JSONSchema:', this.props.JSONSchema);
    console.log('UISchema:', this.props.UISchema);
    console.log('FormData:', this.props.FormData);
    let data = null;
    if (this.props.JSONSchema.type === 'object') {
      data = {
        ...this.props.FormData
      };
    } else if (this.props.JSONSchema.type === 'array') {
      data = [
        ...this.props.FormData
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
              formData={ this.state.FormData }/>
      </div>
    )
  }
}

export default PreviewForm;

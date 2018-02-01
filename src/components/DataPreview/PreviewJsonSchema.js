import React from 'react';

import ReactJson from 'react-json-view';

class PreviewJsonSchema extends React.Component {

  state = {};

  componentDidMount () {

  }

  // * ------------

  render () {
    return (
      <div>
        <ReactJson src={ this.props.JSONSchema } />
      </div>
    )
  }
}

export default PreviewJsonSchema;

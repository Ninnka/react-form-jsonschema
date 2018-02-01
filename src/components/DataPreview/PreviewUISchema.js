import React from 'react';

import ReactJson from 'react-json-view';

class PreviewUISchema extends React.Component {

  state = {};

  render () {
    return (
      <div>
        <ReactJson src={ this.props.UISchema } />
      </div>
    )
  }
}

export default PreviewUISchema;

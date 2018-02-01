import React from 'react';

import ReactJson from 'react-json-view';

class PreviewFormData extends React.Component {

  state = {};

  render () {
    return (
      <div>
        { typeof this.props.FormData === 'object' ?
          <ReactJson src={ this.props.FormData } /> :
          'FormData: ' + this.props.FormData
        }
      </div>
    )
  }
}

export default PreviewFormData;

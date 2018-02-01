import React from 'react';

import ReactJson from 'react-json-view';

// * 功能库
import utilFunc from '@utils/functions';

class PreviewFormData extends React.Component {

  state = {};

  // * ------------

  deleteHandle = (param) => {
    console.log('formdata deletehandle param', param);
    this.props.deleteJsonSchemaData(param);
    utilFunc.messageSuccess({
      message: '删除成功'
    });
    return true;
  }

  // * ------------

  render () {
    return (
      <div>
        { typeof this.props.FormData === 'object' ?
          <ReactJson src={ this.props.FormData }
                     onDelete={ this.deleteHandle } /> :
          'FormData: ' + this.props.FormData
        }
      </div>
    )
  }
}

export default PreviewFormData;

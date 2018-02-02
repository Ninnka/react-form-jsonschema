import React from 'react';

import ReactJson from 'react-json-view';

// * 功能库
import utilFunc from '@utils/functions';

class PreviewUISchema extends React.Component {

  state = {};

  // * ------------

  editHandle = (param) => {
    console.log('uischema editHandle param', param);
    this.props.editJsonSchemaData(param);
    utilFunc.messageSuccess({
      message: '修改成功'
    });
    return true;
  }

  deleteHandle = (param) => {
    console.log('uischema deleteHandle param', param);
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
        <ReactJson src={ this.props.UISchema }
                   onEdit={ this.editHandle }
                   onDelete={ this.deleteHandle } />
      </div>
    )
  }
}

export default PreviewUISchema;

import React from 'react';

import ReactJson from 'react-json-view';

// * 功能库
import utilFunc from '@utils/functions';

class PreviewJsonSchema extends React.Component {

  state = {};

  editExcludeList = ['key', 'type'];

  deleteExcludeList = ['key', 'type'];

  componentDidMount () {

  }

  // * ------------

  editHandle = (param) => {
    console.log('jsonschema editHandle param', param);
    if (param.name && this.editExcludeList.indexOf(param.name) === -1) {
      this.props.editJsonSchemaData(param);
      utilFunc.messageSuccess({
        message: '修改成功'
      });
      return true;
    } else {
      utilFunc.messageError({
        message: '该属性不能修改'
      });
      return false;
    }
  }

  deleteHandle = (param) => {
    console.log('jsonschema deleteHandle param', param);
    if (param.name && this.deleteExcludeList.indexOf(param.name) === -1) {
      this.props.deleteJsonSchemaData(param);
      utilFunc.messageSuccess({
        message: '删除成功'
      });
      return true;
    } else {
      utilFunc.messageError({
        message: '该属性不能删除'
      });
      return false;
    }
  }

  // * ------------

  render () {
    return (
      <div>
        <ReactJson src={ this.props.JSONSchema }
                   onDelete={ this.deleteHandle }
                   onEdit={ this.editHandle } />
      </div>
    )
  }
}

export default PreviewJsonSchema;

import React from 'react';

import ReactJson from 'react-json-view';

// * 功能库
import utilFunc from '@utils/functions';

class PreviewJsonSchema extends React.Component {

  state = {};

  editExcludeList = ['type'];

  deleteExcludeList = ['key', 'type', 'properties', 'items'];

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
    } else if (
      // * 如果namespace最后一个是数字或者是additionalItems则修改无效
      param.namespace[param.namespace.length - 1] === 'additionItems'
      || !isNaN(Number(param.namespace[param.namespace.length - 1]))
    ) {
      utilFunc.messageError({
        message: '该属性修改也没有用的'
      });
      return false;
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

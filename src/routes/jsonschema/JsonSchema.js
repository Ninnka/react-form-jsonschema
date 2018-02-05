import React from 'react';

// * 样式
import styles from './JsonSchema.less';

// * 功能库
import utilFunc from '@utils/functions';

import withCompuListHighOrder from '@utils/withCompuListHighOrder';

import { cloneDeep, isEqual } from 'lodash';

import ObjectSchemaCreator from '@components/SchemaCreator/ObjectSchemaCreator';
import StringSchemaCreator from '@components/SchemaCreator/StringSchemaCreator';
import NumberSchemaCreator from '@components/SchemaCreator/NumberSchemaCreator';
import BooleanSchemaCreator from '@components/SchemaCreator/BooleanSchemaCreator';
import ArraySchemaCreator from '@components/SchemaCreator/ArraySchemaCreator';

import PreviewForm from '@components/FormCreator/PreviewForm';

import DataPreview from '@components/DataPreview/Index';

// * antd组件
import {
  Tabs
} from 'antd';

const TabPane = Tabs.TabPane;

const ObjectSchemaCreatorHOC = withCompuListHighOrder(ObjectSchemaCreator);
const ArraySchemaCreatorHOC = withCompuListHighOrder(ArraySchemaCreator);
const StringSchemaCreatorHOC = withCompuListHighOrder(StringSchemaCreator);
const NumberSchemaCreatorHOC = withCompuListHighOrder(NumberSchemaCreator);
const BooleanSchemaCreatorHOC = withCompuListHighOrder(BooleanSchemaCreator);

class JsonSchema extends React.Component {

  state = {
    JSONSchema: {},
    UISchema: {},
    FormData: {}
  }

  componentDidMount () {

  }

  componentDidCatch () {
    this.messageError({
      message: '出现未知错误'
    });
  }

  // * ------------

  getPropertyJsType = (property) => {
    return Object.prototype.toString.call(property);
  }

  getRefRealPath = (refList) => {
    let resRef = '#';
    for (let ref of refList) {
      resRef += '/' + ref;
    }
    return resRef;
  }

  // * 添加新的属性
  addNewProperties = (newProperty, options = {}) => {
    console.log('addNewProperties newProperty:', newProperty);
    let owner = newProperty.owner;
    let ownerList = owner.split('~/~');

    // * 在根目录添加
    if (ownerList.length === 1 && ownerList[0] === '') {
      this.addNewPropertiesAtRoot({
        newProperty
      });
      return;
    }

    // * 非根目录的情况
    let useProperties = null;
    let tmpProperties = null;

    if (this.state.JSONSchema.type === 'object') {
      useProperties = cloneDeep(this.state.JSONSchema.properties);
      tmpProperties = useProperties; // * 用来定位JsonSchema具体的位置
    } else if (this.state.JSONSchema.type === 'array') {
      useProperties = cloneDeep(this.state.JSONSchema);
      tmpProperties = useProperties; // * 用来定位JsonSchema具体的位置
    }

    // let useUISchema = cloneDeep(this.state.UISchema);
    // let tmpUISchema = useUISchema; // * 用来定位UISchema具体的位置

    // let useFormData = cloneDeep(this.state.FormData);
    // let tmpFormData = useFormData; // * 用来定位FormData具体的位置

    for (let item of ownerList) {
      if (
        item !== 'root'
        && tmpProperties[item]
      ) {
        tmpProperties = tmpProperties[item];

      } else if (
        item !== 'root'
        && tmpProperties.type === 'object'
        && tmpProperties.properties[item]
      ) {
        tmpProperties = tmpProperties.properties[item];

      } else if (
        item !== 'root'
        && tmpProperties.type === 'array'
        && tmpProperties[item]
      ) {
        tmpProperties = tmpProperties[item];
      }

      // // * ui相关start---------------
      // // * 创建ui对象路径
      // item !== 'root' && !useUISchema[item] && (useUISchema[item] = {});
      // item !== 'root' && (useUISchema = useUISchema[item]);
      // // * ui相关end---------------

      // * formData相关start------------
      // // * 创建tmpProperties对应的formData
      // let jsType = utilFunc.getPropertyJsType(useFormData);
      // if (item !== 'root' && !useFormData[item]) {
      //   let tmpD = tmpProperties.type === 'array' ? [] : {};
      //   // * 如果useFormData是数组，则添加一个对象进去
      //   if (jsType.indexOf('Array') !== -1) {
      //     useFormData.push(tmpD);
      //     let pos = useFormData.length - 1;
      //     useFormData = useFormData[pos];
      //   }

      //   // * 如果useFormData是对象，则按照通常方法创造子对象
      //   jsType.indexOf('Object') !== -1 && !useFormData[item] && (useFormData[item] = tmpD);
      // }
      // item !== 'root' && (useFormData = useFormData[item]);
      // * formData相关end------------
    }


    // * ui相关start---------------
    // // * 设置ui最终位置的js类型与key名
    // if (tmpProperties.type === 'object'
    // || (ownerList.length === 1 && ownerList[0] === '')
    // || (ownerList.length === 1 && ownerList[0] === 'root' && this.state.JSONSchema.type === 'object')) {
    //   useUISchema[newProperty.key] = {
    //     ...useUISchema[newProperty.key]
    //   };
    //   useUISchema = useUISchema[newProperty.key];

    // } else if (tmpProperties.type === 'array' && newProperty.asFixedItems) {
    //   if (useUISchema['items'] && Object.keys(useUISchema['items']).length > 0) {
    //     useUISchema['additionalItems'] = useUISchema['items'];
    //   }

    //   if (utilFunc.getPropertyJsType(useUISchema['items']).indexOf('Array') === -1) {
    //     useUISchema['items'] = [];
    //   }
    //   useUISchema = useUISchema['items'];
    // } else if (tmpProperties.type === 'array' && newProperty.coverFixedItems) {
    //   delete useUISchema['additionalItems'];

    //   useUISchema['items'] = {};
    //   useUISchema = useUISchema['items'];
    // } else {
    //   let hasArray = utilFunc.getPropertyJsType(tmpProperties.items).indexOf('Array');
    //   let name = hasArray !== -1 ? 'additionalItems' : 'items';
    //   useUISchema[name] = {};
    //   useUISchema = useUISchema[name];
    // }

    // // * 将ui加入到目标位置
    // newProperty.ui = newProperty.ui ? newProperty.ui : {};
    // if (utilFunc.getPropertyJsType(useUISchema).indexOf('Array') !== -1) {
    //   console.log('useUISchema before', useUISchema);
    //   let data = {};
    //   for (let item of Object.entries(newProperty.ui)) {
    //     let uiPrefix = item[0] !== 'classNames' ? 'ui:' : '';
    //     data[uiPrefix + item[0]] = item[1];
    //   }
    //   // useUISchema[tmpProperties.items.length] = data;
    //   useUISchema.push({...data});
    // } else if (utilFunc.getPropertyJsType(useUISchema).indexOf('Object') !== -1) {
    //   for (let item of Object.entries(newProperty.ui)) {
    //     let uiPrefix = item[0] !== 'classNames' ? 'ui:' : '';
    //     useUISchema[uiPrefix + item[0]] = item[1];
    //   }
    // }

    // delete newProperty.ui;
    // * ui相关end---------------


    // * 如果是使用$ref的情况，获取$ref的正式路径
    if (newProperty.$ref) {
      newProperty.$ref = this.getRefRealPath(newProperty.$ref.split('~/~'));
    }

    // * 将新建的属性加入到目标位置
    if (
      tmpProperties
      && tmpProperties.type === 'object'
      && tmpProperties.properties
    ) {
      tmpProperties.properties[newProperty.key] = newProperty;
    } else if (
      tmpProperties
      && tmpProperties.type === 'array'
      && newProperty.asFixedItems
    ) {
      // delete newProperty.asFixedItems;
      if (Object.prototype.toString.call(tmpProperties.items).indexOf('Object') !== -1) {
        Object.keys(tmpProperties.items).length > 0 && (tmpProperties.additionalItems = tmpProperties.items);
        tmpProperties.items = [];
        tmpProperties.items.push(newProperty);
      } else if (Object.prototype.toString.call(tmpProperties.items).indexOf('Array') !== -1) {
        tmpProperties.items.push(newProperty);
      } else {
        tmpProperties.items = [];
        tmpProperties.items.push(newProperty);
      }
    } else if (
      tmpProperties
      && tmpProperties.type === 'array'
      && newProperty.coverFixedItems
    ) {
      delete newProperty.coverFixedItems;
      delete tmpProperties.additionalItems;
      tmpProperties.items = newProperty;
    } else if (
      tmpProperties
      && tmpProperties.type === 'array'
    ) {
      if (Object.prototype.toString.call(tmpProperties.items).indexOf('Array') !== -1) {
        tmpProperties.additionalItems = newProperty;
      } else {
        tmpProperties.items = newProperty;
      }
    } else {
      tmpProperties[newProperty.key] = newProperty;
    }

    // * 如果是通过数据预览中的搜索过滤出的项，并且更改了key值
    if (options.prune === 'key' && newProperty.oldKey) {
      delete tmpProperties[newProperty.oldKey];
    }

    // * formData相关start------------
    // // * 如果没有设置default，则再formdata中设置对应的key
    // if (newProperty.type === 'object') {
    //   useFormData[newProperty.key] = {};
    // } else if (newProperty.type === 'array') {
    //   useFormData[newProperty.key] = [];
    //   // * 如果数组设置了default
    //   if (newProperty.default) {
    //     useFormData[newProperty.key] = [...newProperty.default];
    //   }
    //   // * 如果数组设置了minItems
    //   if (newProperty.minItems) {
    //     let len = useFormData[newProperty.key].length;
    //     newProperty.minItems > len && (useFormData[newProperty.key] = useFormData[newProperty.key].concat([...Array(2).fill('')]));
    //   }
    // } else {
    //   if (newProperty.default === undefined && utilFunc.getPropertyJsType(useFormData).indexOf('Object') !== -1) {
    //     useFormData[newProperty.key] = '';
    //   } else if (utilFunc.getPropertyJsType(useFormData).indexOf('Array') !== -1 && newProperty.asFixedItems) {
    //     let initValue = null;
    //     switch (newProperty.type) {
    //       case 'boolean':
    //         initValue = newProperty.default === undefined ? false : newProperty.default;
    //         break;
    //       case 'number':
    //         initValue = newProperty.default === undefined ? 0 : newProperty.default;
    //         break;
    //       case 'string':
    //         initValue = newProperty.default === undefined ? '' : newProperty.default;
    //         break;
    //       default:
    //         initValue = '';
    //         break;
    //     }
    //     // let len = tmpProperties.items.length;
    //     // useFormData.splice(len, 1, initValue);
    //     useFormData.push(initValue);
    //   }
    // }
    // * formData相关end------------

    let tmpUISchema = this.addNewPropertiesUiSchema({
      ownerList,
      newProperty,
      tmpProperties,
      prune: options.prune
    });

    let tmpFormData = this.addNewPropertiesFormData({
      ownerList,
      newProperty,
      tmpProperties,
      prune: options.prune
    });

    this.setState((prevState, props) => {
      let data =  {
        JSONSchema: {
          ...prevState.JSONSchema
        }
      };
      if (this.state.JSONSchema.type === 'object') {
        data.JSONSchema.properties = useProperties;
      } else if (this.state.JSONSchema.type === 'array') {
        data.JSONSchema = Object.assign(data.JSONSchema, useProperties);
      }
      data.UISchema = {
        ...prevState.UISchema,
        ...tmpUISchema
      };
      if (utilFunc.getPropertyJsType(tmpFormData).indexOf('Object') !== -1) {
        data.FormData = {
          ...prevState.FormData,
          ...tmpFormData
        };
      } else if (utilFunc.getPropertyJsType(tmpFormData).indexOf('Array') !== -1) {
        data.FormData = [
          ...tmpFormData
        ];
      }
      return {
        ...data
      }
    }, () => {
      utilFunc.messageSuccess({
        message: '添加成功'
      });
    });
  }

  addNewPropertiesUiSchema = (data) => {
    let { ownerList, newProperty, tmpProperties, prune } = data;

    let useUISchema = cloneDeep(this.state.UISchema);
    let tmpUISchema = useUISchema; // * 用来定位UISchema具体的位置
    for (let item of ownerList) {
      // * 创建ui对象路径
      item !== 'root' && !useUISchema[item] && (useUISchema[item] = {});
      item !== 'root' && (useUISchema = useUISchema[item]);
    }


    // * 数据预览中使用搜索功能删除时触发
    if (prune === 'delete') {
      delete useUISchema[newProperty.key];
      return tmpUISchema;
    }

    // * 设置ui最终位置的js类型与key名
    if (tmpProperties.type === 'object'
    || (ownerList.length === 1 && ownerList[0] === '')
    || (ownerList.length === 1 && ownerList[0] === 'root' && this.state.JSONSchema.type === 'object')) {
      useUISchema[newProperty.key] = {
        ...useUISchema[newProperty.key]
      };
      useUISchema = useUISchema[newProperty.key];

    } else if (tmpProperties.type === 'array' && newProperty.asFixedItems) {
      if (useUISchema['items'] && Object.keys(useUISchema['items']).length > 0) {
        useUISchema['additionalItems'] = useUISchema['items'];
      }

      if (utilFunc.getPropertyJsType(useUISchema['items']).indexOf('Array') === -1) {
        useUISchema['items'] = [];
      }
      useUISchema = useUISchema['items'];
    } else if (tmpProperties.type === 'array' && newProperty.coverFixedItems) {
      delete useUISchema['additionalItems'];

      useUISchema['items'] = {};
      useUISchema = useUISchema['items'];
    } else {
      let hasArray = utilFunc.getPropertyJsType(tmpProperties.items).indexOf('Array');
      let name = hasArray !== -1 ? 'additionalItems' : 'items';
      useUISchema[name] = {};
      useUISchema = useUISchema[name];
    }

    // * 将ui加入到目标位置
    newProperty.ui = newProperty.ui ? newProperty.ui : {};
    if (utilFunc.getPropertyJsType(useUISchema).indexOf('Array') !== -1) {
      console.log('useUISchema before', useUISchema);
      let data = {};
      for (let item of Object.entries(newProperty.ui)) {
        let uiPrefix = item[0] !== 'classNames' ? 'ui:' : '';
        data[uiPrefix + item[0]] = item[1];
      }
      // useUISchema[tmpProperties.items.length] = data;
      useUISchema.push({...data});
    } else if (utilFunc.getPropertyJsType(useUISchema).indexOf('Object') !== -1) {
      for (let item of Object.entries(newProperty.ui)) {
        let uiPrefix = item[0] !== 'classNames' ? 'ui:' : '';
        useUISchema[uiPrefix + item[0]] = item[1];
      }
    }

    delete newProperty.ui;

    return tmpUISchema;
  }

  addNewPropertiesFormData = (data) => {
    let { ownerList, newProperty, tmpProperties, prune } = data;

    let useFormData = cloneDeep(this.state.FormData);
    let tmpFormData = useFormData; // * 用来定位FormData具体的位置

    for (let item of ownerList) {
      // * 创建tmpProperties对应的formData
      let jsType = utilFunc.getPropertyJsType(useFormData);
      if (item !== 'root' && !useFormData[item]) {
        let tmpD = tmpProperties.type === 'array' ? [] : {};
        // * 如果useFormData是数组，则添加一个对象进去
        if (jsType.indexOf('Array') !== -1) {
          useFormData.push(tmpD);
          let pos = useFormData.length - 1;
          useFormData = useFormData[pos];
        }

        // * 如果useFormData是对象，则按照通常方法创造子对象
        jsType.indexOf('Object') !== -1 && !useFormData[item] && (useFormData[item] = tmpD);
      }
      item !== 'root' && (useFormData = useFormData[item]);
    }


    // * 数据预览中使用搜索功能删除时触发
    if (prune === 'delete') {
      delete useFormData[newProperty.key];
    }

    // * 如果没有设置default，则再formdata中设置对应的key
    if (newProperty.type === 'object') {
      useFormData[newProperty.key] = {};
    } else if (newProperty.type === 'array') {
      useFormData[newProperty.key] = [];
      // * 如果数组设置了default
      if (newProperty.default) {
        useFormData[newProperty.key] = [...newProperty.default];
      }
      // * 如果数组设置了minItems
      if (newProperty.minItems) {
        let len = useFormData[newProperty.key].length;
        newProperty.minItems > len && (useFormData[newProperty.key] = useFormData[newProperty.key].concat([...Array(2).fill('')]));
      }
    } else {
      if (newProperty.default === undefined && utilFunc.getPropertyJsType(useFormData).indexOf('Object') !== -1) {
        useFormData[newProperty.key] = '';
      } else if (utilFunc.getPropertyJsType(useFormData).indexOf('Array') !== -1 && newProperty.asFixedItems) {
        let initValue = null;
        switch (newProperty.type) {
          case 'boolean':
            initValue = newProperty.default === undefined ? false : newProperty.default;
            break;
          case 'number':
            initValue = newProperty.default === undefined ? 0 : newProperty.default;
            break;
          case 'string':
            initValue = newProperty.default === undefined ? '' : newProperty.default;
            break;
          default:
            initValue = '';
            break;
        }
        // let len = tmpProperties.items.length;
        // useFormData.splice(len, 1, initValue);
        useFormData.push(initValue);
      }
    }

    return tmpFormData;
  }

  addNewPropertiesAtRoot = (data = {}) => {
    let { newProperty } = data;
    this.setState((prevState, props) => {
      let data = {
        JSONSchema: {},
        UISchema: {},
        FormData: ''
      };

      if (newProperty.type === 'object') {
        data.FormData = {};
      } else if (newProperty.type === 'array') {
        data.FormData = [];
        if (newProperty.default !== undefined) {
          data.FormData = [...newProperty.default];
        }
        // * 如果数组设置了minItems
        if (newProperty.minItems) {
          let len = data.FormData.length;
          newProperty.minItems > len && (data.FormData = data.FormData.concat([...Array(newProperty.minItems - len).fill('')]));
        }
      } else {
        data.FormData = newProperty.default !== undefined ? newProperty.default : '';
      }

      newProperty.ui = newProperty.ui ? newProperty.ui : {};
      for (let item of Object.entries(newProperty.ui)) {
        let uiPrefix = item[0] !== 'classNames' ? 'ui:' : '';
        data.UISchema[uiPrefix + item[0]] = item[1];
      }
      delete newProperty.ui;

      data.JSONSchema = {
        ...newProperty
      }
      if (prevState.JSONSchema.definitions) {
        data.JSONSchema.definitions = prevState.JSONSchema.definitions;
      }
      return {
        ...data
      }
    }, () => {
      utilFunc.messageSuccess({
        message: '添加成功'
      });
    });
    return;
  }

  // * ------------

  addNewDefinition = (newDefinition) => {
    delete newDefinition.ui;

    let defOwner = newDefinition.defOwner;
    let defOwnerList = defOwner.split('~/~');

    let useDefObj = cloneDeep(this.state.JSONSchema);
    let tmpDefObj = useDefObj;

    for (let item of defOwnerList) {
      tmpDefObj[item] || (tmpDefObj[item] = {});
      tmpDefObj = tmpDefObj[item];
    }
    if (defOwnerList[defOwnerList.length - 1] !== 'definitions') {
      tmpDefObj['definitions'] = {};
      tmpDefObj = tmpDefObj['definitions'];
    }
    tmpDefObj[newDefinition.key] = newDefinition;
    this.setState((prevState, props) => {
      return {
        JSONSchema: {
          ...useDefObj
        }
      };
    }, () => {
      utilFunc.messageSuccess({
        message: '添加definitions成功'
      });
    });
  }

  // * ------------

  editJsonSchemaData = (param) => {
    console.log('editJsonSchemaData param', param);
    if (param.name === 'key') {
      this.editUISchemaFromJSONSchema(param.existing_value, param.new_value, param.namespace);
      this.editFormDataFromJSONSchema(param.existing_value, param.new_value, param.namespace);
    }
    if (!isEqual(this.state.JSONSchema, param.updated_src)) {
      this.setState({
        JSONSchema: param.updated_src
      })
    }
  }

  editUISchemaFromJSONSchema = (ev, nv, nameSpace) => {
    this.setState((prevState, props) => {
      let useUISchema = {
        ...prevState.UISchema
      };
      let iteUISchema = useUISchema;
      let nspLen = nameSpace.length;
      for (let i = 0; i < nspLen; i++) {
        if (nameSpace[i] !== 'properties' && i !== nspLen - 1) {
          iteUISchema = iteUISchema[nameSpace[i]];
        }
        console.log('iteUISchema', iteUISchema);
      }
      iteUISchema[nv] = iteUISchema[ev];
      delete iteUISchema[ev];
      console.log('useUISchema', useUISchema);
      return {
        UISchema: useUISchema
      }
    });
  }

  editFormDataFromJSONSchema = (ev, nv, nameSpace) => {
    this.setState((prevState, props) => {
      let useFormData = {
        ...prevState.FormData
      };
      let iteFormData = useFormData;
      let nspLen = nameSpace.length;
      for (let i = 0; i < nspLen; i++) {
        if (nameSpace[i] !== 'properties' && i !== nspLen - 1) {
          iteFormData = iteFormData[nameSpace[i]];
        }
        console.log('iteFormData', iteFormData);
      }
      if (iteFormData[ev] !== undefined) {
        iteFormData[nv] = iteFormData[ev]
        delete iteFormData[ev];
      }
      console.log('useFormData', useFormData);
      return {
        FormData: useFormData
      }
    });
  }

  deleteJsonSchemaData = (param) => {
    console.log('deleteJsonSchemaData param', param);
    if (typeof param.existing_value === 'object' && param.existing_value.type) {
      this.deleteUISchemaFromJSONSchema(param.existing_value, param.name, param.namespace);
      this.deleteFormDataFromJSONSchema(param.existing_value, param.name, param.namespace);
    }
    if (!isEqual(this.state.JSONSchema, param.updated_src)) {
      this.setState({
        JSONSchema: param.updated_src
      })
    }
  }

  deleteUISchemaFromJSONSchema = (ev, name, nameSpace) => {
    this.setState((prevState, props) => {
      let useUISchema = {
        ...prevState.UISchema
      };
      let iteUISchema = useUISchema;
      let nspLen = nameSpace.length;
      for (let i = 0; i < nspLen; i++) {
        iteUISchema = iteUISchema[nameSpace[i]];
        console.log('iteUISchema', iteUISchema);
      }
      if (isNaN(Number(name))) {
        delete iteUISchema[ev.key];
      } else {
        iteUISchema.splice(Number(name), 1);
      }
      console.log('useUISchema', useUISchema);
      return {
        UISchema: useUISchema
      }
    });
  }

  deleteFormDataFromJSONSchema = (ev, name, nameSpace) => {
    if (name === 'additionalItems') {
      return;
    }
    this.setState((prevState, props) => {
      let useFormData = utilFunc.getPropertyJsType(prevState.FormData).indexOf('Object') !== -1 ? {
        ...prevState.FormData
      } : [
        ...prevState.FormData
      ];
      let iteFormData = useFormData;
      let nspLen = nameSpace.length;
      for (let i = 0; i < nspLen; i++) {
        if (nameSpace[i] === 'items') {
          continue;
        }
        iteFormData = iteFormData[nameSpace[i]];
        console.log('iteFormData', iteFormData);
      }
      if (isNaN(Number(name))) {
        delete iteFormData[ev.key];
      } else {
        iteFormData.splice(Number(name), 1);
      }
      console.log('useFormData', useFormData);
      return {
        FormData: useFormData
      }
    });
  }

  // * ------------

  render () {
    return (
      <div className="json-schema-container">
        <Tabs defaultActiveKey="1" onChange={this.tabsChange}>
          <TabPane tab="创建Object" key="1">
            <div className={ styles.jsonSchemaTabPane }>
              <ObjectSchemaCreatorHOC properties={
                this.state.JSONSchema.properties
              } addNewProperties={
                this.addNewProperties
              } jsonSchema={
                this.state.JSONSchema
              } definitions={
                this.state.JSONSchema.definitions
              } addNewDefinition={
                this.addNewDefinition
              } />
            </div>
          </TabPane>
          <TabPane tab="创建String" key="2">
            <div className={ styles.jsonSchemaTabPane }>
              <StringSchemaCreatorHOC properties={
                this.state.JSONSchema.properties
              } addNewProperties={
                this.addNewProperties
              } jsonSchema={
                this.state.JSONSchema
              } definitions={
                this.state.JSONSchema.definitions
              } addNewDefinition={
                this.addNewDefinition
              } />
            </div>
          </TabPane>
          <TabPane tab="创建Number" key="3">
            <div className={ styles.jsonSchemaTabPane }>
              <NumberSchemaCreatorHOC properties={
                this.state.JSONSchema.properties
              } addNewProperties={
                this.addNewProperties
              } jsonSchema={
                this.state.JSONSchema
              } definitions={
                this.state.JSONSchema.definitions
              } addNewDefinition={
                this.addNewDefinition
              } />
            </div>
          </TabPane>
          <TabPane tab="创建Boolean" key="4">
            <div className={ styles.jsonSchemaTabPane }>
              <BooleanSchemaCreatorHOC properties={
                this.state.JSONSchema.properties
              } addNewProperties={
                this.addNewProperties
              } jsonSchema={
                this.state.JSONSchema
              } definitions={
                this.state.JSONSchema.definitions
              } addNewDefinition={
                this.addNewDefinition
              } />
            </div></TabPane>
          <TabPane tab="创建Array" key="5">
            <div className={ styles.jsonSchemaTabPane }>
              <ArraySchemaCreatorHOC properties={
                this.state.JSONSchema.properties
              } addNewProperties={
                this.addNewProperties
              } jsonSchema={
                this.state.JSONSchema
              } definitions={
                this.state.JSONSchema.definitions
              } addNewDefinition={
                this.addNewDefinition
              } />
            </div>
          </TabPane>
          <TabPane tab="数据预览" key="6">
            <DataPreview JSONSchema={
              this.state.JSONSchema
            } UISchema={
              this.state.UISchema
            } FormData={
              this.state.FormData
            } editJsonSchemaData={
              this.editJsonSchemaData
            } deleteJsonSchemaData={
              this.deleteJsonSchemaData
            } addNewProperties={
              this.addNewProperties
            } />
          </TabPane>
          <TabPane tab="表单预览" key="7">
            <PreviewForm JSONSchema={
              this.state.JSONSchema
            } UISchema={
              this.state.UISchema
            } FormData={
              this.state.FormData
            } />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default JsonSchema;

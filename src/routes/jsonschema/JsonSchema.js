import React from 'react';

// * 样式
import styles from './JsonSchema.less';

// * 功能库
import utilFunc from '@utils/functions';

import withCompuListHighOrder from '@utils/withCompuListHighOrder';

import { cloneDeep } from 'lodash';

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
    JSONSchema: {
      // definitions: {
      //   Thing: {
      //     type: "object",
      //     properties: {
      //       name: {
      //         type: "string",
      //         title: "Default title",
      //         definitions: {
      //           Hg: {
      //             type: "string",
      //             title: "nyrethy"
      //           }
      //         }
      //       }
      //     },
      //     definitions: {
      //       News: {
      //         type: "string",
      //         title: "a",
      //         default: "dd"
      //       },
      //       Ew: {
      //         type: 'array',
      //         title: 'feiw',
      //         items: [
      //           {
      //             type: 'string',
      //             title: 'ruwe'
      //           }
      //         ]
      //       }
      //     }
      //   },
      //   Shing: {
      //     type: "object",
      //     properties: {
      //       name: {
      //         type: "string",
      //         title: "Default title"
      //       }
      //     },
      //     definitions: {
      //       Io: {
      //         type: "number",
      //         title: "a",
      //         default: "dd",
      //         definitions: {
      //           Rt: {
      //             type: "string",
      //             title: "uriqy"
      //           }
      //         }
      //       }
      //     }
      //   }
      // },
      // type: 'array',
      // title: 'fw items',
      // items: {}
      // type: 'object',
      // title: 'outer-object-title',
      // description: 'outer-object-desc',
      // required: [],
      // properties: {
      //   tsobject: {
      //     type: 'object',
      //     title: 'test title',
      //     properties: {
      //       gfru: {
      //         type: 'object',
      //         title: 'vgrhtyh',
      //         properties: {}
      //       },
      //       fw: {
      //         type: 'array',
      //         title: 'dewq',
      //         items: {
      //           type: 'array',
      //           title: 'fw items',
      //           // properties: {},
      //           items: [{
      //             type: 'string',
      //             title: 'grew'
      //           }, {
      //             type: 'object',
      //             title: 'heiouwq',
      //             properties: {}
      //           }],
      //           additionalItems: {
      //             type: 'object',
      //             title: 'bytrhjh',
      //             properties: {}
      //           }
      //         }
      //       },
      //       hg: {
      //         type: 'array',
      //         title: 'froiehf',
      //         items: {
      //           type: 'string',
      //           title: 'froeih',
      //           enum: [
      //             'tu',
      //             'gbyu'
      //           ]
      //         }
      //       }
      //     }
      //   },
      //   tsarray: {
      //     type: 'array',
      //     title: 'tsarray tittle',
      //     items: [{
      //       type: 'string',
      //       title: 'grew'
      //     }, {
      //       type: 'object',
      //       title: 'heiouwq',
      //       properties: {}
      //     }]
      //   }
      // }
    },
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
  addNewProperties = (newProperty) => {
    console.log('addNewProperties newProperty:', newProperty);
    let owner = newProperty.owner;
    let ownerList = owner.split('~/~');

    // * 在根目录添加
    if (ownerList.length === 1 && ownerList[0] === '') {
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

    let useUISchema = cloneDeep(this.state.UISchema);
    let tmpUISchema = useUISchema; // * 用来定位UISchema具体的位置

    let useFormData = cloneDeep(this.state.FormData);
    let tmpFormData = useFormData; // * 用来定位FormData具体的位置

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

      // * ui相关start---------------
      // * 创建ui对象路径
      item !== 'root' && !useUISchema[item] && (useUISchema[item] = {});
      item !== 'root' && (useUISchema = useUISchema[item]);
      // * ui相关end---------------

      // * formData相关start------------
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
      // * formData相关end------------
    }

    // * ui相关start---------------
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
      let data = {};
      for (let item of Object.entries(newProperty.ui)) {
        let uiPrefix = item[0] !== 'classNames' ? 'ui:' : '';
        data[uiPrefix + item[0]] = item[1];
      }
      useUISchema[tmpProperties.items.length] = data;
      for (let i = 0; i < tmpProperties.items.length; i++) {
        if (typeof useUISchema[i] === 'undefined') {
          useUISchema[i] = {};
        }
      }
    } else if (utilFunc.getPropertyJsType(useUISchema).indexOf('Object') !== -1) {
      for (let item of Object.entries(newProperty.ui)) {
        let uiPrefix = item[0] !== 'classNames' ? 'ui:' : '';
        useUISchema[uiPrefix + item[0]] = item[1];
      }
    }

    delete newProperty.ui;
    // * ui相关end---------------

    // * formData相关start------------
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
    } else if (newProperty.default === undefined) {
      if (utilFunc.getPropertyJsType(useFormData).indexOf('Object') !== -1) {
        useFormData[newProperty.key] = '';
      } else if (utilFunc.getPropertyJsType(useFormData).indexOf('Array') !== -1) {
        // newProperty.type === 'boolean' && useFormData.push(false);
        // newProperty.type === 'number' && useFormData.push(0);
        // newProperty.type === 'string' && useFormData.push('');
      }
    }
    // * formData相关end------------

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
      delete newProperty.asFixedItems;
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

  render () {
    return (
      <div className="json-schema-container">
        <Tabs defaultActiveKey="1" onChange={this.tabsChange}>
          <TabPane tab="创建Object" key="1">
            <div className={ styles.jsonSchemaTabPane }>
              {/* <ObjectSchemaCreator properties={
                this.state.JSONSchema.properties
              } addNewProperties={
                this.addNewProperties
              } jsonSchema={
                this.state.JSONSchema
              } definitions={
                this.state.JSONSchema.definitions
              } addNewDefinition={
                this.addNewDefinition
              }></ObjectSchemaCreator> */}
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
              }></ObjectSchemaCreatorHOC>
            </div>
          </TabPane>
          <TabPane tab="创建String" key="2">
            <div className={ styles.jsonSchemaTabPane }>
              {/* <StringSchemaCreator properties={
                this.state.JSONSchema.properties
              } addNewProperties={
                this.addNewProperties
              } jsonSchema={
                this.state.JSONSchema
              } definitions={
                this.state.JSONSchema.definitions
              } addNewDefinition={
                this.addNewDefinition
              }></StringSchemaCreator> */}
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
              }></StringSchemaCreatorHOC>
            </div>
          </TabPane>
          <TabPane tab="创建Number" key="3">
            <div className={ styles.jsonSchemaTabPane }>
              {/* <NumberSchemaCreator properties={
                this.state.JSONSchema.properties
              } addNewProperties={
                this.addNewProperties
              } jsonSchema={
                this.state.JSONSchema
              } definitions={
                this.state.JSONSchema.definitions
              } addNewDefinition={
                this.addNewDefinition
              }></NumberSchemaCreator> */}
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
              }></NumberSchemaCreatorHOC>
            </div>
          </TabPane>
          <TabPane tab="创建Boolean" key="4">
            <div className={ styles.jsonSchemaTabPane }>
              {/* <BooleanSchemaCreator properties={
                this.state.JSONSchema.properties
              } addNewProperties={
                this.addNewProperties
              } jsonSchema={
                this.state.JSONSchema
              } definitions={
                this.state.JSONSchema.definitions
              } addNewDefinition={
                this.addNewDefinition
              }></BooleanSchemaCreator> */}
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
              }></BooleanSchemaCreatorHOC>
            </div></TabPane>
          <TabPane tab="创建Array" key="5">
            <div className={ styles.jsonSchemaTabPane }>
              {/* <ArraySchemaCreator properties={
                this.state.JSONSchema.properties
              } addNewProperties={
                this.addNewProperties
              } jsonSchema={
                this.state.JSONSchema
              } definitions={
                this.state.JSONSchema.definitions
              } addNewDefinition={
                this.addNewDefinition
              }></ArraySchemaCreator> */}
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
              }></ArraySchemaCreatorHOC>
            </div>
          </TabPane>
          <TabPane tab="数据预览" key="6">
            <DataPreview JSONSchema={
              this.state.JSONSchema
            } UISchema={
              this.state.UISchema
            } FormData={
              this.state.FormData
            }></DataPreview>
          </TabPane>
          <TabPane tab="表单预览" key="7">
            <PreviewForm JSONSchema={
              this.state.JSONSchema
            } UISchema={
              this.state.UISchema
            } FormData={
              this.state.FormData
            }></PreviewForm>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default JsonSchema;

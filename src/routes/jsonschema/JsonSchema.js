import React from 'react';

// * 样式
import styles from './JsonSchema.less';

import { cloneDeep } from 'lodash';

import ObjectSchemaCreator from '@components/SchemaCreator/ObjectSchemaCreator';
import StringSchemaCreator from '@components/SchemaCreator/StringSchemaCreator';
import NumberSchemaCreator from '@components/SchemaCreator/NumberSchemaCreator';
import BooleanSchemaCreator from '@components/SchemaCreator/BooleanSchemaCreator';
import ArraySchemaCreator from '@components/SchemaCreator/ArraySchemaCreator';

// * antd组件
import {
  Tabs,
  message
} from 'antd';

const TabPane = Tabs.TabPane;

class JsonSchema extends React.Component {

  state = {
    JSONSchema: {
      definitions: {},
      type: 'object',
      title: 'outer-object-title',
      description: 'outer-object-desc',
      required: [],
      properties: {
        tsobject: {
          type: 'object',
          title: 'test title',
          properties: {
            gfru: {
              type: 'object',
              title: 'vgrhtyh',
              properties: {}
            },
            fw: {
              type: 'array',
              title: 'dewq',
              items: {
                type: 'array',
                title: 'fw items',
                // properties: {},
                items: [{
                  type: 'string',
                  title: 'grew'
                }, {
                  type: 'object',
                  title: 'heiouwq',
                  properties: {}
                }],
                additionalItems: {
                  type: 'object',
                  title: 'bytrhjh',
                  properties: {}
                }
              }
            }
          }
        },
        tsarray: {
          type: 'array',
          title: 'tsarray tittle',
          items: [{
            type: 'string',
            title: 'grew'
          }, {
            type: 'object',
            title: 'heiouwq',
            properties: {}
          }]
        }
      }
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

  // * 添加新的属性
  addNewProperties = (newProperty) => {
    console.log('addNewProperties newProperty:', newProperty);
    let owner = newProperty.owner;
    let ownerList = owner.split('~/~');

    let useProperties = cloneDeep(this.state.JSONSchema.properties);
    let tmpProperties = useProperties; // * 用来定位JsonSchema具体的位置

    let useUISchema = cloneDeep(this.state.UISchema);
    let tmpUISchema = useUISchema; // * 用来定位UISchema具体的位置

    for (let item of ownerList) {
      if (
        item !== 'global'
        && tmpProperties[item]
      ) {
        tmpProperties = tmpProperties[item];

        if (!useUISchema[item]) {
          useUISchema[item] = {};
        }
        useUISchema = useUISchema[item];
      } else if (
        item !== 'global'
        && tmpProperties.type === 'object'
        && tmpProperties.properties[item]
      ) {
        tmpProperties = tmpProperties.properties[item];

        !useUISchema[item] && (useUISchema[item] = {});
        useUISchema = useUISchema[item];
      } else if (
        item !== 'global'
        && tmpProperties.type === 'array'
        && tmpProperties[item]
      ) {
        // * 目标为数组是，根据item获取到下一个目标
        tmpProperties = tmpProperties[item];

        if (item !== 'items') {
          continue;
        }
        // * 因为是数组，所以需要再次判断获取到的下一个目标的本身的js类型是object还是array
        if (this.getPropertyJsType(tmpProperties).indexOf('Object') !== -1) {
          !useUISchema[item] && (useUISchema[item] = {});
        } else if (this.getPropertyJsType(tmpProperties).indexOf('Array') !== -1) {
          !useUISchema[item] && (useUISchema[item] = []);
        }
        useUISchema = useUISchema[item];
      }
    }

    for (let item of Object.entries(newProperty.ui)) {
      useUISchema[item[0]] = item[1];
    }

    console.log('useUISchema', useUISchema);
    console.log('tmpUISchema', tmpUISchema);

    delete newProperty.ui;

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
        tmpProperties.additionalItems = tmpProperties.items;
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
      return {
        JSONSchema: {
          ...prevState.JSONSchema,
          properties: useProperties
        },
        UISchema: {
          ...prevState.UISchema,
          ...tmpUISchema
        }
      }
    }, () => {
      this.messageSuccess({
        message: '添加成功'
      });
    });
  }

  // * 添加新的ui
  addNewUI = (data) => {
    console.log('addNewUI data: ', data);
  }

  // * ------------

  messageSuccess = (param = {
    message: '成功'
  }) => {
    message.success(param.message, () => {

    });
  }
  messageError = () => {

  }
  messageWarning = () => {

  }
  messageInfo = () => {

  }

  // * ------------

  render () {
    return (
      <div className="json-schema-container">
        <Tabs defaultActiveKey="1" onChange={this.tabsChange}>
          <TabPane tab="创建Object" key="1">
            <div className={ styles.jsonSchemaTabPane }>
              <ObjectSchemaCreator properties={
                this.state.JSONSchema.properties
              } addNewProperties={
                this.addNewProperties
              } addNewUI={
                this.addNewUI
              }></ObjectSchemaCreator>
            </div>
          </TabPane>
          <TabPane tab="创建String" key="2">
            <div className={ styles.jsonSchemaTabPane }>
              <StringSchemaCreator properties={
                this.state.JSONSchema.properties
              } addNewProperties={
                this.addNewProperties
              } addNewUI={
                this.addNewUI
              }></StringSchemaCreator>
            </div>
          </TabPane>
          <TabPane tab="创建Number" key="3">
            <div className={ styles.jsonSchemaTabPane }>
              <NumberSchemaCreator properties={
                this.state.JSONSchema.properties
              } addNewProperties={
                this.addNewProperties
              } addNewUI={
                this.addNewUI
              }></NumberSchemaCreator>
            </div>
          </TabPane>
          <TabPane tab="创建Boolean" key="4">
            <div className={ styles.jsonSchemaTabPane }>
              <BooleanSchemaCreator properties={
                this.state.JSONSchema.properties
              } addNewProperties={
                this.addNewProperties
              } addNewUI={
                this.addNewUI
              }></BooleanSchemaCreator>
            </div></TabPane>
          <TabPane tab="创建Array" key="5">
            <div className={ styles.jsonSchemaTabPane }>
              <ArraySchemaCreator properties={
                this.state.JSONSchema.properties
              } addNewProperties={
                this.addNewProperties
              } addNewUI={
                this.addNewUI
              }></ArraySchemaCreator>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default JsonSchema;

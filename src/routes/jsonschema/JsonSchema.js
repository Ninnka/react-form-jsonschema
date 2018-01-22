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
            fw: {
              type: 'string',
              title: 'dewq'
            }
          }
        },
        tsarray: {
          type: 'array',
          title: 'frehgie'
        }
      }
    },
    UISchema: {
    }
  }

  componentDidMount () {

  }

  componentDidCatch () {
    this.messageError({
      message: '出现未知错误'
    });
  }

  // * ------------

  addNewProperties = (newProperty) => {
    console.log('addNewProperties newProperty:', newProperty);
    let owner = newProperty.owner;
    let ownerList = owner.split('~/~');
    console.log('ownerList', ownerList);
    let useProperties = cloneDeep(this.state.JSONSchema.properties);
    let tmpProperties = useProperties;
    for (let item of ownerList) {
      if (item !== 'global') {
        tmpProperties = tmpProperties[item];
      }
    }
    if (tmpProperties && tmpProperties.type === 'object' && tmpProperties.properties) {
      tmpProperties.properties[newProperty.key] = newProperty;
    } else if (tmpProperties && tmpProperties.type === 'array' && newProperty.asFixedItems) {
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
    } else if (tmpProperties && tmpProperties.type === 'array' && newProperty.coverFixedItems) {
      delete newProperty.coverFixedItems;
      delete tmpProperties.additionalItems;
      tmpProperties.items = newProperty;
    } else if (tmpProperties && tmpProperties.type === 'array') {
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
        }
      }
    }, () => {
      this.messageSuccess({
        message: '添加成功'
      });
    });
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
              }></ObjectSchemaCreator>
            </div>
          </TabPane>
          <TabPane tab="创建String" key="2">
            <div className={ styles.jsonSchemaTabPane }>
              <StringSchemaCreator properties={
                this.state.JSONSchema.properties
              } addNewProperties={
                this.addNewProperties
              }></StringSchemaCreator>
            </div>
          </TabPane>
          <TabPane tab="创建Number" key="3">
            <div className={ styles.jsonSchemaTabPane }>
              <NumberSchemaCreator properties={
                this.state.JSONSchema.properties
              } addNewProperties={
                this.addNewProperties
              }></NumberSchemaCreator>
            </div>
          </TabPane>
          <TabPane tab="创建Boolean" key="4">
            <div className={ styles.jsonSchemaTabPane }>
              <BooleanSchemaCreator properties={
                this.state.JSONSchema.properties
              } addNewProperties={
                this.addNewProperties
              }></BooleanSchemaCreator>
            </div></TabPane>
          <TabPane tab="创建Array" key="5">
            <div className={ styles.jsonSchemaTabPane }>
              <ArraySchemaCreator properties={
                this.state.JSONSchema.properties
              } addNewProperties={
                this.addNewProperties
              }></ArraySchemaCreator>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default JsonSchema;

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
  Button,
  Tabs,
  Select,
  message
} from 'antd';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class JsonSchema extends React.Component {

  state = {
    JSONSchema: {
      definitions: {},
      type: 'object',
      title: 'outer-object-title',
      description: 'outer-object-desc',
      required: [],
      properties: {
        ts: {
          type: 'object',
          title: 'test title',
          properties: {
            fw: {
              type: 'string',
              title: 'dewq'
            }
          }
        }
      }
    },
    UISchema: {
    }
  }

  componentDidMount () {

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
    if (tmpProperties && tmpProperties.properties) {
      tmpProperties.properties[newProperty.key] = newProperty;
    } else {
      tmpProperties[newProperty.key] = newProperty;
    }
    console.log('useProperties', useProperties);
    this.setState((prevState, props) => {
      return {
        JSONSchema: {
          ...prevState.JSONSchema,
          properties: useProperties
        }
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

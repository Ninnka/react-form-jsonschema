import React from 'react';

import PreviewJsonSchema from '@components/DataPreview/PreviewJsonSchema';
import PreviewUISchema from '@components/DataPreview/PreviewUISchema';
import PreviewFormData from '@components/DataPreview/PreviewFormData';

import {
  Tabs
} from 'antd';

const TabPane = Tabs.TabPane;

class DataPreview extends React.Component {

  state = {}

  render () {
    return (
      <div className="borderbox" style={ { padding: '0 24px 24px' } }>
        <Tabs>
          <TabPane tab="jsonschema" key="1">
            <PreviewJsonSchema JSONSchema={ this.props.JSONSchema }
                               editJsonSchemaData={ this.props.editJsonSchemaData }
                               deleteJsonSchemaData={ this.props.deleteJsonSchemaData } />
          </TabPane>
          <TabPane tab="uischema" key="2">
            <PreviewUISchema UISchema={ this.props.UISchema }
                             editJsonSchemaData={ this.props.editJsonSchemaData }
                             deleteJsonSchemaData={ this.props.deleteJsonSchemaData } />
          </TabPane>
          <TabPane tab="formdata" key="3">
            <PreviewFormData FormData={ this.props.FormData }
                             deleteJsonSchemaData={ this.props.deleteJsonSchemaData } />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default DataPreview;

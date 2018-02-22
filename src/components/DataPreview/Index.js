import React from 'react';

// * 功能库
import utilFunc from '@utils/functions';

import {
  httpLib
} from '@http/config';

import PreviewJsonSchema from '@components/DataPreview/PreviewJsonSchema';
import PreviewUISchema from '@components/DataPreview/PreviewUISchema';
import PreviewFormData from '@components/DataPreview/PreviewFormData';

import {
  Tabs,
  Button
} from 'antd';

const TabPane = Tabs.TabPane;

class DataPreview extends React.Component {

  state = {
    submiting: false
  }

  submitDataPraparing = () => {
    if (this.state.submiting) {
      return;
    }
    this.setState({
      submiting: true
    }, () => {
      this.submitData().catch((e) => {
        this.setState({
          submiting: false
        });
        utilFunc.messageError({
          duration: 1500,
          message: '提交失败'
        });
        console.log('submitData catch exception:', e);
      });
    });
  }

  submitData = async () => {
    let resData = await httpLib.submitData({
      schema: this.props.JSONSchema,
      uiSchema: this.props.UISchema,
      formData: this.props.FormData
    });
    console.log('submitData resData', resData);
    if (resData.data.code === 0) {
      utilFunc.messageSuccess({
        duration: 1500,
        message: '提交成功'
      });
      this.setState({
        submiting: false
      });
      this.props.resetAllData();
    }
  }

  render () {
    return (
      <div className="borderbox" style={ { padding: '0 24px 24px' } }>
        <Button loading={ this.state.submiting } type="primary" onClick={ this.submitDataPraparing }>提交</Button>
        <Tabs>
          <TabPane tab="jsonschema" key="1">
            <PreviewJsonSchema JSONSchema={ this.props.JSONSchema }
                               editJsonSchemaData={ this.props.editJsonSchemaData }
                               deleteJsonSchemaData={ this.props.deleteJsonSchemaData }
                               addNewProperties={ this.props.addNewProperties } />
          </TabPane>
          <TabPane tab="uischema" key="2">
            <PreviewUISchema UISchema={ this.props.UISchema } />
          </TabPane>
          <TabPane tab="formdata" key="3">
            <PreviewFormData FormData={ this.props.FormData } />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default DataPreview;

import React from 'react';
import { Router, Route, Switch } from 'dva/router';
// * 中文化
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

import JsonSchema from './routes/jsonschema/JsonSchema';

function RouterConfig({ history }) {
  return (
    <LocaleProvider locale={zh_CN}>
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={ JsonSchema } />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;

import dva from 'dva';

// * 可以全局引入样式进行覆盖操作
// import 'antd/dist/antd.css';

import './index.css';

// * 导入路由设置
import router from './router';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);

// 4. Router
app.router(router);

// 5. Start
app.start('#root');

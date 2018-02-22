import axios from 'axios';

import Qs from 'Qs';

// * 创建axios实例
let axiosInstance = axios.create({
  params: {},
  timeout: 10000,
  validateStatus: (status) => {
    // * 只过滤出2开头的状态，其他状态通通列为失败
    return /^[2,4]\d{2}$/.test(status);
  },
  paramsSerializer: (params) => {
    // * 序列化params对象
    return Qs.stringify(params);
  }
});

axiosInstance.defaults.headers.common['X-Custom-Header'] = 'foobar';

axiosInstance.defaults.baseURL = 'http://10.0.0.27:10201';

const setDefaultBaseURL = (url) => {
  axiosInstance.defaults.baseURL = url;
}

let httpLib = {};

// * 提交数据
httpLib.submitData = function (data) {
  return axiosInstance({
    method: 'post',
    url: '/rules',
    data
  })
};

export {
  setDefaultBaseURL,
  httpLib
}

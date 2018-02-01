import { message } from 'antd';

export default {
  I64BIT_TABLE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split(''),
  createHash: (input) => {
    let hash = 5381;
    let i = input.length - 1;

    if (typeof input === 'string') {
      for (; i > -1; i--)
      hash += (hash << 5) + input.charCodeAt(i);
    } else {
      for (; i > -1; i--)
      hash += (hash << 5) + input[i];
    }
    let value = hash & 0x7FFFFFFF;

    let retValue = '';
    do {
      retValue += this.I64BIT_TABLE[value & 0x3F];
    }
    while(!!(value >>= 6));

    return retValue;
  },
  createRandomId: () => {
    let str = '';
    let pos = null;
    const arr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_'.split('');
    let range = Math.round(Math.random() * (6 - 4)) + 4;
    for (var i = 0; i < range; i++) {
      pos = Math.round(Math.random() * (arr.length - 1));
      str += arr[pos];
    }
    return str;
  },
  getPropertyJsType: (property) => {
    return Object.prototype.toString.call(property);
  },
  messageSuccess: (param = {
    message: '成功'
  }) => {
    message.success(param.message, () => {});
  },
  messageError: (param = {
    message: '错误'
  }) => {
    message.error(param.message, () => {});
  },
  messageWarning: (param = {
    message: '警告'
  }) => {
    message.warning(param.message, () => {});
  },
  messageInfo: (param = {
    message: '信息'
  }) => {
    message.info(param.message, () => {});
  }
}

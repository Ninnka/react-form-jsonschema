export default {
  I64BIT_TABLE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split(''),
  createHash: (input) => {
    var hash = 5381;
    var i = input.length - 1;

    if(typeof input === 'string'){
      for (; i > -1; i--)
      hash += (hash << 5) + input.charCodeAt(i);
    }
    else{
      for (; i > -1; i--)
      hash += (hash << 5) + input[i];
    }
    var value = hash & 0x7FFFFFFF;

    var retValue = '';
    do {
      retValue += this.I64BIT_TABLE[value & 0x3F];
    }
    while(value >>= 6);

    return retValue;
  },
  createRandomId: () => {
    let str = '';
    let pos = null;
    const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let range = Math.round(Math.random() * (6 - 4)) + 4;
    for (var i = 0; i < range; i++) {
      pos = Math.round(Math.random() * (arr.length - 1));
      str += arr[pos];
    }
    return str;
  },
  getPropertyJsType: (property) => {
    return Object.prototype.toString.call(property);
  }
}

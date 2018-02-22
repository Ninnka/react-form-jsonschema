import React from 'react';

// * 功能库
import utilFunc from '@utils/functions';

const withCompuListHighOrder = (WrappedComponent) => {
  return class SchemaCreator extends React.Component {

    constructor () {
      super();
      this.propsHOC = {
        compuListPrepare: this.compuListPrepare,
        // compuOwnerList: this.compuOwnerList,
        // compuOwnerListObject: this.compuOwnerListObject,
        // compuOwnerListArray: this.compuOwnerListArray,
        // compuOwnerListHelper: this.compuOwnerListHelper,
        // compuDefList: this.compuDefList,
        // compuDefListObj: this.compuDefListObj,
        // compuDefListArray: this.compuDefListArray,
        // compuDefListPure: this.compuDefListPure
      }
    }

    state = {
      // objectList: [],
      // arrayList: [],
      // stringList: [],
      // numberList: [],
      // booleanList: []
    }

    propsHOC = {}

    // * ------------

    compuListPrepare = (props) => {
      // let tmpOwnerList = [];
      // if (props.properties) {
      //   tmpOwnerList = [{path: 'root', type: 'object'}].concat(this.compuOwnerList('root', props.properties));
      // } else if (props.jsonSchema && props.jsonSchema.type === 'array') {
      //   tmpOwnerList = this.compuOwnerListArray('', ['root', props.jsonSchema]);
      // }
      // let tmpDefList = [];
      // if (props.definitions) {
      //   tmpDefList = this.compuDefList('', props.definitions);
      // }
      // let tmpRefList = [];
      // for (let index = 0; index < tmpDefList.length; index++) {
      //   let tmpList = tmpDefList[index].path.split('~/~');
      //   if (tmpList.length > 0 && tmpList[tmpList.length - 1] !== 'definitions') {
      //     tmpRefList.push(tmpDefList[index]);
      //   }
      // }
      let res = this.compuSameTypeList();
      console.log('compuSameTypeList res:', res);
      return {
        // ownerList: tmpOwnerList,
        // defList: tmpDefList,
        // refList: tmpRefList,
        sameTypeListObj: res,
        ownerList: this.props.ownerList,
        defList: this.props.defList,
        refList: this.props.refList
      }
    }

    // compuOwnerList = (path, properties) => {
    //   let tmpOwnerList = [];
    //   let propertiesEntryList = Object.entries(properties);
    //   for (let item of propertiesEntryList) {
    //     if (item[1].type === 'object') {
    //       tmpOwnerList = tmpOwnerList.concat(this.compuOwnerListObject(path, item));
    //     } else if (item[1].type === 'array') {
    //       tmpOwnerList = tmpOwnerList.concat(this.compuOwnerListArray(path, item));
    //     }
    //   }
    //   return tmpOwnerList;
    // }

    // compuOwnerListObject = (path, item, exclude = false) => {
    //   let tmpOwnerList = [];
    //   !exclude && tmpOwnerList.push({
    //     path: (path + '~/~' + item[0]).replace(/(^~\/~)|(~\/~$)/g, ''),
    //     type: 'object'
    //   });
    //   tmpOwnerList = tmpOwnerList.concat(this.compuOwnerList(path + '~/~' + item[0], item[1].properties));
    //   return tmpOwnerList;
    // }

    // compuOwnerListArray = (path, item, exclude = false) => {
    //   let tmpOwnerList = [];
    //   let tmpPath = path + '~/~' + item[0];
    //   !exclude && tmpOwnerList.push({
    //     path: tmpPath.replace(/(^~\/~)|(~\/~$)/g, ''),
    //     type: 'array'
    //   });
    //   if (item[1].items && Object.prototype.toString.call(item[1].items).indexOf('Array') !== -1) {
    //     let len = item[1].items.length;
    //     for (let i = 0; i < len; i++) {
    //       let tarr = this.compuOwnerListHelper(tmpPath, ['items~/~' + i, item[1].items[i]]);
    //       tmpOwnerList = tmpOwnerList.concat(tarr);
    //     }
    //     if (item[1].additionalItems && item[1].additionalItems.type !== undefined) {
    //       let tarr = this.compuOwnerListHelper(tmpPath, ['additionalItems', item[1].additionalItems]);
    //       tmpOwnerList = tmpOwnerList.concat(tarr);
    //     }
    //   } else if (item[1].items && Object.prototype.toString.call(item[1].items).indexOf('Object') !== -1) {
    //     let tarr = this.compuOwnerListHelper(tmpPath, ['items', item[1].items]);
    //     tmpOwnerList = tmpOwnerList.concat(tarr);
    //   }
    //   return tmpOwnerList;
    // }

    // compuOwnerListHelper = (path, item) => {
    //   let tmpOwnerList = [];
    //   if (item[1].type === 'object') {
    //     tmpOwnerList = tmpOwnerList.concat(this.compuOwnerListObject(path, item));
    //   } else if (item[1].type === 'array') {
    //     tmpOwnerList = tmpOwnerList.concat(this.compuOwnerListArray(path, item));
    //   }
    //   return tmpOwnerList;
    // }

    // // * ------------

    // compuDefList = (path, item) => {
    //   // console.log('compuDefList');
    //   let tmpDefList = [];

    //   let prePath = path ? path + '~/~definitions' : 'definitions';
    //   tmpDefList.push({
    //     path: prePath,
    //     type: 'object'
    //   });

    //   let defEntriesList = Object.entries(item);
    //   // console.log('defEntriesList', defEntriesList);

    //   for (let item of defEntriesList) {
    //     let tmpPath = prePath + '~/~' + item[0];
    //     tmpDefList.push({
    //       path: tmpPath,
    //       type: 'object'
    //     });
    //     tmpDefList = this.compuDefListPure(tmpPath, item[1], tmpDefList);
    //   }
    //   return tmpDefList;
    // }

    // compuDefListObj = (path, param) => {
    //   console.log('compuDefListObj');
    //   let tmpDefList = [];

    //   let prePath = path ? path + '~/~definitions' : 'definitions';
    //   let tmpPath = prePath + '~/~' + param.key;
    //   console.log('tmpPath', tmpPath);
    //   tmpDefList.push({
    //     path: tmpPath,
    //     type: 'object'
    //   });
    //   tmpDefList = this.compuDefListPure(tmpPath, param.item, tmpDefList);
    //   return tmpDefList;
    // }

    // compuDefListArray = (path, item) => {
    //   console.log('compuDefListArray');
    //   let tmpDefList = [];

    //   let prePath = path + '~/~items';
    //   let len = item.length;
    //   for (let i = 0; i < len; i++) {
    //     let tmpPath = prePath + '~/~' + i;
    //     tmpDefList.push({
    //       path: tmpPath,
    //       type: 'object'
    //     });
    //     console.log('item[i]', item[i]);
    //     tmpDefList = this.compuDefListPure(tmpPath, item[i], tmpDefList);
    //   }
    //   return tmpDefList;
    // }

    // compuDefListPure = (path, item, list) => {
    //   let tmpDefList = list;
    //   let tmpPath = path;
    //   let tmpItem = item;

    //   if (tmpItem.definitions) {
    //     tmpDefList = tmpDefList.concat(this.compuDefList(tmpPath, tmpItem.definitions));
    //   }
    //   if (tmpItem.properties && Object.keys(tmpItem.properties).length > 0) {
    //     tmpDefList = tmpDefList.concat(this.compuDefList(tmpPath, tmpItem.properties));
    //   }
    //   if (tmpItem.items && utilFunc.getPropertyJsType(tmpItem.items).indexOf('Object') !== -1) {
    //     tmpDefList = tmpDefList.concat(this.compuDefListObj(tmpPath, {key: 'items', item: tmpItem.items}));
    //   }
    //   if (tmpItem.items && utilFunc.getPropertyJsType(tmpItem.items).indexOf('Array') !== -1 && tmpItem.items.length > 0) {
    //     tmpDefList = tmpDefList.concat(this.compuDefListArray(tmpPath, tmpItem.items));
    //   }
    //   if (tmpItem.additionalItems && utilFunc.getPropertyJsType(tmpItem.additionalItems).indexOf('Object') !== -1) {
    //     tmpDefList = tmpDefList.concat(this.compuDefListObj(tmpPath, {key: 'additionalItems', item: tmpItem.additionalItems}));
    //   }
    //   return tmpDefList;
    // }

    // * ------------

    compuSameTypeList = (item) => {
      let tmpListCol = {
        tmpObjectList: [],
        tmpArrayList: [],
        tmpStringList: [],
        tmpNumberList: [],
        tmpBooleanList: []
      };
      let res = this.compuSameTypeListByType(this.props.jsonSchema);
      tmpListCol.tmpObjectList = tmpListCol.tmpObjectList.concat(res.tmpObjectList);
      tmpListCol.tmpArrayList = tmpListCol.tmpArrayList.concat(res.tmpArrayList);
      tmpListCol.tmpStringList = tmpListCol.tmpStringList.concat(res.tmpStringList);
      tmpListCol.tmpNumberList = tmpListCol.tmpNumberList.concat(res.tmpNumberList);
      tmpListCol.tmpBooleanList = tmpListCol.tmpBooleanList.concat(res.tmpBooleanList);
      return tmpListCol;
    }

    compuSameTypeListFromObject = (data) => {
      let tmpListCol = {
        tmpObjectList: [],
        tmpArrayList: [],
        tmpStringList: [],
        tmpNumberList: [],
        tmpBooleanList: []
      };
      if (data.properties && Object.keys(data.properties).length > 0) {
        let propsList = Object.entries(data.properties);
        for (let item of propsList) {
          let res = this.compuSameTypeListByType(item[1]);
          tmpListCol.tmpObjectList = tmpListCol.tmpObjectList.concat(res.tmpObjectList);
          tmpListCol.tmpArrayList = tmpListCol.tmpArrayList.concat(res.tmpArrayList);
          tmpListCol.tmpStringList = tmpListCol.tmpStringList.concat(res.tmpStringList);
          tmpListCol.tmpNumberList = tmpListCol.tmpNumberList.concat(res.tmpNumberList);
          tmpListCol.tmpBooleanList = tmpListCol.tmpBooleanList.concat(res.tmpBooleanList);
        }
      }
      return tmpListCol;
    }

    compuSameTypeListFromArray = (data) => {
      let tmpListCol = {
        tmpObjectList: [],
        tmpArrayList: [],
        tmpStringList: [],
        tmpNumberList: [],
        tmpBooleanList: []
      };
      if (data.items && utilFunc.getPropertyJsType(data.items).indexOf('Array') !== -1 && data.items.length > 0) {
        // * 如果items是数组并且长度大于0
        let tmpLen = data.items.length;
        for (let i = 0; i < tmpLen; i++) {
          console.log('data.items[i]', data.items[i]);
          let res = this.compuSameTypeListByType(data.items[i], {
            itemsArray: true,
            idx: i
          });
          tmpListCol.tmpObjectList = tmpListCol.tmpObjectList.concat(res.tmpObjectList);
          tmpListCol.tmpArrayList = tmpListCol.tmpArrayList.concat(res.tmpArrayList);
          tmpListCol.tmpStringList = tmpListCol.tmpStringList.concat(res.tmpStringList);
          tmpListCol.tmpNumberList = tmpListCol.tmpNumberList.concat(res.tmpNumberList);
          tmpListCol.tmpBooleanList = tmpListCol.tmpBooleanList.concat(res.tmpBooleanList);
        }
        // * 判断是否有additionalItems
        if (data.additionalItems && utilFunc.getPropertyJsType(data.additionalItems).indexOf('Object') !== -1 && data.additionalItems.type) {
          let res = this.compuSameTypeListByType(data.additionalItems, {
            additionalItemsObject: true
          });
          tmpListCol.tmpObjectList = tmpListCol.tmpObjectList.concat(res.tmpObjectList);
          tmpListCol.tmpArrayList = tmpListCol.tmpArrayList.concat(res.tmpArrayList);
          tmpListCol.tmpStringList = tmpListCol.tmpStringList.concat(res.tmpStringList);
          tmpListCol.tmpNumberList = tmpListCol.tmpNumberList.concat(res.tmpNumberList);
          tmpListCol.tmpBooleanList = tmpListCol.tmpBooleanList.concat(res.tmpBooleanList);
        }
      } else if (data.items && utilFunc.getPropertyJsType(data.items).indexOf('Object') !== -1) {
        let res = this.compuSameTypeListByType(data.items, {
          itemsObject: true
        });
        tmpListCol.tmpObjectList = tmpListCol.tmpObjectList.concat(res.tmpObjectList);
        tmpListCol.tmpArrayList = tmpListCol.tmpArrayList.concat(res.tmpArrayList);
        tmpListCol.tmpStringList = tmpListCol.tmpStringList.concat(res.tmpStringList);
        tmpListCol.tmpNumberList = tmpListCol.tmpNumberList.concat(res.tmpNumberList);
        tmpListCol.tmpBooleanList = tmpListCol.tmpBooleanList.concat(res.tmpBooleanList);
      }
      return tmpListCol;
    }

    compuSameTypeListByType = (item, options = {}) => {
      let tmpListCol = {
        tmpObjectList: [],
        tmpArrayList: [],
        tmpStringList: [],
        tmpNumberList: [],
        tmpBooleanList: []
      };
      let res = null;

      let tmpItem = {
        ...item
      };

      let selfPath = '';
      options.itemsArray && (selfPath = this.getItemsArrSchemaMemberSelfPath(item, options.idx));
      options.itemsObject && (selfPath = this.getItemsObjSchemaMemberSelfPath(item));
      options.additionalItemsObject && (selfPath = this.getadditionalItemsObjSchemaMemberSelfPath(item));
      selfPath && (tmpItem.selfPath = selfPath);

      let uis = this.props.getPropertiesUISchema(tmpItem);
      tmpItem.ui = uis ? uis : {};

      switch (item.type) {
        case 'object':
          tmpListCol.tmpObjectList.push(tmpItem);
          console.log('object tmpObject', tmpItem);
          res = this.compuSameTypeListFromObject(item);
          break;
        case 'array':
          tmpListCol.tmpArrayList.push(tmpItem);
          res = this.compuSameTypeListFromArray(item);
          break;
        case 'string':
          tmpListCol.tmpStringList.push(tmpItem);
          break;
        case 'number':
          tmpListCol.tmpNumberList.push(tmpItem);
          break;
        case 'boolean':
          tmpListCol.tmpBooleanList.push(tmpItem);
          break;
        default:
          break;
      }
      if (res) {
        tmpListCol.tmpObjectList = tmpListCol.tmpObjectList.concat(res.tmpObjectList);
        tmpListCol.tmpArrayList = tmpListCol.tmpArrayList.concat(res.tmpArrayList);
        tmpListCol.tmpStringList = tmpListCol.tmpStringList.concat(res.tmpStringList);
        tmpListCol.tmpNumberList = tmpListCol.tmpNumberList.concat(res.tmpNumberList);
        tmpListCol.tmpBooleanList = tmpListCol.tmpBooleanList.concat(res.tmpBooleanList);
      }
      console.log('tmpListCol', tmpListCol);
      return tmpListCol;
    }

    // * 如果是是在type为array类型的成员的子成员，固定key为items，items是数组
    getItemsArrSchemaMemberSelfPath = (item, i) => {
      return item.owner + '~/~items~/~' + i
    }

    // * 如果是是在type为array类型的成员的子成员，固定key为items，items是对象
    getItemsObjSchemaMemberSelfPath = (item) => {
      return item.owner + '~/~items'
    }

    // * 如果是是在type为array类型的成员的子成员，固定key为additionalItems，additionalItems是对象
    getadditionalItemsObjSchemaMemberSelfPath = (item) => {
      return item.owner + '~/~additionalItems'
    }

    // * ------------

    render () {
      return (
        <WrappedComponent { ...this.propsHOC } { ...this.props } />
      )
    }
  }
}

export default withCompuListHighOrder;

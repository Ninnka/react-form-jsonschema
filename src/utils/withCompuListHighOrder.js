import React from 'react';

// * 功能库
import utilFunc from '@utils/functions';

const withCompuListHighOrder = (WrappedComponent) => {
  return class SchemaCreator extends React.Component {

    constructor () {
      super();
      this.propsHOC = {
        compuListPrepare: this.compuListPrepare,
        compuOwnerList: this.compuOwnerList,
        compuOwnerListObject: this.compuOwnerListObject,
        compuOwnerListArray: this.compuOwnerListArray,
        compuOwnerListHelper: this.compuOwnerListHelper,
        compuDefList: this.compuDefList,
        compuDefListObj: this.compuDefListObj,
        compuDefListArray: this.compuDefListArray,
        compuDefListPure: this.compuDefListPure
      }
    }

    state = {}

    propsHOC = {}

    // * ------------

    compuListPrepare = (props) => {
      let tmpOwnerList = [];
      if (props.properties) {
        tmpOwnerList = [{path: 'root', type: 'object'}].concat(this.compuOwnerList('root', props.properties));
      } else if (props.jsonSchema && props.jsonSchema.type === 'array') {
        tmpOwnerList = this.compuOwnerListArray('', ['root', props.jsonSchema]);
      }
      let tmpDefList = [];
      if (props.definitions) {
        tmpDefList = this.compuDefList('', props.definitions);
      }
      let tmpRefList = [];
      for (let index = 0; index < tmpDefList.length; index++) {
        let tmpList = tmpDefList[index].path.split('~/~');
        if (tmpList.length > 0 && tmpList[tmpList.length - 1] !== 'definitions') {
          tmpRefList.push(tmpDefList[index]);
        }
      }
      return {
        ownerList: tmpOwnerList,
        defList: tmpDefList,
        refList: tmpRefList
      }
    }

    compuOwnerList = (path, properties) => {
      let tmpOwnerList = [];
      let propertiesEntryList = Object.entries(properties);
      for (let item of propertiesEntryList) {
        if (item[1].type === 'object') {
          tmpOwnerList = tmpOwnerList.concat(this.compuOwnerListObject(path, item));
        } else if (item[1].type === 'array') {
          tmpOwnerList = tmpOwnerList.concat(this.compuOwnerListArray(path, item));
        }
      }
      return tmpOwnerList;
    }

    compuOwnerListObject = (path, item, exclude = false) => {
      let tmpOwnerList = [];
      !exclude && tmpOwnerList.push({
        path: (path + '~/~' + item[0]).replace(/(^~\/~)|(~\/~$)/g, ''),
        type: 'object'
      });
      tmpOwnerList = tmpOwnerList.concat(this.compuOwnerList(path + '~/~' + item[0], item[1].properties));
      return tmpOwnerList;
    }

    compuOwnerListArray = (path, item, exclude = false) => {
      let tmpOwnerList = [];
      let tmpPath = path + '~/~' + item[0];
      !exclude && tmpOwnerList.push({
        path: tmpPath.replace(/(^~\/~)|(~\/~$)/g, ''),
        type: 'array'
      });
      if (item[1].items && Object.prototype.toString.call(item[1].items).indexOf('Array') !== -1) {
        let len = item[1].items.length;
        for (let i = 0; i < len; i++) {
          let tarr = this.compuOwnerListHelper(tmpPath, ['items~/~' + i, item[1].items[i]]);
          tmpOwnerList = tmpOwnerList.concat(tarr);
        }
        if (item[1].additionalItems && item[1].additionalItems.type !== undefined) {
          let tarr = this.compuOwnerListHelper(tmpPath, ['additionalItems', item[1].additionalItems]);
          tmpOwnerList = tmpOwnerList.concat(tarr);
        }
      } else if (item[1].items && Object.prototype.toString.call(item[1].items).indexOf('Object') !== -1) {
        let tarr = this.compuOwnerListHelper(tmpPath, ['items', item[1].items]);
        tmpOwnerList = tmpOwnerList.concat(tarr);
      }
      return tmpOwnerList;
    }

    compuOwnerListHelper = (path, item) => {
      let tmpOwnerList = [];
      if (item[1].type === 'object') {
        tmpOwnerList = tmpOwnerList.concat(this.compuOwnerListObject(path, item));
      } else if (item[1].type === 'array') {
        tmpOwnerList = tmpOwnerList.concat(this.compuOwnerListArray(path, item));
      }
      return tmpOwnerList;
    }

    // * ------------

    compuDefList = (path, item) => {
      // console.log('compuDefList');
      let tmpDefList = [];

      let prePath = path ? path + '~/~definitions' : 'definitions';
      tmpDefList.push({
        path: prePath,
        type: 'object'
      });

      let defEntriesList = Object.entries(item);
      // console.log('defEntriesList', defEntriesList);

      for (let item of defEntriesList) {
        let tmpPath = prePath + '~/~' + item[0];
        tmpDefList.push({
          path: tmpPath,
          type: 'object'
        });
        tmpDefList = this.compuDefListPure(tmpPath, item[1], tmpDefList);
      }
      return tmpDefList;
    }

    compuDefListObj = (path, param) => {
      console.log('compuDefListObj');
      let tmpDefList = [];

      let prePath = path ? path + '~/~definitions' : 'definitions';
      let tmpPath = prePath + '~/~' + param.key;
      console.log('tmpPath', tmpPath);
      tmpDefList.push({
        path: tmpPath,
        type: 'object'
      });
      tmpDefList = this.compuDefListPure(tmpPath, param.item, tmpDefList);
      return tmpDefList;
    }

    compuDefListArray = (path, item) => {
      console.log('compuDefListArray');
      let tmpDefList = [];

      let prePath = path + '~/~items';
      let len = item.length;
      for (let i = 0; i < len; i++) {
        let tmpPath = prePath + '~/~' + i;
        tmpDefList.push({
          path: tmpPath,
          type: 'object'
        });
        console.log('item[i]', item[i]);
        tmpDefList = this.compuDefListPure(tmpPath, item[i], tmpDefList);
      }
      return tmpDefList;
    }

    compuDefListPure = (path, item, list) => {
      let tmpDefList = list;
      let tmpPath = path;
      let tmpItem = item;

      if (tmpItem.definitions) {
        tmpDefList = tmpDefList.concat(this.compuDefList(tmpPath, tmpItem.definitions));
      }
      if (tmpItem.properties && Object.keys(tmpItem.properties).length > 0) {
        tmpDefList = tmpDefList.concat(this.compuDefList(tmpPath, tmpItem.properties));
      }
      if (tmpItem.items && utilFunc.getPropertyJsType(tmpItem.items).indexOf('Object') !== -1) {
        tmpDefList = tmpDefList.concat(this.compuDefListObj(tmpPath, {key: 'items', item: tmpItem.items}));
      }
      if (tmpItem.items && utilFunc.getPropertyJsType(tmpItem.items).indexOf('Array') !== -1 && tmpItem.items.length > 0) {
        tmpDefList = tmpDefList.concat(this.compuDefListArray(tmpPath, tmpItem.items));
      }
      if (tmpItem.additionalItems && utilFunc.getPropertyJsType(tmpItem.additionalItems).indexOf('Object') !== -1) {
        tmpDefList = tmpDefList.concat(this.compuDefListObj(tmpPath, {key: 'additionalItems', item: tmpItem.additionalItems}));
      }
      return tmpDefList;
    }

    render () {
      return (
        <WrappedComponent { ...this.propsHOC } { ...this.props }></WrappedComponent>
      )
    }
  }
}

export default withCompuListHighOrder;

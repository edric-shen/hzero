/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */
/* eslint-disable func-names */
import mapValues from 'lodash/mapValues';
import { Map } from 'immutable';
import React from 'react';

export const SELECT_WIDTH_OFFSET_RIGHT = 48;
const DEFAULT_FONT_SIZE = '14px';
const DEFAULT_FONT_FAMILY = "'Helvetica Neue', Helvetica, Arial, sans-serif";

// RegExp.quote = function (str) {
//     return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
// };

export const defaultValue = (value, _default) => {
  return typeof value === 'undefined' ? _default : value;
};

export const bindActionCreators = (actionCreators, config, dispatch) =>
  mapValues(actionCreators, (actionCreator) => (...args) =>
    dispatch(actionCreator(config, ...args))
  );

export const calcTextWidth = function (
  str,
  fontFamily = DEFAULT_FONT_FAMILY,
  fontSize = DEFAULT_FONT_SIZE
) {
  let div = document.createElement('div');
  div.innerHTML = str;
  const css = {
    position: 'absolute',
    float: 'left',
    'white-space': 'nowrap',
    visibility: 'hidden',
    'font-size': fontSize,
    'font-family': fontFamily,
  };
  for (const k in css) {
    div.style[k] = css[k];
  }
  div = document.body.appendChild(div);
  const w = div.offsetWidth;
  document.body.removeChild(div);
  return w;
};

export const truncateString = (str, n, useWordBoundary) => {
  if (!n || str.length <= n) {
    return str;
  }
  const subString = str.substr(0, n - 1);
  return `${useWordBoundary ? subString.substr(0, subString.lastIndexOf(' ')) : subString}...`;
};

export const BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  bottomRight: {
    points: ['tr', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topRight: {
    points: ['br', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
};

export const immutableEqual = function (v1, v2) {
  if (v1 === v2) {
    return true;
  } else {
    return v1.equals(v2);
  }
};

export const deepEqual = function (v1, v2) {
  if (v1 === v2) {
    return true;
  } else if (Map.isMap(v1)) {
    return v1.equals(v2);
  } else {
    return JSON.stringify(v1) === JSON.stringify(v2);
  }
};

// Do sets have same values?
export const eqSet = function (as, bs) {
  if (as.size !== bs.size) return false;
  for (const a of as) if (!bs.has(a)) return false;
  return true;
};

// Do arrays have same values?
export const eqArrSet = function (arr1, arr2) {
  return eqSet(new Set(arr1), new Set(arr2));
};

export const shallowEqual = (a, b, deep = false) => {
  if (a === b) {
    return true;
  } else if (Array.isArray(a)) return shallowEqualArrays(a, b, deep);
  else if (Map.isMap(a)) return a.equals(b);
  else if (typeof a === 'object') return shallowEqualObjects(a, b, deep);
  else return a === b;
};

function shallowEqualArrays(arrA, arrB, deep = false) {
  if (arrA === arrB) {
    return true;
  }

  if (!arrA || !arrB) {
    return false;
  }

  const len = arrA.length;

  if (arrB.length !== len) {
    return false;
  }

  for (let i = 0; i < len; i++) {
    const isEqual = deep ? shallowEqual(arrA[i], arrB[i]) : arrA[i] === arrB[i];
    if (!isEqual) {
      return false;
    }
  }

  return true;
}

function shallowEqualObjects(objA, objB, deep = false) {
  if (objA === objB) {
    return true;
  }

  if (!objA || !objB) {
    return false;
  }

  const aKeys = Object.keys(objA);
  const bKeys = Object.keys(objB);
  const len = aKeys.length;

  if (bKeys.length !== len) {
    return false;
  }

  for (let i = 0; i < len; i++) {
    const key = aKeys[i];
    const isEqual = deep ? shallowEqual(objA[key], objB[key], deep) : objA[key] === objB[key];
    if (!isEqual) {
      return false;
    }
  }

  return true;
}

export const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&'); // $& means the whole matched string
};

const canUseUnsafe = () => {
  const v = React.version.split('.').map(parseInt.bind(null, 10));
  return v[0] >= 16 && v[1] >= 3;
};

export const useOnPropsChanged = (obj) => {
  if (canUseUnsafe) {
    obj.UNSAFE_componentWillReceiveProps = (nextProps) => {
      obj.onPropsChanged(nextProps);
    };
  } else {
    obj.componentWillReceiveProps = (nextProps) => {
      obj.onPropsChanged(nextProps);
    };
  }
};

const isObject = (v) => typeof v === 'object' && v !== null;
const listValue = (v, title) =>
  isObject(v) ? v : { value: v, title: title !== undefined ? title : v };

// convert {<value>: <title>, ..} or [value, ..] to normal [{value, title}, ..]
const listValuesToArray = (listValuesObj) => {
  if (!isObject(listValuesObj)) return listValuesObj;
  if (Array.isArray(listValuesObj)) return listValuesObj.map((v) => listValue(v));

  const listValuesArr = [];
  for (const v in listValuesObj) {
    const title = listValuesObj[v];
    listValuesArr.push(listValue(v, title));
  }
  return listValuesArr;
};

// listValues can be {<value>: <title>, ..} or [{value, title}, ..] or [value, ..]
export const getItemInListValues = (listValues, value) => {
  if (Array.isArray(listValues)) {
    const values = listValues.map((v) => listValue(v));
    return values.find((v) => v.value === value) || values.find((v) => `${v.value}` === value);
  } else {
    return listValues[value] !== undefined ? listValue(value, listValues[value]) : undefined;
  }
};

export const getTitleInListValues = (listValues, value) => {
  const it = getItemInListValues(listValues, value);
  return it !== undefined ? it.title : undefined;
};

export const getValueInListValues = (listValues, value) => {
  const it = getItemInListValues(listValues, value);
  return it !== undefined ? it.value : undefined;
};

export const mapListValues = (listValues, fun) => {
  const ret = [];
  if (Array.isArray(listValues)) {
    for (const v of listValues) {
      ret.push(fun(listValue(v)));
    }
  } else {
    for (const value in listValues) {
      ret.push(fun(listValue(value, listValues[value])));
    }
  }
  return ret;
};

export const defaultTreeDataMap = { id: 'value', pId: 'parent', rootPId: undefined };

// converts from treeData to treeDataSimpleMode format (https://ant.design/components/tree-select/)
// ! modifies value of `treeData`
export const flatizeTreeData = (treeData) => {
  const tdm = defaultTreeDataMap;

  let rind;
  let len;

  const _flatize = (node, root, lev) => {
    if (node.children) {
      if (lev === 1) node[tdm.pId] = tdm.rootPId; // optional?
      const childrenCount = node.children.length;
      for (const c of node.children) {
        c[tdm.pId] = node[tdm.id];
        rind++;
        root.splice(rind, 0, c); // instead of just push
        len++;
        _flatize(c, root, lev + 1);
      }
      delete node.children;
      if (childrenCount === 0) {
        root.splice(rind, 1);
        rind--;
        len--;
      }
    }
  };

  if (Array.isArray(treeData)) {
    len = treeData.length;
    for (rind = 0; rind < len; rind++) {
      const c = treeData[rind];
      if (!isObject(c)) continue;
      if (c[tdm.pId] !== undefined && c[tdm.pId] !== tdm.rootPId) continue; // not lev 1
      _flatize(c, treeData, 1);
    }
  }

  return treeData;
};

const getPathInListValues = (listValues, value) => {
  const tdm = defaultTreeDataMap;
  const it = getItemInListValues(listValues, value);
  const parentId = it ? it[tdm.pId] : undefined;
  const parent = parentId ? listValues.find((v) => v[tdm.id] === parentId) : undefined;
  return parent ? [parent.value, ...getPathInListValues(listValues, parent.value)] : [];
};

const getChildrenInListValues = (listValues, value) => {
  const tdm = defaultTreeDataMap;
  const it = getItemInListValues(listValues, value);
  return it ? listValues.filter((v) => v[tdm.pId] === it[tdm.id]).map((v) => v.value) : [];
};

// ! modifies value of `treeData`
const extendTreeData = (treeData, fieldSettings, isMulti) => {
  for (const node of treeData) {
    node.path = getPathInListValues(treeData, node.value);
    if (fieldSettings.treeSelectOnlyLeafs !== false) {
      const childrenValues = getChildrenInListValues(treeData, node.value);
      if (!isMulti) {
        node.selectable = childrenValues.length === 0;
      }
    }
  }
  return treeData;
};

export const normalizeListValues = (listValues, type, fieldSettings) => {
  const isTree = ['treeselect', 'treemultiselect'].includes(type);
  const isMulti = ['multiselect', 'treemultiselect'].includes(type);
  if (isTree) {
    listValues = listValuesToArray(listValues);
    listValues = flatizeTreeData(listValues);
    listValues = extendTreeData(listValues, fieldSettings, isMulti);
  }
  return listValues;
};

export const removePrefixPath = (selectedPath, parentPath) => {
  if (!selectedPath) return selectedPath;
  let isPrefix = true;
  for (let i = 0; i < parentPath.length; i++) {
    const part = parentPath[i];
    if (selectedPath[i] !== undefined && part === selectedPath[i]) {
      // ok
    } else {
      isPrefix = false;
      break;
    }
  }
  return isPrefix ? selectedPath.slice(parentPath.length) : selectedPath;
};

import _ from 'lodash';

export function isIncluded(val: any, cover: Array<any>) {
  return cover.includes(val);
}

export function isAllKeyIncluded(obj: object, cover: Array<string>) {
  if (_.isArray(obj))
    return obj.every(x => Object.keys(x).every(x => cover.includes(x)));
  else
    return Object.keys(obj).every(x => cover.includes(x));
}

export function isExistsAnd(val: unknown, type: string) {
  return _.isUndefined(val) || typeof val === type;
}

export function isAllString(obj: object | undefined | Array<string>, keyOrVal: 'k' | 'v') {
  return _.every(obj, (v, k) => keyOrVal === 'k' ? _.isString(k) : _.isString(v));
}

export function isAllStringFromArray(ary: Array<object>, keyOrVal: 'k' | 'v') {
  return ary.every(x => isAllString(x, keyOrVal));
}

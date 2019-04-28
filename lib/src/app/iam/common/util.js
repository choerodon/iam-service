'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isEmpty2 = require('lodash/isEmpty');

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

exports.handleFiltersParams = handleFiltersParams;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 判断params和filters中是否含有特殊字符
 * @param params 表格params
 * @param filters 表格filters
 * @returns {*}
 *
 * 如果加了其他的方法就把下面这条eslint删了
 */
/* eslint-disable-next-line */
function handleFiltersParams(params, filters) {
  /* eslint-disable-next-line */
  var pattern = new RegExp(/[\{\}\|\^\`\\]/g);
  var targetParams = params.find(function (item) {
    return pattern.test(item);
  });
  var targetfilters = Object.values(filters).find(function (item) {
    return !(0, _isEmpty3['default'])(item) && pattern.test(item[0]);
  });
  return targetParams || targetfilters;
}
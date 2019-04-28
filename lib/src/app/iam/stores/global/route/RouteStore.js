'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _class; /**
                   * Created by hulingfangzi on 2018/5/28.
                   */


var _mobx = require('mobx');

var _choerodonBootCombine = require('choerodon-boot-combine');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var RouteStore = (_dec = (0, _choerodonBootCombine.store)('RouteStore'), _dec(_class = function RouteStore() {
  (0, _classCallCheck3['default'])(this, RouteStore);
}) || _class);


var routeStore = new RouteStore();

exports['default'] = routeStore;
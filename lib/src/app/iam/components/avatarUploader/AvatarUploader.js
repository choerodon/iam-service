'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _upload = require('choerodon-ui/lib/upload');

var _upload2 = _interopRequireDefault(_upload);

var _dec, _class, _class2, _temp2; /**
                                    * 裁剪头像上传
                                    */

require('choerodon-ui/lib/modal/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/upload/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIntl = require('react-intl');

var _mobxReact = require('mobx-react');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

require('./AvatarUploader.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Dragger = _upload2['default'].Dragger;
var round = Math.round;

var editorWidth = 540;
var editorHeight = 300;
var defaultRectSize = 200;
var minRectSize = 80;
var prefixClas = 'c7n-iam-avatar-edit';
var limitSize = 1024;
var relativeX = 0;
var relativeY = 0;
var resizeMode = void 0;
var resizeX = 0;
var resizeY = 0;
var resizeSize = 0;

function rotateFlag(rotate) {
  return rotate / 90 % 2 !== 0;
}

var AvatarUploader = (_dec = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactIntl.injectIntl)(_class = (_temp2 = _class2 = function (_Component) {
  (0, _inherits3['default'])(AvatarUploader, _Component);

  function AvatarUploader() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, AvatarUploader);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = AvatarUploader.__proto__ || Object.getPrototypeOf(AvatarUploader)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      submitting: false,
      img: null,
      file: null,
      size: defaultRectSize,
      x: 0,
      y: 0,
      rotate: 0
    }, _this.handleOk = function () {
      var _this$state = _this.state,
          x = _this$state.x,
          y = _this$state.y,
          size = _this$state.size,
          rotate = _this$state.rotate,
          file = _this$state.file,
          _this$state$imageStyl = _this$state.imageStyle,
          width = _this$state$imageStyl.width,
          height = _this$state$imageStyl.height,
          _this$state$img = _this$state.img,
          naturalWidth = _this$state$img.naturalWidth,
          naturalHeight = _this$state$img.naturalHeight;

      var flag = rotateFlag(rotate);
      var scale = naturalWidth / width;
      var startX = flag ? x - (width - height) / 2 : x;
      var startY = flag ? y + (width - height) / 2 : y;
      var qs = _queryString2['default'].stringify({
        rotate: rotate,
        startX: round(startX * scale),
        startY: round(startY * scale),
        endX: round(size * scale),
        endY: round(size * scale)
      });
      var data = new FormData();
      data.append('file', file);
      _this.setState({ submitting: true });
      _choerodonBootCombine.axios.post('/file/v1/cut_image?' + qs, data).then(function (res) {
        if (res.failed) {
          Choerodon.prompt(res.message);
          _this.setState({ submitting: false });
        } else {
          _this.uploadOk(res);
        }
      })['catch'](function (error) {
        Choerodon.handleResponseError(error);
        _this.setState({ submitting: false });
      });
    }, _this.handleCancel = function () {
      _this.close();
    }, _this.handleMoveStart = function (_ref2) {
      var clientX = _ref2.clientX,
          clientY = _ref2.clientY;
      var _this$state2 = _this.state,
          x = _this$state2.x,
          y = _this$state2.y;

      relativeX = clientX - x;
      relativeY = clientY - y;
      document.addEventListener('mousemove', _this.handleMoving);
      document.addEventListener('mouseup', _this.handleMoveEnd);
    }, _this.handleMoving = function (_ref3) {
      var clientX = _ref3.clientX,
          clientY = _ref3.clientY;
      var _this$state3 = _this.state,
          size = _this$state3.size,
          _this$state3$imageSty = _this$state3.imageStyle,
          width = _this$state3$imageSty.width,
          height = _this$state3$imageSty.height,
          rotate = _this$state3.rotate;

      var flag = rotateFlag(rotate);
      var minX = flag ? (width - height) / 2 : 0;
      var minY = flag ? (height - width) / 2 : 0;
      var maxX = width - size - minX;
      var maxY = height - size - minY;
      _this.setState({
        x: Math.min(Math.max(minX, clientX - relativeX), maxX),
        y: Math.min(Math.max(minY, clientY - relativeY), maxY)
      });
    }, _this.handleMoveEnd = function () {
      document.removeEventListener('mousemove', _this.handleMoving);
      document.removeEventListener('mouseup', _this.handleMoveEnd);
    }, _this.handleResizeStart = function (e) {
      e.stopPropagation();
      var currentTarget = e.currentTarget,
          clientX = e.clientX,
          clientY = e.clientY;
      var _this$state4 = _this.state,
          x = _this$state4.x,
          y = _this$state4.y,
          size = _this$state4.size;

      relativeX = clientX - x;
      relativeY = clientY - y;
      resizeMode = currentTarget.className;
      resizeX = x;
      resizeY = y;
      resizeSize = size;
      document.addEventListener('mousemove', _this.handleResizing);
      document.addEventListener('mouseup', _this.handleResizeEnd);
    }, _this.handleResizing = function (_ref4) {
      var clientX = _ref4.clientX,
          clientY = _ref4.clientY;
      var _this$state5 = _this.state,
          _this$state5$imageSty = _this$state5.imageStyle,
          width = _this$state5$imageSty.width,
          height = _this$state5$imageSty.height,
          rotate = _this$state5.rotate;

      var flag = rotateFlag(rotate);
      var newX = clientX - relativeX;
      var newY = clientY - relativeY;
      var x = resizeX;
      var y = resizeY;
      var size = void 0;
      if (resizeMode === 'lt') {
        var relative = Math.min(newX - resizeX, newY - resizeY);
        x += relative;
        y += relative;
        size = resizeSize - x + resizeX;
      } else if (resizeMode === 'rt') {
        var _relative = Math.min(resizeX - newX, newY - resizeY);
        y += _relative;
        size = resizeSize - y + resizeY;
      } else if (resizeMode === 'lb') {
        var _relative2 = Math.min(newX - resizeX, resizeY - newY);
        x += _relative2;
        size = resizeSize - x + resizeX;
      } else {
        var _relative3 = Math.min(resizeX - newX, resizeY - newY);
        size = resizeSize - _relative3;
      }
      var minX = flag ? (width - height) / 2 : 0;
      var minY = flag ? (height - width) / 2 : 0;
      var maxWidth = flag ? (width - height) / 2 + height : width;
      var maxHeight = flag ? (height - width) / 2 + width : height;
      x = Math.min(Math.max(minX, x), resizeSize - minRectSize + resizeX);
      y = Math.min(Math.max(minY, y), resizeSize - minRectSize + resizeY);
      _this.setState({
        x: x,
        y: y,
        size: Math.max(Math.min(size, maxWidth - x, maxHeight - y), minRectSize)
      });
    }, _this.handleResizeEnd = function () {
      document.removeEventListener('mousemove', _this.handleResizing);
      document.removeEventListener('mouseup', _this.handleResizeEnd);
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(AvatarUploader, [{
    key: 'close',
    value: function close() {
      this.setState({
        img: null
      });
      this.props.onVisibleChange(false);
    }
  }, {
    key: 'uploadOk',
    value: function uploadOk(res) {
      var _this2 = this;

      this.setState({
        img: null,
        submitting: false
      }, function () {
        _this2.props.onUploadOk(res);
      });
    }
  }, {
    key: 'initImageSize',
    value: function initImageSize(img) {
      var rotate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var naturalWidth = img.naturalWidth,
          naturalHeight = img.naturalHeight;

      var flag = rotateFlag(rotate);
      var width = flag ? naturalHeight : naturalWidth;
      var height = flag ? naturalWidth : naturalHeight;
      if (width < minRectSize || height < minRectSize) {
        if (width > height) {
          width = width / height * minRectSize;
          height = minRectSize;
        } else {
          height = height / width * minRectSize;
          width = minRectSize;
        }
      } else if (width > editorWidth || height > editorHeight) {
        if (width / editorWidth > height / editorHeight) {
          height = height / width * editorWidth;
          width = editorWidth;
        } else {
          width = width / height * editorHeight;
          height = editorHeight;
        }
      }
      if (flag) {
        var tmp = width;
        width = height;
        height = tmp;
      }
      var size = Math.min(defaultRectSize, width, height);
      this.setState({
        img: img,
        imageStyle: {
          width: width,
          height: height,
          top: (editorHeight - height) / 2,
          left: (editorWidth - width) / 2,
          transform: 'rotate(' + rotate + 'deg)'
        },
        size: size,
        x: (width - size) / 2,
        y: (height - size) / 2,
        rotate: rotate
      });
    }
  }, {
    key: 'loadImage',
    value: function loadImage(src) {
      var _this3 = this;

      var img = new Image();
      img.src = src;
      img.onload = function () {
        _this3.initImageSize(img);
      };
    }
  }, {
    key: 'getPreviewProps',
    value: function getPreviewProps(previewSize) {
      var _state = this.state,
          size = _state.size,
          x = _state.x,
          y = _state.y,
          src = _state.img.src,
          rotate = _state.rotate,
          _state$imageStyle = _state.imageStyle,
          width = _state$imageStyle.width,
          height = _state$imageStyle.height;

      var previewScale = previewSize / size;
      var radius = rotate % 360 / 90;
      var px = -x;
      var py = -y;
      if (radius < 0) radius += 4;
      if (radius === 1) {
        py = x + (height - width) / 2 - height + size;
        px = (height - width) / 2 - y;
      } else if (radius === 2) {
        px = x - width + size;
        py = y - height + size;
      } else if (radius === 3) {
        px = y + (width - height) / 2 - width + size;
        py = (width - height) / 2 - x;
      }
      return {
        style: {
          width: previewSize,
          height: previewSize,
          backgroundImage: 'url(\'' + src + '\')',
          backgroundSize: width * previewScale + 'px ' + height * previewScale + 'px',
          backgroundPosition: px * previewScale + 'px ' + py * previewScale + 'px',
          transform: 'rotate(' + rotate + 'deg)'
        }
      };
    }
  }, {
    key: 'renderPreviewItem',
    value: function renderPreviewItem(previewSize) {
      return _react2['default'].createElement(
        'div',
        { className: prefixClas + '-preview-item' },
        _react2['default'].createElement('i', this.getPreviewProps(previewSize)),
        _react2['default'].createElement(
          'p',
          null,
          previewSize + '\uFF0A' + previewSize
        )
      );
    }
  }, {
    key: 'renderEditor',
    value: function renderEditor(props) {
      var _this4 = this;

      var _state2 = this.state,
          img = _state2.img,
          imageStyle = _state2.imageStyle,
          file = _state2.file,
          size = _state2.size,
          x = _state2.x,
          y = _state2.y,
          rotate = _state2.rotate;
      var intlPrefix = this.props.intlPrefix;
      var src = img.src;
      var left = imageStyle.left,
          top = imageStyle.top;

      var style = {
        width: editorWidth,
        height: editorHeight
      };
      var maskStyle = {
        borderTopWidth: y + top,
        borderRightWidth: editorWidth - x - left - size,
        borderBottomWidth: editorHeight - y - top - size,
        borderLeftWidth: x + left
      };
      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          'h3',
          { className: prefixClas + '-text' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.text' }),
          _react2['default'].createElement(_icon2['default'], { type: 'keyboard_arrow_right' }),
          _react2['default'].createElement(
            'span',
            null,
            file.name
          )
        ),
        _react2['default'].createElement(
          'h4',
          { className: prefixClas + '-hint' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.hint' })
        ),
        _react2['default'].createElement(
          'div',
          { className: prefixClas + '-wraper' },
          _react2['default'].createElement(
            'div',
            { className: prefixClas, style: style },
            _react2['default'].createElement('img', { alt: '', src: src, style: imageStyle }),
            _react2['default'].createElement(
              'div',
              { className: prefixClas + '-mask', style: maskStyle },
              _react2['default'].createElement(
                'div',
                { onMouseDown: this.handleMoveStart },
                _react2['default'].createElement('i', { className: 'lt', onMouseDown: this.handleResizeStart }),
                _react2['default'].createElement('i', { className: 'rt', onMouseDown: this.handleResizeStart }),
                _react2['default'].createElement('i', { className: 'lb', onMouseDown: this.handleResizeStart }),
                _react2['default'].createElement('i', { className: 'rb', onMouseDown: this.handleResizeStart })
              )
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: prefixClas + '-toolbar' },
            _react2['default'].createElement(_button2['default'], { icon: 'replay_90', shape: 'circle', onClick: function onClick() {
                return _this4.initImageSize(img, rotate - 90);
              } }),
            _react2['default'].createElement(_button2['default'], { icon: 'play_90', shape: 'circle', onClick: function onClick() {
                return _this4.initImageSize(img, rotate + 90);
              } })
          ),
          _react2['default'].createElement(
            'div',
            { className: prefixClas + '-preview' },
            _react2['default'].createElement(
              'h5',
              { className: prefixClas + '-preview-title' },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.preview' })
            ),
            this.renderPreviewItem(80),
            this.renderPreviewItem(30),
            this.renderPreviewItem(18)
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: prefixClas + '-button' },
          _react2['default'].createElement(
            _upload2['default'],
            props,
            _react2['default'].createElement(
              _button2['default'],
              { icon: 'file_upload', type: 'primary' },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.button' })
            )
          )
        )
      );
    }
  }, {
    key: 'getUploadProps',
    value: function getUploadProps() {
      var _this5 = this;

      var _props = this.props,
          intl = _props.intl,
          id = _props.id,
          intlPrefix = _props.intlPrefix;

      return {
        multiple: false,
        name: 'file',
        accept: 'image/jpeg, image/png, image/jpg',
        action: id && process.env.API_HOST + '/iam/v1/users/' + id + '/upload_photo',
        headers: {
          Authorization: 'bearer ' + Choerodon.getCookie('access_token')
        },
        showUploadList: false,
        beforeUpload: function beforeUpload(file) {
          var size = file.size;

          if (size > limitSize * 1024) {
            Choerodon.prompt(intl.formatMessage({ id: intlPrefix + '.file.size.limit' }, { size: limitSize / 1024 + 'M' }));
            return false;
          }
          _this5.setState({ file: file });
          var windowURL = window.URL || window.webkitURL;
          if (windowURL && windowURL.createObjectURL) {
            _this5.loadImage(windowURL.createObjectURL(file));
            return false;
          }
        },
        onChange: function onChange(_ref5) {
          var file = _ref5.file;
          var status = file.status,
              response = file.response;

          if (status === 'done') {
            _this5.loadImage(response);
          } else if (status === 'error') {
            Choerodon.prompt('' + response.message);
          }
        }
      };
    }
  }, {
    key: 'renderContainer',
    value: function renderContainer() {
      var img = this.state.img;
      var intlPrefix = this.props.intlPrefix;

      var props = this.getUploadProps();
      return img ? this.renderEditor(props) : _react2['default'].createElement(
        Dragger,
        (0, _extends3['default'])({ className: 'c7n-iam-avatar-dragger' }, props),
        _react2['default'].createElement(_icon2['default'], { type: 'inbox' }),
        _react2['default'].createElement(
          'h3',
          { className: 'c7n-iam-avatar-dragger-text' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.dragger.text' })
        ),
        _react2['default'].createElement(
          'h4',
          { className: 'c7n-iam-avatar-dragger-hint' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.dragger.hint', values: { size: limitSize / 1024 + 'M', access: 'PNG、JPG、JPEG' } })
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          visible = _props2.visible,
          intlPrefix = _props2.intlPrefix;
      var _state3 = this.state,
          img = _state3.img,
          submitting = _state3.submitting;

      var modalFooter = [_react2['default'].createElement(
        _button2['default'],
        { disabled: submitting, key: 'cancel', onClick: this.handleCancel },
        _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'cancel' })
      ), _react2['default'].createElement(
        _button2['default'],
        { key: 'save', type: 'primary', disabled: !img, loading: submitting, onClick: this.handleOk },
        _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'save' })
      )];
      return _react2['default'].createElement(
        _modal2['default'],
        {
          title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.title' }),
          className: 'avatar-modal',
          visible: visible,
          width: 980,
          closable: false,
          maskClosable: false,
          footer: modalFooter
        },
        this.renderContainer()
      );
    }
  }]);
  return AvatarUploader;
}(_react.Component), _class2.propTypes = {
  visible: _propTypes2['default'].bool.isRequired, // 上传图片模态框的显示状态
  intlPrefix: _propTypes2['default'].string, // 多语言的前缀
  onVisibleChange: _propTypes2['default'].func, // 模态框关闭时的回调
  onUploadOk: _propTypes2['default'].func // 成功上传时的回调
}, _temp2)) || _class) || _class);
exports['default'] = AvatarUploader;
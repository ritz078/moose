'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _video = require('video.js');

var videojs = _interopRequireWildcard(_video);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = '/Users/ritz078/projects/blizzard/shared/components/Video.js';

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  max-width: 95%;\n  margin: 0 auto;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  justify-content: center;\n'], ['\n  max-width: 95%;\n  margin: 0 auto;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  justify-content: center;\n']);

var VideoWrapper = _styledComponents2.default.div(_templateObject);

var Video = function (_PureComponent) {
  (0, _inherits3.default)(Video, _PureComponent);

  function Video() {
    (0, _classCallCheck3.default)(this, Video);

    return (0, _possibleConstructorReturn3.default)(this, (Video.__proto__ || (0, _getPrototypeOf2.default)(Video)).apply(this, arguments));
  }

  (0, _createClass3.default)(Video, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      videojs(this.videoRef, this.props.options, function () {
        _this2.props.onInit();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement('div', { style: { display: 'flex', height: '100%' }, __source: {
          fileName: _jsxFileName,
          lineNumber: 23
        }
      }, _react2.default.createElement(VideoWrapper, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 24
        }
      }, _react2.default.createElement('video', {
        className: 'video-js vjs-default-skin',
        controls: true,
        preload: 'auto',
        src: this.props.src,
        ref: function ref(x) {
          return _this3.videoRef = x;
        },
        autoPlay: true,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 25
        }
      })));
    }
  }]);

  return Video;
}(_react.PureComponent);

Video.propTypes = {
  src: _react.PropTypes.string.isRequired,
  onInit: _react.PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  options: _react.PropTypes.object
};

Video.defaultProps = {
  onInit: function onInit() {},

  options: {
    fluid: true
  }
};

exports.default = Video;
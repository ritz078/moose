'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

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

var _nextReduxWrapper = require('next-redux-wrapper');

var _nextReduxWrapper2 = _interopRequireDefault(_nextReduxWrapper);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _socket = require('socket.io-client');

var io = _interopRequireWildcard(_socket);

var _jsCookie = require('js-cookie');

var cookie = _interopRequireWildcard(_jsCookie);

var _reactLoadingBar = require('react-loading-bar');

var _reactLoadingBar2 = _interopRequireDefault(_reactLoadingBar);

var _store = require('../store');

var _store2 = _interopRequireDefault(_store);

var _Results = require('../shared/components/Results');

var _Results2 = _interopRequireDefault(_Results);

var _Layout = require('../shared/components/Layout');

var _Layout2 = _interopRequireDefault(_Layout);

var _Description = require('../shared/components/Description');

var _Description2 = _interopRequireDefault(_Description);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _dec,
    _class,
    _jsxFileName = '/Users/ritz078/projects/blizzard/pages/index.js?entry';

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  flex: 1;\n'], ['\n  flex: 1;\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  padding: 0 0 0 20px;\n  flex: 0 1 480px;\n  & > div {\n    width: 460px;\n    max-height: calc(100vh - 110px);\n  }\n'], ['\n  padding: 0 0 0 20px;\n  flex: 0 1 480px;\n  & > div {\n    width: 460px;\n    max-height: calc(100vh - 110px);\n  }\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  padding: 20px 5% 0;\n  display: flex;\n  padding-top: 85px;\n  padding-bottom: 30px;\n'], ['\n  padding: 20px 5% 0;\n  display: flex;\n  padding-top: 85px;\n  padding-bottom: 30px;\n']),
    _templateObject4 = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  flex-direction: column;\n'], ['\n  display: flex;\n  flex-direction: column;\n']);

var Left = _styledComponents2.default.div(_templateObject);

var Right = _styledComponents2.default.div(_templateObject2);

var Content = _styledComponents2.default.div(_templateObject3);

var Main = _styledComponents2.default.div(_templateObject4);

var Home = (_dec = (0, _nextReduxWrapper2.default)(_store2.default, function (_ref) {
  var results = _ref.results,
      loading = _ref.loading;
  return { results: results, loading: loading };
}), _dec(_class = function (_PureComponent) {
  (0, _inherits3.default)(Home, _PureComponent);

  function Home() {
    var _ref2;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Home);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref2 = Home.__proto__ || (0, _getPrototypeOf2.default)(Home)).call.apply(_ref2, [this].concat(args))), _this), _this.isMagnetUrl = function () {
      return _this.props.results.searchTerm && _this.props.results.searchTerm.match(/magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i) != null;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(Home, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      io.connect('http://localhost:4000' + '?session_name=' + cookie.get('session_name'));
    }
  }, {
    key: 'getContent',
    value: function getContent() {
      var _props = this.props,
          results = _props.results,
          loading = _props.loading;

      if (this.isMagnetUrl()) {
        return _react2.default.createElement(Main, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 60
          }
        }, _react2.default.createElement(Content, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 61
          }
        }, _react2.default.createElement('div', { className: 'centered', __source: {
            fileName: _jsxFileName,
            lineNumber: 62
          }
        }, _react2.default.createElement(_Description2.default, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 62
          }
        }))));
      }

      return _react2.default.createElement(Main, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 69
        }
      }, _react2.default.createElement(Content, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 70
        }
      }, _react2.default.createElement(_reactLoadingBar2.default, { show: loading, color: '#5764c6', __source: {
          fileName: _jsxFileName,
          lineNumber: 71
        }
      }), _react2.default.createElement(Left, { className: 'col-7', __source: {
          fileName: _jsxFileName,
          lineNumber: 72
        }
      }, results.data && !!results.data.length && _react2.default.createElement(_Results2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 73
        }
      })), _react2.default.createElement(Right, { className: 'col-5', __source: {
          fileName: _jsxFileName,
          lineNumber: 75
        }
      }, _react2.default.createElement(_Description2.default, { fixed: true, __source: {
          fileName: _jsxFileName,
          lineNumber: 76
        }
      }))));
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_Layout2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 87
        }
      }, this.getContent());
    }
  }]);

  return Home;
}(_react.PureComponent)) || _class);
Home.propTypes = {
  results: _react.PropTypes.shape({
    data: _react.PropTypes.array,
    searchTerm: _react.PropTypes.string
  }),
  loading: _react.PropTypes.bool.isRequired
};
Home.defaultProps = {
  results: {}
};
exports.default = Home;
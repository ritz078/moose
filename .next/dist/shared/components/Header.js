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

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _nextReduxWrapper = require('next-redux-wrapper');

var _nextReduxWrapper2 = _interopRequireDefault(_nextReduxWrapper);

var _store = require('../../store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _dec,
    _class,
    _jsxFileName = '/Users/ritz078/projects/blizzard/shared/components/Header.js';

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  width: 100%;\n  padding: 10px 5%;\n  position: fixed;\n  box-shadow: 0 1px 1px rgba(0,0,0,0.15);\n  z-index: 99;\n  background-color: white;\n'], ['\n  width: 100%;\n  padding: 10px 5%;\n  position: fixed;\n  box-shadow: 0 1px 1px rgba(0,0,0,0.15);\n  z-index: 99;\n  background-color: white;\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  height: 4.2rem;\n  padding: 0 20px;\n  font-family: inherit;\n  background-color: #f7f7f7;\n  border: 1px solid #f3f3f3;\n'], ['\n  height: 4.2rem;\n  padding: 0 20px;\n  font-family: inherit;\n  background-color: #f7f7f7;\n  border: 1px solid #f3f3f3;\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  height: 4.2rem;\n  padding: 0 20px;\n  font-family: inherit;\n'], ['\n  height: 4.2rem;\n  padding: 0 20px;\n  font-family: inherit;\n']);

var HeaderWrapper = _styledComponents2.default.header(_templateObject);

var SearchInput = _styledComponents2.default.input(_templateObject2);

var SearchButton = _styledComponents2.default.button(_templateObject3);

var Header = (_dec = (0, _nextReduxWrapper2.default)(_store2.default), _dec(_class = function (_PureComponent) {
  (0, _inherits3.default)(Header, _PureComponent);

  function Header() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Header);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Header.__proto__ || (0, _getPrototypeOf2.default)(Header)).call.apply(_ref, [this].concat(args))), _this), _this.handleSearch = function (e) {
      if (e.type === 'keypress' && e.which !== 13) return;

      var input = _this.inputRef.value;

      _this.setState({
        searchTerm: input
      });

      _this.props.dispatch({
        type: 'SET_PAGE',
        payload: 1
      });

      if (input.match(/magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i) != null) {
        _this.props.dispatch({
          type: 'SET_SEARCHTERM',
          payload: input
        });
        _this.props.dispatch({
          type: 'FETCH_DETAILS',
          payload: input
        });
      } else {
        _this.props.dispatch({
          type: 'FETCH_RESULTS',
          payload: input
        });
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(Header, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(HeaderWrapper, { className: 'row', __source: {
          fileName: _jsxFileName,
          lineNumber: 73
        }
      }, _react2.default.createElement('div', { className: 'input-group', __source: {
          fileName: _jsxFileName,
          lineNumber: 74
        }
      }, _react2.default.createElement(SearchInput, {
        type: 'text',
        className: 'form-input',
        placeholder: 'Search or paste your magnet url',
        innerRef: function innerRef(x) {
          return _this2.inputRef = x;
        },
        onKeyPress: this.handleSearch,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 75
        }
      }), _react2.default.createElement(SearchButton, {
        className: 'btn btn-primary input-group-btn',
        onClick: this.handleSearch,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 82
        }
      }, 'Submit')));
    }
  }]);

  return Header;
}(_react.PureComponent)) || _class);
Header.propTypes = {
  dispatch: _react.PropTypes.func
};
Header.defaultProps = {
  dispatch: function dispatch() {}
};
exports.default = Header;
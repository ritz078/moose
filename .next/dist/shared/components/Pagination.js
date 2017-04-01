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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = '/Users/ritz078/projects/blizzard/shared/components/Pagination.js';

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  display: inline-block;\n  padding: 10px;\n  border: 1px solid #f1f1f1;\n  height: 41px;\n  vertical-align: middle;\n  border-radius: 1px;\n  margin: 0 2px;\n  width: 40px;\n  text-align: center;\n  font-weight: bold;\n  ', '\n  &:hover {\n    ', '\n  }\n  & > i {\n    font-weight: bold;\n  }\n'], ['\n  display: inline-block;\n  padding: 10px;\n  border: 1px solid #f1f1f1;\n  height: 41px;\n  vertical-align: middle;\n  border-radius: 1px;\n  margin: 0 2px;\n  width: 40px;\n  text-align: center;\n  font-weight: bold;\n  ', '\n  &:hover {\n    ', '\n  }\n  & > i {\n    font-weight: bold;\n  }\n']);

var PaginationBtn = _styledComponents2.default.span(_templateObject, function (props) {
  return props.focus && 'cursor: pointer;';
}, function (props) {
  return props.focus && 'background-color: #fafafa;';
});

var Pagination = function (_PureComponent) {
  (0, _inherits3.default)(Pagination, _PureComponent);

  function Pagination() {
    (0, _classCallCheck3.default)(this, Pagination);

    return (0, _possibleConstructorReturn3.default)(this, (Pagination.__proto__ || (0, _getPrototypeOf2.default)(Pagination)).apply(this, arguments));
  }

  (0, _createClass3.default)(Pagination, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          currentPage = _props.currentPage,
          onNextClick = _props.onNextClick,
          onPrevClick = _props.onPrevClick;

      return _react2.default.createElement('div', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 38
        }
      }, _react2.default.createElement(PaginationBtn, { focus: true, onClick: onPrevClick, __source: {
          fileName: _jsxFileName,
          lineNumber: 39
        }
      }, _react2.default.createElement('i', { className: 'mdi mdi-chevron-left', __source: {
          fileName: _jsxFileName,
          lineNumber: 40
        }
      })), _react2.default.createElement(PaginationBtn, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 42
        }
      }, currentPage), _react2.default.createElement(PaginationBtn, { focus: true, onClick: onNextClick, __source: {
          fileName: _jsxFileName,
          lineNumber: 43
        }
      }, _react2.default.createElement('i', { className: 'mdi mdi-chevron-right', __source: {
          fileName: _jsxFileName,
          lineNumber: 44
        }
      })));
    }
  }]);

  return Pagination;
}(_react.PureComponent);

Pagination.propTypes = {
  onNextClick: _react.PropTypes.func.isRequired,
  onPrevClick: _react.PropTypes.func.isRequired,
  currentPage: _react.PropTypes.number
};
Pagination.defaultProps = {
  currentPage: 1
};
exports.default = Pagination;
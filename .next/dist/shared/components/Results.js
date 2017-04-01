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

var _Pagination = require('./Pagination');

var _Pagination2 = _interopRequireDefault(_Pagination);

var _sortOrder = require('../constants/sortOrder');

var _sortOrder2 = _interopRequireDefault(_sortOrder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _dec,
    _class,
    _jsxFileName = '/Users/ritz078/projects/blizzard/shared/components/Results.js';

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  font-size: 14px;\n  vertical-align: top;\n  color: ', ';\n'], ['\n  font-size: 14px;\n  vertical-align: top;\n  color: ', ';\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  display: table;\n  width: 100%;\n  margin-top: 20px;\n'], ['\n  display: table;\n  width: 100%;\n  margin-top: 20px;\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  display: table-cell;\n  border-bottom: 0.1rem solid #f1f1f1;\n  padding: 6px 10px;\n  text-align: left;\n  vertical-align: middle;\n'], ['\n  display: table-cell;\n  border-bottom: 0.1rem solid #f1f1f1;\n  padding: 6px 10px;\n  text-align: left;\n  vertical-align: middle;\n']),
    _templateObject4 = (0, _taggedTemplateLiteral3.default)(['\n  display: table-row;\n  cursor: pointer;\n  &:nth-of-type(2n){\n    background-color: #f8f8f8\n  }\n  &:first-of-type {\n    font-weight: bold;\n  }\n'], ['\n  display: table-row;\n  cursor: pointer;\n  &:nth-of-type(2n){\n    background-color: #f8f8f8\n  }\n  &:first-of-type {\n    font-weight: bold;\n  }\n']),
    _templateObject5 = (0, _taggedTemplateLiteral3.default)(['\n  border-color: #f1f1f1;\n  height: 42px !important;\n  display: inline-block;\n  margin-right: 10px;\n  cursor: pointer;\n'], ['\n  border-color: #f1f1f1;\n  height: 42px !important;\n  display: inline-block;\n  margin-right: 10px;\n  cursor: pointer;\n']),
    _templateObject6 = (0, _taggedTemplateLiteral3.default)(['\n  width: 330px;\n'], ['\n  width: 330px;\n']);

var Verified = _styledComponents2.default.i(_templateObject, function (props) {
  return props.active ? 'limegreen' : '#bdbdbd';
});

var Table = _styledComponents2.default.div(_templateObject2);

var Td = _styledComponents2.default.div(_templateObject3);

var Tr = _styledComponents2.default.div(_templateObject4);

var SortOrder = _styledComponents2.default.select(_templateObject5);

var FiltersWrapper = _styledComponents2.default.div(_templateObject6);

var Results = (_dec = (0, _nextReduxWrapper2.default)(_store2.default, function (_ref) {
  var results = _ref.results,
      params = _ref.params;
  return { results: results, params: params };
}), _dec(_class = function (_PureComponent) {
  (0, _inherits3.default)(Results, _PureComponent);

  function Results(props) {
    (0, _classCallCheck3.default)(this, Results);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Results.__proto__ || (0, _getPrototypeOf2.default)(Results)).call(this, props));

    _this.getResults = function () {
      var _this$props = _this.props,
          results = _this$props.results,
          dispatch = _this$props.dispatch;

      return results.data.map(function (result, i) {
        return _react2.default.createElement(Tr, {
          key: result.id,
          onClick: function onClick() {
            return dispatch({
              type: 'FETCH_DETAILS',
              payload: result.magnetLink
            });
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 81
          }
        }, _react2.default.createElement(Td, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 88
          }
        }, i + 1), _react2.default.createElement(Td, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 89
          }
        }, _react2.default.createElement('div', { className: 'tile tile-centered m-0', __source: {
            fileName: _jsxFileName,
            lineNumber: 90
          }
        }, _react2.default.createElement('div', { className: 'tile-content', __source: {
            fileName: _jsxFileName,
            lineNumber: 91
          }
        }, _react2.default.createElement('div', { className: 'tile-title', style: { maxWidth: '500px' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 92
          }
        }, result.name), _react2.default.createElement('div', { className: 'tile-meta', __source: {
            fileName: _jsxFileName,
            lineNumber: 93
          }
        }, _react2.default.createElement(Verified, {
          'data-tooltip': result.verified ? 'Verified' : 'Not verified',
          className: 'mdi mdi-verified tooltip tooltip-right',
          active: result.verified,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 94
          }
        }), ' \xB7 ', result.uploadDate, ' \xB7 ', result.category.name, ' \xB7 ', result.subcategory.name)))), _react2.default.createElement(Td, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 102
          }
        }, result.size), _react2.default.createElement(Td, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 103
          }
        }, result.seeders), _react2.default.createElement(Td, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 104
          }
        }, result.leechers));
      });
    };

    _this.onNextClick = function () {
      _this.props.dispatch({ type: 'SET_PAGE', payload: _this.props.params.page + 1 });
      _this.fetchResults();
    };

    _this.onPrevClick = function () {
      _this.props.dispatch({ type: 'SET_PAGE', payload: _this.props.params.page - 1 });
      _this.fetchResults();
    };

    _this.fetchResults = function () {
      _this.props.dispatch({
        type: 'FETCH_RESULTS'
      });
    };

    _this.setSortOrder = function (e) {
      _this.props.dispatch({
        type: 'SET_SORT_ORDER',
        payload: _sortOrder2.default[e.target.value]
      });

      _this.fetchResults();
    };

    _this.state = {
      selectedTorrentId: null
    };
    return _this;
  }

  (0, _createClass3.default)(Results, [{
    key: 'render',
    value: function render() {
      var params = this.props.params;

      return _react2.default.createElement('div', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 138
        }
      }, _react2.default.createElement('div', { className: 'clearfix', __source: {
          fileName: _jsxFileName,
          lineNumber: 139
        }
      }, _react2.default.createElement('h5', { className: 'float-left', __source: {
          fileName: _jsxFileName,
          lineNumber: 140
        }
      }, 'Results for search term ', _react2.default.createElement('b', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 140
        }
      }, this.props.results.searchTerm)), _react2.default.createElement(FiltersWrapper, { className: 'float-right', __source: {
          fileName: _jsxFileName,
          lineNumber: 141
        }
      }, _react2.default.createElement('div', { className: 'form-group inline-block', __source: {
          fileName: _jsxFileName,
          lineNumber: 142
        }
      }, _react2.default.createElement(SortOrder, { className: 'form-select', onChange: this.setSortOrder, __source: {
          fileName: _jsxFileName,
          lineNumber: 143
        }
      }, _sortOrder2.default.map(function (s, i) {
        return _react2.default.createElement('option', { value: i, __source: {
            fileName: _jsxFileName,
            lineNumber: 145
          }
        }, s.label);
      }))), _react2.default.createElement('div', { className: 'form-group inline-block', __source: {
          fileName: _jsxFileName,
          lineNumber: 149
        }
      }, _react2.default.createElement(_Pagination2.default, {
        onNextClick: this.onNextClick,
        onPrevClick: this.onPrevClick,
        currentPage: params.page,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 150
        }
      })))), _react2.default.createElement(Table, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 159
        }
      }, _react2.default.createElement(Tr, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 160
        }
      }, _react2.default.createElement(Td, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 161
        }
      }, '#'), _react2.default.createElement(Td, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 162
        }
      }, 'Name'), _react2.default.createElement(Td, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 163
        }
      }, 'File Size'), _react2.default.createElement(Td, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 164
        }
      }, 'Seeders'), _react2.default.createElement(Td, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 165
        }
      }, 'Leechers')), this.getResults()), _react2.default.createElement('div', { className: 'float-right mt-10', __source: {
          fileName: _jsxFileName,
          lineNumber: 170
        }
      }, _react2.default.createElement(_Pagination2.default, {
        onNextClick: this.onNextClick,
        onPrevClick: this.onPrevClick,
        currentPage: params.page,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 171
        }
      })));
    }
  }]);

  return Results;
}(_react.PureComponent)) || _class);
Results.propTypes = {
  results: _react.PropTypes.arrayOf(_react.PropTypes.shape({
    magnetLink: _react.PropTypes.string,
    verified: _react.PropTypes.bool,
    size: _react.PropTypes.string,
    seeders: _react.PropTypes.number,
    leechers: _react.PropTypes.number
  })).isRequired,
  dispatch: _react.PropTypes.isRequired,
  params: _react.PropTypes.shape({
    page: _react.PropTypes.number
  }).isRequired
};
exports.default = Results;
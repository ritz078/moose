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

var _ajax = require('rxjs/observable/dom/ajax');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _MediaModal = require('./MediaModal');

var _MediaModal2 = _interopRequireDefault(_MediaModal);

var _store = require('../../store');

var _store2 = _interopRequireDefault(_store);

var _fileType = require('../utils/logic/fileType');

var _fileType2 = _interopRequireDefault(_fileType);

var _colors = require('../constants/colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _dec,
    _class,
    _jsxFileName = '/Users/ritz078/projects/blizzard/shared/components/Description.js';

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  background-color: ', ';\n  border-radius: .2rem;\n  color: #fff;\n  height: 4rem;\n  width: 4rem;\n  display: flex;\n  align-items: center;\n  align-content: space-around;\n'], ['\n  background-color: ', ';\n  border-radius: .2rem;\n  color: #fff;\n  height: 4rem;\n  width: 4rem;\n  display: flex;\n  align-items: center;\n  align-content: space-around;\n']);

/* eslint-disable jsx-a11y/no-static-element-interactions */


var TileWrapper = _styledComponents2.default.div(_templateObject, function (props) {
  return props.color;
});

var Description = (_dec = (0, _nextReduxWrapper2.default)(_store2.default, function (_ref) {
  var details = _ref.details;
  return { details: details };
}), _dec(_class = function (_PureComponent) {
  (0, _inherits3.default)(Description, _PureComponent);

  function Description(props) {
    (0, _classCallCheck3.default)(this, Description);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Description.__proto__ || (0, _getPrototypeOf2.default)(Description)).call(this, props));

    _this.startStream = function (e) {
      _this.setState({
        streaming: true,
        selectedIndex: e.target.dataset.id
      });
    };

    _this.closeModal = function () {
      _this.setState({ streaming: false });
      _ajax.ajax.getJSON('/api/delete/' + _this.props.details.torrentId);
    };

    _this.listTorrent = function (_ref2) {
      var torrentId = _ref2.torrentId;

      _this.props.dispatch({
        type: 'FETCH_DETAILS',
        payload: torrentId
      });
    };

    _this.getFileIcon = function (mime) {
      var icon = void 0;

      switch ((0, _fileType2.default)(mime)) {
        case 'audio':
          icon = 'mdi-music-note';
          break;
        case 'video':
          icon = 'mdi-movie';
          break;
        case 'application':
          icon = 'mdi-application';
          break;
        case 'zip':
          icon = 'mdi-zip-box';
          break;
        case 'image':
          icon = 'mdi-file-image';
          break;
        default:
          icon = 'mdi-file-document';
      }
      return _react2.default.createElement(TileWrapper, { color: _colors2.default.primary, __source: {
          fileName: _jsxFileName,
          lineNumber: 98
        }
      }, _react2.default.createElement('i', { className: 'mdi ' + icon + ' centered fs-22', __source: {
          fileName: _jsxFileName,
          lineNumber: 99
        }
      }));
    };

    _this.state = {
      streaming: false,
      selectedIndex: null
    };
    return _this;
  }

  (0, _createClass3.default)(Description, [{
    key: 'getFiles',
    value: function getFiles() {
      var _this2 = this;

      var details = this.props.details;

      return details && details.files && details.files.map(function (file, i) {
        var fileType = (0, _fileType2.default)(file.type);
        var streamIcon = (0, _classnames2.default)('mdi tooltip tooltip-left fs-22', {
          'mdi-play-circle-outline': fileType === 'video',
          'mdi-eye': fileType === 'image'
        });

        return _react2.default.createElement('div', { className: 'tile tile-centered', __source: {
            fileName: _jsxFileName,
            lineNumber: 115
          }
        }, _react2.default.createElement('div', { className: 'tile-icon', __source: {
            fileName: _jsxFileName,
            lineNumber: 116
          }
        }, _this2.getFileIcon(file.type)), _react2.default.createElement('div', { className: 'tile-content', __source: {
            fileName: _jsxFileName,
            lineNumber: 119
          }
        }, _react2.default.createElement('div', { className: 'tile-title', __source: {
            fileName: _jsxFileName,
            lineNumber: 120
          }
        }, file.name), _react2.default.createElement('div', { className: 'tile-meta', __source: {
            fileName: _jsxFileName,
            lineNumber: 121
          }
        }, file.size, ' \xB7 ', file.type)), _react2.default.createElement('div', { className: 'tile-action', __source: {
            fileName: _jsxFileName,
            lineNumber: 123
          }
        }, Description.isSupported(file.type) && _react2.default.createElement('button', {
          className: 'btn btn-link',
          onClick: _this2.startStream,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 125
          }
        }, _react2.default.createElement('i', {
          className: streamIcon,
          'data-tooltip': fileType === 'video' ? 'Play Video' : 'View Image',
          'data-id': i,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 129
          }
        }))));
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          details = _props.details,
          fixed = _props.fixed;

      if (!details.name) return _react2.default.createElement('div', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 149
        }
      });

      var mainClass = fixed ? 'panel fixed' : 'panel';

      return _react2.default.createElement('div', { className: mainClass, __source: {
          fileName: _jsxFileName,
          lineNumber: 154
        }
      }, _react2.default.createElement('div', { className: 'panel-header', __source: {
          fileName: _jsxFileName,
          lineNumber: 155
        }
      }, _react2.default.createElement('div', { className: 'panel-title text-ellipsis', __source: {
          fileName: _jsxFileName,
          lineNumber: 156
        }
      }, details && details.name)), _react2.default.createElement('div', { className: 'panel-nav', __source: {
          fileName: _jsxFileName,
          lineNumber: 158
        }
      }), _react2.default.createElement('div', { className: 'panel-body', __source: {
          fileName: _jsxFileName,
          lineNumber: 159
        }
      }, this.getFiles()), _react2.default.createElement('div', { className: 'panel-footer', __source: {
          fileName: _jsxFileName,
          lineNumber: 162
        }
      }), _react2.default.createElement(_MediaModal2.default, {
        infoHash: details.torrentId,
        fileIndex: this.state.selectedIndex,
        showModal: this.state.streaming,
        file: details.files[this.state.selectedIndex],
        onCloseClick: this.closeModal,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 163
        }
      }));
    }
  }], [{
    key: 'isSupported',
    value: function isSupported(mime) {
      return document.createElement('video').canPlayType(mime) || mime === 'video/x-matroska' || (0, _fileType2.default)(mime) === 'image';
    }
  }]);

  return Description;
}(_react.PureComponent)) || _class);
Description.propTypes = {
  dispatch: _react.PropTypes.func,
  details: _react.PropTypes.shape({
    name: _react.PropTypes.string,
    torrentId: _react.PropTypes.string,
    files: _react.PropTypes.shape({
      name: _react.PropTypes.string,
      type: _react.PropTypes.string,
      size: _react.PropTypes.string
    })
  }),
  fixed: _react.PropTypes.bool
};
Description.defaultProps = {
  dispatch: function dispatch() {},

  details: {},
  fixed: false
};
exports.default = Description;
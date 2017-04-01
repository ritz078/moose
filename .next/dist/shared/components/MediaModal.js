'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = MediaModal;

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactModal = require('react-modal');

var _reactModal2 = _interopRequireDefault(_reactModal);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _Video = require('./Video');

var _Video2 = _interopRequireDefault(_Video);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = '/Users/ritz078/projects/blizzard/shared/components/MediaModal.js';

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  color: #9c9c9c;\n  position: fixed;\n  top: 5px;\n  right: 5px;\n  font-size: 20px;\n'], ['\n  color: #9c9c9c;\n  position: fixed;\n  top: 5px;\n  right: 5px;\n  font-size: 20px;\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  height: 100%;\n  margin: 0 auto;\n  background-size:contain;\n  background-repeat: no-repeat;\n  background-position: center;\n  background-image: ', ';\n'], ['\n  display: flex;\n  height: 100%;\n  margin: 0 auto;\n  background-size:contain;\n  background-repeat: no-repeat;\n  background-position: center;\n  background-image: ', ';\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  font-size: 40px;\n  cursor: pointer;\n'], ['\n  font-size: 40px;\n  cursor: pointer;\n']);

var ModalControl = _styledComponents2.default.div(_templateObject);

var ImageLightbox = _styledComponents2.default.img(_templateObject2, function (props) {
  return 'url' + props.src;
});

var CloseIcon = _styledComponents2.default.i(_templateObject3);

function MediaModal(props) {
  var infoHash = props.infoHash,
      fileIndex = props.fileIndex,
      file = props.file,
      showModal = props.showModal,
      onCloseClick = props.onCloseClick;

  if (!fileIndex || !file) return null;

  var style = {
    overlay: {
      backgroundColor: 'rgba(0,0,0,0.95)',
      zIndex: 99
    },
    content: {
      background: 'transparent',
      border: 'none'
    }
  };

  var src = '/api/download/' + infoHash + '/' + +fileIndex + '/' + file.name;

  return _react2.default.createElement(_reactModal2.default, {
    style: style,
    isOpen: showModal,
    contentLabel: 'Modal',
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48
    }
  }, _react2.default.createElement(ModalControl, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 53
    }
  }, _react2.default.createElement(CloseIcon, { onClick: onCloseClick, className: 'mdi mdi-close close-modal', __source: {
      fileName: _jsxFileName,
      lineNumber: 54
    }
  })), file.type.indexOf('video') >= 0 && _react2.default.createElement(_Video2.default, { src: src, __source: {
      fileName: _jsxFileName,
      lineNumber: 56
    }
  }), file.type.indexOf('image') >= 0 && _react2.default.createElement(ImageLightbox, { src: src, __source: {
      fileName: _jsxFileName,
      lineNumber: 57
    }
  }));
}

MediaModal.propTypes = {
  infoHash: _react.PropTypes.string.isRequired,
  fileIndex: _react.PropTypes.number.isRequired,
  showModal: _react.PropTypes.bool.isRequired,
  file: _react.PropTypes.shape({
    name: _react.PropTypes.string,
    type: _react.PropTypes.string
  }).isRequired,
  onCloseClick: _react.PropTypes.func.isRequired
};
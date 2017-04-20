/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ajax } from 'rxjs/observable/dom/ajax';
import classNames from 'classnames';
import MediaModal from './MediaModal';
import getFileType from '../utils/logic/fileType';
import colors from '../constants/colors';

const TileWrapper = styled.div`
  background-color: ${props => props.color};
  border-radius: .2rem;
  color: #fff;
  height: 4rem;
  width: 4rem;
  display: flex;
  align-items: center;
  align-content: space-around;
  font-size: 13px;
`;

export default class Description extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    fixed: PropTypes.bool,
    details: PropTypes.shape({
      name: PropTypes.string,
      torrentId: PropTypes.string,
      files: PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
        size: PropTypes.string,
      }),
    }),
  };

  static defaultProps = {
    dispatch() {},
    details: {},
    fixed: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      streaming: false,
      selectedIndex: null,
    };
  }

  startStream = (e) => {
    this.setState({
      streaming: true,
      selectedIndex: e.target.dataset.id,
    });
  };

  closeModal = () => {
    this.setState({ streaming: false });
    ajax.getJSON(`/api/delete/${this.props.details.torrentId}`);
  };

  listTorrent = ({ torrentId }) => {
    this.props.dispatch({
      type: 'FETCH_DETAILS',
      payload: torrentId,
    });
  };

  getFileIcon = (mime) => {
    let icon;

    switch (getFileType(mime)) {
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
    return (
      <TileWrapper color={colors.primary}>
        <i className={`mdi ${icon} centered fs-22`} />
      </TileWrapper>
    );
  };

  getFiles() {
    const { details } = this.props;

    return (
      details &&
      details.files &&
      details.files.map((file, i) => {
        const fileType = getFileType(file.type);
        const streamIcon = classNames('mdi tooltip tooltip-left fs-22', {
          'mdi-play-circle-outline': fileType === 'video',
          'mdi-eye': fileType === 'image',
        });

        return (
          <div className="tile tile-centered">
            <div className="tile-icon">
              {this.getFileIcon(file.type)}
            </div>
            <div className="tile-content">
              <div className="tile-title">{file.name}</div>
              <div className="tile-meta">{file.size} · {file.type}</div>
            </div>
            <div className="tile-action">
              {Description.isSupported(file.type) &&
                <button className="btn btn-link" onClick={this.startStream}>
                  <i
                    className={streamIcon}
                    data-tooltip={fileType === 'video' ? 'Play Video' : 'View Image'}
                    data-id={i}
                  />
                </button>}
            </div>
          </div>
        );
      })
    );
  }

  static isSupported(mime) {
    return (
      document.createElement('video').canPlayType(mime) ||
      mime === 'video/x-matroska' ||
      getFileType(mime) === 'image'
    );
  }

  render() {
    const { details, fixed } = this.props;

    if (!details.name) return <div />;

    const mainClass = fixed ? 'panel fixed' : 'panel';

    return (
      <div className={mainClass}>
        <div className="panel-header">
          <div className="panel-title text-ellipsis">{details && details.name}</div>
        </div>
        <div className="panel-nav" />
        <div className="panel-body">
          {this.getFiles()}
        </div>
        <div className="panel-footer" />
        <MediaModal
          infoHash={details.torrentId}
          fileIndex={this.state.selectedIndex}
          showModal={this.state.streaming}
          file={details.files[this.state.selectedIndex]}
          onCloseClick={this.closeModal}
        />
      </div>
    );
  }
}

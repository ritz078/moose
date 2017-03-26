/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Modal from 'react-modal';
import { ajax } from 'rxjs/observable/dom/ajax';
import Video from '../Video';

const TileWrapper = styled.div`
  background-color: ${props => props.color};
  border-radius: .2rem;
  color: #fff;
  height: 4rem;
  width: 4rem;
  display: flex;
  align-items: center;
  align-content: space-around;
`;

const ImageLightbox = styled.div`
  display: flex;
  height: 100%;
  background-size:contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: ${props => `url${props.src}`};
`;

const ModalControl = styled.div`
  color: #9c9c9c;
  position: fixed;
  top: 5px;
  right: 5px;
  font-size: 20px;
`;

@connect(({ details }) => ({ details }))
export default class Description extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    details: PropTypes.shape({
      name: PropTypes.string,
      torrentId: PropTypes.string,
      files: PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
        size: PropTypes.string,
      }),
    }),
    fixed: PropTypes.bool,
  }

  static defaultProps = {
    dispatch() {
    },
    details: {},
    fixed: false,
  }

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
  }

  closeModal = () => {
    this.setState({ streaming: false });
    ajax.getJSON(`/api/delete/${this.props.details.torrentId}`);
  }

  listTorrent = ({ torrentId }) => {
    this.props.dispatch({
      type: 'FETCH_DETAILS',
      payload: torrentId,
    });
  }

  getFiles() {
    const { details } = this.props;

    return details && details.files && details.files.map((file, i) => (
      <div className="tile tile-centered">
        <div className="tile-icon">
          <TileWrapper color="#e64a19">
            <i className="mdi mdi-movie centered" />
          </TileWrapper>
        </div>
        <div className="tile-content">
          <div className="tile-title">{file.name}</div>
          <div className="tile-meta">{file.size} · {file.type}</div>
        </div>
        <div className="tile-action">
          {Description.isSupported(file.type) &&
            <button
              className="btn btn-link"
              onClick={this.startStream}
            >
              <i
                className="mdi mdi-play-circle-outline tooltip tooltip-bottom fs-22"
                data-tooltip="Play Video"
                data-id={i}
              />
            </button>
            }
        </div>
      </div>
      ));
  }

  static isSupported(mime) {
    return document.createElement('video').canPlayType(mime) || mime === 'video/x-matroska';
  }

  getStreamModal() {
    const style = {
      overlay: {
        backgroundColor: 'rgba(0,0,0,0.95)',
        zIndex: 99,
      },
      content: {
        background: 'transparent',
        border: 'none',
      },
    };

    let selectedTorrent;

    const { details } = this.props;

    if (details && this.state.selectedIndex) {
      selectedTorrent = details.files[this.state.selectedIndex];
    } else {
      return <div />;
    }

    const src = `/api/download/${details.torrentId}/${+this.state.selectedIndex}/${selectedTorrent.name}`;

    return (
      <Modal
        style={style}
        isOpen={this.state.streaming}
        contentLabel={'Modal'}
      >
        <ModalControl>
          <i className="mdi mdi-window-minimize" />
          <i onClick={this.closeModal} className="mdi mdi-close close-modal" />
        </ModalControl>
        {selectedTorrent.type.indexOf('video') >= 0 && <Video src={src} />}
        {selectedTorrent.type.indexOf('image') >= 0 &&
        <ImageLightbox src={src} />
        }
      </Modal>
    );
  }

  render() {
    const { details, fixed } = this.props;

    if (!details.name) return <div />;

    const mainClass = fixed ? 'panel fixed' : 'panel';

    return (
      <div className={mainClass}>
        <div className="panel-header">
          <div className="panel-title">{details && details.name}</div>
        </div>
        <div className="panel-nav" />
        <div className="panel-body">
          {this.getFiles()}
        </div>
        <div className="panel-footer" />
        {this.getStreamModal()}
      </div>
    );
  }
}

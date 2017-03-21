import React, { PureComponent, PropTypes } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import * as axios from 'axios';
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

export default class Description extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedTorrentDetails: null,
      streaming: false,
      selectedIndex: null,
    };

    this.startStream = this.startStream.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.torrentId !== nextProps.torrentId) {
      this.listTorrent(nextProps);
    }
  }

  startStream(e) {
    this.setState({
      streaming: true,
      selectedIndex: e.target.dataset.id,
    });
  }

  closeModal() {
    this.setState({ streaming: false });
    axios.get(`/api/delete/${this.state.torrentDetails.torrentId}`);
  }

  async listTorrent(props) {
    const torrentId = props.torrentId;
    if (!torrentId) return;

    this.setState({ showStubs: true });

    const { data } = await axios.get(`/api/list?torrentId=${window.btoa(torrentId)}&timestamp=${new Date().getTime()}`, { withCredentials: true });

    this.setState({
      selectedTorrentDetails: data,
      showStubs: false,
    });
  }

  getFiles() {
    const torrents = this.state.selectedTorrentDetails;

    return torrents && torrents.files.map((file, i) => (
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
            <button className="btn btn-link">
              <i
                className="mdi mdi-play-circle-outline tooltip tooltip-bottom"
                data-tooltip="Play Video"
                data-id={i}
                onClick={this.startStream}
              />
            </button>
          </div>
        </div>
      ));
  }

  getStreamModal() {
    const style = {
      overlay: {
        backgroundColor: 'rgba(0,0,0,0.95)',
        zIndex: 99,
      },
      content: {
        background: '#000',
        border: 'none',
      },
    };

    let selectedTorrent;

    if (this.state.selectedTorrentDetails && this.state.selectedIndex) {
      selectedTorrent = this.state.selectedTorrentDetails.files[this.state.selectedIndex];
    } else {
      return <div />;
    }

    const src = `/api/download/${this.state.selectedTorrentDetails.torrentId}/${+this.state.selectedIndex}/${selectedTorrent.name}`;

    return (
      <Modal
        style={style}
        isOpen={this.state.streaming}
        contentLabel={'Modal'}
      >
        <div className="modal-control">
          <i className="mdi mdi-window-minimize" />
          <i onClick={this.closeModal} className="mdi mdi-close close-modal" />
        </div>
        {selectedTorrent.type.indexOf('video') >= 0 && <Video src={src} />}
        {selectedTorrent.type.indexOf('image') >= 0 &&
        <div className="image-lightbox" style={{ backgroundImage: `url(${src})` }} />
        }
      </Modal>
    );
  }

  render() {
    const { selectedTorrentDetails } = this.state;

    return (
      <div className="panel fixed">
        <div className="panel-header">
          <div className="panel-title">{selectedTorrentDetails && selectedTorrentDetails.name}</div>
        </div>
        <div className="panel-nav"></div>
        <div className="panel-body">
          {this.getFiles()}{this.getFiles()}
        </div>
        <div className="panel-footer">
        </div>
        {this.getStreamModal()}
      </div>
    )
  }
}

Description.propTypes = {
  torrentId: PropTypes.string
}

import React, { Component } from 'react';
import * as axios from 'axios';
import Helmet from 'react-helmet';
import Modal from 'react-modal';
import * as io from 'socket.io-client';
import * as cookie from 'js-cookie';
import * as store from 'store2';
import Video from '../Video';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      torrentDetails: null,
      streaming: false,
      selectedIndex: null,
    };

    this.listTorrent = this.listTorrent.bind(this);
    this.getTorrentList = this.getTorrentList.bind(this);
    this.startStream = this.startStream.bind(this);
    this.getStreamModal = this.getStreamModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getSelectedTorrent = this.getSelectedTorrent.bind(this);
  }

  async componentDidMount() {
    io.connect(`${window.location.protocol}//${window.location.host}?session_name=${cookie.get('session_name')}`);

    const magnetURI = store('magnetURI');
    if (magnetURI) {
      await this.listTorrent(magnetURI);
    }
  }

  async listTorrent(id) {
    const torrentId = this.inputRef.value || id;

    const { data } = await axios.get(`/list?torrentId=${window.btoa(torrentId)}&timestamp=${new Date().getTime()}`, { withCredentials: true });
    store('magnetURI', data.magnetURI);

    this.inputRef.value = '';

    this.setState({
      torrentDetails: data,
      selectedIndex: null,
    });
  }

  static isSupported(mime) {
    return document.createElement('video').canPlayType(mime) || mime === 'video/x-matroska';
  }

  startStream(e) {
    this.setState({
      streaming: true,
      selectedIndex: e.target.dataset.id,
    });
  }

  closeModal() {
    this.setState({ streaming: false });
    axios.get(`/delete/${this.state.torrentDetails.torrentId}`);
  }

  getSelectedTorrent() {
    return this.state.torrentDetails.files[+this.state.selectedIndex];
  }

  getStreamModal() {
    const style = {
      overlay: {
        backgroundColor: 'rgba(0,0,0,0.95)',
      },
      content: {
        background: '#000',
        border: 'none',
      },
    };

    let selectedTorrent;

    if (this.state.torrentDetails && this.state.selectedIndex) {
      selectedTorrent = this.getSelectedTorrent();
    } else {
      return <div />;
    }

    const src = `/download/${this.state.torrentDetails.torrentId}/${this.state.selectedIndex}/${selectedTorrent.name}`;

    return (
      <Modal
        style={style}
        isOpen={this.state.streaming}
        contentLabel={selectedTorrent.name}
      >
        <i onClick={this.closeModal} className="mdi mdi-close close-modal" />
        <Video src={src} />
      </Modal>
    );
  }

  getTorrentList() {
    const { torrentDetails } = this.state;

    return (
      <table className="table table-striped table-hover">
        <thead>
        <tr>
          <th>#</th>
          <th />
          <th>File Name</th>
          <th>Size</th>
          <th />
          <th>Download</th>
        </tr>
        </thead>
        <tbody>
        {torrentDetails.files.map((file, i) => (
          <tr key={file.name}>
            <td>{i + 1}</td>
            <td>{file.type.indexOf('video') >= 0 && <i className="mdi mdi-movie salmon" />}</td>
            <td>{file.name}</td>
            <td>{file.size}</td>
            <td>
              {Home.isSupported(file.type) &&
              <span className="start-stream">
                    <i className="mdi mdi-play-circle-outline" data-id={i} onClick={this.startStream} />
                  </span>
              }
            </td>
            <td>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`/download/${torrentDetails.torrentId}/${i}/${file.name}`}
                download
              >
                <i className="mdi mdi-download" />
              </a>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    );
  }

  render() {
    const { torrentDetails } = this.state;

    return (
      <article>
        <Helmet title="Home" />

        <div className="row">
          <div className="input-group">
            <input
              type="text"
              className="form-input url-input"
              placeholder="paste your magnet url"
              ref={x => (this.inputRef = x)}
            />
            <button
              className="btn btn-primary input-group-btn add-btn"
              onClick={this.listTorrent}
            >
              Submit
            </button>
          </div>
        </div>

        {torrentDetails &&
        <div>
          <h4 className="torrent-name">{torrentDetails.name}</h4>
          {this.getTorrentList()}
        </div>
        }
        {this.getStreamModal()}
      </article>
    );
  }
}

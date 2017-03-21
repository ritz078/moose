import React, { Component } from 'react';
import * as axios from 'axios';
import Helmet from 'react-helmet';
import * as io from 'socket.io-client';
import * as cookie from 'js-cookie';
import * as store from 'store2';
import Loading from 'react-loading-bar';
import classNames from 'classnames';
import Description from '../Description/Description';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      torrentDetails: null,
      showStubs: false,
      searchResult: null,
      selectedTorrentId: null,
    };

    this.listTorrent = this.listTorrent.bind(this);
    this.getSelectedTorrent = this.getSelectedTorrent.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.getResultsList = this.getResultsList.bind(this);
  }

  async componentDidMount() {
    io.connect(`${window.location.protocol}//${window.location.host}?session_name=${cookie.get('session_name')}`);

    const magnetURI = store('magnetURI');
    if (magnetURI) {
      await this.listTorrent(magnetURI);
    }
  }

  async listTorrent() {
    const torrentId = this.inputRef.value;
    if (!torrentId) return;

    this.setState({ showStubs: true });

    const { data } = await axios.get(`/api/list?torrentId=${window.btoa(torrentId)}&timestamp=${new Date().getTime()}`, { withCredentials: true });
    store('magnetURI', data.magnetURI);

    this.inputRef.value = '';

    this.setState({
      torrentDetails: data,
      selectedIndex: null,
      showStubs: false,
    });
  }

  async searchTorrent(input) {
    this.setState({
      showStubs: true,
    });
    const { data } = await axios.get(`/api/search/${input}`, { withCredentials: true });

    this.setState({
      searchResult: data,
      showStubs: false,
    });
  }

  handleSearch() {
    const input = this.inputRef.value;

    if (input.match(/magnet:\?xt=urn:[a-z0-9]{20,50}/i) != null) {
      this.listTorrent(input);
    } else {
      this.searchTorrent(input);
    }
  }

  static isSupported(mime) {
    return document.createElement('video').canPlayType(mime) || mime === 'video/x-matroska';
  }

  getSelectedTorrent() {
    return this.state.torrentDetails.files[+this.state.selectedIndex];
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
                {file.type.indexOf('image') >= 0 && <i className="mdi mdi-eye" data-id={i} onClick={this.startStream} />}
              </td>
              <td>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`/api/download/${torrentDetails.torrentId}/${i}/${file.name}`}
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

  getResultsList() {
    const { searchResult } = this.state;

    return (
      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th >Name</th>
              <th>File Size</th>
              <th>Seeders</th>
              <th>Leechers</th>
            </tr>
          </thead>
          <tbody>
            {
            searchResult.map((result, i) => {
              const verifyClass = classNames('mdi mdi-verified verified-icon tooltip tooltip-bottom', {
                active: result.verified,
              });
              return (
                <tr key={result.id} onClick={() => (this.setState({ selectedTorrentId: result.magnetLink }))}>
                  <td>{i + 1}</td>
                  <td>
                    <div>
                      {result.name}
                    </div>
                    <div className="result-description">
                      <i data-tooltip={result.verified ? 'Verified' : 'Not verified'} className={verifyClass} />
                      <i className={'mdi mdi-folder-upload upload-icon'} />
                      <span>{result.uploadDate}</span>
                    </div>
                  </td>
                  <td>{result.size}</td>
                  <td>{result.seeders}</td>
                  <td>{result.leechers}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    const { torrentDetails, showStubs, searchResult } = this.state;

    return (
      <div className="main">
        <header className="row">
          <div className="input-group">
            <input
              type="text"
              className="form-input url-input"
              placeholder="paste your magnet url"
              ref={x => (this.inputRef = x)}
            />
            <button
              className="btn btn-primary input-group-btn add-btn"
              onClick={this.handleSearch}
            >
              Submit
            </button>
          </div>
        </header>
        <article className="content">
          <Helmet title="Home" />

          <Loading show={showStubs} color="#5764c6" />

          <div className="left-part col-7">
            {searchResult &&
            <div>
              <h6>Results for search term x</h6>
              {this.getResultsList()}
            </div>
            }

            {torrentDetails &&
            <div>
              <h4 className="torrent-name">{torrentDetails.name}</h4>
              {this.getTorrentList()}
            </div>
            }
          </div>
          <div className="right-part col-5">
            <Description torrentId={this.state.selectedTorrentId} />
          </div>
        </article>
      </div>
    );
  }
}

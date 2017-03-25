/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { PureComponent } from 'react';
import * as axios from 'axios';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import * as io from 'socket.io-client';
import * as cookie from 'js-cookie';
import Loading from 'react-loading-bar';
import classNames from 'classnames';
import Description from '../Description/Description';

@connect(({ results }) => ({ results }))
export default class Home extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      torrentDetails: null,
      showStubs: false,
      searchResult: null,
      selectedTorrentId: null,
      searchTerm: null,
    };
  }

  async componentDidMount() {
    io.connect(`${window.location.protocol}//${window.location.host}?session_name=${cookie.get('session_name')}`);
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

  getSelectedTorrent = () => {
    return this.state.torrentDetails.files[+this.state.selectedIndex];
  }

  getResultsList = () => {
    const { results } = this.props;

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
            results.map((result, i) => {
              const verifyClass = classNames('mdi mdi-verified verified-icon tooltip tooltip-bottom', {
                active: result.verified,
              });
              return (
                <tr
                  className={'result'}
                  key={result.id}
                  onClick={() => (this.setState({ selectedTorrentId: result.magnetLink }))}
                >
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
    const { showStubs } = this.state;
    const { results }  = this.props;

    return (
      <div className="main">
        <article className="content">
          <Helmet title="Home" />

          <Loading show={showStubs} color="#5764c6" />

          <div className="left-part col-7">
            {results && !!results.length &&
            <div>
              <h6>Results for search term <b>{this.state.searchTerm}</b></h6>
              {this.getResultsList()}
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

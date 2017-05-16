/* eslint-disable react/forbid-prop-types */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import parseTorrent from 'parse-torrent';
import withRedux from 'next-redux-wrapper';
import isEmpty from 'just-is-empty';
import initStore from '../store';
import Layout from '../components/Layout';
import DownloadFile, { ContentTitle, Details, Name } from '../components/DownloadTile';
import DownloadMenu from '../components/DownloadMenu';

const config = require('application-config')('Snape');

@withRedux(initStore, ({ download, cast }) => ({
  download,
  cast
}))
export default class Download extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    download: PropTypes.array.isRequired,
    cast: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      downloadData: [],
      selectedIndex: null
    };
  }

  componentDidMount() {
    ipcRenderer.send('init_download_polling');

    ipcRenderer.on('download_data', (event, downloadData) => {
      this.setState({ downloadData });
    });

    config.read((err, { download }) => {
      if (!err && !isEmpty(download)) {
        this.props.dispatch({
          type: 'SET_DOWNLOADS',
          payload: download
        });
      }
    });
  }

  componentWillUnmount() {
    ipcRenderer.send('end_download_polling');
    ipcRenderer.removeAllListeners(['download_data']);
  }

  setSelectedIndex = (i) => {
    this.setState({
      selectedIndex: this.state.selectedIndex === i ? null : i
    });
  };

  getDownloads = () => {
    const content = this.props.download.map((d, i) => (
      <DownloadFile
        details={d}
        index={i}
        key={d.magnetLink}
        dispatch={this.props.dispatch}
        downloadData={this.state.downloadData[parseTorrent(d.magnetLink).infoHash]}
        onClick={this.setSelectedIndex}
        selectedIndex={this.state.selectedIndex}
      />
    ));

    return (
      <div>
        <DownloadMenu />
        {content.length > 0 &&
          <div style={{ height: 'calc(100vh - 116px)', overflow: 'scroll' }}>
            <ContentTitle className="text-bold">
              <div style={{ width: '30px' }} />
              <Name>Name</Name>
              <Details>
                <span>Progress</span>
                <span><i className="mdi mdi-download" />/s</span>
                <span><i className="mdi mdi-upload" />/s</span>
                <span>Size</span>
                <span />
              </Details>
            </ContentTitle>
            {content}
          </div>}
      </div>
    );
  };

  render() {
    return (
      <Layout cast={this.props.cast} download={this.props.download}>
        {this.getDownloads()}
      </Layout>
    );
  }
}

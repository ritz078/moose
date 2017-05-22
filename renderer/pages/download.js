/* eslint-disable react/forbid-prop-types */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import withRedux from 'next-redux-wrapper';
import isEmpty from 'just-is-empty';
import initStore from '../store';
import Layout from '../components/Layout';
import DownloadTile, { ContentTitle, Details, Name, IconWrapper } from '../components/DownloadTile';
import DownloadMenu from '../components/DownloadMenu';
import { readConfig } from '../utils/config';

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

    readConfig((err, { download }) => {
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
      <DownloadTile
        details={d}
        index={i}
        key={d.infoHash}
        dispatch={this.props.dispatch}
        downloadData={this.state.downloadData[d.infoHash]}
        onClick={this.setSelectedIndex}
        selectedIndex={this.state.selectedIndex}
      />
    ));

    return (
      <div>
        <DownloadMenu dispatch={this.props.dispatch} />
        {content.length > 0 &&
          <div style={{ height: 'calc(100vh - 190px)', overflow: 'scroll' }}>
            <ContentTitle className="text-bold">
              <div style={{ width: '30px' }} />
              <Name>Name</Name>
              <Details>
                <div>Progress</div>
                <div><i className="mdi mdi-download" />/s</div>
                <div><i className="mdi mdi-upload" />/s</div>
                <div>Size</div>
                <IconWrapper />
                <IconWrapper />
              </Details>
            </ContentTitle>
            {content}
          </div>}
      </div>
    );
  };

  render() {
    const { cast, download } = this.props;
    return (
      <Layout cast={cast} download={download}>
        {this.getDownloads()}
      </Layout>
    );
  }
}

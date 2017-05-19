import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { remote, ipcRenderer } from 'electron';
import fs from 'fs';
import Modal from 'react-modal';
import parseTorrent from 'parse-torrent';
import { isEmpty } from 'lodash';
import prettyBytes from 'pretty-bytes';
import { showToast } from './Toast';
import isMagnet from '../utils/isMagnet';

const Wrapper = styled.div`
  background-color: #fafafa;
  height: 60px;
  border-bottom: 1px solid #f6f6f6;
  align-items: center;
  display: flex;
  padding: 0 24px;
  cursor: pointer;
`;

const Icon = styled.i`
  font-size: 25px;
  color: #888;
  margin: 0 8px;
  &:hover{
    color: #000;
  }
`;

const CloseIcon = styled.i`
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const ModalWrapper = styled.div`
  padding: 10px;
  position: relative;
  width: 100%;
`;

export default class DownloadMenu extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      showMagnetModal: false
    };
  }

  openTorrentFile = () => {
    remote.dialog.showOpenDialog(
      {
        filters: [
          {
            name: 'Torrent',
            extensions: ['torrent']
          }
        ]
      },
      (paths) => {
        if (isEmpty(paths)) return;
        fs.readFile(paths[0], (err, data) => {
          if (err) {
            showToast(err.message, 'error');
          }
          const torrent = parseTorrent(data);

          torrent.size = torrent.size || prettyBytes(torrent.length);

          this.props.dispatch({
            type: 'ADD_TO_DOWNLOAD_LIST',
            payload: torrent
          });

          ipcRenderer.send('add_torrent_to_download', torrent.infoHash);
        });
      }
    );
  };

  magnetUrlModal = () => {
    const style = {
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
      },
      content: {
        height: 130,
        width: '80%',
        top: 200,
        margin: '0 10%',
        left: 0,
        right: 0,
        border: 0
      }
    };
    return (
      <Modal isOpen={this.state.showMagnetModal} style={style} contentLabel="Magnet">
        <ModalWrapper>
          <h6>Enter the magnet URL</h6>
          <CloseIcon className="mdi mdi-close abs" onClick={this.closeMagnetUrlModal} />
          <input className="form-input" type="text" ref={x => (this.magnetInputRef = x)} />
          <button className="btn btn-primary mt-10 float-right" onClick={this.addMagnetUrl}>
            Fetch Magnet
          </button>
        </ModalWrapper>
      </Modal>
    );
  };

  openMagnetUrlModal = () => {
    this.setState({
      showMagnetModal: true
    });
  };

  closeMagnetUrlModal = () => {
    this.setState({
      showMagnetModal: false
    });
  };

  addMagnetUrl = () => {
    const value = this.magnetInputRef.value;
    if (!isMagnet(value)) {
      showToast('This is not a valid magnet URL', 'error');
      return;
    }

    const { infoHash } = parseTorrent(value);

    ipcRenderer.on('decoded_infoHash', (event, torrent) => {
      this.closeMagnetUrlModal();

      console.log(torrent);

      this.props.dispatch({
        type: 'ADD_TO_DOWNLOAD_LIST',
        payload: torrent
      });
    });

    ipcRenderer.send('decode_infohash_and_add_to_download', infoHash);
  };

  render() {
    return (
      <Wrapper>
        <Icon
          onClick={this.openTorrentFile}
          className="mdi mdi-file-plus tooltip tooltip-bottom"
          data-tooltip="Add torrent"
        />
        <Icon
          onClick={this.openMagnetUrlModal}
          className="mdi mdi-magnet tooltip tooltip-bottom"
          data-tooltip="Add Magnet URI"
        />
        {this.magnetUrlModal()}
      </Wrapper>
    );
  }
}

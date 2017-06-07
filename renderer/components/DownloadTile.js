import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { remote, ipcRenderer } from 'electron';
import styled from 'styled-components';
import prettyBytes from 'pretty-bytes';
import { isEqual } from 'lodash';
import Description from './Description';
import { showToast } from './Toast';

export const Details = styled.div`
  align-items: center;
  display: flex;
  flex: 0.5;
  & > div {
    diaplay: inline-block;
    flex: 1;
  }
`;

export const ContentTitle = styled.div`
  display: flex;
  padding: 10px 20px;
  border-bottom: 0.1rem solid rgb(241, 241, 241);
  font-size: 13px;
  align-items: center;
  background-color: ${props => (props.index + 1) % 2 === 0 && 'rgb(248, 248, 248)'};
  cursor: pointer;
`;

export const Name = styled.div`
  flex: 0.5;
`;

const RemoveIcon = styled.i`
  font-weight: bold;
  transition: all .2s;
  font-size: 18px;
  &:hover{
    transform: scale(1.4);
  }
`;

export const IconWrapper = styled.div`
  display: inline-block;
  flex: 0.4 !important;
  text-align: center;
  color: #666;
  &:hover {
    color: #000;
  }
`;

export default class DownloadTile extends Component {
  static propTypes = {
    downloadData: PropTypes.shape({
      progress: PropTypes.number,
    }),
    details: PropTypes.shape({
      name: PropTypes.string,
      infoHash: PropTypes.string,
    }).isRequired,
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    selectedIndex: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  static defaultProps = {
    downloadData: {},
  };

  shouldComponentUpdate(nextProps) {
    return (
      !isEqual(this.props.downloadData, nextProps.downloadData) ||
      this.props.selectedIndex !== nextProps.selectedIndex
    );
  }

  removeFiles = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { dialog } = remote;
    const { infoHash, name } = this.props.details;

    dialog.showMessageBox(
      {
        type: 'question',
        message: `Do you want to permanently delete the files for ${name} from the disk?`,
        buttons: ['OK', 'Cancel'],
      },
      (response) => {
        if (response === 0) {
          ipcRenderer.send('remove_torrent_files', infoHash);

          this.props.dispatch({
            type: 'REMOVE_FROM_DOWNLOAD_LIST',
            payload: infoHash,
          });

          ipcRenderer.once('removed_torrent_files', () => {
            showToast(`Sucessfully removed ${name} from the disk.`, 'success');
          });
        }
      },
    );
  };

  removeTorrent = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const { dialog } = remote;
    const { infoHash, name } = this.props.details;

    dialog.showMessageBox(
      {
        type: 'question',
        message: `Do you want to delete the torrent for ${name} ?`,
        buttons: ['OK', 'Cancel'],
      },
      (response) => {
        if (response === 0) {
          ipcRenderer.send('remove_torrent', infoHash);

          this.props.dispatch({
            type: 'REMOVE_FROM_DOWNLOAD_LIST',
            payload: infoHash,
          });

          showToast(`Sucessfully removed ${name} from download list`, 'success');
        }
      },
    );
  };

  render() {
    const { details, downloadData, index, selectedIndex, onClick } = this.props;

    return (
      <div>
        <ContentTitle index={index} onClick={() => onClick(index)}>
          <div style={{ width: '30px' }}>{index + 1}</div>
          <Name>{details.name}</Name>
          <Details>
            <div>{Math.round(downloadData.progress || 0)} %</div>
            <div>{prettyBytes(downloadData.downloadSpeed || 0)}/s</div>
            <div>{prettyBytes(downloadData.uploadSpeed || 0)}/s</div>
            <div>{details.size}</div>
            <IconWrapper
              onClick={this.removeFiles}
              className="tooltip tooltip-bottom"
              data-tooltip="Delete torrent and files"
            >
              <RemoveIcon className="mdi mdi-delete-forever" />
            </IconWrapper>
            <IconWrapper
              onClick={this.removeTorrent}
              className="tooltip tooltip-left"
              data-tooltip="Delete torrent"
            >
              <RemoveIcon className="mdi mdi-close" />
            </IconWrapper>
          </Details>
        </ContentTitle>
        {selectedIndex === index &&
          <Description customDetails={downloadData} showOnlyDetails showProgress />}
      </div>
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { remote, ipcRenderer } from 'electron';
import styled from 'styled-components';
import deepCompare from 'deep-compare';
import prettyBytes from 'pretty-bytes';
import Description from './Description';
import { showToast } from './Toast';

export const Details = styled.div`
  display: flex;
  flex: 0.4;
  & > span {
    flex: 1;
  }
`;

export const ContentTitle = styled.div`
  display: flex;
  padding: 10px 20px;
  border-bottom: 0.1rem solid rgb(241, 241, 241);
  font-size: 13px;
  background-color: ${props => (props.index + 1) % 2 === 0 && 'rgb(248, 248, 248)'};
  cursor: pointer;
`;

export const Name = styled.div`
  flex: 0.6;
`;

const RemoveIcon = styled.i`
  font-weight: bold;
  transition: all .2s;
  &:hover{
    transform: scale(1.4);
  }
`;

export default class DownloadTile extends Component {
  static propTypes = {
    downloadData: PropTypes.shape({
      progress: PropTypes.number
    }),
    details: PropTypes.shape({
      name: PropTypes.string,
      magnetLink: PropTypes.string
    }).isRequired,
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    selectedIndex: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  static defaultProps = {
    downloadData: {}
  };

  shouldComponentUpdate(nextProps) {
    return (
      !deepCompare(this.props.downloadData, nextProps.downloadData) ||
      this.props.selectedIndex !== nextProps.selectedIndex
    );
  }

  remove = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const { dialog } = remote;
    const { magnetLink, name } = this.props.details;

    dialog.showMessageBox(
      {
        type: 'question',
        message: `Do you want to delete the torrent for ${name} ?`,
        buttons: ['OK', 'Cancel']
      },
      (response) => {
        if (response === 0) {
          ipcRenderer.send('remove_torrent', magnetLink);

          this.props.dispatch({
            type: 'REMOVE_FROM_DOWNLOAD_LIST',
            payload: magnetLink
          });

          showToast(`Sucessfully removed ${name} from download list`, 'success');
        }
      }
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
            <span>{Math.round(downloadData.progress || 0)} %</span>
            <span>{prettyBytes(downloadData.downloadSpeed || 0)}/s</span>
            <span>{prettyBytes(downloadData.uploadSpeed || 0)}/s</span>
            <span>{details.size}</span>
            <span style={{ textAlign: 'right' }} onClick={this.remove}>
              <RemoveIcon className="mdi mdi-close" />
            </span>
          </Details>
        </ContentTitle>
        {selectedIndex === index &&
          <Description customDetails={downloadData} showOnlyDetails showProgress />}
      </div>
    );
  }
}

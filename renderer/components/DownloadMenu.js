import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { remote } from 'electron';
import fs from 'fs';
import parseTorrent from 'parse-torrent';
import { isEmpty } from 'lodash';
import { showToast } from './Toast';

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

export default class DownloadMenu extends PureComponent {
  openTorrent = () => {
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
          console.log(torrent);
        });
      }
    );
  };

  render() {
    return (
      <Wrapper>
        <Icon
          onClick={this.openTorrent}
          className="mdi mdi-file-plus tooltip tooltip-bottom"
          data-tooltip="Add torrent"
        />
        <Icon className="mdi mdi-magnet tooltip tooltip-bottom" data-tooltip="Add Magnet URI" />
      </Wrapper>
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import deepCompare from 'deep-compare';
import prettyBytes from 'pretty-bytes';
import Description from './Description';

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

export default class DownloadTile extends Component {
  static propTypes = {
    downloadData: PropTypes.shape({
      progress: PropTypes.number
    }),
    details: PropTypes.shape({
      name: PropTypes.string
    }),
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired
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

  render() {
    const { details, downloadData, index, selectedIndex, onClick } = this.props;

    return (
      <div>
        <ContentTitle index={index} onClick={() => onClick(index)}>
          <div style={{ width: '30px' }}>{index + 1}</div>
          <Name>{details.name}</Name>
          <Details>
            <span>{downloadData.progress} %</span>
            <span>{prettyBytes(downloadData.downloadSpeed || 0)}/s</span>
            <span>{prettyBytes(downloadData.uploadSpeed || 0)}/s</span>
            <span>{details.size}</span>
          </Details>
        </ContentTitle>
        {selectedIndex === index &&
          <Description customDetails={downloadData} showOnlyDetails showProgress />}
      </div>
    );
  }
}

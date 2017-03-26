import React, { PropTypes, PureComponent } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

const Verified = styled.i`
  font-size: 14px;
  vertical-align: top;
  margin-right: 8px;
  color: ${props => (props.active ? 'limegreen' : '#bdbdbd')};
`;

const UploadIcon = styled.i`
  color: #565656;
  margin-right: 8px;
  vertical-align: sub;
  font-size: 18px;
`;

const ResultDesc = styled.div`
  font-size: 12px;
  color: #848484;
`;

const Table = styled.div`
  display: table;
  width: 100%;
`;

const Td = styled.div`
  display: table-cell;
  border-bottom: 0.1rem solid #f1f1f1;
  padding: 6px 10px;
  text-align: left;
  vertical-align: middle;
`;

const Tr = styled.div`
  display: table-row;
  cursor: pointer;
  &:nth-of-type(2n){
    background-color: #f8f8f8
  }
  &:first-of-type {
    font-weight: bold;
  }
`;

@connect(({ results }) => ({ results }))
export default class Results extends PureComponent {
  static propTypes = {
    results: PropTypes.arrayOf(
      PropTypes.shape({
        magnetLink: PropTypes.string,
        verified: PropTypes.bool,
        size: PropTypes.string,
        seeders: PropTypes.number,
        leechers: PropTypes.number,
      }),
    ).isRequired,
    dispatch: PropTypes.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedTorrentId: null,
    };
  }

  getResults = () => {
    const { results, dispatch } = this.props;

    return results.data.map((result, i) => (
      <Tr
        key={result.id}
        onClick={() => dispatch({
          type: 'FETCH_DETAILS',
          payload: result.magnetLink,
        })}
      >
        <Td>{i + 1}</Td>
        <Td>
          <div>{result.name}</div>
          <ResultDesc>
            <Verified
              data-tooltip={result.verified ? 'Verified' : 'Not verified'}
              className="mdi mdi-verified tooltip tooltip-bottom"
              active={result.verified}
            />
            <UploadIcon className="mdi mdi-folder-upload" />
            <span>{result.uploadDate}</span>
          </ResultDesc>
        </Td>
        <Td>{result.size}</Td>
        <Td>{result.seeders}</Td>
        <Td>{result.leechers}</Td>
      </Tr>
    ));
  }

  render() {
    return (
      <Table>
        <Tr>
          <Td>#</Td>
          <Td >Name</Td>
          <Td>File Size</Td>
          <Td>Seeders</Td>
          <Td>Leechers</Td>
        </Tr>
        {this.getResults()}
      </Table>
    );
  }
}

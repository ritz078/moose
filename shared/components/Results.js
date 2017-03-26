import React, { PropTypes, PureComponent } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Pagination from './Pagination';

const Verified = styled.i`
  font-size: 14px;
  vertical-align: top;
  margin-right: 8px;
  color: ${props => (props.active ? 'limegreen' : '#bdbdbd')};
`;

const UploadIcon = styled.i`
  color: #565656;
  margin-right: 8px;
  vertical-align: middle;
  font-size: 18px;
`;

const ResultDesc = styled.div`
  font-size: 12px;
  color: #848484;
`;

const Table = styled.div`
  display: table;
  width: 100%;
  margin-top: 20px;
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

@connect(({ results, params }) => ({ results, params }))
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
    params: PropTypes.shape({
      page: PropTypes.number,
    }).isRequired,
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

  onNextClick = () => {
    this.props.dispatch({ type: 'SET_PAGE', payload: this.props.params.page + 1 });
    this.fetchResults();
  }

  onPrevClick = () => {
    this.props.dispatch({ type: 'SET_PAGE', payload: this.props.params.page - 1 });
    this.fetchResults();
  }

  fetchResults = () => {
    this.props.dispatch({
      type: 'FETCH_RESULTS',
    });
  }

  render() {
    const { params } = this.props;

    return (
      <div>
        <div className="clearfix">
          <h5 className="float-left">Results for search term <b>{this.props.results.searchTerm}</b></h5>
          <div className="float-right">
            <Pagination
              onNextClick={this.onNextClick}
              onPrevClick={this.onPrevClick}
              currentPage={params.page}
            />
          </div>
        </div>

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

        <div className="float-right mt-10">
          <Pagination
            onNextClick={this.onNextClick}
            onPrevClick={this.onPrevClick}
            currentPage={params.page}
          />
        </div>
      </div>
    );
  }
}

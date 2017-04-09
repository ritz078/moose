import React, { PropTypes, PureComponent } from 'react';
import styled from 'styled-components';
import withRedux from 'next-redux-wrapper';
import initStore from '../../store';
import Pagination from './Pagination';
import sortOrder from '../constants/sortOrder';

const Verified = styled.i`
  font-size: 14px;
  vertical-align: top;
  color: ${props => (props.active ? 'limegreen' : '#bdbdbd')};
`;

const Table = styled.div`
  display: table;
  width: 100%;
  margin-top: 10px;
  @media screen and (max-width: 600px) {
    display: block;
    overflow: hidden;
  }
`;

const Td = styled.div`
  display: table-cell;
  border-bottom: 0.1rem solid #f1f1f1;
  padding: 6px 10px;
  text-align: left;
  vertical-align: middle;
  @media screen and (max-width: 600px) {
    display: block;
  }
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
  @media screen and (max-width: 600px) {
    display: block;
  }
`;

const SortOrder = styled.select`
  border-color: #f1f1f1 !important;
  height: 42px !important;
  display: inline-block;
  cursor: pointer;
  appearance: none;
`;

const FiltersWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ResultTitle = styled.div`
  max-width: 440px;
  @media screen and (max-width: 600px) {
    width: 100%;
  }
`;

@withRedux(initStore, ({ results, params }) => ({ results, params }))
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
      searchTerm: PropTypes.string,
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedTorrentId: null,
    };
  }

  getResults = () => {
    const { results, dispatch, params } = this.props;

    return results.data.map((result, i) => (
      <Tr
        key={result.id}
        onClick={() => dispatch({
          type: 'FETCH_DETAILS',
          payload: result.magnetLink,
        })}
      >
        <Td className="hide-sm">{((params.page - 1) * 30) + (i + 1)}</Td>
        <Td>
          <div className="tile tile-centered m-0">
            <div className="tile-content">
              <ResultTitle className="tile-title">
                <span className="show-sm-inline">{((params.page - 1) * 30) + (i + 1)}. </span>
                {result.name}
              </ResultTitle>
              <div className="tile-meta">
                <Verified
                  data-tooltip={result.verified ? 'Verified' : 'Not verified'}
                  className="mdi mdi-verified tooltip tooltip-right"
                  active={result.verified}
                /> <span className="show-sm-inline">· {result.size} ·</span>
                <span className="show-sm-inline"> {result.seeders} Seeders · </span>
                {result.uploadDate}
                <span className="hide-sm-inline">· {result.category.name} · {result.subcategory.name}</span>
              </div>
            </div>
          </div>
        </Td>
        <Td className="hide-md">{result.size}</Td>
        <Td className="hide-sm">{result.seeders}</Td>
        <Td className="hide-md">{result.leechers}</Td>
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

  setSortOrder = (e: MouseEvent | KeyboardEvent) => {
    this.props.dispatch({
      type: 'SET_SORT_ORDER',
      payload: sortOrder[e.target.value],
    });

    this.fetchResults();
  }

  render() {
    const { params } = this.props;

    return (
      <div>
        <div className="clearfix">
          <h6 className="float-left hide-sm">Results for search term <b>{this.props.params.searchTerm}</b></h6>
          <FiltersWrapper className="float-right">
            <div className="form-group inline-block">
              <SortOrder className="form-select" onChange={this.setSortOrder}>
                {sortOrder.map((s, i) => (
                  <option value={i}>{s.label}</option>
                ))}
              </SortOrder>
            </div>
          </FiltersWrapper>
        </div>

        <Table>
          <Tr>
            <Td className="hide-sm">#</Td>
            <Td >Name</Td>
            <Td className="hide-md">File Size</Td>
            <Td className="hide-sm">Seeders</Td>
            <Td className="hide-md">Leechers</Td>
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

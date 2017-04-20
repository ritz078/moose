import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import withRedux from 'next-redux-wrapper';
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized';
import initStore from '../../store';
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
  font-size: 13px;
  height: 100vh;
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
        leechers: PropTypes.number
      })
    ).isRequired,
    dispatch: PropTypes.isRequired,
    params: PropTypes.shape({
      page: PropTypes.number,
      searchTerm: PropTypes.string
    }).isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedTorrentId: null,
      loadedRowsMap: {}
    };
  }

  getResults = () => {
    const { results, dispatch, params } = this.props;

    return results.data.map((result, i) => (
      <Tr
        key={result.id}
        onClick={() =>
          dispatch({
            type: 'FETCH_DETAILS',
            payload: result.magnetLink
          })}
      >
        <Td className="hide-sm">{(params.page - 1) * 30 + (i + 1)}</Td>
        <Td>
          <div className="tile tile-centered m-0">
            <div className="tile-content">
              <ResultTitle className="tile-title">
                <span className="show-sm-inline">{(params.page - 1) * 30 + (i + 1)}. </span>
                <Verified
                  data-tooltip={result.verified ? 'Verified' : 'Not verified'}
                  className="mdi mdi-verified tooltip tooltip-right"
                  active={result.verified}
                />
                {' '}
                {result.name}
              </ResultTitle>
              <div className="tile-meta">
                <span className="show-sm-inline">{result.size} ·</span>
                <span className="show-sm-inline"> {result.seeders} Seeders · </span>
                <span className="show-sm-inline">
                  {result.category.name} · {result.subcategory.name}
                </span>
              </div>
            </div>
          </div>
        </Td>
        <Td className="hide-md">{result.uploadDate}</Td>
        <Td className="hide-md">{result.size}</Td>
        <Td className="hide-sm">{result.seeders}</Td>
        <Td className="hide-md">{result.leechers}</Td>
      </Tr>
    ));
  };

  fetchResults = () => {
    this.props.dispatch({
      type: 'FETCH_RESULTS'
    });
  };

  setSortOrder = (e: MouseEvent | KeyboardEvent) => {
    this.props.dispatch({
      type: 'SET_SORT_ORDER',
      payload: sortOrder[e.target.value]
    });

    this.fetchResults();
  };

  loadMoreRows = () => {
    this.props.dispatch({ type: 'SET_PAGE', payload: this.props.params.page + 1 });
    this.fetchResults();
  };

  rowRenderer = ({ index }) => {
    if (index === 0) {
      return (
        <Tr>
          <Td className="hide-sm">#</Td>
          <Td>Name</Td>
          <Td className="hide-md">Uploaded</Td>
          <Td className="hide-md">File Size</Td>
          <Td className="hide-sm mdi mdi-arrow-down-bold" />
          <Td className="hide-md mdi mdi-arrow-up-bold" />
        </Tr>
      );
    }
    return this.getResults();
  };

  isRowLoaded = ({ index }) => {
    const { loadedRowsMap } = this.state;
    return !!loadedRowsMap[index]; // STATUS_LOADING or STATUS_LOADED
  };

  render() {
    return (
      <div>
        <div className="clearfix">
          <h6 className="float-left hide-sm">
            Results for search term <b>{this.props.params.searchTerm}</b>
          </h6>
          <FiltersWrapper className="float-right">
            <div className="form-group inline-block">
              <SortOrder className="form-select" onChange={this.setSortOrder}>
                {sortOrder.map((s, i) => <option value={i}>{s.label}</option>)}
              </SortOrder>
            </div>
          </FiltersWrapper>
        </div>

        <Table>
          <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={100}
          >
            {({ onRowsRendered, registerChild }) => (
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    ref={registerChild}
                    onRowsRendered={onRowsRendered}
                    className={'results-list'}
                    rowCount={50}
                    height={height}
                    width={width}
                    rowHeight={43}
                    rowRenderer={this.rowRenderer}
                  />
                )}
              </AutoSizer>
            )}
          </InfiniteLoader>

        </Table>
      </div>
    );
  }
}

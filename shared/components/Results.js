import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import withRedux from 'next-redux-wrapper';
import { InfiniteLoader, List } from 'react-virtualized';
import initStore from '../../store';
import sortOrder from '../constants/sortOrder';

const Verified = styled.i`
  font-size: 14px;
  vertical-align: top;
  color: ${props => (props.active ? 'limegreen' : '#bdbdbd')};
`;

const Table = styled.div`
  flex: 1;
  font-size: 13px;
`;

const Td = styled.div`
  border-bottom: 0.1rem solid #f1f1f1;
  padding: 10px 10px;
  text-align: left;
  vertical-align: middle;
  flex: ${props => props.flex};
`;

const Tr = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  &:nth-of-type(2n){
    background-color: #f8f8f8
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
  max-width: 500px;
`;

@withRedux(initStore, ({ results, params, loading }) => ({ results, params, loading }))
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

  getResult = (index, style) => {
    const { results, dispatch } = this.props;

    const result = results.data[index];

    return (
      <Tr
        key={result.id}
        data-id={result.id}
        style={style}
        onClick={() =>
          dispatch({
            type: 'FETCH_DETAILS',
            payload: result.magnetLink
          })}
      >
        <Td flex={0.5}>{index + 1}</Td>
        <Td flex={10}>
          <ResultTitle className="tile-title text-ellipsis">
            <Verified
              data-tooltip={result.verified ? 'Verified' : 'Not verified'}
              className="mdi mdi-verified tooltip tooltip-right"
              active={result.verified}
            />
            {' '}
            {result.name}
          </ResultTitle>
        </Td>
        <Td flex={2}>{result.uploadDate}</Td>
        <Td flex={2}>{result.size}</Td>
        <Td flex={1}>{result.seeders}</Td>
        <Td flex={1}>{result.leechers}</Td>
      </Tr>
    );
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
    if (this.props.loading) return;
    this.props.dispatch({ type: 'SET_PAGE', payload: this.props.params.page + 1 });
    if (this.props.params.page > 1) this.fetchResults();
  };

  rowRenderer = ({ index, style }) => {
    if (this.props.results.data[index]) {
      return this.getResult(index, style);
    }
    return <div style={style} className="loading" />;
  };

  isRowLoaded = ({ index }) => {
    const { results } = this.props;
    return !!results.data[index];
  };

  render() {
    const rowCount = this.props.results.data.length + 1;
    return (
      <Table>
        <Tr style={{ padding: '0 20px' }} className="text-bold">
          <Td flex={0.5}>#</Td>
          <Td flex={10}>Name</Td>
          <Td flex={2}>Uploaded</Td>
          <Td flex={2}>File Size</Td>
          <Td flex={1} className="mdi mdi-arrow-down-bold" />
          <Td flex={1} className="mdi mdi-arrow-up-bold" />
        </Tr>
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          rowCount={rowCount}
          minimumBatchSize={1}
          threshold={1}
        >
          {({ onRowsRendered, registerChild }) => (
            <List
              ref={registerChild}
              height={678}
              onRowsRendered={onRowsRendered}
              className={'results-list'}
              rowCount={rowCount}
              width={1000}
              rowHeight={41}
              overscanRowCount={5}
              rowRenderer={this.rowRenderer}
              estimatedRowSize={41}
            />
          )}
        </InfiniteLoader>
      </Table>
    );
  }
}

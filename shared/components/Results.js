import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styled from 'styled-components';
import withRedux from 'next-redux-wrapper';
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized';
import initStore from '../../store';
import sortOrder from '../constants/sortOrder';
import Description from './Description';

const Verified = styled.i`
  font-size: 14px;
  vertical-align: top;
  color: ${props => (props.active ? 'limegreen' : '#bdbdbd')};
`;

const Table = styled.div`
  flex: 1;
  font-size: 13px;
  display: flex;
  flex-direction: column;
`;

const Td = styled.div`
  border-bottom: 0.1rem solid #f1f1f1;
  padding: 10px 10px;
  text-align: left;
  vertical-align: middle;
  flex: ${props => props.flex};
`;

const Tr = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'column'};
  &.row-even{
    background-color: #f8f8f8
  }
`;

const ResultTitle = styled.div`
  max-width: 500px;
`;

const SortIcon = styled.i`
  font-size: 16px;
  color: #aaa;
  &:hover {
    color: #555;
  }
`;

@withRedux(initStore, ({ results, params, loading, details }) => ({
  results,
  params,
  loading,
  details
}))
export default class Results extends PureComponent {
  static propTypes = {
    results: PropTypes.shape({
      data: PropTypes.arrayOf(
        PropTypes.shape({
          magnetLink: PropTypes.string,
          verified: PropTypes.bool,
          size: PropTypes.string,
          seeders: PropTypes.number,
          leechers: PropTypes.number
        })
      )
    }).isRequired,
    dispatch: PropTypes.isRequired,
    params: PropTypes.shape({
      page: PropTypes.number,
      searchTerm: PropTypes.string,
      sortBy: PropTypes.string,
      orderBy: PropTypes.string
    }).isRequired,
    loading: PropTypes.bool.isRequired,
    details: PropTypes.shape({
      name: PropTypes.string
    })
  };

  static defaultProps = {
    details: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: null
    };
  }

  getResult = (index, style) => {
    const { results, dispatch, details, loading } = this.props;
    const { selectedIndex } = this.state;

    const result = results.data[index];

    const mainClass = cn({
      'row-even': index % 2 === 0
    });

    return (
      <Tr key={result.id} data-id={result.id} style={style} className={mainClass}>
        <div
          style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }}
          onClick={() => {
            if (selectedIndex === index && (details.name === result.name || loading)) return;
            this.setState(
              {
                selectedIndex: index
              },
              () => {
                const i = Math.min(index, selectedIndex);
                return this.listRef.recomputeRowHeights(i);
              }
            );
            return dispatch({
              type: 'FETCH_DETAILS',
              payload: result.magnetLink
            });
          }}
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
        </div>
        {this.state.selectedIndex === index && <Description />}
      </Tr>
    );
  };

  fetchResults = () => {
    this.props.dispatch({
      type: 'FETCH_RESULTS'
    });
  };

  setSortOrder = (e: MouseEvent | KeyboardEvent) => {
    const { orderBy, sortBy } = this.props.params;

    const ob = e.target.dataset.sortType;
    const sb = orderBy !== ob ? 'desc' : sortBy === 'desc' ? 'asc' : 'desc';

    const x = {
      sortBy: sb,
      orderBy: ob
    };

    this.props.dispatch({
      type: 'SET_SORT_ORDER',
      payload: x
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

  getHeight = ({ index }) => {
    if (index === this.state.selectedIndex) return 350;
    return 41;
  };

  render() {
    const rowCount = this.props.results.data.length + 1;

    const { orderBy, sortBy } = this.props.params;

    function getClass(order) {
      return cn('mdi', {
        'mdi-unfold-more': orderBy !== order,
        'mdi-chevron-double-down black': orderBy === order && sortBy === 'desc',
        'mdi-chevron-double-up black': orderBy === order && sortBy === 'asc'
      });
    }

    return (
      <Table>
        <Tr direction="row" style={{ padding: '0 20px' }} className="text-bold">
          <Td flex={0.5}>#</Td>
          <Td flex={10}>Name</Td>
          <Td data-sort-type="date" onClick={this.setSortOrder} className="pointer" flex={2}>
            Uploaded <SortIcon className={getClass('date')} />
          </Td>
          <Td data-sort-type="size" onClick={this.setSortOrder} className="pointer" flex={2}>
            File Size <SortIcon className={getClass('size')} />
          </Td>
          <Td data-sort-type="seeds" onClick={this.setSortOrder} className="pointer" flex={1}>
            Seeds<SortIcon className={getClass('seeds')} />
          </Td>
          <Td flex={1}>Leech</Td>
        </Tr>
        <div style={{ flex: 1 }}>
          <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={rowCount}
            minimumBatchSize={1}
            threshold={5}
          >
            {({ onRowsRendered, registerChild }) => (
              <AutoSizer>
                {({ width, height }) => (
                  <List
                    ref={(x) => {
                      this.listRef = x;
                      registerChild(x);
                    }}
                    height={height}
                    onRowsRendered={onRowsRendered}
                    className={'results-list'}
                    rowCount={rowCount}
                    width={width}
                    rowHeight={this.getHeight}
                    overscanRowCount={5}
                    rowRenderer={this.rowRenderer}
                  />
                )}
              </AutoSizer>
            )}
          </InfiniteLoader>
        </div>
      </Table>
    );
  }
}

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styled from 'styled-components';
import withRedux from 'next-redux-wrapper';
import Ink from 'react-ink';
import { findIndex, isEmpty } from 'lodash';
import { ipcRenderer } from 'electron';
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized';
import initStore from '../store';
import Description from './Description';
import { showToast } from './Toast';
import getCategoryIcon from '../utils/getCategoryIcon';
import DotLoader from './DotLoader';

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
  vertical-align: middle;
  flex: ${props => props.flex || 1};
`;

const Tr = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'column'};
  &.row-even{
    background-color: #f8f8f8
  }
`;

const ResultTitle = styled.div`
  max-width: 475px;
`;

const SortIcon = styled.i`
  font-size: 12px;
  color: #aaa;
  font-weight: bold;
  &:hover {
    color: #555;
  }
`;

const DefaultRow = styled.div`
  display: flex;
  flex-direction: row;
  height: 41px;
  cursor: pointer;
  position: relative;
`;

const LoaderWrapper = styled.div`
  position: absolute;
  align-self: center;
  margin-top: 30vh;
  z-index: 10;
`;

@withRedux(initStore, ({ results, params, download }) => ({
  results,
  params,
  download,
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
          leechers: PropTypes.number,
        }),
      ),
      loading: PropTypes.bool,
    }).isRequired,
    dispatch: PropTypes.isRequired,
    params: PropTypes.shape({
      page: PropTypes.number,
      searchTerm: PropTypes.string,
      sortBy: PropTypes.string,
      orderBy: PropTypes.string,
    }).isRequired,
    download: PropTypes.shape({
      magnetLink: PropTypes.string,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: null,
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.areResultsDifferent(this.props, newProps)) {
      this.setState({
        selectedIndex: null,
      });
    }
  }

  componentDidUpdate(oldProps) {
    if (this.areResultsDifferent(oldProps, this.props)) {
      this.listRef.forceUpdateGrid();
      this.listRef.recomputeRowHeights(0);
    }
  }

  getDetails = (e, index) => {
    const { dispatch, results } = this.props;
    const { selectedIndex } = this.state;

    const result = results.data[index];

    if (selectedIndex === index) {
      this.setState(
        {
          selectedIndex: null,
        },
        () => {
          const i = Math.min(index, selectedIndex);
          return this.listRef.recomputeRowHeights(i);
        },
      );
      return;
    }

    this.setState(
      {
        selectedIndex: index,
      },
      () => {
        const i = Math.min(index, selectedIndex);
        return this.listRef.recomputeRowHeights(i);
      },
    );

    dispatch({
      type: 'FETCH_DETAILS',
      payload: result.magnetLink,
    });
  };

  getResult = (index, style) => {
    const { results } = this.props;

    const result = results.data[index];

    const mainClass = cn({
      'row-even': index % 2 === 0,
    });

    const downloadClass = cn('mdi mdi-download fs-18', {
      downloading: this.isBeingDownloaded(result.magnetLink),
    });

    return (
      <Tr key={result.id} data-id={result.id} style={style} className={mainClass}>
        <DefaultRow onClick={e => this.getDetails(e, index)}>
          <Td flex={0.5}>{index + 1}</Td>
          <Td flex={0.5}>
            {getCategoryIcon(`${result.category.name} | ${result.subcategory.name}`)}
          </Td>
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
          <Td>{result.seeders}</Td>
          <Td>{result.leechers}</Td>
          <Td flex={0.5} onClick={e => this.addToDownload(e, result)} style={{ zIndex: 99 }}>
            <i className={downloadClass} />
          </Td>
          <Ink />
        </DefaultRow>
        {this.state.selectedIndex === index && <Description />}
      </Tr>
    );
  };

  setSortOrder = (e: MouseEvent | KeyboardEvent) => {
    const { orderBy, sortBy } = this.props.params;

    const ob = e.currentTarget.dataset.sortType;
    let sb;
    if (orderBy !== ob) {
      sb = 'desc';
    } else {
      sb = sortBy === 'desc' ? 'asc' : 'desc';
    }

    const x = {
      sortBy: sb,
      orderBy: ob,
    };

    this.props.dispatch({
      type: 'SET_PAGE',
      payload: 1,
    });

    this.props.dispatch({
      type: 'SET_SORT_ORDER',
      payload: x,
    });

    this.fetchResults();
  };

  getHeight = ({ index }) => {
    if (index === this.state.selectedIndex) return 350;
    return 41;
  };

  getTableHeader = () => {
    const { orderBy, sortBy } = this.props.params;

    function getClass(order) {
      return cn('mdi', {
        'mdi-unfold-more-horizontal': orderBy !== order,
        'mdi-chevron-double-down black': orderBy === order && sortBy === 'desc',
        'mdi-chevron-double-up black': orderBy === order && sortBy === 'asc',
      });
    }

    return (
      <Tr direction="row" style={{ padding: '0 20px' }} className="text-bold">
        <Td flex={0.5}>#</Td>
        <Td flex={0.5} />
        <Td flex={10}>Name</Td>
        <Td data-sort-type="date" onClick={this.setSortOrder} className="pointer" flex={2}>
          Uploaded <SortIcon className={getClass('date')} />
        </Td>
        <Td data-sort-type="size" onClick={this.setSortOrder} className="pointer" flex={2}>
          File Size <SortIcon className={getClass('size')} />
        </Td>
        <Td data-sort-type="seeds" onClick={this.setSortOrder} className="pointer">
          Seeds<SortIcon className={getClass('seeds')} />
        </Td>
        <Td>Leech</Td>
        <Td flex={0.5} />
      </Tr>
    );
  };

  /**
   * Tells whether the search results are for a different search term.
   * @param oldProps
   * @param newProps
   * @returns {boolean}
   */
  areResultsDifferent = (oldProps, newProps) =>
    oldProps.results.data !== newProps.results.data && newProps.params.page === 1;

  addTorrentToDownload = (infoHash) => {
    ipcRenderer.send('add_torrent_to_download', infoHash);
  };

  isRowLoaded = ({ index }) => {
    const { results } = this.props;
    return !!results.data[index];
  };

  rowRenderer = ({ index, style }) => {
    const { results } = this.props;
    if (results.data[index]) {
      return this.getResult(index, style);
    }
    return <div key="loading" style={style} className="loading" />;
  };

  loadMoreRows = () => {
    if (this.props.results.loading) return;
    this.props.dispatch({
      type: 'SET_PAGE',
      payload: this.props.params.page + 1,
    });
    this.fetchResults();
  };

  fetchResults = () => {
    this.props.dispatch({
      type: 'FETCH_RESULTS',
    });
  };

  addToDownload = (e, result) => {
    e.preventDefault();
    e.stopPropagation();
    e.cancelBubble = true;
    if (this.isBeingDownloaded(result.infoHash)) {
      showToast('Already present in the download list', 'warning');
      return;
    }
    this.addTorrentToDownload(result.infoHash);
    showToast('Successfully added to the download list.', 'success');
    this.props.dispatch({
      type: 'ADD_TO_DOWNLOAD_LIST',
      payload: result,
    });
  };

  isBeingDownloaded = infoHash => findIndex(this.props.download, o => o.infoHash === infoHash) >= 0;

  render() {
    const { results } = this.props;

    const rowCount = results.data.length + 1;

    const mainClass = cn({
      'loading-results': results.loading,
    });

    return (
      <Table className={mainClass}>
        {this.getTableHeader()}
        {!isEmpty(this.props.results.data) &&
          <div style={{ flex: 1 }}>
            <InfiniteLoader
              isRowLoaded={this.isRowLoaded}
              loadMoreRows={this.loadMoreRows}
              rowCount={rowCount}
              minimumBatchSize={1}
              threshold={5}
            >
              {({ onRowsRendered, registerChild }) =>
                (<AutoSizer>
                  {({ width, height }) =>
                    (<List
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
                    />)}
                </AutoSizer>)}
            </InfiniteLoader>
          </div>}
        {results.loading && <LoaderWrapper><DotLoader /></LoaderWrapper>}
      </Table>
    );
  }
}

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

const SortOrder = styled.select`
  border-color: #f1f1f1 !important;
  height: 42px !important;
  display: inline-block;
  margin-right: 10px;
  cursor: pointer;
  appearance: none;
`;

const FiltersWrapper = styled.div`
  width: 330px;
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
          <div className="tile tile-centered m-0">
            <div className="tile-content">
              <div className="tile-title" style={{ maxWidth: '500px' }}>{result.name}</div>
              <div className="tile-meta">
                <Verified
                  data-tooltip={result.verified ? 'Verified' : 'Not verified'}
                  className="mdi mdi-verified tooltip tooltip-right"
                  active={result.verified}
                /> · {result.uploadDate} · {result.category.name} · {result.subcategory.name}</div>
            </div>
          </div>
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
          <h5 className="float-left">Results for search term <b>{this.props.results.searchTerm}</b></h5>
          <FiltersWrapper className="float-right">
            <div className="form-group inline-block">
              <SortOrder className="form-select" onChange={this.setSortOrder}>
                {sortOrder.map((s, i) => (
                  <option value={i}>{s.label}</option>
                ))}
              </SortOrder>
            </div>
            <div className="form-group inline-block">
              <Pagination
                onNextClick={this.onNextClick}
                onPrevClick={this.onPrevClick}
                currentPage={params.page}
              />
            </div>
          </FiltersWrapper>
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

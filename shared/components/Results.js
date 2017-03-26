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
      <tr
        style={{ cursor: 'pointer' }}
        key={result.id}
        onClick={() => dispatch({
          type: 'FETCH_DETAILS',
          payload: result.magnetLink,
        })}
      >
        <td>{i + 1}</td>
        <td>
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
        </td>
        <td>{result.size}</td>
        <td>{result.seeders}</td>
        <td>{result.leechers}</td>
      </tr>
    ));
  }

  render() {
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th >Name</th>
            <th>File Size</th>
            <th>Seeders</th>
            <th>Leechers</th>
          </tr>
        </thead>
        <tbody>
          {this.getResults()}
        </tbody>
      </table>
    );
  }
}

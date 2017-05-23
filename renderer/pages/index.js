/* eslint-disable react/no-did-mount-set-state */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import styled from 'styled-components';
import Header from '../components/Header';
import initStore from '../store';
import Results from '../components/Results';
import Layout from '../components/Layout';
import Description from '../components/Description';
import isMagnet from '../utils/isMagnet';

const Content = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  padding-top: 20px;
`;

@withRedux(
  initStore,
  ({ results, loading, details, params, cast, download, selectedTorrent }) => ({
    results,
    loading,
    details,
    params,
    cast,
    download,
    selectedTorrent
  })
)
export default class Home extends PureComponent {
  static propTypes = {
    results: PropTypes.shape({
      data: PropTypes.array,
      searchTerm: PropTypes.string
    }),
    loading: PropTypes.bool.isRequired,
    details: PropTypes.shape({
      name: PropTypes.string,
      torrentId: PropTypes.string,
      files: PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
        size: PropTypes.string
      })
    }).isRequired,
    dispatch: PropTypes.func,
    params: PropTypes.shape({
      searchTerm: PropTypes.string
    }).isRequired,
    cast: PropTypes.array,
    download: PropTypes.array.isRequired,
    selectedTorrent: PropTypes.shape({
      name: PropTypes.string
    })
  };

  static defaultProps = {
    results: {},
    dispatch() {}
  };

  getContent() {
    const { results, details, dispatch } = this.props;

    if (this.isMagnetUrl()) {
      return (
        <Content>
          <div className="centered" style={{ width: '90%' }}>
            <h5>{details.name}</h5>
            <Description
              details={details}
              dispatch={dispatch}
              showOnlyDetails
            />
          </div>
        </Content>
      );
    }

    return (
      <Content>
        {results.data && !!results.data.length && <Results />}
      </Content>
    );
  }

  isMagnetUrl = () => {
    const { params } = this.props;
    return params.searchTerm && isMagnet(params.searchTerm);
  };

  render() {
    const {
      loading,
      details,
      cast,
      download,
      selectedTorrent,
      dispatch
    } = this.props;
    return (
      <Layout
        loading={loading || (details && details.loading)}
        cast={cast}
        download={download}
        selectedTorrent={selectedTorrent}
        dispatch={dispatch}
      >
        <Header />
        {this.getContent()}
      </Layout>
    );
  }
}

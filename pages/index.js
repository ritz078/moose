/* eslint-disable react/no-did-mount-set-state */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import styled from 'styled-components';
import initStore from '../store';
import Results from '../shared/components/Results';
import Layout from '../shared/components/Layout';
import Description from '../shared/components/Description';

const Right = styled.div`
  padding: 0;
  width: 100% !important;
  flex: none;
  position: fixed;
  left: 0;
  bottom: 0;
  box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.3);
  & > div {
    position: relative;
    width: 100%;
    background-color: #fff;
    max-height: 40vh;
  }
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  padding-top: 20px;
`;

@withRedux(initStore, ({ results, loading, details, params }) => ({
  results,
  loading,
  details,
  params
}))
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
    }).isRequired
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
          <div className="centered"><Description details={details} dispatch={dispatch} /></div>
        </Content>
      );
    }

    return (
      <Content>
        {results.data && !!results.data.length && <Results />}
        <Description details={details} dispatch={dispatch} />
      </Content>
    );
  }

  isMagnetUrl = () =>
    this.props.params.searchTerm &&
    this.props.params.searchTerm.match(/magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i) != null;

  render() {
    return <Layout loading={this.props.loading}>{this.getContent()}</Layout>;
  }
}

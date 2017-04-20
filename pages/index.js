/* eslint-disable react/no-did-mount-set-state */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import styled from 'styled-components';
import qs from 'query-string';
import initStore from '../store';
import Results from '../shared/components/Results';
import Layout from '../shared/components/Layout';
import Description from '../shared/components/Description';

const Left = styled.div`
  flex: 1;
  
  @media screen and (max-width: 1220px) {
    width: 100%;
  }
`;

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
  padding-top: 85px;
  padding-bottom: 30px;
  width: 100%;
  max-width: 1220px;
  margin:0 auto;
`;

const Main = styled.div`
  display: flex;
`;

@withRedux(initStore, ({ results, loading, details, params }) => ({
  results,
  loading,
  details,
  params,
}))
export default class Home extends PureComponent {
  static propTypes = {
    results: PropTypes.shape({
      data: PropTypes.array,
      searchTerm: PropTypes.string,
    }),
    loading: PropTypes.bool.isRequired,
    details: PropTypes.shape({
      name: PropTypes.string,
      torrentId: PropTypes.string,
      files: PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
        size: PropTypes.string,
      }),
    }).isRequired,
    dispatch: PropTypes.func,
    params: PropTypes.shape({
      searchTerm: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    results: {},
    dispatch() {},
  };

  constructor(props) {
    super(props);

    this.state = {
      url: '',
    };
  }

  componentDidMount() {
    this.decodeFilter();

    this.setState({
      url: window.location.href,
    });
  }

  componentWillReceiveProps() {
    if (this.state.url !== window.location.href) {
      this.decodeFilter(true);
    }

    this.setState({
      url: window.location.href,
    });
  }

  decodeFilter(fetch = false) {
    const { f } = qs.parse(window.location.search);
    if (f) {
      this.props.dispatch({
        type: 'DECODE_FILTER',
        payload: JSON.parse(atob(f)),
      });
    }

    if (fetch) {
      this.props.dispatch({
        type: 'FETCH_RESULTS',
      });
    }
  }

  getContent() {
    const { results, details, dispatch } = this.props;

    if (this.isMagnetUrl()) {
      return (
        <Main>
          <Content>
            <div className="centered"><Description details={details} dispatch={dispatch} /></div>
          </Content>
        </Main>
      );
    }

    return (
      <Main>
        <Content>
          <Left className="col-7 col-lg-12">
            {results.data && !!results.data.length && <Results />}
          </Left>
          <Right className="col-5">
            <Description fixed details={details} dispatch={dispatch} />
          </Right>
        </Content>
      </Main>
    );
  }

  isMagnetUrl = () =>
    this.props.params.searchTerm &&
    this.props.params.searchTerm.match(/magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i) != null;

  render() {
    return <Layout loading={this.props.loading}>{this.getContent()}</Layout>;
  }
}

/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import * as io from 'socket.io-client';
import * as cookie from 'js-cookie';
import styled from 'styled-components';
import Loading from 'react-loading-bar';
import Results from '../components/Results';
import Description from '../components/Description/Description';

const Left = styled.div`
  flex: 1;
`;

const Right = styled.div`
  padding: 0 0 0 20px;
  flex: 0 1 480px;
  & > div {
    width: 480px;
    max-height: calc(100vh - 110px);
  }
`;

const Content = styled.div`
  padding: 20px 5% 0;
  display: flex;
  padding-top: 85px;
  padding-bottom: 30px;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
`;

@connect(({ results, loading }) => ({ results, loading }))
export default class Home extends PureComponent {
  static propTypes = {
    results: PropTypes.shape({
      data: PropTypes.array,
      searchTerm: PropTypes.string,
    }),
    loading: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    results: {},
  }

  componentDidMount() {
    io.connect(`${window.location.protocol}//${window.location.host}?session_name=${cookie.get('session_name')}`);
  }

  isMagnetUrl = () => this.props.results.searchTerm.match(/magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i) != null

  render() {
    const { results, loading } = this.props;

    if (this.isMagnetUrl()) {
      return (
        <Main>
          <Content>
            <div className="centered"><Description /></div>
          </Content>
        </Main>
      );
    }

    return (
      <Main>
        <Content>
          <Helmet title="Home" />
          <Loading show={loading} color="#5764c6" />
          <Left className="col-7">
            {results.data && !!results.data.length && <Results />}
          </Left>
          <Right className="col-5">
            <Description fixed />
          </Right>
        </Content>
      </Main>
    );
  }
}

import React, { PureComponent, PropTypes } from 'react';
import withRedux from 'next-redux-wrapper';
import styled from 'styled-components';
import * as io from 'socket.io-client';
import cookie from 'js-cookie';
import initStore from '../store';
import Results from '../shared/components/Results';
import Layout from '../shared/components/Layout';
import Description from '../shared/components/Description';

const Left = styled.div`
  flex: 1;
`;

const Right = styled.div`
  padding: 0 0 0 20px;
  flex: 0 1 480px;
  & > div {
    width: 460px;
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

@withRedux(initStore, ({ results, loading, details }) => ({ results, loading, details }))
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
    }),
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    results: {},
    dispatch() {
    },
  }

  componentDidMount() {
    io.connect(`http://localhost:${SERVER_PORT}?session_name=${cookie.get('session_name')}`);
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
          <Left className="col-7">
            {results.data && !!results.data.length && <Results />}
          </Left>
          <Right className="col-5">
            <Description fixed details={details} dispatch={dispatch} />
          </Right>
        </Content>
      </Main>
    );
  }

  isMagnetUrl = () => this.props.results.searchTerm && this.props.results.searchTerm.match(/magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i) != null

  render() {
    return (
      <Layout loading={this.props.loading}>{this.getContent()}</Layout>
    );
  }
}

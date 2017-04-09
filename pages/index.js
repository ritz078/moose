import React, { PureComponent, PropTypes } from 'react';
import withRedux from 'next-redux-wrapper';
import styled from 'styled-components';
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
  padding: 0 0 0 20px;
  flex: 0 1 430px;
  & > div {
    width: 410px;
    max-height: calc(100vh - 110px);
  }
  
  @media screen and (max-width: 1220px) {
    padding: 0;
    width: 100% !important;
    flex: none;
    position: fixed;
    left: 0;
    bottom: 0;
    box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.3);
    max-height: 40vh;
    & > div {
      position: relative;
      width: 100%;
      background-color: #fff;
    }
  }
`;

const Content = styled.div`
  display: flex;
  padding-top: 85px;
  padding-bottom: 30px;
  width: 100%;
  max-width: 1220px;
  margin:0 auto;
  @media screen and (max-width: 1220px) {
    padding-bottom: 40vh;
  }
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  padding:0 20px;
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

  isMagnetUrl = () => this.props.results.searchTerm && this.props.results.searchTerm.match(/magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i) != null

  render() {
    return (
      <Layout loading={this.props.loading}>{this.getContent()}</Layout>
    );
  }
}

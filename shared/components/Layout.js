import React, { PropTypes } from 'react';
import Head from 'next/head';
import Loading from 'react-loading-bar';

import stylesheet from '../../styles/index.less';
import Header from './Header';

export default function Layout({ children, loading }) {
  return (<div>
    <Head>
      <title>Snape</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
    </Head>
    <Loading show={loading} color="#3f51b5" />
    <Header />

    { children }
  </div>);
}

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  loading: PropTypes.bool.isRequired,
};

Layout.defaultProps = {
  children: [],
};

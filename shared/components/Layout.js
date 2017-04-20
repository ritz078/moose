import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Loading from 'react-loading-bar';
import { ToastContainer } from 'react-toastify';

import stylesheet from '../../styles/index.less';
import Header from './Header';

export default function Layout({ children, loading }) {
  return (
    <div>
      <Head>
        <title>Snape : A web application to search and stream torrents.</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" type="image/png" href="./static/images/favicon.png" />
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
      </Head>
      <Loading show={loading} showSpinner={false} color="#3f51b5" />
      <Header />

      {children}

      <ToastContainer autoClose={3000} position="bottom-center" />
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  loading: PropTypes.bool.isRequired
};

Layout.defaultProps = {
  children: []
};

import React from 'react';
import Head from 'next/head';

import stylesheet from '../../styles/index.less';
import Header from './Header';

export default ({ children, title = 'Snape' }) => (
  <div>
    <Head>
      <title>{ title }</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
    </Head>
    <Header />

    { children }
  </div>
);

import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  render() {
    const sheet = new ServerStyleSheet();
    const main = sheet.collectStyles(<Main />);
    const styleTags = sheet.getStyleElement();
    return (
      <html>
        <Head>
          {styleTags}
        </Head>
        <body>
          <Main>
            <div className="root">
              {main}
            </div>
          </Main>
          <NextScript />
        </body>
      </html>
    );
  }
}

/* eslint-disable global-require */

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { withAsyncComponents } from 'react-async-component';
import { Provider } from 'react-redux';

import App from '../shared/views';
import configureStore from '../config/configureStore';

// Get the DOM Element that will host our React application.
const container = document.querySelector('#app');

// Does the user's browser support the HTML5 history API?
const supportsHistory = 'pushState' in window.history;

/**
 * Renders the given React Application component.
 */
function renderApp(TheApp) {
  const app = (
    <Provider store={configureStore()}>
      <BrowserRouter forceRefresh={!supportsHistory}>
        <TheApp />
      </BrowserRouter>
    </Provider>
  );

  // We use the react-async-component in order to support code splitting of
  // our bundle output. It's important to use this helper.
  // @see https://github.com/ctrlplusb/react-async-component
  withAsyncComponents(app).then(({ appWithAsyncComponents }) =>
    render(appWithAsyncComponents, container),
  );
}

// Execute the first render of our app.
renderApp(App);

// This registers our service worker for asset caching and offline support.
// Keep this as the last item, just in case the code execution failed (thanks
// to react-boilerplate for that tip.)
require('./registerServiceWorker');

// The following is needed so that we can support hot reloading our application.
if (process.env.BUILD_FLAG_IS_DEV && module.hot) {
  // Accept changes to this file for hot reloading.
  module.hot.accept('../shared/views/Error404.js');
  // Any changes to our App will cause a hotload re-render.
  module.hot.accept(
    '../shared/views',
    () => renderApp(require('../shared/views').default),
  );
}

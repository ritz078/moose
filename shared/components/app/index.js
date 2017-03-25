import React from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';

import './globals.css';

import Error404 from './Error404';
import Header from './Header';
import Home from './Home'

function DemoApp() {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route component={Error404} />
      </Switch>
    </div>
  );
}

export default DemoApp;

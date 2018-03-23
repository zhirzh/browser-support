/**
 * @flow
 * @prettier
 */

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import registerServiceWorker from './registerServiceWorker';

import './index.css';

ReactDOM.render(
  <App />,

  // $FlowFixMe
  document.getElementById('root')
);

registerServiceWorker();

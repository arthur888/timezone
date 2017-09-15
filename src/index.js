import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './AppRouter'; // includes AppRouter.js
import config from './Config';
require('babel-polyfill');

config.get();

ReactDOM.render(
  <AppRouter />,
  document.getElementById('root')
);

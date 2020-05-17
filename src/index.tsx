import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import * as Sentry from '@sentry/browser';
import 'mobx-react-lite/batchingForReactDom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, AppStoreProvider } from './store';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
});

if (process.env.REACT_APP_GA_UA_ID) {
  ReactGA.initialize(process.env.REACT_APP_GA_UA_ID, {
    debug: process.env.NODE_ENV === 'development',
    titleCase: false,
  });
}

const appStore = createStore();

ReactDOM.render(
  <AppStoreProvider value={appStore}>
    <App />
  </AppStoreProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

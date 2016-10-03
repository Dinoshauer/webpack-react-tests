'use strict';
import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';

import App from './App/App';
import Home from './App/Home';

import rootReducer from './redux';

const configureStore = (initialState) => {
  let store = createStore(
    rootReducer,
    window.devToolsExtension && window.devToolsExtension(),
    compose(applyMiddleware(ReduxThunk))
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./redux', () => {
      const nextReducer = require('./redux/index').default;

      store.replaceReducer(nextReducer);
    });
  }

  return store;
};

const router = (
  <Provider store={configureStore()}>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={Home} />
      </Route>
    </Router>
  </Provider>
);

render(router, document.getElementById('app'));

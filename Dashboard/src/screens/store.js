// @flow

import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from './reducer';

function configureStore(initState) {
  const logger = createLogger();

  const enhancers = [];
  const middlewares = [];


  if (true) {
    const devToolsExtension = window.devToolsExtension
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }

    middlewares.push(logger);
  }

  middlewares.push(thunk);
  const enhancer = compose(
    applyMiddleware(...middlewares),
    ...enhancers
  );

  const store = createStore(
    rootReducer,
    initState,
    enhancer
  );

  return store;
}

export default configureStore;

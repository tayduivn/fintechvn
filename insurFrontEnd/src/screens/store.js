// @flow

import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from './reducer';

function configureStore(initialState: any, history: any) {
  const logger = createLogger();

  const enhancers = [];
  const middlewares = [];

  // FIXME: Check if in production mode
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
    initialState,
    enhancer
  );

  return store;
}

export default configureStore;

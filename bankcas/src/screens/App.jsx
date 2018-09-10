import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';

import { KEY_SESSION } from 'config/constants';
import { NotifycationProvider } from 'components';
import { localStorage, sessionStorage } from 'utils';
import configureStore from './store';
import Routes from './Routes';
import i18n from './i18n';

let initialState = localStorage.loadState(KEY_SESSION);
if(undefined === initialState.session) initialState = sessionStorage.loadState(KEY_SESSION);

let store         = configureStore(initialState);

class App extends Component {
  render() {
    return (
      <NotifycationProvider>
        <Provider store={ store } >
          <I18nextProvider i18n={ i18n }>
            <Router>
              <Routes />
            </Router>
          </I18nextProvider>
        </Provider>
      </NotifycationProvider>
      
    );
  }
}

export default App;

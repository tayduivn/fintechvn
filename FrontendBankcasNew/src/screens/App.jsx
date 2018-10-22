import * as React                   from 'react';
import { BrowserRouter as Router }  from 'react-router-dom';
import { Provider }                 from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import { NotifycationProvider }   from 'components';
import { localStorage, sessionStorage } from 'utils';
import Routes                     from './Routes';
import configureStore             from './store';
import { KEY_SESSION } from 'config/constants';

import i18n from './i18n';

let initialState = localStorage.loadState(KEY_SESSION);
if(undefined === initialState.session) initialState = sessionStorage.loadState(KEY_SESSION);

let store = configureStore(initialState);

class App extends React.Component{
  render(){
    return (
      <NotifycationProvider >
        <Provider store={ store }>
          <I18nextProvider i18n={ i18n }>
            <Router>
              <Routes />
            </Router>
          </I18nextProvider>
        </Provider>
      </NotifycationProvider>
    )
  }
}

export default App;
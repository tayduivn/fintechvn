import * as React                   from 'react';
import { BrowserRouter as Router }  from 'react-router-dom';
import { Provider }                 from 'react-redux';

import { NotifycationProvider }   from 'components';
import { localStorage, sessionStorage } from 'utils';
import Routes                     from './Routes';
import configureStore             from './store';
import { KEY_SESSION } from 'config/constants';

let initialState = localStorage.loadState(KEY_SESSION);
if(undefined === initialState.session) initialState = sessionStorage.loadState(KEY_SESSION);

let store = configureStore(initialState);

class App extends React.Component{
  render(){
    return (
      <NotifycationProvider >
        <Provider store={ store }>
          <Router>
            <Routes />
          </Router>
        </Provider>
      </NotifycationProvider>
    )
  }
}

export default App;
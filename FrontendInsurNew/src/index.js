import React from 'react';
import ReactDOM from 'react-dom';

import { App }  from 'screens';

import registerServiceWorker from './registerServiceWorker';

import 'assets/bootstrap/dist/css/bootstrap.min.css';
import 'assets/css/animate.css';
import 'assets/css/style.css';
import 'assets/css/colors/default-dark.css';
import 'assets/css/style_custom.css';
import 'styles/custom.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

import React from 'react';
import ReactDOM from 'react-dom';

import { App } from 'screens';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

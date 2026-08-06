import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { register } from './registerServiceWorker';
import applySeasonalFavicon from './helpers/seasonalFavicon';

ReactDOM.render(<App />, document.getElementById('root'));

register();
applySeasonalFavicon();

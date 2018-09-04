import React from 'react';
import './polyfills.js';

import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './App'
import './index.scss';
import store from './store/configureStore';
import registerServiceWorker from './registerServiceWorker';
import { CookiesProvider } from 'react-cookie';

ReactDOM.render(
	(
		<Provider store={store}>
			<CookiesProvider>
				<App />
			</CookiesProvider>
		</Provider>
	),
	document.getElementById('root')
);
registerServiceWorker();

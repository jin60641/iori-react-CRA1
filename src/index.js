import React from 'react';
import './polyfills.js';

import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './App'
import './index.css';
import configureStore from './store/configureStore';
import registerServiceWorker from './registerServiceWorker';
import { CookiesProvider } from 'react-cookie';

let store = configureStore();

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

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

export default function configureStore() {
	let middlewares = [thunk];

	return createStore(
		rootReducer,
		compose(
			applyMiddleware(...middlewares)
		)
	);
}

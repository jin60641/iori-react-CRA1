import { createStore, applyMiddleware, compose } from 'redux';
import rootEpic from '../actions';
import rootReducer from '../reducers';

import thunk from 'redux-thunk';
import { createEpicMiddleware } from 'redux-observable';

const epicMiddleware = createEpicMiddleware();

const middlewares = [epicMiddleware,thunk];

const store = createStore(
	rootReducer,
	compose(
		applyMiddleware(...middlewares)
	)
);
epicMiddleware.run(rootEpic)

export default store;


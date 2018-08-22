import { createStore, applyMiddleware, compose } from 'redux';
import rootEpic from '../actions';
import rootReducer from '../reducers';

import { createEpicMiddleware } from 'redux-observable';

const epicMiddleware = createEpicMiddleware();

const middlewares = [epicMiddleware];

const store = createStore(
	rootReducer,
	compose(
		applyMiddleware(...middlewares)
	)
);
epicMiddleware.run(rootEpic)

store.getState().socket.on('*', (event,data) => store.dispatch({ type : event, payload : data }) );

export default store;


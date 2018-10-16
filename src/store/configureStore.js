import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from '../actions';
import rootReducer from '../reducers';


const epicMiddleware = createEpicMiddleware();

const middlewares = [epicMiddleware];

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(...middlewares),
  ),
);
epicMiddleware.run(rootEpic);

store.getState().socket.on('*', (event, data) => store.dispatch({ type: event, payload: data }));

export default store;

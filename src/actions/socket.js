import createAction from './createAsyncAction';

import { from, fromEvent, of } from 'rxjs'
import { bindActionCreators } from 'redux'
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { ofType, combineEpics } from 'redux-observable';

import { newsfeedSocket } from './newsfeed.js';


export const connectSocket = createAction('CONNECT_SOCKET');
export const closeSocket = createAction('CLOSE_SOCKET');

export const fetchCloseSocket = () => {
  return closeSocket();
};

const socketEpic = (action$,state$) => action$.pipe(
  ofType(connectSocket.REQUEST),
  mergeMap(action => from(
    new Promise( resolve => {
      state$.value.socket.emit('login');
      resolve();
    })
  )),
  map( () => connectSocket.SUCCESS() )
);

export default combineEpics(
  socketEpic
);

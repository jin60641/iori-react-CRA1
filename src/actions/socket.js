
import { from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ofType, combineEpics } from 'redux-observable';
import createAction from './createAsyncAction';

export const connectSocket = createAction('CONNECT_SOCKET');
export const closeSocket = createAction('CLOSE_SOCKET');

export const fetchCloseSocket = () => closeSocket();

const socketEpic = (action$, state$) => action$.pipe(
  ofType(connectSocket.REQUEST),
  mergeMap(action => from(
    new Promise((resolve) => {
      state$.value.socket.emit('login');
      resolve();
    }),
  )),
  map(() => connectSocket.SUCCESS()),
);

export default combineEpics(
  socketEpic,
);

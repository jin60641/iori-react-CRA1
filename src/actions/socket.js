import createAction from './createAsyncAction';

import { from, fromEvent, of } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';

import { chatSocket } from './chat.js';
import { newsfeedSocket } from './newsfeed.js';
import io from 'socket.io-client';

export const connectSocket = createAction('CONNECT_SOCKET');
export const closeSocket = createAction('CLOSE_SOCKET');

export const fetchCloseSocket = () => {
	return closeSocket();
};

function init(socket, dispatch) {
	socket.on('disconnect', () => {
		console.log('disconnected!!!');
	});
}

const socketEpic = action$ => action$.pipe(
  ofType(connectSocket.REQUEST),
  mergeMap(action => from(
    new Promise( resolve => {
      const socket = io();
      chatSocket(socket);
      resolve(socket);
    })
  )),
  map( test => {
    return connectSocket.SUCCESS();
  })
  /*
    chatSocket(socket);
    return from(socket);
  })
  .map( () => {
    return connectSocket.SUCCESS();
  })
  */
);


export default socketEpic;


import { from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';
import createAction from './createAsyncAction';
import api from '../api/chat';

export const getChats = createAction('GET_CHATS');
export const getChat = createAction('GET_CHAT');
export const getDialogs = createAction('GET_DIALOGS');
export const getDialog = createAction('GET_DIALOG');
export const sendChat = createAction('SEND_CHAT');
export const makeGroup = createAction('MAKE_GROUP');

const getChatEpic = action$ => action$.pipe(
  ofType(getChat.ORIGIN),
  mergeMap(action => [
    getChat.SUCCESS(action.payload),
    getDialog.SUCCESS(action.payload),
  ]),
);

const getChatsEpic = action$ => action$.pipe(
  ofType(getChats.REQUEST),
  mergeMap(action => from(api.getChats(action.payload))),
  map(body => (body.data
    ? getChats.SUCCESS(body.data)
    : getChats.FAILURE(new Error(body.message)))),
);

const getDialogsEpic = action$ => action$.pipe(
  ofType(getDialogs.REQUEST),
  mergeMap(action => from(api.getDialogs(action.payload))),
  map(body => (body.data
    ? getDialogs.SUCCESS(body.data)
    : getDialogs.FAILURE(new Error(body.message)))),
);

const sendChatEpic = action$ => action$.pipe(
  ofType(sendChat.REQUEST),
  mergeMap(action => from(api.sendChat(action.payload))),
  mergeMap(body => (body.data
    ? [sendChat.SUCCESS(body.data), getDialog.SUCCESS(body.data)]
    : [sendChat.FAILURE(new Error(body.message))])),
);

const makeGroupEpic = action$ => action$.pipe(
  ofType(makeGroup.REQUEST),
  mergeMap(action => from(api.makeGroup(action.payload))),
  mergeMap(body => (body.data
    ? [makeGroup.SUCCESS(body.data), getDialog.SUCCESS(body.data)]
    : [makeGroup.FAILURE(new Error(body.message))])),
);

export default combineEpics(
  getChatEpic,
  getChatsEpic,
  getDialogsEpic,
  sendChatEpic,
  makeGroupEpic,
);

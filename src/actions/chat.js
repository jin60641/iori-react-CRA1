import createAction from './createAsyncAction';

import { fromEvent, of, concat } from 'rxjs'
import { map, mapTo } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';

export const getChats = createAction('GET_CHATS');
export const getChat = createAction('GET_CHAT');
export const getDialogs = createAction('GET_DIALOGS');
export const getDialog = createAction('GET_DIALOG');
export const sendChat = createAction('SEND_CHAT');
export const makeGroup = createAction('MAKE_GROUP');

const getChatsUri = '/api/chat/getchats';
const getDialogsUri = '/api/chat/getdialogs';
const sendChatUri = '/api/chat/sendchat';
const makeGroupUri = '/api/chat/makegroup';

export const chatSocket = socket => combineEpics(
  fromEvent(socket,'getchat')
  .subscribe( (data) => concat(
	    getChat.SUCCESS(data),
      getDialog.SUCCESS(data)
  ))
)

export const fetchMakeGroup = data => {
	return async (dispatch) => {
		const resp = await fetch(makeGroupUri, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(data),
			credentials: 'include'
		});
		const body = await resp.json();
		if(body.data){
			return dispatch(makeGroup.SUCCESS(body.data));
		} else {
			return dispatch(makeGroup.FAILURE(new Error(body.message)));
		}
	}
}

export const fetchGetDialogs = (data) => {
	return async (dispatch) => {
		const resp = await fetch(getDialogsUri, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(data),
			credentials: 'include'
		});
		const body = await resp.json();
		if(body.data){
			return dispatch(getDialogs.SUCCESS(body.data));
		} else {
			return dispatch(getDialogs.FAILURE(new Error(body.message)));
		}
	}
};

export const fetchGetChats = (data) => {
	return async (dispatch) => {
		const resp = await fetch(getChatsUri, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(data),
			credentials: 'include'
		});
		const body = await resp.json();
		if(body.data){
			return dispatch(getChats.SUCCESS(body.data));
		} else {
			return dispatch(getChats.FAILURE(new Error(body.message)));
		}
	}
};

export const fetchSendChat = (data) => {
	return async (dispatch) => {
		const resp = await fetch(sendChatUri, {
			method: 'POST',
			body: data,
			credentials: 'include'
		});
		const body = await resp.json();
		if(body.data){
			return dispatch(sendChat.SUCCESS(body.data)) && dispatch(getDialog.SUCCESS(body.data));
		} else {
			return dispatch(sendChat.FAILURE(new Error(body.message)));
		}
	}
};


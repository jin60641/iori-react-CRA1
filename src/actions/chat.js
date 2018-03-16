import {createAction} from 'redux-actions';

export const getChats = createAction('GETCHATS');
export const getChat = createAction('GETCHAT');
export const getDialogs = createAction('GETDIALOGS');
export const getDialog = createAction('GETDIALOG');
export const sendChat = createAction('SENDCHAT');
export const makeGroup = createAction('MAKEGROUP');

const getChatsUri = '/api/chat/getchats';
const getDialogsUri = '/api/chat/getdialogs';
const sendChatUri = '/api/chat/sendchat';
const makeGroupUri = '/api/chat/makegroup';

export const chatSocket = (socket,dispatch) => {
	socket.on( 'getchat', data => {
		dispatch(getDialog(data));
		dispatch(getChat(data));
	});
};

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
			return dispatch(makeGroup(body.data));
		} else {
			return dispatch(makeGroup(new Error(body.msg)));
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
			console.log(body.data);
			return dispatch(getDialogs(body.data));
		} else {
			return dispatch(getDialogs(new Error(body.msg)));
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
			return dispatch(getChats(body.data));
		} else {
			return dispatch(getChats(new Error(body.msg)));
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
			return dispatch(sendChat(body.data)) && dispatch(getDialog(body.data));
		} else {
			return dispatch(sendChat(new Error(body.msg)));
		}
	}
};


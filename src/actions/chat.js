import {createAction} from 'redux-actions';

export const getChats = createAction('GETCHATS');
export const sendChat = createAction('SENDCHAT');

const getChatsUri = '/api/chat/getchats';
const sendChatUri = '/api/chat/sendchat';

export const chatSocket = (socket,dispatch) => {
	socket.on( 'chat new', (data) => {
		dispatch(sendChat(data));
	});
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
			return dispatch(sendChat(body.data));
		} else {
			return dispatch(sendChat(new Error(body.msg)));
		}
	}
};


import {createAction} from 'redux-actions';

export const searchUser = createAction('SEARCHUSER');
export const searchUsers = createAction('SEARCHUSERS');

const searchUserUri = '/api/search/user';
const searchUsersUri = '/api/search/users';

export const fetchSearchUser = (data) => {
	return async (dispatch) => {
		const resp = await fetch(searchUserUri, {
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
			return dispatch(searchUser(body.data));
		} else {
			return dispatch(searchUser(new Error(body.msg)));
		}
	}
};

export const fetchSearchUsers = (data) => {
	return async (dispatch) => {
		const resp = await fetch(searchUsersUri, {
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
			return dispatch(searchUsers(body.data));
		} else {
			return dispatch(searchUsers(new Error(body.msg)));
		}
	}
};


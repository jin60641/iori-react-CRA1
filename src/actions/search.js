import {createAction} from 'redux-actions';

export const searchUserByHandle = createAction('SEARCHUSERBYHANDLE');
export const searchUsers = createAction('SEARCHUSERS');
export const searchGroup = createAction('SEARCHGROUP');
export const searchFollows = createAction('SEARCHFOLLOWS');

const searchUserByHandleUri = '/api/search/user/handle';
const searchUsersUri = '/api/search/users';
const searchGroupUri = '/api/search/group';
const searchFollowsUri = '/api/search/follows';

export const fetchSearchFollows = (data) => {
	return async (dispatch) => {
		const resp = await fetch(searchFollowsUri, {
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
			return dispatch(searchFollows(body.data));
		} else {
			return dispatch(searchFollows(new Error(body.msg)));
		}
	}
};

export const fetchSearchGroup = (data) => {
	return async (dispatch) => {
		const resp = await fetch(searchGroupUri, {
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
			return dispatch(searchGroup(body.data));
		} else {
			return dispatch(searchGroup(new Error(body.msg)));
		}
	}
};

export const fetchSearchUserByHandle = (data) => {
	return async (dispatch) => {
		const resp = await fetch(searchUserByHandleUri, {
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
			return dispatch(searchUserByHandle(body.data));
		} else {
			return dispatch(searchUserByHandle(new Error(body.msg)));
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


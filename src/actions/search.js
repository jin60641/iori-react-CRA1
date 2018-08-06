import {createAction} from 'redux-actions';

export const searchUserByHandle = createAction('SEARCH_USER_BY_HANDLE');
export const searchUsers = createAction('SEARCH_USERS');
export const searchGroupById = createAction('SEARCH_GROUP_BY_ID');
export const searchFollows = createAction('SEARCH_FOLLOWS');

const searchUserByHandleUri = '/api/search/user/handle';
const searchUsersUri = '/api/search/users';
const searchGroupByIdUri = '/api/search/group/id';
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
			return dispatch(searchFollows(new Error(body.message)));
		}
	}
};

export const fetchSearchGroupById = (data) => {
	return async (dispatch) => {
		const resp = await fetch(searchGroupByIdUri, {
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
			return dispatch(searchGroupById(body.data));
		} else {
			return dispatch(searchGroupById(new Error(body.message)));
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
			return dispatch(searchUserByHandle(new Error(body.message)));
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
			return dispatch(searchUsers(new Error(body.message)));
		}
	}
};


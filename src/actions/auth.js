import {createAction} from 'redux-actions';

export const login = createAction('LOGIN');
export const logout = createAction('LOGOUT');
export const loggedIn = createAction('LOGGEDIN');
export const join = createAction('JOIN');
export const verifyMail = createAction('VERIFYMAIL');

const loginUri = '/api/auth/local';
const logoutUri = '/api/auth/logout';
const loggedInUri = '/api/auth/loggedin';
const joinUri = '/api/auth/join';
const verifyMailUri = '/api/auth/verify';

export const fetchLogin = (data) => {
	return async (dispatch) => {
		const resp = await fetch(loginUri, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(data),
			credentials: 'include'
		});
		const body = await resp.json();
		console.log(body);
		if(body.data){
			return dispatch(login(body.data));
		} else {
			return dispatch(login(new Error(body.msg)));
		}
	}
};

export const fetchLogout = () => {
	return async (dispatch) => {
		const resp = await fetch(logoutUri, {method: 'POST', credentials: 'include'});
		if(!resp.ok) {
			const body = await resp.json();

			return dispatch(logout(new Error(body.message)));
		}
		return dispatch(logout({}));
	}
};

export const fetchLoggedIn = () => {
	return async (dispatch) => {
		const resp = await fetch(loggedInUri, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			credentials: 'include'
		});
		const body = await resp.json();
		if(body.data){
			return dispatch(login(body.data));
		} else {
			return dispatch(login(new Error(body.msg)));
		}
	}
};

export const fetchJoin = (data) => {
	return async (dispatch) => {
		const resp = await fetch(joinUri, {
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
			return dispatch(join(body.data));
		} else {
			return dispatch(join(new Error(body.msg)));
		}
	}
};

export const fetchCertifyMail = (data) => {
	return async (dispatch) => {
		const resp = await fetch(verifyMailUri, {
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
			return dispatch(verifyMail(body.data));
		} else {
			return dispatch(verifyMail(new Error(body.msg)));
		}
	}
};

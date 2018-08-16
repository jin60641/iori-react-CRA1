import createAction from './createAsyncAction';
import { from } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';

export const login = createAction('LOGIN');
export const logout = createAction('LOGOUT');
export const loggedIn = createAction('LOGGEDIN');
export const join = createAction('JOIN');
export const verifyMail = createAction('VERIFY_MAIL');
export const findPw = createAction('FIND_PW');
export const changePw = createAction('CHANGE_PW');

const loginUri = '/api/auth/login/local';
const logoutUri = '/api/auth/logout';
const loggedInUri = '/api/auth/loggedin';
const joinUri = '/api/auth/join';
const verifyMailUri = '/api/auth/verify';
const findPwUri = '/api/auth/findpw';
const changePwUri = '/api/auth/changepw';

export const fetchFindPw = (data) => {
	return async (dispatch) => {
		const resp = await fetch(findPwUri, {
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
			return dispatch(findPw(body.data));
		} else {
			return dispatch(findPw(new Error(body.message)));
		}
	}
};

export const fetchChangePw = (data) => {
	return async (dispatch) => {
		const resp = await fetch(changePwUri, {
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
			return dispatch(changePw(body.data));
		} else {
			return dispatch(changePw(new Error(body.message)));
		}
	}
};

export const fetchLogout = () => {
	return async (dispatch) => {
		const resp = await fetch(logoutUri, {method: 'POST', credentials: 'include'});
		const body = await resp.json();
		if(body.message) {
			return dispatch(logout(new Error(body.message)));
		} else {
  		return dispatch(logout({}));
    }
	}
};

const fetchLogin = (action$) => action$.pipe(
  ofType(login.REQUEST),
  mergeMap(action => from( 
    fetch(loginUri, {
  	  headers: {
  		  'Accept': 'application/json',
  			'Content-Type': 'application/json'
  		},
  		method: 'POST',
			body: JSON.stringify(action.payload),
  		credentials: 'include'
    })
    .then( response => response.json() )
  )),
  map( body => {
    if( body.data ){
      return login.SUCCESS(body.data);
    } else {
      return login.FAILURE(new Error(body.message));
    }
  })
);

const fetchLoggedIn = (action$) => action$.pipe(
  ofType(loggedIn.REQUEST),
  mergeMap(action => from ( 
    fetch(loggedInUri, {
  	  headers: {
  		  'Accept': 'application/json',
  			'Content-Type': 'application/json'
  		},
  		method: 'POST',
  		credentials: 'include'
    })
    .then( response => response.json() )
  )),
  map( body => {
    if( body.data ){
      return loggedIn.SUCCESS(body.data);
    } else {
      return loggedIn.FAILURE(new Error(body.message));
    }
  })
);

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
			return dispatch(join(new Error(body.message)));
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
			return dispatch(verifyMail(new Error(body.message)));
		}
	}
};

export const authEpic = combineEpics(
  fetchLogin,
  fetchLoggedIn
);


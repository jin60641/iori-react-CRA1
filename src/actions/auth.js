import { from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';
import createAction from './createAsyncAction';

import { connectSocket } from './socket';
import { successToastr, warningToastr } from './toastr';

import api from '../api/auth';

export const login = createAction('LOGIN');
export const logout = createAction('LOGOUT');
export const loggedIn = createAction('LOGGEDIN');
export const join = createAction('JOIN');
export const verifyMail = createAction('VERIFY_MAIL');
export const findPw = createAction('FIND_PW');
export const changePw = createAction('CHANGE_PW');

const loginEpic = action$ => action$.pipe(
  ofType(login.REQUEST),
  mergeMap(action => from(api.login(action.payload))),
  mergeMap(body => (body.data ? [
    login.SUCCESS(body.data),
    connectSocket.REQUEST(),
    successToastr(body.message),
  ] : [
    login.FAILURE(new Error(body.message)),
    warningToastr(body.message),
  ])),
);

const logoutEpic = action$ => action$.pipe(
  ofType(logout.REQUEST),
  mergeMap(action => from(api.logout())),
  mergeMap(body => (body.data ? [
    logout.SUCCESS(body.data),
    successToastr(body.message),
  ] : [
    logout.FAILURE(new Error(body.message)),
    warningToastr(body.message),
  ])),
);

const loggedInEpic = action$ => action$.pipe(
  ofType(loggedIn.REQUEST),
  mergeMap(action => from(api.loggedIn())),
  mergeMap(body => (body.data ? [
    loggedIn.SUCCESS(body.data),
    connectSocket.REQUEST(),
  ] : [
    loggedIn.FAILURE(new Error(body.message)),
  ])),
);

const joinEpic = action$ => action$.pipe(
  ofType(join.REQUEST),
  mergeMap(action => from(api.join(action.payload))),
  mergeMap(body => (body.data ? [
    join.SUCCESS(body.data),
    successToastr(body.message),
  ] : [
    join.FAILURE(new Error(body.message)),
    warningToastr(body.message),
  ])),
);

const verifyMailEpic = action$ => action$.pipe(
  ofType(verifyMail.REQUEST),
  mergeMap(action => from(api.verifyMail(action.payload))),
  map(body => (body.data
    ? verifyMail.SUCCESS(body.data)
    : verifyMail.FAILURE(new Error(body.message)))),
);

const findPwEpic = action$ => action$.pipe(
  ofType(findPw.REQUEST),
  mergeMap(action => from(api.findPw(action.payload))),
  mergeMap(body => (body.data ? [
    findPw.SUCCESS(body.data),
    successToastr(body.message),
  ] : [
    findPw.FAILURE(new Error(body.message)),
    warningToastr(body.message),
  ])),
);

const changePwEpic = action$ => action$.pipe(
  ofType(changePw.REQUEST),
  mergeMap(action => from(api.changePw(action.payload))),
  mergeMap(body => (body.data ? [
    changePw.SUCCESS(body.data),
    successToastr(body.message),
  ] : [
    changePw.FAILURE(new Error(body.message)),
    warningToastr(body.message),
  ])),
);

export default combineEpics(
  loginEpic,
  loggedInEpic,
  logoutEpic,
  joinEpic,
  verifyMailEpic,
  findPwEpic,
  changePwEpic,
);

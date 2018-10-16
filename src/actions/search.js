import { from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';
import createAction from './createAsyncAction';

import api from '../api/search';

export const searchUserByHandle = createAction('SEARCH_USER_BY_HANDLE');
export const searchUsers = createAction('SEARCH_USERS');
export const searchGroupById = createAction('SEARCH_GROUP_BY_ID');
export const searchFollows = createAction('SEARCH_FOLLOWS');

const searchFollowsEpic = action$ => action$.pipe(
  ofType(searchFollows.REQUEST),
  mergeMap(action => from(api.searchFollows(action.payload))),
  map(body => (body.data
    ? searchFollows.SUCCESS(body.data)
    : searchFollows.FAILURE(new Error(body.message)))),
);

const searchGroupByIdEpic = action$ => action$.pipe(
  ofType(searchGroupById.REQUEST),
  mergeMap(action => from(api.searchGroupById(action.payload))),
  map(body => (body.data
    ? searchGroupById.SUCCESS(body.data)
    : searchGroupById.FAILURE(new Error(body.message)))),
);

const searchUserByHandleEpic = action$ => action$.pipe(
  ofType(searchUserByHandle.REQUEST),
  mergeMap(action => from(api.searchUserByHandle(action.payload))),
  map(body => (body.data
    ? searchUserByHandle.SUCCESS(body.data)
    : searchUserByHandle.FAILURE(new Error(body.message)))),
);

const searchUsersEpic = action$ => action$.pipe(
  ofType(searchUsers.REQUEST),
  mergeMap(action => from(api.searchUsers(action.payload))),
  map(body => (body.data
    ? searchUsers.SUCCESS(body.data)
    : searchUsers.FAILURE(new Error(body.message)))),
);

export default combineEpics(
  searchFollowsEpic,
  searchGroupByIdEpic,
  searchUserByHandleEpic,
  searchUsersEpic,
);

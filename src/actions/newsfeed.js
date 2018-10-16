
import { from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';
import createAction from './createAsyncAction';
import api from '../api/newsfeed';

export const getPost = createAction('GET_POST');
export const getPosts = createAction('GET_POSTS');
export const writePost = createAction('WRITE_POST');
export const removePost = createAction('REMOVE_POSTS');
export const hidePost = createAction('HIDE_POSTS');

const getPostEpic = action$ => action$.pipe(
  ofType(getPost.ORIGIN),
  map(action => getPost.SUCCESS(action.payload)),
);

const getPostsEpic = action$ => action$.pipe(
  ofType(getPosts.REQUEST),
  mergeMap(action => from(api.getPosts(action.payload))),
  map(body => (body.data
    ? getPosts.SUCCESS(body.data)
    : getPosts.FAILURE(new Error(body.message)))),
);

const writePostEpic = action$ => action$.pipe(
  ofType(writePost.REQUEST),
  mergeMap(action => from(api.writePost(action.payload))),
  map(body => (body.data
    ? writePost.SUCCESS(body.data)
    : writePost.FAILURE(new Error(body.message)))),
);

const removePostEpic = action$ => action$.pipe(
  ofType(removePost.REQUEST),
  mergeMap(action => from(api.removePost(action.payload))),
  map(body => (body.data
    ? removePost.SUCCESS(body.data)
    : removePost.FAILURE(new Error(body.message)))),
);

const hidePostEpic = action$ => action$.pipe(
  ofType(hidePost.REQUEST),
  mergeMap(action => from(api.hidePost(action.payload))),
  map(body => (body.data
    ? hidePost.SUCCESS(body.data)
    : hidePost.FAILURE(new Error(body.message)))),
);

export default combineEpics(
  getPostEpic,
  getPostsEpic,
  writePostEpic,
  removePostEpic,
  hidePostEpic,
);

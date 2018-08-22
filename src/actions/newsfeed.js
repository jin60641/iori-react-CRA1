import createAction from './createAsyncAction';
  
import { from } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';
import api from '../api/newsfeed';

export const getPost = createAction('GET_POST');
export const getPosts = createAction('GET_POSTS');
export const writePost = createAction('WRITE_POST');
export const removePost = createAction('REMOVE_POSTS');

const getPostEpic = action$ => action$.pipe(
  ofType('getpost'),
  map( action => getPost.SUCCESS(action.payload) )
);

const getPostsEpic = (action$) => action$.pipe(
  ofType(getPosts.REQUEST),
  mergeMap( action => from(api.getPosts(action.payload)) ),
  map( body =>
    body.data
      ? getPosts.SUCCESS(body.data)
      : getPosts.FAILURE(new Error(body.message))
  )
);

const writePostEpic = (action$) => action$.pipe(
  ofType(writePost.REQUEST),
  mergeMap( action => from(api.writePost(action.payload)) ),
  map( body =>
    body.data
      ? writePost.SUCCESS(body.data)
      : writePost.FAILURE(new Error(body.message))
  )
);

const removePostEpic = (action$) => action$.pipe(
  ofType(removePost.REQUEST),
  mergeMap( action => from(api.removePost(action.payload)) ),
  map( body =>
    body.data
      ? removePost.SUCCESS(body.data)
      : removePost.FAILURE(new Error(body.message))
  )
);

export default combineEpics(
  getPostEpic,
  getPostsEpic,
  writePostEpic,
  removePostEpic,
);

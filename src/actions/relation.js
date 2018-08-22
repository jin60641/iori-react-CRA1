import createAction from './createAsyncAction';

import { from } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';
import api from '../api/relation';

export const follow = createAction('FOLLOW');

const followEpic = (action$) => action$.pipe(
  ofType(follow.REQUEST),
  mergeMap( action => from(api.follow(action.payload)) ),
  map( body =>
    body.data
      ? follow.SUCCESS(body.data)
      : follow.FAILURE(new Error(body.message))
  )
);

export default combineEpics(
  followEpic,
);

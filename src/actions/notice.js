import createAction from './createAsyncAction';

import { fromEvent, of } from 'rxjs'
import { map, mergeMap, concat } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';

export const getNotice = createAction('GET_NOTICE');

const fetchGetNotice = action$ => action$.pipe(
  ofType(getNotice.ORIGIN),
  mergeMap( action => [
    getNotice.SUCCESS(action.payload),
  ])
);

export default combineEpics(
  fetchGetNotice
);

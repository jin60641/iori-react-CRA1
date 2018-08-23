import createAction from './createAsyncAction';

import { mergeMap } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';

import { infoToastr } from './toastr'

export const getNotice = createAction('GET_NOTICE');

const fetchGetNotice = action$ => action$.pipe(
  ofType(getNotice.ORIGIN),
  mergeMap( action => [
    getNotice.SUCCESS(action.payload),
    infoToastr(action.payload.text)
  ])
);

export default combineEpics(
  fetchGetNotice
);

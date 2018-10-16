
import { from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';
import createAction from './createAsyncAction';

import api from '../api/notice';

import { infoToastr } from './toastr';

export const getNotice = createAction('GET_NOTICE');
export const getNotices = createAction('GET_NOTICES');
export const removeNotice = createAction('REMOVE_NOTICE');

const getNoticeEpic = action$ => action$.pipe(
  ofType(getNotice.ORIGIN),
  mergeMap(action => [
    getNotice.SUCCESS(action.payload),
    infoToastr(action.payload.text),
  ]),
);

const getNoticesEpic = action$ => action$.pipe(
  ofType(getNotices.REQUEST),
  mergeMap(action => from(api.getNotices(action.payload))),
  map(body => (body.data
    ? getNotices.SUCCESS(body.data)
    : getNotices.FAILURE(new Error(body.message)))),
);

const removeNoticeEpic = action$ => action$.pipe(
  ofType(removeNotice.REQUEST),
  mergeMap(action => from(api.removeNotice(action.payload))),
  map(body => (body.data
    ? removeNotice.SUCCESS(body.data)
    : removeNotice.FAILURE(new Error(body.message)))),
);

export default combineEpics(
  getNoticeEpic,
  getNoticesEpic,
);

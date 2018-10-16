
import { from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';
import createAction from './createAsyncAction';
import api from '../api/link';

export const getLink = createAction('GET_LINK');

const getLinkEpic = action$ => action$.pipe(
  ofType(getLink.REQUEST),
  mergeMap(action => from(api.getLink(action.payload))),
  map(body => (body.data
    ? getLink.SUCCESS(body.data)
    : getLink.FAILURE(new Error(body.message)))),
);

export default combineEpics(
  getLinkEpic,
);

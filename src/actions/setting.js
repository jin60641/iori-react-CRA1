
import { from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';
import createAction from './createAsyncAction';

import api from '../api/setting';

export const setProfile = createAction('SET_PROFILE');

const setProfileEpic = action$ => action$.pipe(
  ofType(setProfile.REQUEST),
  mergeMap(action => from(api.setProfile(action.payload))),
  map(body => (body.data
    ? setProfile.SUCCESS(body.data)
    : setProfile.FAILURE(new Error(body.message)))),
);

export default combineEpics(
  setProfileEpic,
);

/*
import createAction from './createAsyncAction';
import { from } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators';
*/
import { combineEpics } from 'redux-observable';
import { actions } from 'react-redux-toastr';

const makeToastr = type => message => actions.add({
  type: 'light',
  message,
  options: {
    status: type,
    icon: type,
  },
});

export const successToastr = makeToastr('success');
export const warningToastr = makeToastr('warning');
export const infoToastr = makeToastr('info');

export default combineEpics(
);

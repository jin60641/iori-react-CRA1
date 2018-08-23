/*
import createAction from './createAsyncAction';
import { from } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators';
*/
import { combineEpics } from 'redux-observable';
import { actions } from 'react-redux-toastr'

export const warningToastr = (message) => actions.add({type:'warning',message});
export default combineEpics(
);

import {handleActions} from 'redux-actions';
import { getNotice } from '../actions/notice';

let initialState = [];

export default handleActions({
	[getNotice.SUCCESS]: function(state, action) {
		return [action.payload].concat(state);
	},
}, initialState );

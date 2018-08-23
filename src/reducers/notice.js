import { handleActions } from 'redux-actions';
import { getNotice, getNotices } from '../actions/notice';

let initialState = [];

export default handleActions({
	[getNotice.SUCCESS]: function(state, action) {
		return [action.payload].concat(state);
	},
	[getNotices.SUCCESS]: function(state, action) {
		return state.concat(action.payload);
	},
}, initialState );

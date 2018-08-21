import {handleActions} from 'redux-actions';
import { getNotice } from '../actions/notice';

let initialState = [];

export default handleActions({
	[getNotice.SUCCESS]: function(state, action) {
		const { text } = action.payload;
    console.log(text);
		return [action.payload].concat(state);
	},
}, initialState );

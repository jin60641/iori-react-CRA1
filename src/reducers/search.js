import {handleActions} from 'redux-actions';
import { search } from '../actions/search';

let initialState = [];

export default handleActions({
	[search]: function(state, action) {
		if( action.error ) {
			return state;
		}
		return action.payload;
	},
}, initialState );

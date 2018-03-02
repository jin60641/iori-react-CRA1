import {handleActions} from 'redux-actions';
import { getChats, sendChat } from '../actions/chat';

let initialState = [];

export default handleActions({
	[getChats]: function(state, action) {
		if( action.error ) {
			return state;
		}
		return state.concat(action.payload);
	},
	[sendChat]: function(state, action) {
		if( action.error ) {
			return state;
		}
		return [action.payload].concat(state);
	},
}, initialState );

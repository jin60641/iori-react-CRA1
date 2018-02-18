import {handleActions} from 'redux-actions';
import { getPosts, writePost } from '../actions/newsfeed';

let initialState = [];

export default handleActions({
	[getPosts]: function(state, action) {
		if( action.error ) {
			return state;
		}
		return state.concat(action.payload);
	},
	[writePost]: function(state, action) {
		if( action.error ) {
			return state;
		}
		return action.payload.concat(state);
	},
}, initialState );

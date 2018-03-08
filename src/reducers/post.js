import {handleActions} from 'redux-actions';
import { getPost, getPosts, writePost } from '../actions/newsfeed';

let initialState = [];

export default handleActions({
	[getPosts]: (state, action) => {
		if( action.error ) {
			return state;
		}
		return state.concat(action.payload);
	},
	[writePost]: (state, action) => {
		if( action.error ) {
			return state;
		}
		return [action.payload].concat(state);
	},
	[getPost]: (state, action) => {
		if( action.error ) {
			return state;
		}
		return state.concat([action.payload]);
	}
}, initialState );

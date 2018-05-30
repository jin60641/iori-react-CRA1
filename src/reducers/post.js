import {handleActions} from 'redux-actions';
import { removePost, resetPosts, getPost, getPosts, writePost } from '../actions/newsfeed';

let initialState = [];

export default handleActions({
	[removePost]: (state, action) => {
		if( action.error ){
			return state;
		}
		const index = state.findIndex( post => post.id === action.payload.id );
		return state.slice(0,index).concat(action.payload).concat(state.slice(index+1));
	},
	[resetPosts]: (state, action) => {
		return [];
	},
	[getPosts]: (state, action) => {
		if( action.error ) {
			return state;
		}
		console.log(action.payload);
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

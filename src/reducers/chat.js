import {handleActions} from 'redux-actions';
import { getChats, sendChat } from '../actions/chat';

let initialState = {};

export default handleActions({
	[getChats]: function(state, action) {
		if( action.error ) {
			return state;
		}
		const { chats, to } = action.payload;
		const nextState = {}
		nextState[to.handle] = chats.reverse().concat(state[to.handle]?state[to.handle]:[]);
		return Object.assign({...state},nextState);
//		return state.concat(action.payload);
	},
	[sendChat]: function(state, action) {
		if( action.error ) {
			return state;
		}
		const { chats, to } = action.payload;
		const nextState = {}
		nextState[to.handle] = (state[to.handle]?state[to.handle]:[]).concat(chats);
		return Object.assign({...state},nextState);
//		return [action.payload].concat(state);
	},
}, initialState );

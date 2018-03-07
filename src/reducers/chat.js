import {handleActions} from 'redux-actions';
import { getChats, sendChat, getChat } from '../actions/chat';

let initialState = {};

export default handleActions({
	[getChats]: function(state, action) {
		if( action.error ) {
			return state;
		}
		const { chats, from } = action.payload;
		const nextState = {}
		nextState[from.handle] = chats.reverse().concat(state[from.handle]?state[from.handle]:[]);
		return Object.assign({...state},nextState);
//		return state.concat(action.payload);
	},
	[sendChat]: function(state, action) {
		if( action.error ) {
			return state;
		}
		const { chat, to } = action.payload;
		const nextState = {}
		nextState[to.handle] = (state[to.handle]?state[to.handle]:[]).concat([chat]);
		return Object.assign({...state},nextState);
//		return [action.payload].concat(state);
	},
	[getChat]: function(state, action) {
		if( action.error ){
			return state;
		}
		const { chat, from } = action.payload;
		const nextState = {}
		nextState[from.handle] = (state[from.handle]?state[from.handle]:[]).concat([chat]);
		return Object.assign({...state},nextState);
	}
}, initialState );

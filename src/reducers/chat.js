import {handleActions} from 'redux-actions';
import { getChats, sendChat, getChat } from '../actions/chat';

let initialState = {};

export default handleActions({
  [getChats.REQUEST]: function(state, action) {
    getChats.isFetching = true;
    return state;
  },
	[getChats.SUCCESS]: function(state, action) {
    getChats.isFetching = false;
		const { chats, handle } = action.payload;
		const nextState = {}
		nextState[handle] = chats.reverse().concat(state[handle]?state[handle]:[]);
		return Object.assign({...state},nextState);
//		return state.concat(action.payload);
	},
	[getChats.Failure]: function(state, action) {
    getChats.isFetching = false;
    return state;
  },
	[sendChat.SUCCESS]: function(state, action) {
		if( action.error ) {
			return state;
		}
		const { chat, handle } = action.payload;
		const nextState = {}
		nextState[handle] = (state[handle]?state[handle]:[]).concat([chat]);
		return Object.assign({...state},nextState);
//		return [action.payload].concat(state);
	},
	[getChat.SUCCESS]: function(state, action) {
		const { chat, handle } = action.payload;
		const nextState = {}
		nextState[handle] = (state[handle]?state[handle]:[]).concat([chat]);
		return Object.assign({...state},nextState);
	},
  [getChat.FAILURE]: function(state, action) {
	  return state;
  }
}, initialState );

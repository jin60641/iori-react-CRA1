import { handleActions } from 'redux-actions';
import { getChats } from '../actions/chat';

let initialState = {};

export default handleActions({
  [getChats.REQUEST]: (state, action) => {
    return { getChats : true };
  },
	[getChats.SUCCESS]: (state, action) => {
    return { getChats : false };
	},
	[getChats.Failure]: (state, action) => {
    return { getChats : false };
  },
}, initialState );

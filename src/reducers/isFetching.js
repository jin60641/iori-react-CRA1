import { handleActions } from 'redux-actions';
import { getChats } from '../actions/chat';
import { getNotices } from '../actions/notice';

let initialState = {};

const actions = [getChats,getNotices]

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
  [getNotices.REQUEST]: (state, action) => {
    return { getNotices : true };
  },
	[getNotices.SUCCESS]: (state, action) => {
    return { getNotices : false };
	},
	[getNotices.Failure]: (state, action) => {
    return { getNotices : false };
  },
}, initialState );

import { handleActions } from 'redux-actions';
import { getChats } from '../actions/chat';
import { getNotices } from '../actions/notice';
import { searchUsers } from '../actions/search';

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
  [searchUsers.REQUEST]: (state, action) => {
    return { searchUsers : true };
  },
	[searchUsers.SUCCESS]: (state, action) => {
    return { searchUsers : false };
	},
	[searchUsers.Failure]: (state, action) => {
    return { searchUsers : false };
  },
}, initialState );

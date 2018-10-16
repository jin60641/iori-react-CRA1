import { handleActions } from 'redux-actions';
import { getChats } from '../actions/chat';
import { getNotices } from '../actions/notice';
import { searchUsers } from '../actions/search';

const initialState = {};

// const actions = [getChats,getNotices]

export default handleActions({
  [getChats.REQUEST]: (state, action) => ({ getChats: true }),
  [getChats.SUCCESS]: (state, action) => ({ getChats: false }),
  [getChats.Failure]: (state, action) => ({ getChats: false }),
  [getNotices.REQUEST]: (state, action) => ({ getNotices: true }),
  [getNotices.SUCCESS]: (state, action) => ({ getNotices: false }),
  [getNotices.Failure]: (state, action) => ({ getNotices: false }),
  [searchUsers.REQUEST]: (state, action) => ({ searchUsers: true }),
  [searchUsers.SUCCESS]: (state, action) => ({ searchUsers: false }),
  [searchUsers.Failure]: (state, action) => ({ searchUsers: false }),
}, initialState);

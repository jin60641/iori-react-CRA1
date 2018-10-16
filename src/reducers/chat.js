import { handleActions } from 'redux-actions';
import { getChats, sendChat, getChat } from '../actions/chat';

const initialState = {};

export default handleActions({
  [getChats.REQUEST]: (state, action) => {
    getChats.isFetching = true;
    return state;
  },
  [getChats.SUCCESS]: (state, action) => {
    getChats.isFetching = false;
    const { chats, handle } = action.payload;
    return { ...state, [handle]: chats.reverse().concat(state[handle] ? state[handle] : []) };
  },
  [getChats.Failure]: (state, action) => {
    getChats.isFetching = false;
    return state;
  },
  [sendChat.SUCCESS]: (state, action) => {
    const { chat, handle } = action.payload;
    return { ...state, [handle]: (state[handle] ? state[handle] : []).concat([chat]) };
  },
  [sendChat.FAILURE]: (state, action) => state,
  [getChat.SUCCESS]: (state, action) => {
    const { chat, handle } = action.payload;
    return { ...state, [handle]: (state[handle] ? state[handle] : []).concat([chat]) };
  },
  [getChat.FAILURE]: (state, action) => state,
}, initialState);

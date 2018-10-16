import { handleActions } from 'redux-actions';
import { getDialogs, getDialog } from '../actions/chat';

const handleToIndex = {};
const initialState = [];

export default handleActions({
  [getDialogs.SUCCESS]: (state, action) => {
    if (action.error) {
      return state;
    }
    const nextState = Object.keys(action.payload).map(handle => action.payload[handle]);
    nextState.sort((a, b) => a.id < b.id).forEach((dialog, key) => { handleToIndex[dialog.handle] = key; });
    return nextState;
  },
  [getDialog.SUCCESS]: (state, action) => {
    console.log(action);
    const { chat, handle } = action.payload;
    chat.handle = handle;
    let nextState = [].concat(state);
    const index = handleToIndex[handle];
    if (index >= 0) {
      nextState.splice(index, 1);
    }
    nextState = [chat].concat(nextState);
    nextState.forEach((dialog, key) => { handleToIndex[dialog.handle] = key; });
    return nextState;
  },
  [getDialog.FAILURE]: (state, action) => state,
}, initialState);

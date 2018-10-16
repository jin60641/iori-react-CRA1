import { handleActions } from 'redux-actions';
import { getNotice, getNotices } from '../actions/notice';

const initialState = [];

export default handleActions({
  [getNotice.SUCCESS](state, action) {
    return [action.payload].concat(state);
  },
  [getNotices.SUCCESS](state, action) {
    return state.concat(action.payload);
  },
  [getNotices.RESET](state, action) {
    return [...initialState];
  },
}, initialState);

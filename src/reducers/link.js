import { handleActions } from 'redux-actions';
import { getLink } from '../actions/link';

const initialState = {};

export default handleActions({
  [getLink.SUCCESS](state, action) {
    const { link } = action.payload;
    return { ...state, [link]: action.payload };
  },
}, initialState);

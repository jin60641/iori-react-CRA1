import { handleActions } from 'redux-actions';
import { follow } from '../actions/relation';
import {
  searchUserByHandle,
  searchGroupById,
  searchUsers,
  searchFollows,
} from '../actions/search';

const initialState = {
  user: {},
  group: {},
  users: [],
  follows: [],
};

export default handleActions({
  [follow.SUCCESS]: (state, action) => {
    const { following, to } = action.payload;
    const nextState = { ...state };
    if (state.user.id === to) {
      nextState.user = { ...state.user, following };
    }
    const index = state.follows.findIndex(user => user.id === to);
    if (index >= 0) {
      console.log(following);
      nextState.follows = state.follows.slice(0, index).concat([{ ...state.follows[index], following }]).concat(state.follows.slice(index + 1));
    }
    return nextState;
  },
  [searchGroupById.SUCCESS]: (state, action) => ({ ...state, group: action.payload }),
  [searchUserByHandle.SUCCESS]: (state, action) => ({ ...state, user: action.payload }),
  [searchUserByHandle.FAILURE]: (state, action) => state,
  [searchUsers.SUCCESS]: (state, action) => ({ ...state, users: action.payload }),
  [searchFollows.SUCCESS]: (state, action) => ({ ...state, follows: action.payload }),
}, initialState);

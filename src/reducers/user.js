import { handleActions } from 'redux-actions';
import {
  login, logout, loggedIn, join,
} from '../actions/auth';
import { follow } from '../actions/relation';
import { writePost, removePost } from '../actions/newsfeed';
import { setProfile } from '../actions/setting';

const initialState = null;

export default handleActions({
  [login.SUCCESS]: (state, action) => Object.assign({}, action.payload),
  [login.FAILURE]: (state, action) => state,
  [logout.SUCCESS]: (state, action) => ({ ...initialState }),
  [logout.FAILURE]: (state, action) => state,
  [loggedIn.SUCCESS]: (state, action) => Object.assign({}, action.payload),
  [loggedIn.FAILURE]: state => ({}),
  [join.SUCCESS]: (state, action) => ({ ...initialState }),
  [join.FAILURE]: (state, action) => state,
  [setProfile]: (state, action) => {
    if (action.error) {
      return state;
    }
    return Object.assign(state, action.payload);
  },
  [writePost.SUCCESS]: (state, action) => ({ ...state, posts: state.posts + 1 }),
  [writePost.FAILURE]: (state, action) => state,
  [removePost.SUCCESS]: (state, action) => ({ ...state, posts: state.posts + (action.payload.status ? 1 : -1) }),
  [removePost.FAILURE]: (state, action) => state,
  [follow.SUCCESS]: (state, action) => {
    if (action.error) {
      return state;
    }
    return { ...state, followings: state.followings + (action.payload.following ? 1 : -1) };
  },
}, initialState);

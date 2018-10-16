import { handleActions } from 'redux-actions';
import {
  removePost, hidePost, getPost, getPosts, writePost,
} from '../actions/newsfeed';

const initialState = {
  Home: [],
  detail: {},
};

export default handleActions({
  [getPost.ORIGIN]: (state, action) => ({ ...state, Home: [action.payload].concat(state.Home) }),
  [getPosts.SUCCESS]: (state, action) => {
    const { key, posts } = action.payload;
    if (key === 'detail') {
      return { ...state, detail: posts[0] };
    }
    return { ...state, [key]: (state[key] ? state[key] : []).concat(posts) };
  },
  [getPosts.FAILURE]: (state, action) => state,
  [getPosts.RESET]: (state, action) => ({ ...state, [action.payload]: initialState[action.payload] }),
  [writePost.SUCCESS]: (state, action) => ({ ...state, Home: [action.payload].concat(state.Home) }),
  [writePost.FAILURE]: (state, action) => state,
  [removePost.SUCCESS]: (state, action) => {
    const { key, id, status } = action.payload;
    console.log(action.payload);
    const homeIndex = state.Home.findIndex(post => post.id === id);
    const index = state[key].findIndex(post => post.id === id);
    return {
      ...state,
      Home: state.Home.slice(0, homeIndex).concat([{ ...state.Home[homeIndex], deleted: !status }]).concat(state.Home.slice(homeIndex + 1)),
      [key]: state[key].slice(0, index).concat([{ ...state[key][index], deleted: !status }]).concat(state[key].slice(index + 1)),
    };
  },
  [removePost.FAILURE]: (state, action) => state,
  [hidePost.SUCCESS]: (state, action) => {
    const { key, id, status } = action.payload;
    const homeIndex = state.Home.findIndex(post => post.id === id);
    const index = state[key].findIndex(post => post.id === id);
    return {
      ...state,
      Home: state.Home.slice(0, homeIndex).concat([{ ...state.Home[homeIndex], deleted: status }]).concat(state.Home.slice(homeIndex + 1)),
      [key]: state[key].slice(0, index).concat([{ ...state[key][index], deleted: status }]).concat(state[key].slice(index + 1)),
    };
  },
}, initialState);

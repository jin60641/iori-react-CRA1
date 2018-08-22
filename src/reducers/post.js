import { handleActions } from 'redux-actions';
import { removePost, getPost, getPosts, writePost } from '../actions/newsfeed';

let initialState = {
  Home : []
};

export default handleActions({
  [getPost.ORIGIN]: (state, action) => {
    return { ...state, Home : [action.payload].concat(state.Home) };
  },
  [getPosts.SUCCESS]: (state, action) => {
    const { key, posts } = action.payload;
    return { ...state, [key] : (state[key]?state[key]:[]).concat(posts) };
  },
  [getPosts.FAILURE]: (state, action) => {
    return state;
  },
  [writePost.SUCCESS]: (state, action) => {
    return { ...state, Home : [action.payload].concat(state.Home) };
  },
  [writePost.FAILURE]: (state, action) => {
    return state;
  },
  [removePost.SUCCESS]: (state, action) => {
    const { key, id } = action.payload;
    const homeIndex = state.Home.findIndex( post => post.id === id );
    const index = state[key].findIndex( post => post.id === id );
    return {
      ...state,
      Home : state.Home.slice(0,homeIndex).concat([{ ...state.Home[homeIndex], deleted : true }]).concat(state.Home.slice(homeIndex+1)),
      [key] : state[key].slice(0,index).concat([{ ...state[key][index], deleted : true }]).concat(state[key].slice(index+1)),
    };
  },
  [removePost.FAILURE]: (state, action) => {
    return state;
  }
}, initialState );

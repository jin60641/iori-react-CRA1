import {handleActions} from 'redux-actions';
import {follow} from '../actions/relation';
import {searchUserByHandle,searchGroupById,searchUsers,searchFollows} from '../actions/search';

let initialState = {
  user : {},
  group : {},
	users : [],
	follows : []
};

export default handleActions({
  [follow.SUCCESS]: (state, action) => {
    const { following, to } = action.payload;
    const nextState = { ...state };
    if( state.user.id === to ){
      nextState.user = { ...state.user, following };
    }
    const index = state.follows.findIndex( user => user.id === to );
    if( index >= 0 ){
      nextState.follows = state.follows.slice(0,index).concat([{ ...state.follows[index], following }]).concat(state.follows.slice(index+1));
    }
    return nextState;
  },
  [searchGroupById.SUCCESS]: (state, action) => {
    return { ...state, group : action.payload };
  },
  [searchUserByHandle.SUCCESS]: (state, action) => {
    return { ...state, user : action.payload };
  },
  [searchUserByHandle.FAILURE]: (state, action) => {
    return state;
  },
	[searchUsers.SUCCESS]: (state, action) => {
		return { ...state, users : action.payload };
	},
	[searchFollows.SUCCESS]: (state, action) => {
		return { ...state, follows : action.payload };
	},
}, initialState );

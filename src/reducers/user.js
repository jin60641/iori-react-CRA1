import {handleActions} from 'redux-actions';
import {login,logout,loggedIn,join} from '../actions/auth';
import {follow} from '../actions/relation';
import {writePost,removePost} from '../actions/newsfeed';
import {setProfile} from '../actions/setting';

const initialState = null;

export default handleActions({
	[login.SUCCESS]: (state, action) => {
		return Object.assign({}, action.payload );
	},
  [login.FAILURE]: (state, action) => {
		return state;
  },
	[logout.SUCCESS]: (state, action) => {
		return { ...initialState };
	},
  [logout.FAILURE]: (state, action) => {
	  return state;
  },
	[loggedIn.SUCCESS]: (state, action) => {
		return Object.assign({}, action.payload );
	},
  [loggedIn.FAILURE]: (state) => {
	  return {};
  },
  [join.SUCCESS]: (state, action) => {
    return { ...initialState };
  },
  [join.FAILURE]: (state, action) => {
    return state;
  },
	[setProfile]: (state, action) => {
		if( action.error ) {
			return state;
		}
		return Object.assign(state,action.payload);
	},
	[writePost]: (state, action) => {
		if( action.error ) {
			return state;
		}
		return { ...state, posts : state.posts+1 };
	},
	[removePost]: (state, action) => {
		if( action.error ) {
			return state;
		}
		return { ...state, posts : state.posts-1 };
	},
	[follow]: (state, action) => {
		if( action.error ) {
			return state;
		}
		return Object.assign(state,{ followings : state.followings+(action.payload?1:-1) })
	}
}, initialState);

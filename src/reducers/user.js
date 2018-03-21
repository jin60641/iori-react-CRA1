import {handleActions} from 'redux-actions';
import {login,logout,loggedIn,join} from '../actions/auth';
import {follow} from '../actions/relation';
import {setProfile} from '../actions/setting';

const initialState = null;

export default handleActions({
	[login]: (state, action) => {
		if( action.error ) {
			return state;
		}
		return Object.assign({}, action.payload );
	},
	[logout]: (state, action) => {
		if( action.error ) {
			return state;
		}
		return {};
	},
	[loggedIn]: (state, action) => {
		if( action.error ) {
			return state;
		}
		return Object.assign({}, action.payload );
	},
    [join]: (state, action) => {
        if( action.error ) {
            return state;
        }
        return null;
    },
	[setProfile]: (state, action) => {
		if( action.error ) {
			return state;
		}
		return Object.assign(state,action.payload);
	},
	[follow]: (state, action) => {
		if( action.error ) {
			return state;
		}
		return Object.assign(state,{ followings : state.followings+(action.payload?1:-1) })
	}
}, initialState);

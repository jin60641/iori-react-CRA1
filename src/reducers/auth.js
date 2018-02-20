import {handleActions} from 'redux-actions';
import {login,logout,loggedIn,join} from '../actions/auth';

const initialState = null;

export default handleActions({
	[login]: function(state, action) {
		if( action.error ) {
			return state;
		}
		return Object.assign({}, action.payload );
	},
	[logout]: function(state, action) {
		if( action.error ) {
			return state;
		}
		return {};
	},
	[loggedIn]: function(state, action) {
		if( action.error ) {
			return state;
		}
		return Object.assign({}, action.payload );
	},
    [join]: function(state, action) {
        if( action.error ) {
            return state;
        }
        return null;
    }
}, initialState);

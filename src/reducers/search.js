import {handleActions} from 'redux-actions';
import {searchUsers,searchFollows} from '../actions/search';

let initialState = {
	users : [],
	follows : []
};

export default handleActions({
	[searchUsers]: (state, action) => {
		if( action.error ) {
			return state;
		}
		return { ...state, users : action.payload };
	},
	[searchFollows]: (state, action) => {
		if( action.error ) {
			return state;
		}
		return { ...state, follows : action.payload };
	},
}, initialState );

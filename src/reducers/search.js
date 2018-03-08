import {handleActions} from 'redux-actions';
import {searchUsers} from '../actions/search';

let initialState = {
	users : []
};

export default handleActions({
	[searchUsers]: (state, action) => {
		if( action.error ) {
			return state;
		}
		return { ...state, users : action.payload };
	},
}, initialState );

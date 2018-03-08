import {handleActions} from 'redux-actions';
import { getDialogs } from '../actions/chat';

const initialState = {};

export default handleActions({
	[getDialogs]: (state, action) => {
		if( action.error ) {
			return state;
		}
		return Object.assign({},action.payload);
	}
}, initialState );

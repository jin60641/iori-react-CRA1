import {handleActions} from 'redux-actions';
import {closeSocket, connectSocket} from '../actions/socket';

export default handleActions({
	[connectSocket]: (state, action) => {
		if (!action.error) {
			return action.payload;
		}
		return state;
	},
	[closeSocket]: (state, action) => {
		return null;
	}
}, null);

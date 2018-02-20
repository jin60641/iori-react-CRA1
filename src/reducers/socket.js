import {handleActions} from 'redux-actions';
import {closeSocket, connectSocket} from '../actions/socket';

export default handleActions({
	[connectSocket]: function (state, action) {
		if (!action.error) {
			return action.payload;
		}
		return state;
	},
	[closeSocket]: function (state, action) {
		return null;
	}
}, null);

import {handleActions} from 'redux-actions';
import {closeSocket, connectSocket} from '../actions/socket';

export default handleActions({
	[connectSocket.SUCCESS]: (state, action) => {
    console.log("connected");
		return action.payload;
	},
	[connectSocket.FAILURE]: (state, action) => {
    return state;
  },
	[closeSocket]: (state, action) => {
		return null;
	}
}, null);

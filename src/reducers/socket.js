import {handleActions} from 'redux-actions';
import {closeSocket, connectSocket} from '../actions/socket';
import io from 'socket.io-client';

const socket = io();
const onevent = socket.onevent;
socket.onevent = function (packet) {
  let args = packet.data || [];
  onevent.call(this, packet);
  packet.data = ["*"].concat(args);
  onevent.call(this, packet);
};

export default handleActions({
	[connectSocket.SUCCESS]: (state, action) => {
		return state;
	},
	[connectSocket.FAILURE]: (state, action) => {
    return state;
  },
	[closeSocket.SUCCESS]: (state, action) => {
		return state;
	}
}, socket);

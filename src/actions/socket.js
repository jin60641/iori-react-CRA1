import {createAction} from 'redux-actions';
import io from 'socket.io-client';

export const connectSocket = createAction('CONNECT_SOCKET');
export const closeSocket = createAction('CLOSE_SOCKET');

export const fetchCloseSocket = () => {
	return closeSocket();
};

function init(socket, dispatch) {
	socket.on('disconnect', function () {
		console.log('disconnected!!!');
	});
}


export const fetchConnectSocket = () => {
	return async (dispatch) => {
		const socket = io();

		try {
			await new Promise((resolve, reject) => {
				const timer = setTimeout(function () {
					reject(new Error('Socket Timeout'));
				}, 3000);

				socket.on('connect', function () {
					console.log('connected!!!');
					clearTimeout(timer);
					resolve();
				});
			});

			init(socket, dispatch);

			return dispatch(connectSocket(socket));
		}
		catch(e) {
			console.log(e);
			return dispatch(connectSocket(e));
		}
	};
};

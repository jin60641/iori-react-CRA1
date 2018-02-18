import {combineReducers} from 'redux';

import auth from "./auth";
import post from "./post";
import socket from "./socket";

export default combineReducers({
	user: auth,
	posts: post,
	socket
})

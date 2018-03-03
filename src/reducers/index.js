import {combineReducers} from 'redux';

import auth from "./auth";
import post from "./post";
import socket from "./socket";
import search from "./search";

export default combineReducers({
	user: auth,
	posts: post,
	socket,
	searched : search
})

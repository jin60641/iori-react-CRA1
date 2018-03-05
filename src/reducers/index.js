import {combineReducers} from 'redux';

import auth from "./auth";
import post from "./post";
import socket from "./socket";
import search from "./search";
import chat from "./chat";

export default combineReducers({
	user: auth,
	posts: post,
	socket,
	searched : search,
	chats : chat
})

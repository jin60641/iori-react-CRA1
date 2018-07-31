import {createAction} from 'redux-actions';

export const writePost = createAction('WRITE_POST');
export const getPosts = createAction('GET_POSTS');
export const getPost = createAction('GET_POST');
export const resetPosts = createAction('RESET_POSTS');
export const removePost = createAction('REMOVE_POSTS');

const writePostUri = '/api/newsfeed/writepost';
const getPostsUri = '/api/newsfeed/getposts';
const removePostUri = '/api/newsfeed/removepost';

export const newsfeedSocket = (socket,dispatch) => {
	socket.on( 'getpost', data => {
		dispatch(getPost(data));
	});
};

export const fetchResetPosts = (data) => {
	return dispatch => dispatch(resetPosts());
}

export const fetchRemovePost = (data) => {
	return async (dispatch) => {
		const resp = await fetch(removePostUri, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(data),
			credentials: 'include'
		});
		const body = await resp.json();
		if(body.data){
			return dispatch(removePost(body.data));
		} else {
			return dispatch(removePost(new Error(body.message)));
		}
	}
};

export const fetchWritePost = (data) => {
	return async (dispatch) => {
		const resp = await fetch(writePostUri, {
			method: 'POST',
			body: data,
			credentials: 'include'
		});
		const body = await resp.json();
		if(body.data){
			return dispatch(writePost(body.data));
		} else {
			return dispatch(writePost(new Error(body.message)));
		}
	}
};

export const fetchGetPosts = (data) => {
	return async (dispatch) => {
		const resp = await fetch(getPostsUri, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(data),
			credentials: 'include'
		});
		const body = await resp.json();
		if(body.data){
			return dispatch(getPosts(body.data));
		} else {
			return dispatch(getPosts(new Error(body.message)));
		}
	}
};

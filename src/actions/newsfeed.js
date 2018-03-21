import {createAction} from 'redux-actions';

export const writePost = createAction('WRITEPOST');
export const getPosts = createAction('GETPOSTS');
export const getPost = createAction('GETPOST');
export const resetPosts = createAction('RESETPOSTS');

const writePostUri = '/api/newsfeed/writepost';
const getPostsUri = '/api/newsfeed/getposts';

export const newsfeedSocket = (socket,dispatch) => {
	socket.on( 'getpost', data => {
		dispatch(getPost(data));
	});
};

export const fetchResetPosts = (data) => {
	return dispatch => dispatch(resetPosts());
}

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
			return dispatch(writePost(new Error(body.msg)));
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
			return dispatch(getPosts(new Error(body.msg)));
		}
	}
};

import {createAction} from 'redux-actions';

export const follow = createAction('FOLLOW');

const followUri = '/api/relation/follow';

export const fetchFollow = (data) => {
	return async (dispatch) => {
		const resp = await fetch(followUri, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data),
			credentials: 'include'
		});
		const body = await resp.json();
		if(body.data !== null){
			return dispatch(follow(body.data));
		} else {
			return dispatch(follow(new Error(body.msg)));
		}
	}
};


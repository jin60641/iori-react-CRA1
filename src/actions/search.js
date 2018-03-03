import {createAction} from 'redux-actions';

export const search = createAction('SEARCH');

const searchUri = '/api/search';

export const fetchSearch = (data) => {
	return async (dispatch) => {
		const resp = await fetch(searchUri, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data),
			credentials: 'include'
		});
		const body = await resp.json();
		console.log(body);
		if(body.data){
			return dispatch(search(body.data));
		} else {
			return dispatch(search(new Error(body.msg)));
		}
	}
};


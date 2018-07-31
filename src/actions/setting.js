import {createAction} from 'redux-actions';

export const setProfile = createAction('SETPROFILE');
const setProfileUri = '/api/setting/profile';

export const fetchSetProfile = (data) => {
    return async (dispatch) => {
        const resp = await fetch(setProfileUri, {
            method: 'POST',
            body: data,
            credentials: 'include'
        });
        const body = await resp.json();
        if(body.data){
            return dispatch(setProfile(body.data));
        } else {
            return dispatch(setProfile(new Error(body.message)));
        }
    }
};


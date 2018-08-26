import { handleActions } from 'redux-actions';
import { getLink } from '../actions/link';

let initialState = {};

export default handleActions({
	[getLink.SUCCESS]: function(state, action) {
    const { link } = action.payload;
    return { ...state, [link] : action.payload };
	},
}, initialState );

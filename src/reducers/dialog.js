import {handleActions} from 'redux-actions';
import { getDialogs, getDialog } from '../actions/chat';

const handleToIndex= {};
const initialState = [];

export default handleActions({
	[getDialogs]: (state, action) => {
		if( action.error ) {
			return state;
		}
		let nextState = Object.keys(action.payload).map( handle => { return action.payload[handle] });
		nextState.sort( (a,b) => { return a.id < b.id }).forEach( (dialog,key) => { handleToIndex[dialog.handle] = key; } );
		return nextState;
	},
	[getDialog]: (state, action) => {
		if( action.error ) {
			return state;
		}
		const { chat, handle } = action.payload;
		let nextState = [].concat(state);
		const index = handleToIndex[handle];
		if( index >= 0 ) {
			nextState.splice(index,1);
		}
		nextState = [chat].concat(nextState);
		nextState.forEach( (dialog,key) => { handleToIndex[dialog.handle] = key; } );
		return nextState;
	}
}, initialState );

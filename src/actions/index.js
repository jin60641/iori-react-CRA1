import { combineEpics } from 'redux-observable';
import { authEpic } from './auth';

export default combineEpics(
  authEpic
);

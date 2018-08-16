import { combineEpics } from 'redux-observable';
import { authEpic } from './auth';
import socketEpic from './socket';

export default combineEpics(
  authEpic,
  socketEpic
);

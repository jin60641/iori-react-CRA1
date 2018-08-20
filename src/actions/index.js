import { BehaviorSubject, concat } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';

import authEpic from './auth';
import chatEpic from './chat';
import socketEpic from './socket';

export const rootEpic = combineEpics(authEpic,socketEpic,chatEpic);
/*
export const rootEpic$ = new BehaviorSubject( combineEpics(authEpic,socketEpic,chatEpic) );
const rootEpic = (action$, store, dependencies) =>
  rootEpic$.pipe(mergeMap(epic => epic(action$, store, dependencies)))
const epics = [];
export const addEpic = epic$ => {
  epics.push(epic$);
  rootEpic$.next(combineEpics(...epics));
}
*/

//addEpic(authEpic);
//addEpic(socketEpic);

export default rootEpic;

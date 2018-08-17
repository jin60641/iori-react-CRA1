import { BehaviorSubject } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';

import authEpic from './auth';
import socketEpic from './socket';

console.log(authEpic);
console.log(socketEpic);

export const rootEpic$ = new BehaviorSubject( combineEpics(authEpic,socketEpic) );
const rootEpic = (action$, store, dependencies) => 
  rootEpic$.pipe(mergeMap(epic => epic(action$, store, dependencies)))

export const addEpic = epic$ => {
  rootEpic$.next(epic$);
}

export default rootEpic;

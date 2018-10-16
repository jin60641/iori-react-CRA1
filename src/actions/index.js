// import { BehaviorSubject } from 'rxjs';
// import { mergeMap } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';

import authEpic from './auth';
import chatEpic from './chat';
import socketEpic from './socket';
import newsfeedEpic from './newsfeed';
import relationEpic from './relation';
import searchEpic from './search';
import settingEpic from './setting';
import noticeEpic from './notice';
import linkEpic from './link';

export const rootEpic = combineEpics(
  authEpic,
  socketEpic,
  chatEpic,
  newsfeedEpic,
  relationEpic,
  searchEpic,
  settingEpic,
  noticeEpic,
  linkEpic,
);

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

// addEpic(authEpic);
// addEpic(socketEpic);

export default rootEpic;

import { combineReducers } from 'redux';

import { reducer as toastr } from 'react-redux-toastr';
import user from './user';
import post from './post';
import socket from './socket';
import search from './search';
import chat from './chat';
import dialog from './dialog';
import notice from './notice';
import link from './link';
import isFetching from './isFetching';

export default combineReducers({
  user,
  posts: post,
  socket,
  searched: search,
  chats: chat,
  dialogs: dialog,
  notices: notice,
  links: link,
  isFetching,
  toastr,
});

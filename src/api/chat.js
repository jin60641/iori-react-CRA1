import Fetch from './Fetch';

const getChatsUri = '/api/chat/getchats';
const getDialogsUri = '/api/chat/getdialogs';
const sendChatUri = '/api/chat/sendchat';
const makeGroupUri = '/api/chat/makegroup';

const obj = {};

obj.getChats = data => Fetch('POST', getChatsUri, data);
obj.getDialogs = () => Fetch('POST', getDialogsUri);
obj.sendChat = data => Fetch('POST', sendChatUri, data);
obj.makeGroup = data => Fetch('POST', makeGroupUri, data);

export default obj;

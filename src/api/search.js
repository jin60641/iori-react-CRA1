import Fetch from './Fetch';

const searchUserByHandleUri = '/api/search/user/handle';
const searchUsersUri = '/api/search/users';
const searchGroupByIdUri = '/api/search/group/id';
const searchFollowsUri = '/api/search/follows';

const obj = {};

obj.searchUserByHandle = data => Fetch('POST', searchUserByHandleUri, data);
obj.searchUsers = data => Fetch('POST', searchUsersUri, data);
obj.searchGroupById = data => Fetch('POST', searchGroupByIdUri, data);
obj.searchFollows = data => Fetch('POST', searchFollowsUri, data);

export default obj;

import Fetch from './Fetch';

const writePostUri = '/api/newsfeed/post/write';
const getPostsUri = '/api/newsfeed/post/get';
const removePostUri = '/api/newsfeed/post/remove';
const hidePostUri = '/api/newsfeed/post/hide';

const obj = {};

obj.writePost = data => Fetch('POST', writePostUri, data);
obj.getPosts = data => Fetch('POST', getPostsUri, data);
obj.removePost = data => Fetch('POST', removePostUri, data);
obj.hidePost = data => Fetch('POST', hidePostUri, data);

export default obj;

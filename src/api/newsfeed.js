import Fetch from './Fetch';
  
const writePostUri = '/api/newsfeed/writepost';
const getPostsUri = '/api/newsfeed/getposts';
const removePostUri = '/api/newsfeed/removepost';

const obj = {};

obj.writePost = data => Fetch('POST',writePostUri,data);
obj.getPosts = data => Fetch('POST',getPostsUri,data);
obj.removePost = data => Fetch('POST',removePostUri,data);

export default obj;

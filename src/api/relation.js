import Fetch from './Fetch';

const followUri = '/api/relation/follow';

const obj = {};

obj.follow = data => Fetch('POST', followUri, data);

export default obj;

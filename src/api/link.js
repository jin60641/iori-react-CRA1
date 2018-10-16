import Fetch from './Fetch';

const getLinkUri = '/api/link/get';

const obj = {};

obj.getLink = data => Fetch('POST', getLinkUri, data);

export default obj;

import Fetch from './Fetch';

const setProfileUri = '/api/setting/profile';

const obj = {};

obj.setProfile = data => Fetch('POST', setProfileUri, data);

export default obj;

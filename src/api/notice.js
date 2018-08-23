import Fetch from './Fetch';

const getNoticesUri = '/api/notice/getnotices';

const obj = {};

obj.getNotices = data => Fetch('POST',getNoticesUri,data);

export default obj;

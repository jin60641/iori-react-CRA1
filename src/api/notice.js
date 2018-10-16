import Fetch from './Fetch';

const getNoticesUri = '/api/notice/gets';
const removeNoticeUri = '/api/notice/remove';

const obj = {};

obj.getNotices = data => Fetch('POST', getNoticesUri, data);
obj.removeNotice = data => Fetch('POST', removeNoticeUri, data);

export default obj;

const Fetch = (method, uri, data) => {
  const options = {
    method,
    credentials: 'include',
  };
  if (data) {
    if (data.constructor !== FormData) {
      options.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      options.body = JSON.stringify(data);
    } else {
      options.body = data;
    }
  }
  return fetch(uri, options).then(resp => resp.json());
};
export default Fetch;

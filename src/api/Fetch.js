const Fetch = (method,uri,data) => {
  const options = { 
    method,
    credentials: 'include'
  };
  if( data ){
    if( data.constructor !== FormData ){
      options.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
      options.data = JSON.stringify(data);
    } else {
      options.data = data;
    }
  }
  return fetch(uri,options).then( resp => resp.json() );
}
export default Fetch;

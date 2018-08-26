const obj = {};
obj.timeout = async (ms, promise) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("promise timeout"))
    }, ms);
    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  })
}

obj.getMeta = async (body) => {
	const metas = {};
  if( !body || !body.length ){
    return metas;
  }
	let head = body.substring( body.indexOf("<head>") + 6, body.indexOf("</head>") - 1);
	while( head && head.length && head.indexOf('property="') ){
    let property, content;
		let meta = head.substr( 0, head.indexOf(">") );
		head = head.substr( meta.length + 1 );
		if( meta == "" ){
			break;
		}
		if( meta.indexOf('property="') >= 0 ){
			property = meta.substr( meta.indexOf('property="og:') + 13 );
			property = property.substr( 0, property.indexOf('"') );
		} else {
			continue;
		}
		if( meta.indexOf('content="') >= 0 ){
			content = meta.substr( meta.indexOf('content="') + 9 );
			content = content.substr( 0, content.indexOf('"') );
		} else {
			continue;
		}
		metas[ property ] = content;
	}
	return metas;
}

module.exports = obj;

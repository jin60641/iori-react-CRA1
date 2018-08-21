const db = require("./models/index.js");

let cookie = require('cookie');

let io;
function socketjs( server ){
	io = require('socket.io').listen(server);
	global.io = io;
	io.on( 'connection', socketCore );
}

let socketIds = {};
global.socketIds = socketIds;

function socketCore( socket ){
  socket.on( 'login', () => {
  	if( socket.request.headers.cookie && cookie.parse( socket.request.headers.cookie )[ 'connect.sid' ] ){
  		global.store.get( cookie.parse( socket.request.headers.cookie )[ 'connect.sid' ].split('.')[0].substring(2) , function( err, session ){
  			if( session && session.passport && session.passport.user ){
  				if( session.passport.user.verify ){
  					socket.user = session.passport.user;
  					socketIds[socket.user.id] = socket.id;
  					console.log("socket connected (" + socket.user.name + ")" );
  				} else if( session.passport.user.token ){
  					socketIds[session.passport.user.token] = socket.id;
  					console.log("socket connected (" + session.passport.user.username + ")" );
  				}
  			} else {
  				console.log("socket connected (guest)");
  			}
  		});
  	}
  });
	socket.on( 'disconnect', function(){
	});
}

module.exports = socketjs;

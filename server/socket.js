const db = require("./models/index.js");

let cookie = require('cookie');

let io;
function socketjs( server ){
	io = require('socket.io').listen(server);
	global.io = io;
	io.on( 'connection', socketCore );
}

let socket_ids = {};
global.socket_ids = socket_ids;

function socketCore( socket ){
	console.log("socket connected (guest)");
	socket.on( 'say', function(data){
		console.log(1);
		socket.broadcast.emit('say',data);
	});
	socket.on( 'disconnect', function(){
	});
}

module.exports = socketjs;

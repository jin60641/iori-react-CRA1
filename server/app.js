const express = require('express');
const path = require('path')
const app = express();
const bodyParser = require('body-parser');

app.use('/public',express.static(path.resolve(__dirname,'..','public')));
let port = process.evn.PORT||3000;
if( process.env.NODE_ENV == 'api' ){
	port = 3333;
} else {
	app.use(express.static(path.resolve(__dirname,'..','build')));
	app.get('*',(req,res)=>{
		res.sendFile(path.resolve(__dirname,'..','build','index.html'));
	});
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

let sessionstore = require('sessionstore');
global.store = sessionstore.createSessionStore();
let session = require('express-session')
let sessionMiddleware = {
	store : global.store,
    secret: require('./config/settings.js').sessionSecret,
	resave: false,
	saveUninitialized: true
}
let authMws = require('./middlewares/auth.js');
app.use(session(sessionMiddleware));
app.use(authMws.passport.initialize()).use(authMws.passport.session());


const route = require('./route');
app.use(route);
const server = require('http').createServer(app);
require('./socket.js')(server);
server.listen(port, () => {
	console.log('listen on ' + port);
});

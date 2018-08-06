const express = require('express');
const path = require('path')
const app = express();
const sessionstore = require('sessionstore');
const session = require('express-session');
const bodyParser = require('body-parser');
const port = process.env.PORT||3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

global.store = sessionstore.createSessionStore();
const sessionMiddleware = {
	store : global.store,
    secret: require('./config/settings.js').sessionSecret,
	resave: false,
	saveUninitialized: true
}
let authMws = require('./middlewares/auth.js');
app.use(session(sessionMiddleware));
app.use(authMws.passport.initialize()).use(authMws.passport.session());

app.use(require('./route'));
app.use('/files',express.static(path.resolve(__dirname,'..','files')));
app.use('/public',express.static(path.resolve(__dirname,'..','public')));
app.use(express.static(path.resolve(__dirname,'..','build')));
app.get('*',(req,res)=>{
	res.sendFile(path.resolve(__dirname,'..','build','index.html'));
});


const server = require('http').createServer(app);
require('./socket.js')(server);
server.listen(port, () => {
});

module.exports = server;

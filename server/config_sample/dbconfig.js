const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const promise = mongoose.connect('mongodb://localhost/[dbName]', {
    useMongoClient: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));

db.once('open', function callback() {
	console.log('db connected');
});

const models = {};

const UserSchema = new mongoose.Schema({
	id : { type : Number },
	admin : { type : Boolean, default : false },
	email : String,
	name : String,
	password : String,
	last : { type : Date },
	date : { type : Date, default : Date.now },
	signUp : { type : Boolean, default : false },
	profile : { type : Boolean, default : false },
	be : { type : Boolean, default : true }
});
models.Users = mongoose.model('User', UserSchema);

const PostSchema = new mongoose.Schema({
	id : { type : Number },
	user : { type : mongoose.Schema.Types.ObjectId, ref : 'User' },
	text : { type : String, default : "" },
	html : { type : String, default : "" },
	date : { type : Date, default : Date.now },
	file : { type : Number, default : 0 },
	be : { type : Boolean, default : true }
});
models.Posts = mongoose.model('Post', PostSchema);

module.exports = models;

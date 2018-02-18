const settings = {
	sessionSecret : "session secret",
	mailAccount : {
		user : "gmail address",
		pass : "gmail password",
		clientId : "gmail client id",
		clientSecret : "gmail client secret",
	},
	db : {
		pool : { 
			max : 100,
			min : 0,
			acquire : 30000,
			idle: 10000
		},
		password : "mysql address",
		host : 'mysql host',
		port : 3306,
		database : "mysql database",
		dialect : "mysql",
		username : "mysql username",
		define: {
			charset: 'utf8',
			dialectOptions: {
				collate: 'utf8_general_ci'
			},
 		},
		query : {
			raw : true 
		}
	}
}

module.exports = settings;


const env = process.env.NODE_ENV || 'development';

const database = {
	development : "development database name",
	test : "test database name",
	production : "production database name",
}

const settings = {
  host: "http://exmaple.com",
  domain: "exmaple.com",
	sessionSecret : "session secret",
	mailAccount : {
		user : "gmail address",
		pass : "gmail password",
		clientId : "gmail client id",
		clientSecret : "gmail client secret",
	},
	db : {
		database : database[env],
		password : "mysql password",
		username : "mysql username",
		options : {
			pool : {
				max : 100,
				min : 0,
				acquire : 30000,
				idle: 10000
			},
			//host : 'root',
			port : 3306,
			dialect : "mysql",
			define: {
				charset: 'utf8',
				dialectOptions: {
					collate: 'utf8_general_ci'
				},
			},
			query : {
			}
		}
	}
}

module.exports = settings;


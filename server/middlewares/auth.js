let db = require('../models/index.js');
let smtpTransport = require("./../config/mailconfig.js");
let crypto = require('crypto');

let obj = {
	passport : require('passport')
}

let LocalStrategy = require('passport-local').Strategy;
obj.passport.use(new LocalStrategy({ usernameField : 'email', passwordField : 'password' }, function( email, password, next ){
	db.User.findOne({ where : { email : email } }).then( function( user ){
		if(!user){
			return next(new Error("이메일 또는 비밀번호가 잘못되었습니다."));
		} else {
			var shasum = crypto.createHash('sha1');
			shasum.update(password);
			var sha_pw = shasum.digest('hex');
			if( user.password == sha_pw ){
				if( user && user.signUp == false ){
					return next(new Error('이메일 인증을 진행하셔야 정상적인 이용이 가능합니다.'));
				} else if( user ){
					return next(null,user);
				}
			} else {
				return next(new Error('이메일 또는 비밀번호가 잘못되었습니다.'));
			}
		}
	});
}));

obj.passport.deserializeUser( function(obj, done) {done(null, obj);});
obj.passport.serializeUser( function(user, done) {done(null, user);});

obj.verifyMail = function( req, res ){
	 var email = req.params.email;
	 var link = req.params.link;
	 if( email != null, link != null ){
		db.User.findOne({ where : { email : email } }).then( function( user ){
			if( user ){
				 var shasum = crypto.createHash('sha1');
				 shasum.update(user.email);
				 var sha_email = shasum.digest('hex');
				 if( sha_email == link ){
					if( !user.signUp ){
						db.User.update({ 'signUp' : true }, { where : { email : email } }).then( function(){
							res.send({ data : "회원가입이 완료되었습니다." });
						});
					} else {
						res.send({ data : "회원가입이 완료되었습니다." });
					}
				 } else {
					res.send({ msg : "잘못된 접근입니다." });
				 }
			} else {
				res.send({ msg : "잘못된 접근입니다." });
			}
	 	});
	}
}

obj.findPw = function( req, res ){
	var email = req.body['email'].trim();
	db.User.findOne({ where : { email : email } }).then( function( user ){
		if( user ) {
			var shasum = crypto.createHash('sha1');
			shasum.update(email);
			var sha_email = shasum.digest('hex');
			var string = "https://iori.kr/api/auth/findpw/" + email + "/" + sha_email;
			smtpTransport.sendMail({
				from: 'iori <iori.kr>',
				to: email,
				subject : '[iori.kr] 비밀번호 재설정 안내',
				'html' : '<div style="width : 100%; text-align : center; font-size : 10pt; line-height : 24px;"><img src="https://iori.kr/svg/logo.svg" style="width : 100px; margin : 30px 0 30px 0;"><div style="border-top : 1px solid #4c0e25; border-bottom : 1px solid #4c0e25; padding-top : 60px; padding-bottom : 60px; margin-bottom : 20px;">안녕하세요. ' + user.name + '님.<br><br>iori.kr의 이메일의 비밀번호 재설정을 요청하셨기에 이메일로 안내해 드립니다.<br>>아래 링크를 클릭하시면 비밀번호를 재설정 하실 수 있습>니다.<br><a href="' + string + '" style="display : block; margin-top : 20px; text-decoration:none;color:red;font-weight:bold;">여기>를 눌러 비밀번호 >재설정</a></div></div>'
			}, function( error, response ){
				if( error ){
					throw error;
				} else {
					res.send({ data : "이메일로 비밀번호를 다시 설정하는 방법을 보내드렸습니다." });
				}
			});
		} else {
			res.send({ msg : "입력하신 메일을 찾을 수 없습니다." });
		}
	});
};

obj.findPwVerifyMail = function( req, res ){
	var email = req.params.email;
	var link = req.params.link;
	db.User.findOne({ where : { email : email } }).then( function( user ){
		if( user ){
			var shasum = crypto.createHash('sha1');
			shasum.update(user.email);
			var sha_email = shasum.digest('hex');
			if( sha_email == link ){
				 res.redirect('/changepw/'+email+'/'+link);
			} else {
				 res.redirect('/');
			}
		} else {
			res.end();
		}
	});
}

obj.checkSession = function( req, res, next ){
	 if( req.user && req.user.signUp ){
		return next();
	 } else {
		res.send({ msg : "로그인해주세요" });
	 }
}

obj.checkAdmin = function( req, res, next ){
	if( req.user && req.user.signUp ){
		db.User.findOne({ where : { id : req.user.id } }).then( function( user ){
			if( user.admin == true ){
				return next();
			} else {
				res.status(404).send("Not Found");
			}
		});
	} else {
		res.status(404).send("Not Found");
	}
}

obj.logOut = function( req, res, msg ){
	res.clearCookie("email");
	res.clearCookie("password");
	res.cookie("facebook","false",{ maxAge : 900000, expire : new Date(Date.now() + 900000), domain : "iori.kr", path : "/" });
	res.cookie("google","false",{ maxAge : 900000, expire : new Date(Date.now() + 900000), domain : "iori.kr", path : "/" });
	req.logout();
	req.session.destroy( function( err ){
		if( req.user ){
			delete req.user;
		}
		if( req.method == "GET" ){
			res.redirect('/');
		} else {
			res.send({ "msg" : msg });
		}
	});
}

obj.loggedIn = function( req, res ){
	res.send({ "data" : req.user });
};

obj.authLocal = function( req, res, next ){
	obj.passport.authenticate('local', function( err, user, info ){
		if( err ){
			return res.send({ msg : err.message });
		} else {
			req.logIn( user, function( error ){
				if( error ){
					return next( error );
				} else {
					return res.send({ "data" : user });
				}
			});
		}
	})( req, res, next );
}

obj.join = function( req, res ){
	let password, email, name;
	try {
		email = req.body['email'].trim();
		password = req.body['password'].trim();
		name = req.body['name'].trim();
	} catch( e ){
		res.send({ "msg" : e.message });
	}
	db.User.findOne({ where : { email : email } })
		.then( function( user ){
			if( user ){
				throw new Error("이미 사용중인 메일입니다.");
			} else {
				const regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
				if( regex.test(email) === false ){
					throw new Error("유효하지 않은 이메일입니다.");
				} else {
					return null;
				}
			} 
		}).then( function(){
			let shasum = crypto.createHash('sha1');
			shasum.update(password);
			let pw = shasum.digest('hex');
			let shasum2 = crypto.createHash('sha1');
			shasum2.update(email);
			let link = shasum2.digest('hex');
			let current = {
				password : pw,
				email : email,
				name : name
			};
			db.User.create(current).then( function(task){
				let string = "https://iori.kr/mail/" + email + "/" + link;
				smtpTransport.sendMail({
					from: 'iori <jinsang@ajou.ac.kr>',
					to: email,
					subject : 'iori.kr E-mail verification guide',
					html : '<div><a id="btn" href="' + string + '">인증</div>'
				}, function(err, response){
					if( err ){
					}
				});
				res.send({ "data" : "입력하신 이메일로 인증메일을 전송하였습니다." });
			})
		}).catch( function(e){
			res.send({ "msg" : e.message });
		})
}

module.exports = obj;

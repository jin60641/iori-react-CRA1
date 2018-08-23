let db = require('../models/index.js');
let smtpTransport = require('../config/mailconfig.js');
const settings = require('../config/settings.js');
const { host, domain, mailAccount } = settings;
let cookie = require('cookie');
let crypto = require('crypto');

let obj = {
	passport : require('passport')
}

obj.isLoggedIn = async req => {
	if( req.user && req.user.verify ){
		return req.user;
	} else if( req.headers.cookie ){
		const sid = await req.headers.cookie && cookie.parse( req.headers.cookie )[ 'connect.sid' ];
		if( sid ){
			global.store.get( sid.split('.')[0].substring(2), ( err, session ) => {
				if( session && session.passport && session.passport.user ){
					return session.passport.user;
				} else {
					return null;
				}
			});
		} else {
			return null;
		}
	}
}

let LocalStrategy = require('passport-local').Strategy;
obj.passport.use(new LocalStrategy({ usernameField : 'email', passwordField : 'password' }, async ( email, password, next ) => {
	const where = { 
		$or : [{
			email
		},{
			handle : email
		}],
		password : db.User.createHashedPassword(password)
	}
	const user = await db.User.findOne({ 
		where, 
		attributes : db.User.attributeNames,
		raw : true
	});
	if( user ){
		if( user.verify ){
			return next(null,user);
		} else {
			return next(new Error('이메일 인증을 진행하셔야 정상적인 이용이 가능합니다.'));
		}
	} else {
		return next(new Error('이메일 또는 비밀번호가 잘못되었습니다.'));
	}
}));

obj.passport.serializeUser( async (user, done) => {
	if( user.verify ){
		user.posts = await db.Post.count({ where: { userId : user.id } });
		user.followings = await db.Follow.count({ where : { fromId : user.id } });
		user.followers = await db.Follow.count({ where : { toId : user.id } });
	}
	done(null, user) 
});
obj.passport.deserializeUser( (obj, done) => done(null, obj) );

obj.verifyMail = async ( req, res ) => {
	let { email = "", link = "" } = req.body;
	const user = await db.User.findOne({ where : { email }});
	if( user && db.User.createHashedEmail(email) === link ){
		db.User.update({ 'verify' : true }, { where : { email } })
		.then( () => {
			res.send({ data : '회원가입이 완료되었습니다.' });
		});
	} else {
		res.status(401).send({ message : '잘못된 접근입니다.' });
	}
}

obj.findPw = ( req, res ) => {
	let { email = "" } = req.body;
	let shasum = crypto.createHash('sha1');
	shasum.update(email);
	let link = shasum.digest('hex');
	const string = `${host}/auth/change/${email}/${link}`;
	db.User.findOne({ where : { email } })
	.then( user => {
		if( user ) {
			smtpTransport.sendMail({
				from: `iori <${mailAccount.user}>`,
				to: email,
				subject : `[${domain}] 비밀번호 재설정 안내`,
				html : `<div style="width : 100%; text-align : center; font-size : 10pt; line-height : 24px;"><img src="${host}/svg/logo.svg" style="width : 100px; margin : 30px 0 30px 0;"><div style="border-top : 1px solid #4c0e25; border-bottom : 1px solid #4c0e25; padding-top : 60px; padding-bottom : 60px; margin-bottom : 20px;">안녕하세요. ${user.name}님.<br><br>${domain}의 비밀번호 수정을 요청하셨기에 안내해 드립니다.<br />아래 링크에서 비밀번호를 변경하실 수 있습니다.<a id="btn" href="${string}" style="text-decoration:none;cursor:pointer;margin-top:22px;margin-left:10px;padding-top:14px;padding-bottom:14px;padding-right:35px;padding-left:35px;font-size:17px;border-radius:200px;background-color:#3fc649;color:white;display:inline-block;text-align:center;" > 비밀번호 변경 </a></div> <div id="footer" style="margin-top:80px;" > <br></div></div>`
			}, ( err, response ) => {
				if( err ){
				}
			});
			res.send({ data : 'success', message : '이메일로 비밀번호 재설정 방법을 발신하였습니다.' });
		} else {
			res.status(401).send({ message : '입력하신 이메일로 가입된 계정이 존재하지 않습니다.' });
		}
	});
};

obj.changePw = async ( req, res ) => {
	const { password = "", email = "", link = "" } = req.body;
	const where = { email : req.user?req.user.email:email } 
	const user = await db.User.findOne({ where });
	if( user && ( await obj.isLoggedIn(req) || (db.User.createHashedEmail(email) === link) ) ){
		await db.User.update({ password },{ where });
		res.send({ data : 'success', message : '비밀번호가 성공적으로 재설정되었습니다.' });
	} else {
		res.status(401).send({ message : '잘못된 접근입니다.' });
	}
}

obj.checkSession = async ( req, res, next ) => {
	const session = await obj.isLoggedIn(req);
	if( session ){
		req.user = session;
		return next();
	} else {
		res.status(400).send({ message : '로그인이 필요합니다.' });
	}
}

obj.checkAdmin = async ( req, res, next ) => {
	if( await obj.isLoggedIn(req) ){
		db.User.findOne({ where : { id : req.user.id, adin : true }, raw : true }).then( user => {
			if( user ){
				return next();
			} else {
				res.status(400).send('로그인이 필요합니다');
			}
		});
	} else {
		res.status(400).send('로그인이 필요합니다');
	}
}

obj.logOut = ( req, res ) => {
	if( res.clearCookie ){
		res.clearCookie('email');
		res.clearCookie('password');
	}
	if( res.cookie ){
		res.cookie('facebook','false',{ maxAge : 900000, expire : new Date(Date.now() + 900000), domain, path : '/' });
		res.cookie('google','false',{ maxAge : 900000, expire : new Date(Date.now() + 900000), domain, path : '/' });
	}
	if( req.logout ){
		req.logout();
	}
	if( req.session ){
		req.session.destroy( err => {
			if( err ){
				throw err;
			}
			if( req.user ){
				delete req.user;
			}
			res.status(200).send({ data : 'success', message : '로그아웃되었습니다.' });
		});
	} else {
		res.status(200).send({ data : 'success', message : '로그아웃되었습니다.' });
	}
}

obj.loggedIn = ( req, res ) => {
	res.send({ 'data' : req.user });
};

obj.authLocal = ( req, res, next ) => {
	obj.passport.authenticate('local', ( err, user, info ) => {
		if( err ){
			res.status(401).send({ message : err.message });
		} else {
			req.logIn( user, error => {
				if( error ){
					return next( error );
				} else {
					return res.send({ data : user, message : '로그인되었습니다.' });
				}
			});
		}
	})( req, res, next );
}

obj.join = ( req, res ) => {
	let { password, email, name, handle } = req.body;
	try {
		email = email.trim();
		password = password.trim();
		handle = handle.trim();
		name = name.trim();
	} catch( e ){
		res.status(400).send({ message : e.message });
	}
	db.User.findOne({ 
		where : { 
			$or : [
				{ email },
				{ handle }
			]
		}, 
		raw : true 
	})
	.then( user => {
		if( user ){
			if( user.email == email ){
				throw new Error('이미 사용중인 메일입니다.');
			} else if( user.handle == handle ){
				throw new Error('이미 사용중인 핸들입니다.');
			}
		} else {
			const regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
			if( regex.test(email) === false ){
				throw new Error('유효하지 않은 이메일입니다.');
			} else {
				return null;
			}
		} 
	}).then( () => {
		let shasum2 = crypto.createHash('sha1');
		shasum2.update(email);
		let link = shasum2.digest('hex');
		let current = {
			password,
			email,
			name,
			handle
		};
		db.User.create(current).then( created => {
			let string = host + '/mail/' + email + '/' + link;
			smtpTransport.sendMail({
				from: `iori <${mailAccount.user}>`,
				to: email,
				subject : `${domain} 이메일 인증 안내`,
				html : `<div id="box" style="display:block;background-color:#ebeff4;margin-top:auto;margin-bottom:auto;margin-right:auto;margin-left:auto;width:100%;padding-top:50px;padding-bottom:50px;" > <div id="wrap" style="max-width:700px;border-radius:4px;margin-left:auto;margin-right:auto;box-shadow:0 2px 8px rgba(0, 0, 0, 0.25);background-color:white;" > <div id="head" style="height:55px;background-color:#ff5c3e;padding-top:13px;padding-bottom:0px;padding-right:0px;padding-left:38px;box-sizing:border-box;" > <img src="${host}/images/email_logo_mono.png" style="width:77px;" /> </div> <div id="body" style="position:relative;background-position:right bottom;background-repeat:no-repeat;background-size:265px;background-image:url('${host}/images/email_deco.png');padding-top:38px;padding-bottom:38px;padding-right:38px;padding-left:38px;box-sizing:border-box;" > <div id="title" style="font-size:19px;font-weight:800;padding-bottom:20px;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:black;max-width:310px;width:100%;margin-bottom:20px;" > ${domain} 이메일 인증 안내 </div> <div id="text" style="font-size:15px;line-height:32px;" > 안녕하세요.<br /> ${domain}의 회원이 되신 것을 진심으로 환영합니다.<br /> 아래 인증 버튼을 클릭하시면<br /> 회원 가입 절차가 완료됩니다.<br /> </div> <a id="btn" href="${string}" style="text-decoration:none;cursor:pointer;margin-top:22px;margin-left:10px;padding-top:14px;padding-bottom:14px;padding-right:35px;padding-left:35px;font-size:17px;border-radius:200px;background-color:#3fc649;color:white;display:inline-block;text-align:center;" > 이메일 인증 </a> <div id="footer" style="margin-top:80px;" > <img src="${host}/images/email_logo_colored.png" style="height:27px;display:inline-block;vertical-align:middle;" /> <div id="footer-text" style="display:inline-block;margin-top:2px;vertical-align:middle;font-size:10px;color:#a8a8a8;padding-left:15px;border-left-width:1px;border-left-style:solid;border-left-color:#d5d5d5;margin-left:15px;line-height:14px;" > Copyrightⓒ2017.Allrights reserved by ${domain}<br /> 본인이 가입하신 것이 아니라면 문의 바랍니다. </div> </div> </div> </div> </div>`
			}, (err, response) => {
				if( err ){
				}
			});
			res.send({ data : 'success', message : '입력하신 이메일로 인증메일을 전송하였습니다.' });
		})
	}).catch( e => {
		res.status(400).send({ message : e.message });
	});
}

module.exports = obj;

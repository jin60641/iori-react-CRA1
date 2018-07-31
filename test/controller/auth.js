const request = require('supertest');
const crypto = require('crypto');

describe('auth controller', function () {
	before(global.setup);
	afterEach(global.teardown);

	let agent, app, userInfo;

	beforeEach(async function () {
		this.timeout(5000);
		app = require('../../server/app');
		agent = request.agent(app);
		userInfo = { ...global.defaultUserInfo };
	});

	context('when user tries to join,', function () {
		it('should save user document and inform to read verify mail/', async function () {
			const { email, password, handle, name } = userInfo;
			const resp = await agent
				.post('/api/auth/join')
				.send({ email, password, handle, name })
				.expect(200);
			const {body: {data}} = resp;
			expect(data).to.equal('입력하신 이메일로 인증메일을 전송하였습니다.');
		});
	});

	context('if user is created,', function () {
		context('when user who not verified tries to log in,', function () {
			it('should return error message.', async function () {
				const { email, password } = userInfo;
				const resp = await agent
					.post('/api/auth/login/local')
					.send({email, password })
					.expect(401);

				expect(resp.body.message).to.equal('이메일 인증을 진행하셔야 정상적인 이용이 가능합니다.');
			});
		});

		context('when user tries to verify email,', function () {
			it('should verify field change to true and return success message.', async function () {
				const { email } = userInfo;
				let shasum = crypto.createHash('sha1');
				shasum.update(email);
				const link = shasum.digest('hex');
				const resp = await agent
					.post('/api/auth/verify')
					.send({email, link })
					.expect(200);
				const {body: {data}} = resp;
				expect(data).to.equal('회원가입이 완료되었습니다.');
			});
		});		

		context('when user tries to log in,', function () {
			it('should save user session and return user info.', async function () {
				const { email, password } = userInfo;
				const resp = await agent
					.post('/api/auth/login/local')
					.send({ email, password })
					.expect(200);

				const {body: {data: newUser}} = resp;
				expect(newUser).to.deep.match({
					email
				});

			});
		});

		context('when user tries to log in with invalid user name,', function () {
			it('should return error message.', async function () {
				const { email, password } = userInfo;
				const resp = await agent
					.post('/api/auth/login/local')
					.send({ email : email+'2', password })
					.expect(401);

				expect(resp.body.message).to.equal('이메일 또는 비밀번호가 잘못되었습니다.');
			});
		});

		context('when user tries to log in with invalid user password,', function () {
			it('should return error message.', async function () {
				const { email, password } = userInfo;
				const resp = await agent
					.post('/api/auth/login/local')
					.send({ email, password : password+'2' })
					.expect(401);

				expect(resp.body.message).to.equal('이메일 또는 비밀번호가 잘못되었습니다.');
			});
		});

		context('when user tries to log out,', function () {
			it('should log out the user and remove the session.', async function () {
				const { email, password } = userInfo;
				await agent
					.post('/api/auth/login/local')
					.send({email, password})
					.expect(200);

				await agent
					.post('/api/auth/logout')
					.expect(200);

				const resp = await agent
					.post('/api/auth/loggedin')
					.expect(403);

				expect(resp.body.message).to.equal('로그인이 필요합니다.');
			});
		})
	});
});

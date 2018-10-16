const request = require('supertest');
const crypto = require('crypto');

describe('auth controller', function () {
  before(global.setup);
  after(global.setup);
  let agent, app, userInfo = { ...global.defaultUserInfos[0], verify : false };
  beforeEach(async function () {
    this.timeout(5000);
    app = require('../../server/app');
    agent = request.agent(app);
  });

  context('if user is not created,', function () {
    context('when user tries to log in,', function () {
      it('should return error message.', async function () {
        const { email, password } = userInfo;
        const resp = await agent
          .post('/api/auth/login/local')
          .send({ email, password })
          .expect(401);

        expect(resp.body.message).to.equal('이메일 또는 비밀번호가 잘못되었습니다.');
      });
    });

    context('when user tries to change password,', function () {
      it('should return error message.', async function () {
        const { email, password } = userInfo;
        let shasum = crypto.createHash('sha1');
        shasum.update(email);
        const link = shasum.digest('hex');
        const resp = await agent
          .post('/api/auth/changepw')
          .send({ email, link, password })
          .expect(401)

        expect(resp.body.message).to.equal('잘못된 접근입니다.');
      });
    });

    context('when user tries to find password,', function () {
      it('should return error message.', async function () {
        const { email } = userInfo;
        const resp = await agent
          .post('/api/auth/findpw')
          .send({ email })
          .expect(401)

        expect(resp.body.message).to.equal('입력하신 이메일로 가입된 계정이 존재하지 않습니다.');
      });
    });

    context('when user tries to join with not verified format email,', async function () {
      it('should return error meessage.', async function () {
        const { password, handle, name } = userInfo;
        const resp = await agent
          .post('/api/auth/join')
          .send({ email : 'not email format', password, handle, name })
          .expect(400)

        expect(resp.body.message).to.equal('유효하지 않은 이메일입니다.');
      });
    });

    context('when user tries to join,', function () {
      it('should save user document and inform to read verify mail.', async function () {
        const { email, password, handle, name } = userInfo;
        const resp = await agent
          .post('/api/auth/join')
          .send({ email, password, handle, name })
          .expect(200);
        const { body: { data } } = resp;
        expect(data).to.equal('입력하신 이메일로 인증메일을 전송하였습니다.');
      });
    });

    context('when user tries to join with already joined mail,', function () {
      it('should return error meessage.', async function () {
        const { email, password, handle, name } = userInfo;
        const resp = await agent
          .post('/api/auth/join')
          .send({ email, password, handle : handle+'a', name })
          .expect(400)

        expect(resp.body.message).to.equal('이미 사용중인 메일입니다.');
      });
    });

    context('when user tries to join with already joined mail,', function () {
      it('should return error meessage.', async function () {
        const { email, password, handle, name } = userInfo;
        const resp = await agent
          .post('/api/auth/join')
          .send({ email : 'a'+email, password, handle, name })
          .expect(400)

        expect(resp.body.message).to.equal('이미 사용중인 핸들입니다.');
      });
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

    context('when user tries to verify email with invalid email,', function () {
      it('should return error message.', async function () {
        const { email } = userInfo;
        let shasum = crypto.createHash('sha1');
        shasum.update(email);
        const link = shasum.digest('hex');
        const resp = await agent
          .post('/api/auth/verify')
          .send({email : email+'2', link })
          .expect(401);
        expect(resp.body.message).to.equal('잘못된 접근입니다.');
      });
    });

    context('when user tries to verify email with invalid link,', function () {
      it('should return error message.', async function () {
        const { email } = userInfo;
        let shasum = crypto.createHash('sha1');
        shasum.update(email);
        const link = shasum.digest('hex');
        const resp = await agent
          .post('/api/auth/verify')
          .send({ email, link : link+'2' })
          .expect(401);
        expect(resp.body.message).to.equal('잘못된 접근입니다.');
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
        const { body : { data } } = resp;
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

        const { body : { data : newUser } } = resp;
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

    context('when user tries to find password,', function () {
      it('should get mail inform for change password.', async function () {
        const { email } = userInfo;
        const resp = await agent
          .post('/api/auth/findpw')
          .send({ email })
          .expect(200)

        const { body : { data } } = resp;
        expect(data).to.equal('이메일로 비밀번호 재설정 방법을 발신하였습니다.');
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
          .expect(400);

        expect(resp.body.message).to.equal('로그인이 필요합니다.');
      });
    })

    context('when user tries to change password with invalid email,', function () {
      it('should return error message.', async function () {
        const { email, password } = userInfo;
        let shasum = crypto.createHash('sha1');
        shasum.update(email);
        const link = shasum.digest('hex');
        const newPassword = password+'5';
        const resp = await agent
          .post('/api/auth/changepw')
          .send({ email : email+'5', link, password : newPassword })
          .expect(401)

        expect(resp.body.message).to.equal('잘못된 접근입니다.');
      });
    });

    context('when user tries to change password with no session,', function () {
      it('should return success message and could login with new password.', async function () {
        const { email, password } = userInfo;
        let shasum = crypto.createHash('sha1');
        shasum.update(email);
        const link = shasum.digest('hex');
        const newPassword = password+'5';
        const resp = await agent
          .post('/api/auth/changepw')
          .send({ email, link, password : newPassword })
          .expect(200)
        
        const { body : { data } } = resp;
        expect(data).to.equal('비밀번호가 성공적으로 재설정되었습니다.');

        userInfo.password = newPassword;
        await agent
          .post('/api/auth/login/local')
          .send({email, password : newPassword})
          .expect(200);
      });
    });

    context('when user tries to change password with session,', function () {
      it('should return success message, and could login with new password.', async function () {
        const { email, password } = userInfo;
        await agent
          .post('/api/auth/login/local')
          .send({email, password})
          .expect(200);


        const newPassword = password+'6';
        const resp = await agent
          .post('/api/auth/changepw')
          .send({ password : newPassword })
          .expect(200)
        
        const { body : { data } } = resp;
        expect(data).to.equal('비밀번호가 성공적으로 재설정되었습니다.');


        userInfo.password = newPassword;
        await agent
          .post('/api/auth/login/local')
          .send({email, password : newPassword})
          .expect(200);

      });
    });
  });
});

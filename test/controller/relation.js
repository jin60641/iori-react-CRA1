const request = require('supertest');

describe('relation controller', function () {
  before(global.setup);
  afterEach(global.teardown);

  let agent, 
    app, 
    userInfo,
    userInfos;

  before(async function () {
    userInfos = await global.prepareUsers();
    this.timeout(5000);
    app = require('../../server/app');
    agent = request.agent(app);
    const { email, password } = global.defaultUserInfos[0];
    const resp = await agent
      .post('/api/auth/login/local')
      .send({ email, password })
      .expect(200);

    userInfo = resp.body.data;
  });
  beforeEach(async function () {
    this.timeout(5000);
  });
  
  context('when user tries to follow himself,', function () {
    it('should return error.', async function () {
      const resp = await agent
        .post('/api/relation/follow')
        .send({to:userInfo.id})
        .expect(400)
      
      expect(resp.body.message).to.equal('자신을 팔로우 할 수 없습니다.');
    });
  });

  context('if there is no relation,', function () {
    context('when user tries to follow other user,', function () {
      it('should return true.', async function () {
        const resp = await agent
          .post('/api/relation/follow')
          .send({to:userInfos[5].id})
          .expect(200)
        
        const { body : { data } } = resp;
        expect(data).to.be.true;
      });
    });
  });

  context('if there is a relation', function () {
    context('when user tries to unfollow other user,', function () {
      it('should return false.', async function () {
        const resp = await agent
          .post('/api/relation/follow')
          .send({to:userInfos[5].id})
          .expect(200)

        const { body : { data } } = resp;
        expect(data).to.be.false;
      });
    });
  });
});

  const request = require('supertest');

describe('search controller', function () {
  before(global.setup);
  afterEach(global.teardown);

  let agent, 
    app, 
    userInfos

  before(async function () {
    userInfos = await global.prepareUsers(2);
    await global.prepareFollows(2);
    this.timeout(5000);
    app = require('../../server/app');
    agent = request.agent(app);
    const { email, password } = global.defaultUserInfos[0];
    await agent
      .post('/api/auth/login/local')
      .send({ email, password })
      .expect(200);

  });
  beforeEach(async function () {
    this.timeout(5000);
  });
  
  context('if user is not created,', function () {
    context('when user tries to search users with invalid query,', function () {
      it('should return empty array.', async function () {
        const resp = await agent
          .post('/api/search/users')
          .send({ query : 'a'+userInfos[0].handle })
          .expect(200)
  
        const { body : { data } } = resp;
        expect(data).to.be.empty;
      });
    });
    context('when user tries to search user by invalid handle,', function () {
      it('should return error message.', async function() {
        const resp = await agent
          .post('/api/search/user/handle')
          .send({ query : 'a' + userInfos[0].handle })
          .expect(400);
        
        expect(resp.body.message).to.equal('잘못된 접근입니다.')
      });
    });
  });
  context('if user is created,', function () {
    context('when user tries to search users,', async function () {
      it('should return array that contain user object.', async function () {
        const resp = await agent
          .post('/api/search/users')
          .send({ query : userInfos[0].handle })
          .expect(200)
  
        const { body : { data } } = resp;
        expect(data[0]).to.deep.match({
          handle : userInfos[0].handle
        });
      });
    });
    context('if follows are not created', function () {
      context('when user tries to search follows with invalid type,', function () {
        it('should return error message.', async function () {
          const resp = await agent
            .post('/api/search/follows')
            .send({ type : 'asdf', userId : userInfos[0].id })
            .expect(400)
          
          expect(resp.body.message).to.equal('잘못된 접근입니다.');
        });
      });
      context('when user tries to search follows with invalid userId,', function () {
        it('should return error message.', async function () {
          const resp = await agent
            .post('/api/search/follows')
            .send({ type : 'to', userId : userInfos[0].id+'3' })
            .expect(400)
          
          expect(resp.body.message).to.equal('잘못된 접근입니다.');
        });
      });
    });
    context('if follows are created', function () {
      context('when user tries to search followers,', function () {
        it('should return user array.', async function () {
          const resp = await agent
            .post('/api/search/follows')
            .send({ type : 'to', userId : userInfos[0].id })
            .expect(200)
          
          const { body : { data } } = resp;
          expect(data[0]).to.deep.match({
            id : userInfos[1].id,
            follower : true,
          });
        });
      });
      context('when user tries to search followings,', function () {
        it('should return user array.', async function () {
          const resp = await agent
            .post('/api/search/follows')
            .send({ type : 'from', userId : userInfos[0].id })
            .expect(200)
          
          const { body : { data } } = resp;
          expect(data[0]).to.deep.match({
            id : userInfos[1].id,
            following : true,
          });
        });
      });
    });
  });
});

  const request = require('supertest');

describe('setting controller', function () {
  before(global.setup);
  afterEach(global.teardown);

  let agent, 
    app, 
    userInfo

  before(async function () {
    await global.prepareUsers();
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
  
  context('when user tries to setting profile', function () {
    it('should return object that contain updated field', async function () {
      const name = userInfo+'new';
      const resp = await agent
        .post('/api/setting/profile')
        .send({ name })
        .expect(200)
      
      const { body : { data } } = resp;
      expect(data).to.deep.match({
        name
      });
    });
  });
});

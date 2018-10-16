const request = require('supertest');

describe('newsfeed controller', function () {
  before(global.setup);
  afterEach(global.teardown);

  let agent, 
    app, 
    postInfo = { ...global.defaultPostInfos[0] };

  before(async function () {
    await global.prepareUsers();
  });
  beforeEach(async function () {
    this.timeout(5000);
    app = require('../../server/app');
    agent = request.agent(app);
    const { email, password } = global.defaultUserInfos[0];
    await agent
      .post('/api/auth/login/local')
      .send({ email, password })
      .expect(200);
  });
  
  context('if post is not created,', function () {
    context('when user tries to get posts,', function () {
      it('should return empty array.', async function () {
        const resp = await agent
          .post('/api/newsfeed/getposts')
          .send({})
          .expect(200)
        
        const { body : { data } } = resp;
        expect(data).to.be.empty;
      });
    });
  });

  context('when user tries to write post,', function () {
    it('should save post document and return that.', async function () {
      const { text } = postInfo;
      const resp = await agent
        .post('/api/newsfeed/writepost')
        .field('text', text)
        .expect(200)
      
      const { body : { data : newPost } } = resp;
      expect(newPost).to.deep.match({ 
        text,
      });
      postInfo = newPost;
    });
  });

  context('if post is created,', function () {
    context('when user tries to get posts,', function () {
      it('should return posts array.', async function () {
        const { text } = postInfo;
        const resp = await agent
          .post('/api/newsfeed/getposts')
          .send({})
          .expect(200)
        
        const { body : { data } } = resp;
        expect(data[0]).deep.match({
          text
        });
      });
    });

    context('when user tries to remove a post,', function () {
      it('should return post object that has deleted field with true.', async function () {
        const { id } = postInfo;
        const resp = await agent
          .post('/api/newsfeed/removepost')
          .send({ id })
          .expect(200)
        
        const { body : { data : deletedPost } } = resp;
        expect(deletedPost).deep.match({
          deleted : true
        });
      });
    });

    
    context('when user tries to remove a post with already removed post id,', function () {
      it('should return error message.', async function () {
        const { id } = postInfo;
        const resp = await agent
          .post('/api/newsfeed/removepost')
          .send({ id })
          .expect(401)

        expect(resp.body.message).to.equal('존재하지 않는 게시글입니다.');
      });
    });

    context('when user tries to remove a post with invalid id,', function () {
      it('should return error message.', async function () {
        const resp = await agent
          .post('/api/newsfeed/removepost')
          .send({ id : 0 })
          .expect(401)

        expect(resp.body.message).to.equal('존재하지 않는 게시글입니다.');
      });
    });
  });

  context('if post is removed', function () {
    context('when user tries to get posts,', function () {
      it('should return empty array.', async function () {
        const resp = await agent
          .post('/api/newsfeed/getposts')
          .send({})
          .expect(200)
        
        const { body : { data } } = resp;
        expect(data).to.be.empty;
      });
    });
  });
});

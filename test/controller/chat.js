const request = require('supertest');


const strToChar = {
    'user' : '@',
    'group' : '$',
}

describe('chat controller', function () {
  before(global.setup);
  afterEach(global.teardown);

  let agent, 
    app, 
    userChatInfo = { ...global.defaultUserChatInfos[0] }, 
    groupChatInfo = { ...global.defaultGroupChatInfos[0] }, 
    userInfos,
    groupInfo;

  before(async function () {
    userInfos = await global.prepareUsers();
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
  
  context('if chat is not created,', function () {
    context('when user tries to get dialogs,', function () {
      it('should return empty object.', async function () {
        const resp = await agent
          .post('/api/chat/getdialogs')
          .send({})
          .expect(200)
        
        const { body : { data } } = resp;
        expect(Object.keys(data)).to.have.lengthOf(0);
      });
    });

    context('when user tries to get chats,', function () {
      it('should return handle and empty chats array.', async function () {
        const { type } = userChatInfo;
        const resp = await agent
          .post('/api/chat/getchats')
          .send({ from : userInfos[1], type })
          .expect(200)
        
        const { body : { data : { handle, chats }  } } = resp;
        expect(handle).to.equal(strToChar[type]+userInfos[1].handle);
        expect(chats).to.have.lengthOf(0);
      });
    });
  });

  context('when user tries to send chat to another user,', function () {
    it('should save chat document and return chat info', async function () {
      const { toId, text, type } = userChatInfo;
      const resp = await agent
        .post('/api/chat/sendchat')
        .send({ to : toId, text, type })
        .expect(200)

      const { body : { data : { chat : newChat } } } = resp;
      expect(newChat).to.deep.match({
        text,
        toId,
        type
      });
    });
  });

  context('if user chat is created,', function () {
    context('when user tries to get dialogs,', function () {
      it('should return dialogs object.', async function () {
      const { text, type } = userChatInfo;
        const resp = await agent
          .post('/api/chat/getdialogs')
          .send({})
          .expect(200)
        
        const { body : { data } } = resp;
        expect(data[strToChar[type]+userInfos[1].handle]).to.deep.match({
          text
        });
      });
    });

    context('when user tries to get chats,', function () {
      it('should return chats object with handle.', async function () {
        const { fromId, toId, type, text } = userChatInfo;
        const resp = await agent
          .post('/api/chat/getchats')
          .send({ from : userInfos[1], type })
          .expect(200)
        
        const { body : { data : { handle, chats } } } = resp;
        expect(handle).to.equal(strToChar[type]+userInfos[1].handle);
        expect(chats[0]).to.deep.match({
          fromId,
          toId,
          type,
          text
        });
      })
    });
  });

  context('when user tries to make group,', function () {
    it('should save group document and return that.', async function () {
      const userIds = userInfos.map( user => user.id );
      const resp = await agent
        .post('/api/chat/makegroup')
        .send({ userIds })
        .expect(200)
      
      const { body : { data : newGroup } } = resp;
      expect(newGroup.users).to.have.lengthOf(userIds.length);
      groupInfo = newGroup;
    });
  });

  context('if group is created,', function () {
    context('when user tries to send chat to this group,', function () {
      it('should save chat document and return chat info', async function () {
        const { groupId, text, type } = groupChatInfo;
        const resp = await agent
          .post('/api/chat/sendchat')
          .send({ to : groupId, text, type })
          .expect(200)
  
        const { body : { data : { chat : newChat } } } = resp;
        expect(newChat).to.deep.match({
          text,
          groupId,
          type
        });
      });
    });
  });

  context('if group chat is created,', function () {
    context('when user tries to get dialogs,', function () {
      it('should return dialogs object.', async function () {
      const { text, type } = groupChatInfo;
        const resp = await agent
          .post('/api/chat/getdialogs')
          .send({})
          .expect(200)
        
        const { body : { data } } = resp;
        expect(data[strToChar[type]+groupInfo.handle]).to.deep.match({
          text
        });
      });
    });

    context('when user tries to get chats,', function () {
      it('should return chats object with handle.', async function () {
        const { fromId, groupId, type, text } = groupChatInfo;
        const resp = await agent
          .post('/api/chat/getchats')
          .send({ from : groupInfo, type })
          .expect(200)
        
        const { body : { data : { handle, chats } } } = resp;
        expect(handle).to.equal(strToChar[type]+groupInfo.handle);
        expect(chats[0]).to.deep.match({
          fromId,
          groupId,
          type,
          text
        });
      })
    });
  });
});

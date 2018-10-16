import React, { Component } from 'react';

const types = [{
  key: 'post',
  name: '새 게시글',
}, {
  key: 'chat',
  name: '쪽지',
}, {
  key: 'follow',
  name: '팔로우',
}];

const filters = [{
  key: 'follower',
  name: '나를 팔로우하지 않는 사람',
}, {
  key: 'following',
  name: '내가 팔로우하지 않는 계정',
}, {
  key: 'profile',
  name: '기본 프로필 이미지를 사용하는 계정',
}];

class Notice extends Component {
  constrcutor() {
  }

  render() {
    return (
      <div className='Setting-Notice'>
        <div className='setting-wrap'>
          <div className='setting-title'>타입</div>
          { types.map(type => (
            <div className='setting-check' key={`setting-notice-type-${type.key}`}>
              {type.name}
            </div>
          ))}
        </div>
        <div className='setting-wrap'>
          <div className='setting-title'>필터</div>
          { filters.map(filter => (
            <div className='setting-check' key={`setting-notice-filter-${filter.key}`}>
              {filter.name}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Notice;

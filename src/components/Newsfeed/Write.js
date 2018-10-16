import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './Write.scss';
import { writePost } from '../../actions/newsfeed';

const cx = classNames.bind(styles);
const initialState = {
  text: '',
  files: [],
};
const maxFileCount = 4;

const actionToProps = {
  writePost: writePost.REQUEST,
};

@connect(undefined, actionToProps)
class Write extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleSubmit = () => {
    const { writePost } = this.props;
    const { text, files } = this.state;
    const formData = new FormData();
    if (!(text.length || files.length)) {
      return 0;
    }
    formData.append('text', text);
    Array.from(files).forEach((file) => {
      formData.append('file', file.data);
    });
    this.setState(initialState);
    writePost(formData);
  }

  handleChangeText = (e) => {
    this.setState({ text: e.target.value });
  }

  handleChangeFile = (e) => {
    e.preventDefault();
    const files = e.target.files;
    if ((files.length + this.state.files.length) > maxFileCount) {
      return alert(`최대 ${maxFileCount}개의 이미지를 업로드하실 수 있습니다.`);
    }
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState(state => ({
          files: state.files.concat([{ data: file, url: reader.result }]),
        }));
      };
      reader.readAsDataURL(file);
    });
  }

  handleRemoveFile = url => (e) => {
    const { files } = this.state;
    const index = files.findIndex(file => file.url === url);
    this.setState({
      files: files.slice(0, index).concat(files.slice(index + 1)),
    });
  }

  render() {
    return (
      <div className={cx('Write')}>
        <textarea className='write-text' value={this.state.text} onChange={this.handleChangeText} placeholder='글을 입력하세요' />
        <div className='write-preview'>
          { this.state.files.map(file => (
            <div key={file.url} style={{ backgroundImage: `url('${file.url}')` }} className='write-img'>
              <div className='write-img-remove' onClick={this.handleRemoveFile(file.url)} />
            </div>
          ))}
        </div>
        <div className='write-submit' onClick={this.handleSubmit}> 게시 </div>
        <label className='write-label' htmlFor='file' />
        <input ref='file' id='file' type='file' className='write-file' multiple onChange={this.handleChangeFile} />
      </div>
    );
  }
}

export default Write;

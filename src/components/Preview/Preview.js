import React, { Component } from 'react';
import './Preview.scss';

const initialState = {
  play: false,
};
class Preview extends Component {
  constructor(props) {
    super(props);
    const { link } = this.props;
    let vid;
    let vindex;
    vindex = link.indexOf('youtu.be/');
    if (vindex >= 0) {
      vid = link.substr(vindex + 9);
    }
    vindex = link.indexOf('youtube.com/watch?v=');
    if (vindex >= 0) {
      vid = link.substr(vindex + 20);
    }
    if (vid && vid.length) {
      vid = vid.split('&')[0];
      this.state = {
        ...initialState,
        video: vid,
      };
    } else {
      this.state = { ...initialState };
    }
  }

  handleClickImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { video } = this.state;
    if (video) {
      this.setState({
        play: true,
      });
    }
  }

  render() {
    const {
      title, description, image, link, imgHeight,
    } = this.props;
    const { video, play } = this.state;
    if (!title) {
      return null;
    }
    return (
      <a href={link} target='_blank' className='Preview' rel='noopener noreferrer'>
        <div className='preview-img' style={{ backgroundImage: `url('${image}')`, height: `${imgHeight}px` }} onClick={this.handleClickImg}>
          { (video && play)
            ? <iframe title={`preview-${video}`} className='preview-iframe' src={`https://youtube.com/embed/${video}`} allowFullScreen /> : null
        }
        </div>
        <div className='preview-text'>
          <div className='preview-title'>
            { title }
          </div>
          <div className='preview-description'>
            { description }
          </div>
        </div>
      </a>
    );
  }
}

export default Preview;

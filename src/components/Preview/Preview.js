import React, { Component } from 'react';
import './Preview.css';

class Preview extends Component {
  constructor(props){
    super(props);
    const { link } = this.props;
    let vid;
    let vindex;
    vindex = link.indexOf("youtu.be/");
    if( vindex >= 0 ){
      vid = link.substr( vindex + 9 );
    }
    vindex = link.indexOf("youtube.com/watch?v=");
    if( vindex >= 0 ){
      vid = link.substr( vindex + 20 );
    }
    if( vid && vid.length ){
      vid = vid.split('&')[0];
      this.state = {
        video : vid
      }
    }
  }
  render(){
    const { title, description, image, link } = this.props;
    if( !title ){
      return null;
    }
    return (
      <a href={link} target="_blank"  className="Preview" rel="noopener noreferrer">
        <div className="preview-img" style={ { backgroundImage : `url('${image}')` } } />
        <div className="preview-text">
          <div className="preview-title">
            { title }
          </div>
          <div className="preview-description">
            { description }
          </div>
        </div>
      </a>
    );
  }
}

export default Preview;

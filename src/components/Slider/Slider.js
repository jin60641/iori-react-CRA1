import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './Slider.scss';

const cx = classNames.bind(styles);

const sliderNums = [2, 3, 4, 1];
const imgUrl = num => `/images/slider/${num}.png`;

class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: null,
      page: 0,
      moving: true,
    };
  }

  componentDidMount() {
    this.props.showScroll(false);
    this.setState({
      timer: setInterval(() => this.nextSlide(), 3000),
    });
  }

  componentWillUnmount() {
    this.props.showScroll(true);
    this.setState({
      timer: clearInterval(this.state.timer),
    });
  }

  nextSlide() {
    this.setState({
      moving: true,
      page: this.state.page + 1,
    });
    setTimeout(() => {
      if (this.state.timer && this.state.page === sliderNums.length) {
        this.setState({
          moving: false,
          page: 0,
        });
      }
    }, 1200);
  }

  render() {
    return (
      <div className='Slider'>
        <div className={cx('slider-img', { 'slider-img-moving': this.state.moving })} style={{ marginLeft: `${-100 * this.state.page}vw`, backgroundImage: `url(${imgUrl(1)})` }} />
        { sliderNums.map(num => (<div className='slider-img' key={`slider-img-${num}`} style={{ backgroundImage: `url(${imgUrl(num)})` }} />))}
        <div className='slider-layer'>
          <div className='slider-text'>
            Lorem Ipsum.

          </div>
        </div>
      </div>
    );
  }
}

export default Slider;

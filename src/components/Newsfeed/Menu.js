import React, { Component } from 'react';
import withClickOutside from 'react-click-outside';
import classNames from 'classnames/bind';
import styles from './Menu.css';
const cx = classNames.bind(styles);

const initialState = { active : false };
class Menu extends Component {
	constructor(props){
		super(props);
		this.state = { ...initialState };
	}
	handleClickOutside = () => {
		this.setState({ ...initialState });
	}
	handleToggle = () => {
		this.setState( state => ({
			active : !state.active
		}));
	}
	render(){
		const { my } = this.props;
		const { active } = this.state;
		return (
			<div className={cx("Menu",{"menu-active":active})} onClick={this.handleToggle}>
				<div className="menu-caret-outer" /> <div className="menu-caret-inner" />
				{ my ?
					<div className="menu-box">
						<div className="menu-row">
							삭제
						</div>
					</div> 
					: <div className="menu-box">
						<div className="menu-row">
							감추기
						</div>
					</div>
				}
			</div>
		);
	}
}
export default withClickOutside(Menu);

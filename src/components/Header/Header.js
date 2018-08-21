import React, { Component } from 'react';
import { NavLink, withRouter } from "react-router-dom";

import './Header.css';
import Menu from './Menu';

class Header extends Component {
	constructor(props) {
		super(props);
		const tab = (key,link,name) => {
			return { key, link, name }
		};
		this.state = {
			tabs : [
				tab("home","/","홈"),
				tab("notice","/notice","알림"),
				tab("chat","/chat","쪽지"),
				tab("search","/search","검색")
			]
		};
	}
	handleLogout = () => {
		const {logout} = this.props;
		logout();
	}
	render() {
		const { user } = this.props;
		const { tabs } = this.state;
		
		return (
			<div className="Header">
				<div className="header-tabs">
					{ tabs.map((tab) => {
						return (<NavLink exact={"/"===tab.link} className="header-tab" to={tab.link} key={tab.key} activeClassName="header-tab-active" > {tab.name} </NavLink>);
					})}
				</div>
				<Menu user={ user } handleLogout={this.handleLogout} />
			</div>
		);
	}
}

export default withRouter(Header);


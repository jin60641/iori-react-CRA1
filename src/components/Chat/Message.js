import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Preview from '../Preview/Preview';
import { getLink } from '../../actions/link';

import styles from './Message.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const initialState = {
  link : null
}

const linkRegex = /((?:(?:http|https)):\/\/(?:[\w-]+(?:\.[\w-]+)+(?:[\w.@?^=%&amp;:\/~+#-])*[\w@?^=%&amp;\/~+#-]))/gi;

const stateToProps = ({links}) => ({links});
const actionToProps = {
  getLink : getLink.REQUEST
}

@connect(stateToProps, actionToProps)
class Message extends Component {
  constructor(props){
    super(props);
    this.state = { ...initialState };
  }
  componentDidMount(){
    const { handleMessageMount, getLink, chat : { text } } = this.props;
    const match = text.match(linkRegex);
    if( match ) {
      const [link] = match;
      this.setState({
        link
      });
      getLink({ link });
    }
    setTimeout( handleMessageMount, 0 );
  }
	render(){
		const { user, chat, links } = this.props;
    const { link } = this.state;
		const my = user.id === chat.from.id;
		return(
			<div className={cx("Message",{"Message-my":my})}>
				{ /*
					my ?
						null
						: <a className="message-profileimg" href={`/profile${chat.from.handle}`}></a>
				*/ }
				<div className="message-body">
					<div className="message-body-name">
						{ chat.from.name }
					</div>
					{
						chat.file ?
							<img className="message-body-file" src={`/files/chat/${chat.id}.png`} alt="file in chat" />
						:
							<div>
								<div className="message-body-caret">
									<div className="message-body-caret-outer" />
									<div className="message-body-caret-inner" />
								</div>
								<div className="message-body-text">
                  { link ? <div className="message-body-preview"><Preview { ...links[link] } link={link} imgHeight={100}/></div> : null }
									{ chat.text.split('\n').map( (line,i) => {
                    const key = `chat-${chat.id}-text-${i}`
                    return (
                      <Fragment key={key} >
                      { link ? 
                        line.split(linkRegex).map( (word,j) => 
                          linkRegex.test(word) ?
                          <a href={word} key={`${key}-${j}`} target="_blank" rel="noopener noreferrer">{word}</a>
                          : <Fragment key={`${key}-${j}`}>{word}</Fragment> 
                        )
                        : <Fragment>{line}</Fragment> 
                      }
                      </Fragment>
                    )
                  })}
								</div>
							</div>
					}
				</div>
				{/* 
					my ?
						<span className="message-profileimg"></span>
						: null
				*/}
			</div>
		);
	}
}
export default Message;

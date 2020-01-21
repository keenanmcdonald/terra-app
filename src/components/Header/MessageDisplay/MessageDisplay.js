import React from 'react'

class MessageDisplay extends React.Component{
    render(){
        return (
            <div className='message-container'>
                <p className={`message ${this.props.hidden ? 'hidden' : 'visible'}`}>{this.props.text}</p>
            </div>
        )
    }
}

export default MessageDisplay
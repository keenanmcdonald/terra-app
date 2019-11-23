import React from 'react';
import AccountDropdown from './AccountDropdown'
import {withRouter} from 'react-router-dom'


class Header extends React.Component{
    render(){
        return (
            <header>
                <div onClick={() => this.props.history.push('/')} className="title">
                    <img className="logo" src={require('../images/terra-logo.png')} alt="logo"/>
                    <h1>Terra</h1>
                </div>
                <div className="account-dropdown-container">
                    <AccountDropdown/>
                </div>
            </header>
        )
    }
}

export default withRouter(Header)
import React from 'react';
import AccountNav from './AccountNav'
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
                    <AccountNav/>
                </div>
            </header>
        )
    }
}

export default withRouter(Header)
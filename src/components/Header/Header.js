import React from 'react';
import AccountNav from './AccountNav/AccountNav'
import {withRouter} from 'react-router-dom'


function Header(){
    function onTitleClick(){
        if (this.props.match.path === '/' && this.props.match.isExact){
            this.props.history.push('/welcome')
        }
        else{
            this.props.history.push('/')
        }
    }

    return (
        <header>
            <div onClick={onTitleClick} className="header-title">
                <img className="logo" src={require('../../images/terra-logo.png')} alt="logo"/>
                <h1>Terra</h1>
            </div>
            <div className="account-nav-container">
                <AccountNav/>
            </div>
        </header>
    )
}

export default withRouter(Header)
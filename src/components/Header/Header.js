import React from 'react';
import AccountNav from './AccountNav'
import {withRouter} from 'react-router-dom'


class Header extends React.Component{
    onTitleClick(){
        if (this.props.match.path === '/' && this.props.match.isExact){
            this.props.history.push('/welcome')
        }
        else{
            this.props.history.push('/')
        }
    }

    render(){
        return (
            <header>
                <div onClick={() => this.onTitleClick()} className="header-title">
                    <img className="logo" src={require('../images/terra-logo.png')} alt="logo"/>
                    <h1>Terra</h1>
                </div>
                <div className="account-nav-container">
                    <AccountNav/>
                </div>
            </header>
        )
    }
}

export default withRouter(Header)
import React from 'react';
import {withRouter} from 'react-router-dom'
import TerraContext from '../../../TerraContext'

class AccountNav extends React.Component{
    static contextType = TerraContext

    constructor() {
        super();

        this.state = {
            showMenu: false,
        }
    }

    render(){
        let content;
        if (this.context.user){
            content = (
                <div className="account-nav">
                    <h2 className='username'>{this.context.user.user_name}</h2>
                    <button onClick={() => this.context.methods.logout()}>Logout</button>
                </div>
            )
        }
        else {
            content = (
                <div className="account-nav">
                    <button onClick={() => this.props.history.push('/login')}>Login</button>
                    <button onClick={() => this.props.history.push('/signup')}>Signup</button>
                </div>
            )
        }
        return content
    }
}

export default withRouter(AccountNav)
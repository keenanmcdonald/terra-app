import React from 'react';
import {withRouter} from 'react-router-dom'
import TerraContext from '../TerraContext'

class AccountNav extends React.Component{
    static contextType = TerraContext

    constructor() {
        super();

        this.state = {
            showMenu: false,
        }

        this.openMenu = this.openMenu.bind(this)
        this.closeMenu = this.closeMenu.bind(this)
    }

    openMenu(e){
        e.preventDefault();

        this.setState({showMenu: true}, () => {
                document.addEventListener('click', this.closeMenu);
            }
        )
    }

    closeMenu(){
        this.setState({showMenu: false}, () => {
            document.removeEventListener('click', this.closeMenu)
        })
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
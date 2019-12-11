import React from 'react';
import {withRouter} from 'react-router-dom'

class AccountNav extends React.Component{
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
        return (
            <div className="account-nav">
                <button onClick={() => this.props.history.push('/login')}>Login</button>
                <button onClick={() => this.props.history.push('/signup')}>Signup</button>
            </div>
        )
    }
}

export default withRouter(AccountNav)
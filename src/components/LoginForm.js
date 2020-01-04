import React from 'react'
import config from '../config'
import AuthApiService from '../services/auth-api-service'
import TerraContext from '../TerraContext'

class LoginForm extends React.Component{
    static contextType = TerraContext

    constructor(props){
        super(props)
        this.state = {
            email: {
                value: '',
                touched: false
            },
            password: {
                value: '',
                touched: false,
            },
            staySignedIn: false,
        }
    }

    updateEmail(email) {
        this.setState({email: {value: email, touched: true}})
    }
    updatePassword(password) {
        this.setState({password: {value: password, touched: true}})
    }
    updateStaySignedIn(staySignedIn){
        this.setState({staySignedIn})
    }

    submitForm(e){
        e.preventDefault()
        
        const credentials = {
            email: this.state.email.value,
            password: this.state.password.value,
        }

        AuthApiService.postLogin(credentials)
            .then(res => {
                window.localStorage.setItem(config.TOKEN_KEY, res.authToken)
                if(this.state.staySignedIn){
                    let expiryDate = new Date()
                    expiryDate.setMonth(expiryDate.getMonth() + 1)
                    document.cookie = `user=${res.user}; expires=${expiryDate}`
                    document.cookie = `authToken=${res.authToken}; expires=${expiryDate}`
                }
                this.context.methods.login(res.user)
                this.props.history.push('/')
            })
            .catch(res => {
                console.log(res.error)
            })
        
    }
    render(){
        return (
            <div className='login-container form-display'>
                <form className='login-form'>
                    <h3>Log In</h3>
                    <label htmlFor='email'>Email: </label>
                    <input name='email' id='email' type='text' onChange={e => this.updateEmail(e.target.value)}/>
                    <br/>
                    <label htmlFor='password'>Password: </label>
                    <input name='password' id='password' type='password' onChange={e => this.updatePassword(e.target.value)}/>
                    <br/>
                    <input name='staySignedIn' id='staySignedIn' type='checkbox' onChange={e => this.updateStaySignedIn(e.target.value)}/>
                    <label htmlFor='staySignedIn' className='stay-signed-in'>Stay signed in</label>
                    <button id='submit' type='submit' 
                        onClick={e => this.submitForm(e)} 
                    >
                        Login
                    </button>
                </form> 
            </div>
        )
    }
}

export default LoginForm
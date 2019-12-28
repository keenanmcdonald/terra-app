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
        }
    }

    updateEmail(email) {
        this.setState({email: {value: email, touched: true}})
    }
    updatePassword(password) {
        this.setState({password: {value: password, touched: true}})
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
                this.context.methods.login(res.user)
                this.props.history.push('/')
            })
            .catch(res => {
                console.log(res.error)
            })
        
    }
    render(){
        return (
            <div>
                <form className='login-form'>
                    <label htmlFor='email'>Email: </label>
                    <input name='email' id='email' type='text' onChange={e => this.updateEmail(e.target.value)}/>
                    <br/>
                    <label htmlFor='password'>Password: </label>
                    <input name='password' id='password' type='password' onChange={e => this.updatePassword(e.target.value)}/>
                    <br/>
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
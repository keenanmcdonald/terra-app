import React from 'react'
import config from '../../../../config'
import AuthApiService from '../../../../services/auth-api-service'
import TerraContext from '../../../../TerraContext'
import BarLoader from 'react-spinners/BarLoader'

// eslint-disable-next-line
const REGEX_EMAIL_VALIDATION = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


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
            error: '',
            loading: false,
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
    
    validateEmail(){
        const email = this.state.email.value
        // eslint-disable-next-line
        if (!(REGEX_EMAIL_VALIDATION.test(email))){
            return 'must enter valid email'
        }
    }
    validatePassword(){
        const password = this.state.password.value
        if (password.length < 8){
            return 'password must be at least 8 characters long'
        }
    }

    submitForm(e){
        e.preventDefault()
        
        const credentials = {
            email: this.state.email.value,
            password: this.state.password.value,
        }

        this.setState({loading: true})

        AuthApiService.postLogin(credentials)
            .then(res => {
                this.setState({error: '', loading: false})
                window.localStorage.setItem(config.TOKEN_KEY, res.authToken)
                if(this.state.staySignedIn){
                    let expiryDate = new Date()
                    expiryDate.setMonth(expiryDate.getMonth() + 1)
                    document.cookie = `authToken=${res.authToken}; expires=${expiryDate}`
                }
                this.context.methods.login(res.user)
                this.props.history.push('/')
            })
            .catch(res => {
                this.setState({error: 'something went wrong, check that username and password is correct and please try again'})
            })
    }
    render(){
        return (
            <div className='login-container page-backdrop'>
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
                        className={
                            (this.validateEmail() || 
                            this.validatePassword())
                            && 'disabled'
                        }
                        onClick={e => this.submitForm(e)} 
                        disabled={
                            this.validateEmail() || 
                            this.validatePassword()
                        }
                    >
                        Login
                    </button>
                    <div className='loader-container'>
                        <BarLoader
                            color={'#FFFFFF'}
                            loading={this.state.loading}
                            css={`
                            width: 100%;
                            `}
                        />
                    </div>
                    <p className='error'>{this.state.error}</p> 
                </form> 
            </div>
        )
    }
}

export default LoginForm
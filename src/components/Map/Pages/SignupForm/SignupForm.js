import React from 'react'
import config from '../../../../config'
import AuthApiService from '../../../../services/auth-api-service'
import TerraContext from '../../../../TerraContext'
import BarLoader from 'react-spinners/BarLoader'

const REGEX_UPPER_LOWER_NUMBER = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\S]+/
// eslint-disable-next-line
const REGEX_EMAIL_VALIDATION = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class SignupForm extends React.Component{
    static contextType = TerraContext

    constructor(props){
        super(props)
        this.state = {
            email: {
                value: '',
                touched: false
            },
            username: {
                value: '',
                touched: false,
            },
            password: {
                value: '',
                touched: false,
            },
            repeatPassword: {
                value: '',
                touched: false,
            },
            error: '',
            loading: false,
        }
    }

    updateEmail(email) {
        this.setState({email: {value: email, touched: true}})
    }
    updateUsername(username) {
        this.setState({username: {value: username, touched: true}})
    }
    updatePassword(password) {
        this.setState({password: {value: password, touched: true}})
    }
    updateRepeatPassword(repeatPassword) {
        this.setState({repeatPassword: {value: repeatPassword, touched: true}})
    }

    validateEmail(){
        const email = this.state.email.value
        if (!(REGEX_EMAIL_VALIDATION.test(email))){
            return 'must enter valid email'
        }
    }
    validateUsername(){
        const username = this.state.username.value

        if (username.includes(' ')){
            return 'username cannot include spaces'
        }
        else if (username.length < 7){
            return 'username must be at least 7 characters long'
        }
        else if (username.length > 20){
            return 'username cannot be longer than 20 characters'
        }
    }
    validatePassword(){
        const password = this.state.password.value

        if (password.length < 8){
            return 'password must be at least 8 characters long'
        }
        else if (password.length > 72){
            return 'password cannot be longer than 72 characters'
        }
        else if (password.startsWith(' ') || password.endsWith(' ')){
            return 'Password must not start or end with spaces'
        }
        else if (!REGEX_UPPER_LOWER_NUMBER.test(password)) {
            return 'Password must contain at least one 1 upper case, lower case and number'
        }
    }
    validateRepeatPassword(){
        const password = this.state.password.value
        const repeatPassword = this.state.repeatPassword.value

        if (!(password === repeatPassword)){
            return 'passwords must match'
        }
    }

    submitForm(e){
        e.preventDefault()
        
        const user = {
            email: this.state.email.value,
            user_name: this.state.username.value,
            password: this.state.password.value,
        }

        this.setState({loading: true})

        AuthApiService.postUser(user)
            .then(res => {
                if (!res.ok){
                    throw new Error(res.error)
                }
                AuthApiService.postLogin({email: user.email, password: user.password})
                    .then(res => {
                        this.setState({loading: false})
                        window.localStorage.setItem(config.TOKEN_KEY, res.authToken)
                        this.context.methods.login(res.user)
                        this.props.history.push('/')
                    })
                    .catch(res => {
                        this.setState({error: 'an error has occured, please try again later'})
                        console.log(res.error)
                    })
                })
            .catch(res => {
                this.setState({error: 'something went wrong, that email or username may already exist'})
            })
    }
    render(){
        return (
            <div className='signup-container page-backdrop'>
                <form className='signup-form'>
                    <h3>Sign Up</h3>
                    <label htmlFor='email'>Email: </label>
                    <input name='email' id='email' type='text' onChange={e => this.updateEmail(e.target.value)}/>
                    {this.state.email.touched && this.validateEmail() ? (<p className='validation-error error'>{this.validateEmail()}</p>) : ''}
                    <label htmlFor='username'>Username: </label>
                    <input name='username' id='username' type='text' onChange={e => this.updateUsername(e.target.value)}/>
                    {this.state.username.touched && this.validateUsername() ? (<p className='validation-error error'>{this.validateUsername()}</p>) : ''}
                    <label htmlFor='password'>Password: </label>
                    <input name='password' id='password' type='password' onChange={e => this.updatePassword(e.target.value)}/>
                    {this.state.password.touched && this.validatePassword() ? (<p className='validation-error error'>{this.validatePassword()}</p>) : ''}
                    <label htmlFor='repeatPassword'>Repeat Password: </label>
                    <input name='repeatPassword' id='repeatPassword' type='password' onChange={e => this.updateRepeatPassword(e.target.value)}/>
                    {this.state.repeatPassword.touched && this.validateRepeatPassword() ? (<p className='validation-error error'>{this.validateRepeatPassword()}</p>) : ''}
                    <button id='submit' type='submit' 
                        className={
                            (this.validateEmail() || 
                            this.validateUsername() ||
                            this.validatePassword() ||
                            this.validateRepeatPassword())
                            && 'disabled'
                        }
                        onClick={e => this.submitForm(e)} 
                        disabled={
                            this.validateEmail() || 
                            this.validateUsername() ||
                            this.validatePassword() ||
                            this.validateRepeatPassword()
                        }
                    >
                        Sign up
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

export default SignupForm
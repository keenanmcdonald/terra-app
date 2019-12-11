import React from 'react'

class SignupForm extends React.Component{
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
            }
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
        // eslint-disable-next-line
        if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))){
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

        if (password.length < 7){
            return 'password must be at least 7 characters long'
        }
        else if (password.length > 20){
            return 'password cannot be longer than 20 characters'
        }
        else if (!/[0-9]/.test(password)){
            return 'password must contain at least one digit'
        }
        else if (!/[A-Za-z]/.test(password)){
            return 'password must contain at least one letter'
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
        //submit to server
    }
    render(){
        return (
            <div>
                <form>
                    <label htmlFor='email'>Email: </label>
                    <input name='email' id='email' type='text' onChange={e => this.updateEmail(e.target.value)}/>
                    {this.state.email.touched && (<span className='validation-error'>{this.validateEmail()}</span>)}
                    <br/>
                    <label htmlFor='username'>Username: </label>
                    <input name='username' id='username' type='text' onChange={e => this.updateUsername(e.target.value)}/>
                    {this.state.username.touched && (<span className='validation-error'>{this.validateUsername()}</span>)}
                    <br/>
                    <label htmlFor='password'>Password: </label>
                    <input name='password' id='password' type='password' onChange={e => this.updatePassword(e.target.value)}/>
                    {this.state.password.touched && (<span className='validation-error'>{this.validatePassword()}</span>)}
                    <br/>
                    <label htmlFor='repeatPassword'>Repeat Password: </label>
                    <input name='repeatPassword' id='repeatPassword' type='password' onChange={e => this.updateRepeatPassword(e.target.value)}/>
                    {this.state.repeatPassword.touched && (<span className='validation-error'>{this.validateRepeatPassword()}</span>)}
                    <br/>
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
                </form> 
            </div>
        )
    }
}

export default SignupForm
import React from 'react'

class LoginForm extends React.Component{
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
        //submit to server
    }
    render(){
        return (
            <div>
                <form>
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
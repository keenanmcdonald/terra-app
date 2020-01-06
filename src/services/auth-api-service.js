import config from '../config'

const AuthApiService = {
    postLogin(credentials) {
        console.log('postlogin')
        return fetch(`${config.API_ENDPOINT}auth/login`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',  
            },
            body: JSON.stringify(credentials),
        })
            .then(res => {
                if (!res.ok){
                    throw new Error(res.error)
                }
                return res.json()
            })
    },

    postUser(user) {
        return fetch(`${config.API_ENDPOINT}users`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',  
            },
            body: JSON.stringify(user),
        })
            .then(res => {
                if (!res.ok){
                    throw new Error(res.status)
                }
                return res.json()
            })
            .catch(error => console.log(error))
    }
}

export default AuthApiService
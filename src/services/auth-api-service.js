import config from '../config'

const AuthApiService = {
    async loginWithToken(authToken){
        return fetch(`${config.API_ENDPOINT}auth/verify_token`,  {       
            method: 'POST',
            headers: {
                'content-type': 'application/json',  
            },
            body: JSON.stringify({authToken: authToken}),
          })
            .then(res => {
              if (!res.ok){
                throw new Error(res.error)
              }
              return res.json()
            })
            .catch(error => {
              console.log(error)
            })
    },
    postLogin(credentials) {
        return fetch(`${config.API_ENDPOINT}auth/login`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',  
            },
            body: JSON.stringify(credentials),
        })
            .then(res => {
                if (!res.ok){
                    throw new Error(res.json())
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
    }
}

export default AuthApiService
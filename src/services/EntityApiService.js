import config from '../config'
import CesiumService from './CesiumService'

const EntityApiService = {
    getEntities(){
        return fetch(`${config.API_ENDPOINT}entities`, {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
              'authorization': `bearer ${window.localStorage.getItem(config.TOKEN_KEY)}`,
            },
          })
          .then(res => {
            if (!res.ok){
              throw new Error(res.status)
            }
            return res.json()
          })
          .then(resJson => {
            const entities = CesiumService.parseEntityData(resJson)
            return entities
          })
    },
    getEntitiesByUser(){

    },    
}

export default EntityApiService


import React from 'react'
import Header from './components/Header'
import Map from './components/Map'
import { hot } from 'react-hot-loader/root'
import TerraContext from './TerraContext'
import './App.css'
import config from './config'
import {Cartesian3} from 'cesium'

class App extends React.Component{
  constructor(props){
    super(props)

    this.state={
      entities:[],
      selected: -1,
      loadForeignEntities: false,
      mode: '',
      user: undefined,
    }

    this.loadEntities = this.loadEntities.bind(this)
    this.toggleLoadForeignEntities = this.toggleLoadForeignEntities.bind(this)
    this.setMode = this.setMode.bind(this)
    this.uploadEntity = this.uploadEntity.bind(this)
    this.dropWaypoint = this.dropWaypoint.bind(this)
    this.dropRouteJoint = this.dropRouteJoint.bind(this)
    this.selectEntity = this.selectEntity.bind(this)
    this.deleteEntity = this.deleteEntity.bind(this)
    this.saveSelected = this.saveSelected.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
    this.logout = this.logout.bind(this)
    this.login = this.login.bind(this)
  }


  getCookieByName(name) 
    {
      var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
      if (match) {
        return match[2]
      }
      else{
        return undefined
      }
   }

  //will check to see if there is a login token saved in the user's cookies and log in the user if there is
  componentDidMount(){
    /*
    const authToken = this.getCookieByName('authToken')
    const user = this.getCookieByName('user')
    console.log(user)
    this.login(user)
    
    if (document.cookie.authToken){
      fetch(`${config.API_ENDPOINT}auth/verify-token`,  {       
        method: 'POST',
        headers: {
            'content-type': 'application/json',  
        },
        body: JSON.stringify(authToken),
      })
        .then(res => {
          console.log(res)
          this.login(user)
        })
    }*/
  }

  //takes entity data as it is provided from the server and converts position data to the proper Cesium objects
  //also marks any all entities as 'saved' since they were just pulled from the server
  parseEntityData(entities){
    let newEntities = []
    for (const entity of entities){
      if (entity.type === 'waypoint'){
        entity.position = new Cartesian3.fromArray(entity.position[0]);
      } 
      else if (entity.type === 'route'){
        let newPosition = []
        for (const position of entity.position){
          newPosition.push(new Cartesian3.fromArray(position))
        }
        entity.position = newPosition
        entity.saved = true
      }
      entity.saved = true
      newEntities.push(entity)
    }
    return newEntities
  }

  toggleLoadForeignEntities(){
    this.setState({loadForeignEntities: !this.state.loadForeignEntities}, () => {
      this.loadEntities()
    })
  }

  setMode(mode){
    this.setState({mode})
  }

  //checks 'loadForeignEntities' and loads either the current users entities or all users entities into the state
  loadEntities(){
    if (this.state.loadForeignEntities){
      fetch(`${config.API_ENDPOINT}entities`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',  
        },
      })
        .then(res => {
          if (!res.ok){
            throw new Error(res.status)
          }
          return res.json()
        })
        .then(resJson => {
          const entities = this.parseEntityData(resJson)
          this.setState({entities})
        })
        .catch(error => console.log(error))
    }   
    else {
      fetch(`${config.API_ENDPOINT}entities/user/${this.state.user.user_name}`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',  
        },
      })
        .then(res => {
          if (!res.ok){
            throw new Error(res.status)
          }
          return res.json()
        })
        .then(resJson => {
          const entities = this.parseEntityData(resJson)
          this.setState({entities})
        })
        .catch(error => console.log(error))
      }
  }
  
  //accepts an entity object as an argument and posts the entity to the server
  uploadEntity(entity){
    let position = []
    if (entity.type === 'waypoint'){
      position = [[entity.position.x, entity.position.y, entity.position.z]]
    } else if (entity.type === 'route') {
      for (let i = 0; i < entity.position.length; i++){
        position.push([entity.position[i].x, entity.position[i].y, entity.position[i].z])
      }
    }

    const dbEntity = {
      name: entity.name,
      description: entity.description,
      user_name: this.state.user.user_name,
      type: entity.type,
      position,
    }

    fetch(`${config.API_ENDPOINT}entities`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',  
        },
        body: JSON.stringify(dbEntity),
    })
      .then(res => {
        this.loadEntities()
      })
  }


  //creates a new waypoint and puts it in the state, does NOT upload to the server
  dropWaypoint(position) {
    const waypoint = {position: position, name: '', description: '', type: 'waypoint', user_name: this.state.user.user_name, saved: false, id: -1}
    let entities = this.state.entities
    entities.push(waypoint)
    this.setState({entities, selected: entities.length-1})
    this.setMode('create')
  }

  dropRouteJoint(position){
    let route = this.state.entities[this.state.selected]
    if (!route){
      let newRoute = {position: [position], name: '', description: '', type: 'route'}
      this.uploadEntity(newRoute)
    }
    else if (this.state.mode === 'edit'){
      route.position.push(position)
      this.updateSelected(route)
    }
    else{
      this.setState({selected: -1, mode: ''})
    }
  }

  selectEntity(id) {
    const length = this.state.entities.length
    for (let i=0; i < length; i++){
      if (id === this.state.entities[i].id){
        this.setState({selected: i})
      }
    }
    this.setMode('select')
  }

  saveSelected(e, name, description){
    e.preventDefault()
    let entity = this.state.entities[this.state.selected]
    entity.name = name
    entity.description = description
    if (this.state.mode === 'edit'){
      this.deleteEntity(this.state.selected)
    }
    this.uploadEntity(entity)

    const mode = this.state.mode === 'create' ? '' : 'select'
    this.setMode(mode)
  }

  deleteEntity(index){
    let entities = this.state.entities

    if (this.state.user) {
      fetch(`${config.API_ENDPOINT}entities/${entities[index].id}`, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',  
        },
      })
        .then(res => {
          console.log(res)
        })
        .catch(err => console.log(err))
    }

    entities.splice(index, 1)
    this.setState({entities})
  }

  cancelEdit(){
    if (!this.state.entities[this.state.selected].saved){
      let entities = this.state.entities
      entities.splice(this.state.selected, 1)
      this.setState({entities})
    }
    else{
      this.setMode('select')
    }
  }

  //takes user object as an argument, loads user to the state, and calls loadEntities
  login(user){
    this.setState({user})
    this.loadEntities()
  }

  logout(){
    this.setState({user: undefined})
    window.localStorage.removeItem(config.TOKEN_KEY)
  }

  render(){
    const contextValue = {
      ...this.state, 
      methods: {
        loadEntities: this.loadEntities,
        toggleLoadForeignEntities: this.toggleLoadForeignEntities,
        setMode: this.setMode,
        dropWaypoint: this.dropWaypoint,
        uploadEntity: this.uploadEntity,
        selectEntity: this.selectEntity,
        dropRouteJoint: this.dropRouteJoint,
        deleteEntity: this.deleteEntity,
        saveSelected: this.saveSelected,
        cancelEdit: this.cancelEdit,
        logout: this.logout,
        login: this.login,
      }
    }
    return (
      <div className="App">
        <TerraContext.Provider value={contextValue}>
        <Header />
          <main>
            <Map displaySearchButton={this.state.displaySearchButton}/>
          </main>
        </TerraContext.Provider>
      </div>
    )
  }
}

export default hot(App);

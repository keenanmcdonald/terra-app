import React from 'react'
import Header from './components/Header/Header'
import Map from './components/Map/Map'
import { hot } from 'react-hot-loader/root'
import TerraContext from './TerraContext'
import './App.css'
import config from './config'
import {Cartographic} from 'cesium'
import {withRouter} from 'react-router-dom'
import * as turf from '@turf/turf'
import {Math as CesiumMath} from 'cesium'
import SidePanel from './components/SidePanel/SidePanel'


class App extends React.Component{
  constructor(props){
    super(props)

    this.state={
      entities:[],
      selected: -1,
      loadForeignEntities: false,
      flyToSelected: false,
      mode: '',
      user: undefined,
      message: {text: '', hidden: true, timeoutId: undefined},
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
    this.displayMessage = this.displayMessage.bind(this)
    this.logout = this.logout.bind(this)
    this.login = this.login.bind(this)
    this.calculateLegDistance = this.calculateLegDistance.bind(this)
    this.cancelFlyTo = this.cancelFlyTo.bind(this)
  }

  componentDidMount(){
    //load landing page for new users
    const previousVisit = (this.getCookieByName('previousVisit') === 'true')
    if (!previousVisit){
      this.props.history.push('/welcome')
    }
    let expiryDate = new Date()
    expiryDate.setMonth(expiryDate.getMonth() + 6)
    document.cookie = `previousVisit=true; expires=${expiryDate}`


    //keep me logged in logic
    const authToken = this.getCookieByName('authToken')
    if (authToken){
      fetch(`${config.API_ENDPOINT}auth/verify_token`,  {       
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
          res.json()
            .then(user => {
              this.login(user)
            })
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  getCookieByName(name) 
  {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    if (match) {
      return match[2]
    }
    else{
      return undefined
    }
 }

  parseEntityData(entities){
    //convert position data from server to Cartesian3 objects
    let newEntities = []
    for (const entity of entities){
      if (entity.type === 'waypoint'){
        entity.position = new Cartographic(entity.position[0][1], entity.position[0][0], entity.position[0][2]);
      } 
      else if (entity.type === 'route'){
        let newPosition = []
        for (const position of entity.position){
          newPosition.push(new Cartographic(position[1], position[0], position[2]))
        }
        entity.distance = this.calculateRouteDistance(entity.position)
        entity.position = newPosition
        entity.saved = true
      }
      //mark entities loaded from server as saved
      entity.saved = true
      newEntities.push(entity)
    }
    return newEntities
  }

  //toggle load foreign entities button on toolbar
  toggleLoadForeignEntities(){
    if (this.state.loadForeignEntities && this.state.mode === 'select'){
      this.setMode('')
    }
    this.setState({loadForeignEntities: !this.state.loadForeignEntities}, () => {
      this.loadEntities()
    })
  }

  setMode(mode, message){
    this.setState({mode})
    if (message){
      this.displayMessage(message, 3000)
    }
  }

  loadEntities(){
    //check 'loadForeignEntities' and load either the current users entities or all users entities into the state
    if (this.state.loadForeignEntities){
      fetch(`${config.API_ENDPOINT}entities`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization': `bearer ${window.localStorage.getItem(config.TOKEN_KEY)}`
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
      position = [[entity.position.latitude, entity.position.longitude, entity.position.height]]
    } else if (entity.type === 'route') {
      for (let i = 0; i < entity.position.length; i++){
        position.push([entity.position[i].latitude, entity.position[i].longitude, entity.position[i].height])
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
            'authorization': `bearer ${window.localStorage.getItem(config.TOKEN_KEY)}`,
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
    this.setMode('create point')
  }

  //called when a route is started, and when a new joint is dropped
  dropRouteJoint(position){
    //checks the current mode to see if the route already exists or needs to be created
    if (this.state.mode === 'create route'){
      this.displayMessage('Click on the map again to draw a line between points', 4000)
      let entities = this.state.entities
      let route = entities[this.state.selected]
      route.position.push(position)
      route.distance += this.calculateLegDistance(route.position[route.position.length-1], route.position[route.position.length-2])
      entities.splice(this.state.selected, 1)
      entities.push(route)
      this.setState({entities, selected: entities.length-1})
    }
    else {
      this.displayMessage('Click on the map again to draw a line between points', 4000)
      let route = {position: [position], name: '', description: '', type: 'route', user_name: this.state.user.user_name, saved: false, id: -1, distance: 0}
      let entities = this.state.entities
      entities.push(route)
      this.setState({entities, selected: entities.length-1})
      this.setMode('create route')
    }
  }

  calculateRouteDistance(positions){
    let totalDistance = 0
    for (let i = 1; i < positions.length; i++){
      totalDistance += this.calculateLegDistance(positions[i-1], positions[i])
    }
    return totalDistance
  }

  calculateLegDistance(point1, point2){
    let from;
    let to;
    if (point1.latitude){
      from = turf.point([CesiumMath.toDegrees(point1.longitude), CesiumMath.toDegrees(point1.latitude)])
      to = turf.point([CesiumMath.toDegrees(point2.longitude), CesiumMath.toDegrees(point2.latitude)])  
    }
    else{
      from = turf.point([CesiumMath.toDegrees(point1[1]), CesiumMath.toDegrees(point1[0])])
      to = turf.point([CesiumMath.toDegrees(point2[1]), CesiumMath.toDegrees(point2[0])])  
    }
    return turf.distance(from, to, {units: 'miles'})
  }

  selectEntity(id, flyTo=false) {
    for (let i=0; i < this.state.entities.length; i++){
      if (id === this.state.entities[i].id){
        this.setState({selected: i, flyToSelected: flyTo})
      }
    }
    this.setMode('select')
  }

  cancelFlyTo(){
    this.setState({flyToSelected: false})
  }

  //called when the 'add' button is pressed while creating or editing an entity
  saveSelected(e, name, description){
    e.preventDefault()
    let entity = this.state.entities[this.state.selected]
    entity.name = name
    entity.description = description
    if (this.state.mode === 'edit'){
      this.deleteEntity(this.state.selected)
    }
    this.uploadEntity(entity)

    this.setMode('select')
  }

  //deletes entity from the server and removes from the state
  deleteEntity(index){
    let entities = this.state.entities

    if (this.state.user) {
      fetch(`${config.API_ENDPOINT}entities/${entities[index].id}`, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'authorization': `bearer ${window.localStorage.getItem(config.TOKEN_KEY)}`,
        },
      })
        .then(res => {
          if (!res.ok){
            throw new Error(res.error)
          }
        })
        .catch(error => console.log(error))
    }

    entities.splice(index, 1)
    this.setState({entities})
  }

  //called when the cancel button is pressed while adding or editing an entity
  cancelEdit(){
    if (this.state.entities[this.state.selected] && !this.state.entities[this.state.selected].saved){
      let entities = this.state.entities
      entities.splice(this.state.selected, 1)
      this.setState({entities})
    }
    else{
      this.setMode('select')
    }
  }

  async displayMessage(text, timeout){
    //clear all current timeouts to start fresh
    clearTimeout(this.state.message.timeoutId)
    this.setState({message: {...this.state.message, hidden: true}})
    //fade in
    setTimeout(function(){
      this.setState({message: {...this.state.message, text, hidden: false}})
    }.bind(this), 10)

    if (timeout){
      //fade out
      const timeoutId = setTimeout(function(){
          this.setState({message: {...this.state.message, hidden: true}})
        }.bind(this), timeout)
      this.setState({message: {...this.state.message, timeoutId}})
    }
  }

  //loads user to the state, and calls loadEntities
  login(user){
    this.setState({user})
    this.loadEntities()
  }

  //logs the current user out, resets the state. 
  logout(){
    this.setState({
      entities:[],
      selected: -1,
      loadForeignEntities: false,
      mode: '',
      user: undefined,
      message: {text: '', hidden: true, timeoutId: undefined},
    })
    //remove authToken from local storage and cookies
    window.localStorage.removeItem(config.TOKEN_KEY)
    document.cookie = "authToken= ; expires = Thu, 01 Jan 1992 00:00:00 GMT"
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
        displayMessage: this.displayMessage,
        logout: this.logout,
        login: this.login,
        calculateLegDistance: this.calculateLegDistance,
        cancelFlyTo: this.cancelFlyTo,
      }
    }
    return (
      <div className="App">
        <TerraContext.Provider value={contextValue}>
        <Header />
          <main>
              <Map displaySearchButton={this.state.displaySearchButton} flyTo={this.state.flyToSelected}/>
              <SidePanel/>
          </main>
        </TerraContext.Provider>
      </div>
    )
  }
}

export default hot(withRouter(App));

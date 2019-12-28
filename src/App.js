import React from 'react'
import Header from './components/Header'
import Map from './components/Map'
import {Route} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import { hot } from 'react-hot-loader/root'
import TerraContext from './TerraContext'
//import uuidv4 from 'uuid/v4'
import './App.css'
import config from './config'
import {Cartesian3} from 'cesium'

class App extends React.Component{
  constructor(props){
    super(props)

    this.state={
      entities:[],
      selected: -1,
      toolbar: {selectedTool: '', loadEntities: false},
      display: '',
      user: undefined,
    }

    this.loadEntities = this.loadEntities.bind(this)
    this.setTool = this.setTool.bind(this)
    this.toggleLoadEntities = this.toggleLoadEntities.bind(this)
    this.setDisplay = this.setDisplay.bind(this)
    this.addEntity = this.addEntity.bind(this)
    this.updateSelected = this.updateSelected.bind(this)
    this.dropWaypoint = this.dropWaypoint.bind(this)
    this.dropRouteJoint = this.dropRouteJoint.bind(this)
    this.selectEntity = this.selectEntity.bind(this)
    this.deleteSelected = this.deleteSelected.bind(this)
    this.saveSelected = this.saveSelected.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
    this.logout = this.logout.bind(this)
    this.login = this.login.bind(this)
  }
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
      }
      newEntities.push(entity)
    }
    return newEntities
  }
  setTool(tool) {
    this.setState({toolbar: {...this.state.toolbar, selectedTool: tool}})
  }
  toggleLoadEntities(){
    this.setState({toolbar: {...this.state.toolbar, loadEntities: !this.state.toolbar.loadEntities}})
    this.loadEntities()
  }
  setDisplay(mode){
    this.setState({display: mode})
  }

  loadEntities(){
    if (this.state.toolbar.loadEntities){
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
          console.log(resJson)
          const entities = this.parseEntityData(resJson)
          this.setState({entities})
        })
        .catch(error => console.log(error))
    }   
    else {
      console.log(this.state.user.id)
      fetch(`${config.API_ENDPOINT}entities/user/${this.state.user.id}`, {
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
          console.log(resJson)
          const entities = this.parseEntityData(resJson)
          this.setState({entities})
        })
        .catch(error => console.log(error))
      }
  }
  
  addEntity(entity){
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
      user_id: this.state.user.id,
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

  updateSelected(entity){
    this.deleteSelected()
    this.addEntity(entity)
  }

  dropWaypoint(position) {
    if (this.state.display === 'edit'){
      let waypoint = this.state.entities[this.state.selected]
      waypoint.position = position
      this.updateSelected(waypoint)
    }
    else{
      const waypoint = {position: position, name: '', description: '', type: 'waypoint'}
      this.addEntity(waypoint)
      this.setDisplay('edit')
    }
  }

  dropRouteJoint(position){
    let route = this.state.entities[this.state.selected]
    if (!route){
      let newRoute = {position: [position], name: '', description: '', type: 'route'}
      this.addEntity(newRoute)
    }
    else if (this.state.display === 'edit'){
      route.position.push(position)
      this.updateSelected(route)
    }
    else{
      this.setState({selected: -1, display: ''})
    }
  }

  selectEntity(id) {
    const length = this.state.entities.length
    for (let i=0; i < length; i++){
      if (id === this.state.entities[i].id){
        this.setState({selected: i})
      }
    }
    this.setDisplay('info')
  }

  saveSelected(e, name, description){
    e.preventDefault()
    let entity = this.state.entities[this.state.selected]
    entity.name = name
    entity.description = description
    this.updateSelected(entity)
    this.setDisplay('info')
  }

  deleteSelected(){
    let entities = this.state.entities

    if (this.state.user) {
      fetch(`${config.API_ENDPOINT}entities/${entities[this.state.selected].id}`, {
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


    entities.splice(this.state.selected, 1)
    this.setState({entities})

  }

  cancelEdit(){
    if (!this.state.entities[this.state.selected].name){
      this.deleteSelected()
    }
    else{
      this.setDisplay('info')
    }
  }

  login(user){
    this.setState({user})
  }

  logout(){
    console.log('logout')
    this.setState({user: undefined})
    window.localStorage.removeItem(config.TOKEN_KEY)
  }

  render(){
    const contextValue = {
      ...this.state, 
      methods: {
        loadEntities: this.loadEntities,
        setTool: this.setTool,
        toggleLoadEntities: this.toggleLoadEntities,
        setDisplay: this.setDisplay,
        dropWaypoint: this.dropWaypoint,
        addEntity: this.addEntity,
        selectEntity: this.selectEntity,
        dropRouteJoint: this.dropRouteJoint,
        deleteSelected: this.deleteSelected,
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
            <Route exact path='/' component={Map}/>
            <Route path='/login' component={LoginForm}/>
            <Route path='/signup' component={SignupForm}/>
          </main>
        </TerraContext.Provider>
      </div>
    )
  }
}

export default hot(App);

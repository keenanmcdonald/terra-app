import React from 'react'
import Header from './components/Header'
import Map from './components/Map'
import {Route} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import { hot } from 'react-hot-loader/root'
import TerraContext from './TerraContext'
import uuidv4 from 'uuid/v4'
import './App.css'
import { thisExpression } from '@babel/types'

class App extends React.Component{
  constructor(props){
    super(props)

    this.state={
      waypoints:[],
      routes: [],
      selected: null,
      editMode: '',
    }

    this.switchEditMode = this.switchEditMode.bind(this)
    this.dropMarker = this.dropMarker.bind(this)
    this.cancelAddEntity = this.cancelAddEntity.bind(this)
    this.saveSelected = this.saveSelected.bind(this)
    this.selectEntity = this.selectEntity.bind(this)
    this.dropRouteJoint = this.dropRouteJoint.bind(this)
    this.highlightEntity = this.highlightEntity.bind(this)
    this.removeHighlights = this.removeHighlights.bind(this)
  }

  switchEditMode(mode) {
    this.setState({editMode: mode})
  }

  dropMarker(position) {
    const waypoint = {saved: false, position: position, id: uuidv4(), type: 'waypoint', hover: true}
    this.setState({selected: waypoint})
  }

  dropRouteJoint(position){
    if (!this.state.selected){
      console.log('newroute')
      let newRoute = {saved: false, positions: [position], id: uuidv4(), type: 'route', hover: true}
      this.setState({selected: newRoute})
    }
    else{
      let positions = this.state.selected.positions
      positions.push(position)
      this.setState({selected: {...this.state.selected, positions: positions}})
    }
  }

  selectEntity(id) {
    let selected = this.state.selected
    selected = this.state.waypoints.find(waypoint => {
      return waypoint.id === id
    })
    if(!selected){
      selected = this.state.routes.find(route => {
        return route.id === id
      })
    }
    this.setState({selected: selected})

  }

  saveSelected(event, name, description){
    event.preventDefault()
    const selected = { ...this.state.selected, saved: true, name, description}
    if (selected.type === 'waypoint'){
      let waypoints = this.state.waypoints
      waypoints.push(selected)
      this.setState({waypoints: waypoints, selected: null})
    }
    else if (selected.type === 'route'){
      let routes = this.state.routes
      routes.push(selected)
      this.setState({routes: routes, selected: null})
    }
  }

  highlightEntity(id){
    let entity;
    entity = this.state.waypoints.find(waypoint => {
      return waypoint.id === id
    })
    if(!entity){
      entity = this.state.routes.find(route => {
        return route.id === id
      })
    }
    if (entity){
      entity.hover = true;
    }
  }
  removeHighlights(){
    let waypoints = this.state.waypoints
    let routes = this.state.routes
    for (let i = 0; i < waypoints.length; i++){
      waypoints[i].hover = false
    }
    for (let i = 0; i < routes.length; i++){
      routes[i].hover = false
    }
    this.setState({...this.state, routes: routes, waypoints: waypoints})
  }

  cancelAddEntity(e){
    e.preventDefault()
    this.setState({selected: null})
  }

  render(){
    const contextValue = {
      ...this.state, 
      methods: {
        switchEditMode: this.switchEditMode,
        dropMarker: this.dropMarker,
        cancelAddEntity: this.cancelAddEntity,
        saveSelected: this.saveSelected,
        selectEntity: this.selectEntity,
        dropRouteJoint: this.dropRouteJoint,
        highlightEntity: this.highlightEntity,
        removeHighlights: this.removeHighlights,
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

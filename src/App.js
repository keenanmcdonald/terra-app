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
    this.editSelected = this.editSelected.bind(this)
    this.deleteSelected = this.deleteSelected.bind(this)
  }

  switchEditMode(mode) {
    this.setState({editMode: mode})
  }

  dropMarker(position) {
    const waypoint = {editing: true, position: position, id: uuidv4(), type: 'waypoint'}
    this.setState({selected: waypoint})
  }

  dropRouteJoint(position){
    if (!this.state.selected){
      console.log('newroute')
      let newRoute = {editing: true, positions: [position], id: uuidv4(), type: 'route'}
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

  editSelected(){
    this.setState({selected: {...this.state.selected, editing: true}})
  }

  deleteSelected(){
    console.log('deleteSelected')
    if (this.state.selected.type === 'waypoint'){
      console.log('delete waypoint')

      let waypoints = this.state.waypoints
      let index = -1
      for (let i = 0; i < waypoints.length; i++){
        if (waypoints[i].id === this.state.selected.id){
          console.log(waypoints[i].id)
          console.log(this.state.selected.id)
          index = i
        }
      }
      if (index > -1) {
        waypoints.splice(index,1)
      }
      this.setState({selected: null, waypoints})
    }
    else if (this.state.selected.type === 'route'){
      console.log('delete route')

      let routes = this.state.routes
      let index = -1
      for (let i = 0; i < routes.length; i++){
        if (routes[i].id === this.state.selected.id){
          index = i
        }
      }      
      if(index > -1){
        routes.splice(index, 1)
      }
      this.setState({selected: null, routes})
    }
  }

  saveSelected(event, name, description){
    event.preventDefault()
    const selected = { ...this.state.selected, editing: false, name, description}
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
        editSelected: this.editSelected,
        deleteSelected: this.deleteSelected,
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

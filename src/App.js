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
      selected: null,
      editMode: '',
    }

    this.switchEditMode = this.switchEditMode.bind(this)
    this.dropMarker = this.dropMarker.bind(this)
    this.cancelAddEntity = this.cancelAddEntity.bind(this)
    this.saveSelected = this.saveSelected.bind(this)
    this.selectEntity = this.selectEntity.bind(this)
  }

  switchEditMode(mode) {
    this.setState({editMode: mode})
  }

  dropMarker(position) {
    const waypoint = {saved: false, position: position, id: uuidv4()}
    this.setState({selected: waypoint})
  }

  selectEntity(id) {
    console.log('entity clicked')
    const entity = this.state.waypoints.filter(waypoint => waypoint.id === id)
    this.setState = {selected: entity}
  }

  saveSelected(event, name, description){
    event.preventDefault()
    const selected = { ...this.state.selected, saved: true, name, description}
    let waypoints = this.state.waypoints
    waypoints.push(selected)
    this.setState({waypoints: waypoints, selected: null})
  }

  cancelAddEntity(e){
    e.preventDefault()
    this.setState({selected: null})
  }

  render(){
    const contextValue = {
      waypoints: this.state.waypoints,
      selected: this.state.selected,
      editMode: this.state.editMode,
      methods: {
        switchEditMode: this.switchEditMode,
        dropMarker: this.dropMarker,
        cancelAddEntity: this.cancelAddEntity,
        saveSelected: this.saveSelected,
        selectEntity: this.selectEntity,
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

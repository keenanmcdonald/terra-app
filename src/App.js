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

/*
const TOOL_NONE = 0
const TOOL_ADDWAYPOINT = 1
const TOOL_ADDROUTE = 2
*/

class App extends React.Component{
  constructor(props){
    super(props)

    this.state={
      entities:[],
      selected: -1,
      toolbar: {selectedTool: ''},
      display: '',
    }

    this.setTool = this.setTool.bind(this)
    this.setDisplay = this.setDisplay.bind(this)
    this.addEntity = this.addEntity.bind(this)
    this.updateSelected = this.updateSelected.bind(this)
    this.dropWaypoint = this.dropWaypoint.bind(this)
    this.dropRouteJoint = this.dropRouteJoint.bind(this)
    this.selectEntity = this.selectEntity.bind(this)
    this.deleteSelected = this.deleteSelected.bind(this)
    this.saveSelected = this.saveSelected.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
  }

  setTool(tool) {
    this.setState({toolbar: {...this.state.toolbar, selectedTool: tool}})
  }
  setDisplay(mode){
    this.setState({display: mode})
  }
  
  addEntity(entity){
    let entities = this.state.entities
    const index = entities.length
    entities.push(entity)
    this.setState({entities: entities, selected: index})
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
      const waypoint = {position: position, id: uuidv4(), name: '', description: '', type: 'waypoint'}
      this.addEntity(waypoint)
      this.setDisplay('edit')
    }
  }

  dropRouteJoint(position){
    let route = this.state.entities[this.state.selected]
    if (!route){
      let newRoute = {position: [position], id: uuidv4(), name: '', description: '', type: 'route'}
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

  render(){
    const contextValue = {
      ...this.state, 
      methods: {
        setTool: this.setTool,
        setDisplay: this.setDisplay,
        dropWaypoint: this.dropWaypoint,
        addEntity: this.addEntity,
        selectEntity: this.selectEntity,
        dropRouteJoint: this.dropRouteJoint,
        deleteSelected: this.deleteSelected,
        saveSelected: this.saveSelected,
        cancelEdit: this.cancelEdit,
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

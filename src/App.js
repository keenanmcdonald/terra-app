import React from 'react'
import Header from './components/Header'
import Map from './components/Map'
import {Route} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import { hot } from 'react-hot-loader/root'
import TerraContext from './TerraContext'

import './App.css'

class App extends React.Component{
  constructor(props){
    super(props)

    this.state={
      waypoints:[],
      editMode: ''
    }

    this.switchEditMode = this.switchEditMode.bind(this)
    this.addPoint = this.addPoint.bind(this)
  }

  switchEditMode(mode) {
    console.log('switchEditMode called')
    this.setState({editMode: mode})
  }

  addPoint(position){
    let waypoints = this.state.waypoints
    waypoints.push(position)
    this.setState({waypoints: waypoints})
    console.log('waypoints: ')
    console.log(this.state.waypoints)
  }

  render(){
    const contextValue = {
      waypoints: this.state.waypoints,
      editMode: this.state.editMode,
      methods: {
        switchEditMode: this.switchEditMode,
        addPoint: this.addPoint
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

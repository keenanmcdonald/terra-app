import React from 'react'
import Header from './components/Header'
import Map from './components/Map'
import {Route} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import GlobeContainer from './components/Globe'

import './App.css'

function App() {
  return (
    <div className="App">
      <Header/>
      <main>
        <Route exact path='/' component={GlobeContainer}/>
        <Route path='/login' component={LoginForm}/>
        <Route path='/signup' component={SignupForm}/>
      </main>
    </div>
  );
}

export default App;

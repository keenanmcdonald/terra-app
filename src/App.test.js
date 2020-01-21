import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import Map from './components/Map'
import Display from './components/Display'
import AccountNav from './components/AccountNav'
import EditEntityForm from './components/EditEntityForm'

it('App renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>, 
    div
  )
  ReactDOM.unmountComponentAtNode(div)
});

/*
it('Map renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Map />, div);
  ReactDOM.unmountComponentAtNode(div);
})

it('Display renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Display />, div);
  ReactDOM.unmountComponentAtNode(div);
})

it('AccountNav renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AccountNav />, div);
  ReactDOM.unmountComponentAtNode(div);
})

it('EditEntityForm renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<EditEntityForm />, div);
  ReactDOM.unmountComponentAtNode(div);
})
*/
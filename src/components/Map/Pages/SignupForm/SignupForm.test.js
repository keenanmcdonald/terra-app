import React from 'react'
import ReactDOM from 'react-dom'
import SignupForm from './SignupForm'
import { BrowserRouter } from 'react-router-dom'

it('SignupForm renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <BrowserRouter>
      <SignupForm />
    </BrowserRouter>, 
    div
  )
  ReactDOM.unmountComponentAtNode(div)
});
import React from 'react'
import ReactDOM from 'react-dom'
import MessageDisplay from './MessageDisplay'
import { BrowserRouter } from 'react-router-dom'

it('MessageDisplay renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <BrowserRouter>
      <MessageDisplay />
    </BrowserRouter>, 
    div
  )
  ReactDOM.unmountComponentAtNode(div)
});
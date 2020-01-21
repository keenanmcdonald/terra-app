import React from 'react'
import ReactDOM from 'react-dom'
import AccountNav from './AccountNav'
import { BrowserRouter } from 'react-router-dom'

it('AccountNav renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <BrowserRouter>
            <AccountNav />
        </BrowserRouter>, div);
    ReactDOM.unmountComponentAtNode(div);
  })
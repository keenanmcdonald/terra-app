import React from 'react'
import ReactDOM from 'react-dom'
import Toolbar from './Toolbar'
import TerraContext from '../../../TerraContext'


it('Toolbar renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <TerraContext.Provider value={{
            mode: '',
            }}>
            <Toolbar />
        </TerraContext.Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
  })
  
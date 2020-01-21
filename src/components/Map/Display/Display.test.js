import React from 'react'
import ReactDOM from 'react-dom'
import Display from './Display'
import TerraContext from '../../../TerraContext'


it('Display renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <TerraContext.Provider value={{
            entities: {name: 'foo', description: ''},
            selected: 0,
            }}>
            <Display />
        </TerraContext.Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
  })
  
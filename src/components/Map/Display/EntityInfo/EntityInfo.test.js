import React from 'react'
import ReactDOM from 'react-dom'
import EntityInfo from './EntityInfo'
import TerraContext from '../../../../TerraContext'

it('EntityInfo renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <TerraContext.Provider value={{
            entities: {name: 'foo', description: ''},
            selected: 0,
            }}>
            <EntityInfo />
        </TerraContext.Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
  })
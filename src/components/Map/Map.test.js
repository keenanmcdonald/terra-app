import React from 'react'
import ReactDOM from 'react-dom'
import Map from './Map'
import TerraContext from '../../TerraContext'

it('Map renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <TerraContext.Provider value={{
            entities: [{id: 0, name: 'foo', description: '', position: {x: 1635365.35844253, y: -4311219.54363677, z: 4397107.35472596}}],
            selected: 0,
            message: {hidden: true}
            }}>
            <Map />
        </TerraContext.Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
  })
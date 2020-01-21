import React from 'react'
import ReactDOM from 'react-dom'
import EditEntityForm from './EditEntityForm'
import TerraContext from '../../../../TerraContext'

it('EditEntityForm renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <TerraContext.Provider value={{
            entities: {name: 'foo', description: ''},
            selected: 0,
            }}>
            <EditEntityForm />
        </TerraContext.Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
  })
import React from 'react'
import ReactDOM from 'react-dom'
import ToolbarButton from './ToolbarButton'
import TerraContext from '../../../../TerraContext'


it('ToolbarButton renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <TerraContext.Provider value={{
            mode: '',
            }}>
            <ToolbarButton />
        </TerraContext.Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
  })
  
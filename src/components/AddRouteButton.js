import React from 'react'
import TerraContext from '../TerraContext'

class AddRouteButton extends React.Component{
    static contextType = TerraContext

    handleClick(){
        this.context.methods.setTool('add route')
    }

    render(){
        return(
            <button className={(this.context.toolbar.selectedTool === 'add route') ? 'selected' : ''} onClick={() => this.handleClick()}>Add Route</button>
        )
    }
}

export default AddRouteButton
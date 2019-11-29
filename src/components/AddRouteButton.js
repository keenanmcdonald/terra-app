import React from 'react'
import TerraContext from '../TerraContext'

class AddRouteButton extends React.Component{
    static contextType = TerraContext

    handleClick(){
        console.log('add waypoint clicked')
        this.context.methods.switchEditMode('route')
    }

    render(){
        return(
            <button className={(this.context.editMode === 'route') ? 'selected' : ''} onClick={() => this.handleClick()}>Add Route</button>
        )
    }
}

export default AddRouteButton
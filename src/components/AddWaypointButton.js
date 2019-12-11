import React from 'react'
import TerraContext from '../TerraContext'

class AddWaypointButton extends React.Component{
    static contextType = TerraContext

    handleClick(){
        this.context.methods.setTool('add point')
    }

    render(){
        return(
            <button className={(this.context.toolbar.selectedTool === 'add point') ? 'selected' : ''} onClick={() => this.handleClick()}>Add Waypoint</button>
        )
    }
}

export default AddWaypointButton
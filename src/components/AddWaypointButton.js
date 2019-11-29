import React from 'react'
import TerraContext from '../TerraContext'

class AddWaypointButton extends React.Component{
    static contextType = TerraContext

    handleClick(){
        console.log('add waypoint clicked')
        this.context.methods.switchEditMode('point')
    }

    render(){
        return(
            <button className={(this.context.editMode === 'point') ? 'selected' : ''} onClick={() => this.handleClick()}>Add Waypoint</button>
        )
    }
}

export default AddWaypointButton
import React from 'react'
import TerraContext from '../TerraContext'

class AddWaypointButton extends React.Component{
    static contextType = TerraContext

    handleClick(){
        this.context.methods.setMode('add point')
        this.context.methods.displayMessage('Click on the map to add a waypoint', 3000)
    }

    render(){
        let button;
        if (this.context.user && ['add point', 'add route', 'select',''].some(item => item === this.context.mode)){
            button = <button className={this.context.mode === 'add point' ? 'selected' : ''} onClick={() => this.handleClick()}>Add Waypoint</button>
        }
        else{
            button = <button className='disabled'>Add Waypoint</button>
        }
        return(
            <div>
                {button}
            </div>
        )
    }
}

export default AddWaypointButton
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
            button = <button className={this.context.mode === 'add point' ? 'selected' : ''}><img className='icon' src="./waypoint.png" alt="waypoint icon" onClick={() => this.handleClick()} /></button>
        }
        else{
            button = <button className='disabled'><img className='icon' src="./waypoint.png" alt="waypoint icon" /></button>
        }
        return(
            <div className='tooltip'>
                <span class='tooltip-text'>Add Waypoint</span>
                {button}
            </div>
        )
    }
}

export default AddWaypointButton
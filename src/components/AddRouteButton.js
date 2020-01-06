import React from 'react'
import TerraContext from '../TerraContext'

class AddRouteButton extends React.Component{
    static contextType = TerraContext

    handleClick(){
        this.context.methods.setMode('add route')
        this.context.methods.displayMessage('Click on the map to begin drawing a route', 3000)
    }

    render(){
        let button;
        if (this.context.user && ['add point', 'add route', 'select',''].some(item => item === this.context.mode)){
            button = <button className={this.context.mode === 'add route' ? 'selected' : ''}><img className='icon' src="./route.png" alt="route icon" onClick={() => this.handleClick()} /></button>
        }
        else{
            button = <button className='disabled'><img className='icon' src="./route.png" alt="route icon"/></button>
        }
        return(
            <div className="tooltip">
                <span class='tooltip-text'>Add Route</span>
                {button}
            </div>
        )
    }
}

export default AddRouteButton
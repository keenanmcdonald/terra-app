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
            button = <button className={this.context.mode === 'add route' ? 'selected' : ''} onClick={() => this.handleClick()}>Add Route</button>
        }
        else{
            button = <button className='disabled'>Add Route</button>
        }
        return(
            <div>
                {button}
            </div>
        )
    }
}

export default AddRouteButton
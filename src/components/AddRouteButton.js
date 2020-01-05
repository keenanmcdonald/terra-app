import React from 'react'
import TerraContext from '../TerraContext'

class AddRouteButton extends React.Component{
    static contextType = TerraContext

    handleClick(){
        this.context.methods.setMode('add route')
    }

    render(){
        return(
            <button className={this.context.user ? (this.context.mode === 'add route' ? 'selected' : '') : 'disabled'} onClick={() => this.handleClick()}>Add Route</button>
        )
    }
}

export default AddRouteButton
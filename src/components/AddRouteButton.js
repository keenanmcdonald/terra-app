import React from 'react'
import TerraContext from '../TerraContext'

class AddRouteButton extends React.Component{
    static contextType = TerraContext

    handleClick(){
        this.context.methods.setTool('add route')
        this.context.methods.selectEntity(-1)
        this.context.methods.setMode('')
    }

    render(){
        return(
            <button className={this.context.user ? (this.context.toolbar.selectedTool === 'add route' ? 'selected' : '') : 'disabled'} onClick={() => this.handleClick()}>Add Route</button>
        )
    }
}

export default AddRouteButton
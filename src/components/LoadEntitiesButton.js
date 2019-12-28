import React from 'react'
import TerraContext from '../TerraContext'

class LoadEntitiesButton extends React.Component {
    static contextType = TerraContext
    
    handleClick(){
        this.context.methods.toggleLoadEntities()
    }

    render(){
        return(
            <button className={(this.context.user ? (this.context.toolbar.loadEntities ? 'selected' : '') : 'disabled') + ' load-entities'} onClick={() => this.handleClick()}>see other users' data</button>
        )
    }
}

export default LoadEntitiesButton
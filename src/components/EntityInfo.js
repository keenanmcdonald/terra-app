import React from 'react'
import TerraContext from '../TerraContext'


class EntityInfo extends React.Component{
    static contextType = TerraContext

    render(){
        return (
            <div>
                <h2>Name: {this.props.name}</h2> 
                <p>Description: {this.props.description}</p>
                <button onClick={e => this.context.methods.editSelected()}>Edit</button>
                <button onClick={e => this.context.methods.deleteSelected()}>Delete</button>
            </div>
        )
    }
}

export default EntityInfo
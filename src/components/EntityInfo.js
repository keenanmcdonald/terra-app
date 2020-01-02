import React from 'react'
import TerraContext from '../TerraContext'


class EntityInfo extends React.Component{
    static contextType = TerraContext

    handleDelete(){
        this.context.methods.setDisplay('')
        this.context.methods.deleteSelected()
        this.props.requestRender()
    }

    render(){
        return (
            <div>
                <p>Name: {this.props.name}</p> 
                <p>Description: {this.props.description}</p>
                <p>Created By: {this.props.user}</p>
                <button onClick={e => this.context.methods.setDisplay('edit')}>Edit</button>
                <button onClick={e => this.handleDelete()}>Delete</button>
            </div>
        )
    }
}

export default EntityInfo
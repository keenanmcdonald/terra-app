import React from 'react'
import TerraContext from '../TerraContext'


class EntityInfo extends React.Component{
    static contextType = TerraContext

    handleDelete(){
        this.context.methods.setMode('')
        this.context.methods.deleteEntity(this.context.selected)
        this.props.requestRender()
    }

    render(){
        let buttons;
        if (this.context.user && this.context.user.user_name === this.props.user_name) {
            buttons = (
                <div className='display-buttons'>
                    <button onClick={e => this.context.methods.setMode('edit')}>Edit</button>
                    <button onClick={e => this.handleDelete()}>Delete</button>
                </div>
            )
        }
        return (
            <div>
                <p>Name: {this.props.name}</p> 
                <p>Description: {this.props.description}</p>
                <p>Created By: {this.props.user_name}</p>
                {buttons}
            </div>
        )
    }
}

export default EntityInfo
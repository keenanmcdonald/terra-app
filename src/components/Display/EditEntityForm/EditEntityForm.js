import React from 'react'
import TerraContext from '../TerraContext'


class EditEntityForm extends React.Component{
    static contextType = TerraContext

    constructor(props){
        super(props)

        this.state = {
            name: this.props.name,
            description: this.props.description,
        }
    }

    updateName(name){
        this.setState({name: name})
    }

    updateDescription(description){
        this.setState({description: description})
    }

    handleCancel(){
        this.context.methods.setMode('')
        this.context.methods.cancelEdit()
        this.props.requestRender()
    }
    
    render(){
        const currentEntity = this.context.entities[this.context.selected]
        const allowAdd = (this.state.name && !(currentEntity.type === 'route' && currentEntity.position.length < 2))

        return (
            <form className='edit-entity-form'>
                <div>
                    <label htmlFor='name'>Name: </label>
                    <input name='name' id='name' type='text' defaultValue={this.props.name} onChange={e => this.updateName(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor='description'>Description: </label>
                    <textarea name='description' id='description' type='text' rows='3' defaultValue={this.props.description} onChange={e => this.updateDescription(e.target.value)}/>
                </div>
                <div className='display-buttons'>
                    <button id='submit' className={allowAdd ? '' : 'disabled'} type='submit' onClick={e => this.context.methods.saveSelected(e, this.state.name, this.state.description)} disabled={!allowAdd}>
                        Add
                    </button>
                    <button id='cancel' type='button' onClick={() => this.handleCancel()}>
                        Cancel
                    </button>
                </div>
            </form>
        )
    }
}

export default EditEntityForm
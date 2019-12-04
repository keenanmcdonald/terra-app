import React from 'react'
import TerraContext from '../TerraContext'


class AddEntityForm extends React.Component{
    static contextType = TerraContext

    constructor(props){
        super(props)

        this.state = {
            name: '',
            description: ''
        }
    }

    updateName(name){
        this.setState({name: name})
    }
    updateDescription(description){
        this.setState({description: description})
    }
    render(){
        return (
            <form className='add-entity-form'>
                    <label htmlFor='name'>Name: </label>
                    <input name='name' id='name' type='text' onChange={e => this.updateName(e.target.value)}/>
                    <br/>
                    <label htmlFor='description'>Description: </label>
                    <input name='description' id='description' type='text' onChange={e => this.updateDescription(e.target.value)}/>
                    <br/>
                    <button id='submit' type='submit' onClick={e => this.context.methods.saveSelected(e, this.state.name, this.state.description)} >
                        Add
                    </button>
                    <button id='cancel' type='button' onClick={e => this.context.methods.cancelAddEntity(e)}>
                        Cancel
                    </button>
            </form>
        )
    }
}

export default AddEntityForm
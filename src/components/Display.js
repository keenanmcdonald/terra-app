import React from 'react'
import TerraContext from '../TerraContext'
import EntityInfo from './EntityInfo'
import EditEntityForm from './EditEntityForm'

class Display extends React.Component{
    static contextType = TerraContext

    render(){
        const selected = this.context.entities[this.context.selected] ? this.context.entities[this.context.selected] : {name: '', description: ''}
        let content;
        if(this.context.mode === 'edit'){
            content = <EditEntityForm name={selected.name} description={selected.description} requestRender={this.props.requestRender}/>
        }
        else if (this.context.mode === 'info'){
            content = <EntityInfo name={selected.name} description={selected.description} user={selected.user_name} requestRender={this.props.requestRender}/>
        }
        return(
            <div className='display-container'>
                <div className='display'>
                    {content}
                </div>
            </div>
        )
    }
}

export default Display
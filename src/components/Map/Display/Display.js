import React from 'react'
import TerraContext from '../../../TerraContext'
import EntityInfo from './EntityInfo/EntityInfo'
import EditEntityForm from './EditEntityForm/EditEntityForm'

class Display extends React.Component{
    static contextType = TerraContext

    render(){
        const selected = this.context.entities[this.context.selected] ? this.context.entities[this.context.selected] : {name: '', description: ''}
        let content;
        if(['edit', 'create point', 'create route'].some(item => item === this.context.mode)){
            content = <EditEntityForm name={selected.name} description={selected.description} requestRender={this.props.requestRender}/>
        }
        else if (this.context.mode === 'select'){
            content = <EntityInfo {...selected} requestRender={this.props.requestRender}/>
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
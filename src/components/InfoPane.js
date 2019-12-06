import React from 'react'
import TerraContext from '../TerraContext'
import EntityInfo from './EntityInfo'
import AddEntityForm from './AddEntityForm'

class InfoPane extends React.Component{
    static contextType = TerraContext

    render(){
        const selected = this.context.selected
        const content = selected.editing ? <AddEntityForm/> : <EntityInfo name={selected.name} description={selected.description}/>
        
        return(
            <div className='info-pane'>
                {content}
            </div>
        )
    }
}

export default InfoPane
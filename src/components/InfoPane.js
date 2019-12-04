import React from 'react'
import TerraContext from '../TerraContext'
import EntityInfo from './EntityInfo'
import AddEntityForm from './AddEntityForm'

class InfoPane extends React.Component{
    static contextType = TerraContext

    render(){
        const selected = this.context.selected
        let content;
        if (selected.saved){
            content = <EntityInfo name={selected.name} description={selected.description}/>
        }
        else {
            content = <AddEntityForm/>
        }
        
        return(
            <div className='info-pane'>
                {content}
            </div>
        )
    }
}

export default InfoPane
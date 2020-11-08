import React from 'react'
import EntityList from './EntityList/EntityList'
import TerraContext from '../../TerraContext'
import EntityInfo from './EntityInfo/EntityInfo'
import EditEntity from './EditEntity/EditEntity'

class SidePanel extends React.Component {
    static contextType = TerraContext

    render(){
        const selected = this.context.entities[this.context.selected] ? this.context.entities[this.context.selected] : {name: '', description: ''}
        let content;
        if(['edit', 'create point', 'create route'].some(item => item === this.context.mode)){
            content = <EditEntity {...selected} requestRender={this.props.requestRender}/>
        }
        else if (this.context.mode === 'select'){
            content = <EntityInfo {...selected} /> //requestRender={this.props.requestRender}/>
        }

        return (
            <div className={`side-panel ${this.props.hidden ? 'hidden' : ''}`}>
                <EntityList entities={this.context.entities} selected={this.context.selected} selectEntity={(id, flyTo) => this.context.methods.selectEntity(id, flyTo)}/>
                {content}
            </div>
        )
    }
}

export default SidePanel
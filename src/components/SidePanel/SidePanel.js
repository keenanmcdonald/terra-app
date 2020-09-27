import React from 'react'
import EntityList from './EntityList/EntityList'
import TerraContext from '../../TerraContext'
import EntityInfo from './EntityInfo/EntityInfo'


class SidePanel extends React.Component {
    static contextType = TerraContext

    render(){
        const selected = this.context.entities[this.context.selected] ? this.context.entities[this.context.selected] : {name: '', description: ''}
        let content;
        if(['edit', 'create point', 'create route'].some(item => item === this.context.mode)){
            content = ''//<EditEntityForm name={selected.name} description={selected.description} requestRender={this.props.requestRender}/>
        }
        else if (this.context.mode === 'select'){
            content = <EntityInfo {...selected} /> //requestRender={this.props.requestRender}/>
        }

        return (
            <div className='side-panel'>
                <EntityList entities={this.context.entities} selected={this.context.selected} selectEntity={(id, flyTo) => this.context.methods.selectEntity(id, flyTo)}/>
                {content}
            </div>
        )
    }
}

export default SidePanel
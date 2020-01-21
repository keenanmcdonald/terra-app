import React from 'react'
import ToolbarButton from './ToolbarButton'
import TerraContext from '../../TerraContext'

class Toolbar extends React.Component{
    static contextType = TerraContext

    handleToolClick(mode, message){
        if (this.context.mode === mode){
            this.context.methods.setMode('')
        }
        else{
            this.context.methods.setMode(mode, message)
        }
    }

    render(){
        const toolsEnabled = (this.context.user && ['add point', 'add route', 'select',''].some(item => item === this.context.mode))
        const loadForeignEntitiesEnabled = (this.context.user)

        return (
            <div className='toolbar'>
                <ToolbarButton 
                    name='Add Waypoint' 
                    enabled={toolsEnabled} 
                    selected={this.context.mode === 'add point'}
                    clickFunction={()=>this.handleToolClick('add point', 'Click on the map to create a waypoint')}
                    iconUrl='./waypoint.png'
                />
                <ToolbarButton
                    name='Add Route'
                    enabled={toolsEnabled}
                    selected={this.context.mode === 'add route'}
                    clickFunction={()=>this.handleToolClick('add route', 'Click on the map to begin drawing a route')}
                    iconUrl='./route.png'

                />
                <ToolbarButton
                    className='load-entities-button'
                    name={`Load other users' data`}
                    enabled={loadForeignEntitiesEnabled}
                    selected={this.context.loadForeignEntities}
                    clickFunction={() => this.context.methods.toggleLoadForeignEntities()}
                    iconUrl='./internet.png'
                />
            </div>
        )
    }
}

export default Toolbar
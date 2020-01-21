import React from 'react'
import TerraContext from '../../../../TerraContext'

class ToolbarButton extends React.Component{
    static contextType = TerraContext

    clickFunction() {
        if (this.props.enabled){
            this.props.clickFunction()
        }
    }

    render(){
        let button;
        if (this.props.enabled){
            button = <button className={`toolbar-button ${this.props.selected ? 'selected' : ''}`} ><img className='icon' src={this.props.iconUrl} alt={this.props.name} /></button>
        }
        else{
            button = <button className='toolbar-button disabled'><img className='icon' src={this.props.iconUrl} alt={this.props.name}/></button>
        }
        return(
            <div className='tooltip' onClick={() => this.clickFunction()}>
                <span className='tooltip-text'>{this.props.name}</span>
                {button}
            </div>
        )
    }
}

export default ToolbarButton       

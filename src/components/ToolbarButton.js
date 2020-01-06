import React from 'react'
import TerraContext from '../TerraContext'

class ToolbarButton extends React.Component{
    static contextType = TerraContext

    handleClick(){
        console.log('handle click')
        if (this.props.enabled){
            this.props.clickFunction()
            if (this.props.messageOnClick){
                this.context.methods.displayMessage(this.props.messageOnClick, 3000)
            }    
        }
    }

    render(){
        let button;
        if (this.props.enabled){
            button = <button className={this.props.selected ? 'selected' : ''} ><img className='icon' src={this.props.iconUrl} alt={this.props.name} /></button>
        }
        else{
            button = <button className='disabled'><img className='icon' src={this.props.iconUrl} alt={this.props.name}/></button>
        }
        return(
            <div className='tooltip' onClick={()=>this.handleClick()}>
                <span className='tooltip-text'>{this.props.name}</span>
                {button}
            </div>
        )
    }
}

export default ToolbarButton       

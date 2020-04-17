import React from 'react'
import TerraContext from '../../../../TerraContext'
import ElevationProfile from '../ElevationProfile/ElevationProfile'


class EntityInfo extends React.Component{
    static contextType = TerraContext

    handleDelete(){
        this.context.methods.setMode('')
        this.context.methods.deleteEntity(this.context.selected)
        this.props.requestRender()
    }

    numberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    

    render(){
        let description;
        if (this.props.description){
            description = (
                <div className='description info-box'>
                    <h6>Description:</h6>
                    <p>{this.props.description}</p>
                </div>
            )
        }
        let buttons;
        if (this.context.user && this.context.user.user_name === this.props.user_name) {
            buttons = (
                <div className='display-buttons'>
                    <button onClick={e => this.context.methods.setMode('edit')}>Edit</button>
                    <button onClick={e => this.handleDelete()}>Delete</button>
                </div>
            )
        }
        return (
            <div className='entity-info'>
                <div className='name-and-user'>
                    <div className='name info-box'>
                        <h6>Name: </h6>
                        <p>{this.props.name}</p>
                    </div>
                    <div className='user info-box'>
                        <h6>Created By:</h6>
                        <p>{this.props.user_name}</p>
                    </div>
                    {this.props.elevation ? (
                        <div className='elevation info-box'> 
                            <h6>Elevation:</h6>
                            {this.props.type === 'waypoint' ? (
                                <p>{this.numberWithCommas(this.props.elevation)}ft</p>
                            ) 
                            : <ElevationProfile elevation={this.props.elevation}/>}
                        </div>
                    ) : ''}
                </div>
                {description}
                {buttons}
            </div>
        )
    }
}

export default EntityInfo
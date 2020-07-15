import React from 'react'
import TerraContext from '../../../../TerraContext'
import ElevationProfile from '../ElevationProfile/ElevationProfile'
import {Math as CesiumMath} from 'cesium'


class EntityInfo extends React.Component{
    static contextType = TerraContext

    componentDidMount(){
        this.props.requestRender()
    }

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

        console.log(this.props)
        
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
                    {this.props.position && this.props.position.height ? (
                        <div className='elevation info-box'> 
                            <h6>Elevation:</h6>
                            {this.props.type === 'waypoint' ? (
                                <p>{this.numberWithCommas(Math.round(this.props.position.height * 3.28084))}ft</p>
                            ) 
                            : <ElevationProfile position={this.props.position}/>}
                        </div>
                    ) : ''}
                    {this.props.type === 'waypoint' ? (
                        <div className='latitude info-box'>
                            <h6>Latitude:</h6>
                            <p>{Math.round(CesiumMath.toDegrees(this.props.position.latitude) * 100) * .01}</p>
                        </div>
                    ) : ''}
                    {this.props.type === 'waypoint' ? (
                        <div className='longitude info-box'>
                            <h6>Longitude:</h6>
                            <p>{Math.round(CesiumMath.toDegrees(this.props.position.longitude) * 100) * .01}</p>
                        </div>
                    ) : ''}
                    {this.props.type === 'route' ? (
                        <div className='distance info-box'>
                            <h6>Distance:</h6>
                            <p>{Math.round(this.props.distance*100)*.01} miles</p>
                        </div>
                    ) : ''}
                    {this.props.position && this.props.position.length ? (
                        <div className='elevation-profile info-box'>
                            <h6>Elevation Profile:</h6>
                            <ElevationProfile positions={this.props.position}/>
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
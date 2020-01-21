import React from 'react'
import {isMobile} from 'react-device-detect'
import {withRouter} from 'react-router-dom'
import TerraContext from '../../../TerraContext'


class LandingPage extends React.Component{
    static contextType = TerraContext

    render(){
        let controls
        if (isMobile){
            controls = (
                <div className='controls'>
                    <h4>Controls:</h4>
                    <h5>Pan</h5>
                    <p>one finger drag</p>
                    <h5>Zoom</h5>
                    <p>two finger pinch</p> 
                    <h5>Tilt view</h5>
                    <p>two finger drag, same direction</p>
                    <h5>Rotate view</h5>
                    <p>two finger drag, opposite direction</p>
                </div> 
            )
        }
        else{
            controls = (
                <div className='controls'>
                    <h4>Controls:</h4>
                    <h5>Pan</h5>
                    <p>left click + drag</p>
                    <h5>Zoom</h5>
                    <p>right click + drag, or scroll in/out</p> 
                    <h5>Rotate view </h5>
                    <p>CTRL + click + drag</p>
                </div> 
            )
        }

        let signUpButton;
        if (!this.context.user){
            signUpButton = <button onClick={() => this.props.history.push('/signup')}>Sign Up</button>
        }
        return(
            <div className='page-backdrop landing-page'>
                <h1>Welcome to <span>Terra</span></h1>
                <p>Terra is a mapping app geared towards hikers, climbers, mountaineers and explorers.</p>
                <p>It allows users to drop waypoints and draw routes on a 3D terrain map of the world.</p>
                <p>Users can share their routes with the community and access routes left by others.</p>
                {controls}
                <div className='landing-page-buttons'>
                    {signUpButton}
                    <br/>
                    <button onClick={() => this.props.history.push('/')}>Explore the Map</button>
                </div>
            </div>
        )
    }
}

export default withRouter(LandingPage)
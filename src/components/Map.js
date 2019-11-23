import React from "react"
import ReactMapGL, {Marker} from 'react-map-gl'

export class Map extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            viewport: {
                latitude: 30,
                longitute: -97,
                width: '100%',
                height: '400px',
                zoom: 2,    
            }
        }
    }
    setViewport(newViewport){
        this.setState({viewport: newViewport});
    }
    render(){
        return (
            <div className="map-container">
                <ReactMapGL 
                {...this.state.viewport} 
                mapboxApiAccessToken="pk.eyJ1Ijoia2VlbmFuam1jZG9uYWxkIiwiYSI6ImNrM2F1NzVnMzA2NzMzY3FldnpreGY2NGwifQ.FBxBbbO30pfwtUoy_oVMHw"
                mapStyle="mapbox://styles/keenanjmcdonald/ck3av2xi41jli1ct47qdbeurb"
                onViewportChange={viewport => {
                    this.setViewport(viewport);
                }}
                >
                    <Marker latitude={30} longitude={97}>
                        <button className="marker">
                            <img className="waypoint" src="https://cdn0.iconfinder.com/data/icons/location-and-maps/24/waypoint-circle-512.png" alt="waypoint icon"/>
                        </button>
                    </Marker>
                </ReactMapGL>
            </div>
        )
    }
}

export default Map
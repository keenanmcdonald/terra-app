import React from "react"
import { Camera, Viewer, Entity, ScreenSpaceEventHandler, ScreenSpaceEvent } from 'resium'
import { 
            Ion, 
            Cartesian3, 
            createWorldTerrain, 
            ScreenSpaceEventType, 
            sampleTerrainMostDetailed, 
            Cartographic,
            SceneMode
        } from 'cesium'
import TerraContext from '../TerraContext'
import Toolbar from './Toolbar'

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZWI5Mzc5NS1iZjNmLTQ0OTEtYTNjOS0xYWY1MTBmNGE0YjAiLCJpZCI6MTg4MzcsInNjb3BlcyI6WyJhc2wiLCJhc3IiLCJhc3ciLCJnYyJdLCJpYXQiOjE1NzQ4MTM3MDJ9.q8-BHVsogGtuJUBMi5K8V-h9frZOQWsZGJwf-CuyDCY'

const terrainProvider = createWorldTerrain();
const pointGraphics = { pixelSize: 10 };
const grandTetonCoordinates = new Cartesian3(-1640873.683562967, -4320866.876996664, 4393353.31858848)

class Map extends React.Component {
    static contextType = TerraContext

    componentDidMount(){
    }

    drawRoutes(){
        return this.context.waypoints.map((position, index) => {
            return (
                <Entity 
                    key={index}
                    position={new Cartesian3(position.latitude, position.longitude, position.height)} 
                    point={pointGraphics}
                />
            )
        })
    }   

    getCameraPosition(){
        const {viewer} = this;

        console.log(`position: `)
        console.log(viewer.camera.position)
        console.log(`direction: `)
        console.log(viewer.camera.direction)
    }

    async getClickPosition(mousePosition){
        const { viewer } = this;
        let cartesian;

        //if scene is zoomed close enough to display 3d data
        if (viewer.scene.mode === SceneMode.SCENE3D){
            cartesian = viewer.scene.pickPosition(mousePosition)
        }
        else{
            cartesian = viewer.camera.pickEllipsoid(mousePosition, viewer.scene.globe.ellipsoid)    
        }

        //convert to cartographic and get height at point
        let cartographic = Cartographic.fromCartesian(cartesian)
        let cartographicArray = await sampleTerrainMostDetailed(terrainProvider, [cartographic])
        return cartographicArray[0]
    }

    handleClick(event){
        if (this.context.editMode === 'point'){
            const mousePosition = event.position
            this.getClickPosition(mousePosition)
                .then(position => {
                    this.context.methods.addPoint(position)
                })
        }
        else if (this.context.editMode === 'route'){
            console.log('add route')
        }
    }

    render() {
        const waypoints = this.drawRoutes();
        return (
            <div>
                <Viewer 
                    ref={e => {
                        this.viewer = e ? e.cesiumElement : null;
                    }}
                    animation={false} 
                    baseLayerPicker={false}
                    fullscreenButton={false}
                    homeButton={false}
                    infoBox={false}
                    sceneModePicker={false}
                    timeline={false}
                    navigationHelpButton={false}
                    terrainProvider={terrainProvider}
                    requestRenderMode={true}>
                    <Toolbar/>
                        {waypoints}
                    <ScreenSpaceEventHandler>
                        <ScreenSpaceEvent action={e => this.handleClick(e)} type={ScreenSpaceEventType.LEFT_CLICK} />
                    </ScreenSpaceEventHandler>
                </Viewer>
            </div>
        );
    }
}

export default Map



/* Turn cartographic into lat/lng

    let longitude = cesiumMath.toDegrees(cartographic.longitude).toFixed(2);
    let latitude = cesiumMath.toDegrees(cartographic.latitude).toFixed(2)
    console.log(`lat: ${latitude}, lng: ${longitude}`)*/
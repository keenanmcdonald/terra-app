import React from "react"
import { Globe, Viewer, Entity, ScreenSpaceEventHandler, ScreenSpaceEvent } from 'resium'
import { 
            Math as cesiumMath,
            Ion, 
            Cartesian3, 
            createWorldTerrain, 
            ScreenSpaceEventType, 
            sampleTerrainMostDetailed, 
            Cartographic
        } from 'cesium'
import TerraContext from '../TerraContext'
import Toolbar from './Toolbar'
import InfoPane from './InfoPane'

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZWI5Mzc5NS1iZjNmLTQ0OTEtYTNjOS0xYWY1MTBmNGE0YjAiLCJpZCI6MTg4MzcsInNjb3BlcyI6WyJhc2wiLCJhc3IiLCJhc3ciLCJnYyJdLCJpYXQiOjE1NzQ4MTM3MDJ9.q8-BHVsogGtuJUBMi5K8V-h9frZOQWsZGJwf-CuyDCY'

const terrainProvider = createWorldTerrain();
const pointGraphics = { pixelSize: 15 };
//const grandTetonCoordinates = new Cartesian3(-1640873.683562967, -4320866.876996664, 4393353.31858848)

class Map extends React.Component {
    static contextType = TerraContext

    drawEntities(){
        let entities = this.context.waypoints.map((point, index) => {
            return (
                <Entity 
                    key={point.id}
                    position={new Cartesian3.fromRadians(point.position.longitude, point.position.latitude, point.position.height)}
                    point={pointGraphics}
                    onClick={event => this.context.methods.selectEntity(point.id)}
                />
            )
        })

        //add selected route if it exists
        if (this.context.selected){
            entities.push(
                <Entity 
                    key={this.context.selected.id} 
                    position={new Cartesian3.fromRadians(this.context.selected.position.longitude, this.context.selected.position.latitude, this.context.selected.position.height)}
                    point={pointGraphics}
                />
            )
        }
        return entities
    }
    
    logPosition(cartographic){
        let longitude = cesiumMath.toDegrees(cartographic.longitude).toFixed(2);
        let latitude = cesiumMath.toDegrees(cartographic.latitude).toFixed(2)
        console.log(`lat: ${latitude}, lng: ${longitude}`)
    }
    logCameraPosition(){
        const {viewer} = this;

        console.log(`position: `)
        console.log(viewer.camera.position)
        console.log(`direction: `)
        console.log(viewer.camera.direction)
    }
    handleClick(event) {
        if (this.context.editMode === 'point'){
            const mousePosition = event.position
            this.getClickPosition(mousePosition, this.viewer.scene)
                .then(position => {
                    this.context.methods.dropMarker(position)
                })
                .catch(error => console.log(error))
        }
        else if (this.context.editMode === 'route'){
            console.log('add route')
        }
    }
    async getClickPosition(mousePosition, scene){
        let cartesian = scene.pickPosition(mousePosition)
        let cartographic = Cartographic.fromCartesian(cartesian);
        let sampledArray = await sampleTerrainMostDetailed(terrainProvider, [cartographic])
        cartographic = sampledArray[0]
        return cartographic
    }
    render() {
        const entities = this.drawEntities();
        let infoPane;
        if (this.context.selected){
            infoPane = <InfoPane/>
        }
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
                    selectionIndicator={false}
                    terrainProvider={terrainProvider}
                    requestRenderMode={true}
                    scene3DOnly={true}>
                    <Globe depthTestAgainstTerrain={true}>
                        <Toolbar/>
                            {entities}
                        <ScreenSpaceEventHandler>
                        </ScreenSpaceEventHandler>
                    </Globe>
                </Viewer>
                {infoPane}
            </div>
        );
    }
}

export default Map

//                            <ScreenSpaceEvent action={e => this.handleClick(e)} type={ScreenSpaceEventType.LEFT_CLICK} />

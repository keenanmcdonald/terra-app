import React from "react"
import { Globe, Viewer, Entity, ScreenSpaceEventHandler, ScreenSpaceEvent } from 'resium'
import { 
            PolylineGraphics,
            Color,
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
//const grandTetonCoordinates = new Cartesian3(-1640873.683562967, -4320866.876996664, 4393353.31858848)

class Map extends React.Component {
    static contextType = TerraContext
    constructor(props){
        super(props)

        this.state = {
            mousePosition: null
        }
    }
    drawWaypoints(){
        return this.context.waypoints.map((waypoint, index) => {
            console.log(waypoint.name)
            const pixelSize = waypoint.hover ? 16 : 14
            console.log(pixelSize)
            return (
                <Entity 
                    key={waypoint.id}
                    id={waypoint.id}
                    position={waypoint.position}
                    point={{
                        pixelSize,
                        color: Color.CORNFLOWERBLUE,
                    }}
                />
            )
        }) 
    }
    drawRoutes(){
        return this.context.routes.map((route, index) => {
            const width = route.hover ? 5 : 4
            return <Entity
                key={route.id}
                id={route.id}
                position={route.positions[0]}
                polyline={new PolylineGraphics({
                    positions: route.positions,
                    width,
                    clampToGround: true,
                    material: Color.CORNFLOWERBLUE,
                })}
            />
        })
    }
    drawSelected(){
        let selected = '';
        if (this.context.selected){
            if (this.context.selected.type === 'waypoint'){
                selected = (
                    <Entity 
                        key={this.context.selected.id} 
                        position={this.context.selected.position}
                        point={{pixelSize: 14}}
                    />
                )
            }
            else if (this.context.selected.type === 'route'){
                selected = (
                    <Entity
                        position={this.context.selected.positions[0]} //is this necessary?
                        polyline={new PolylineGraphics({
                            positions: this.context.selected.positions,
                            width: 3.0,
                            clampToGround: true,
                        })}/>
                )
            }
        }
        return selected
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
        const mousePosition = event.position
        const pickedObject = this.viewer.scene.pick(mousePosition)
        if (pickedObject){
            console.log(pickedObject)
            this.context.methods.selectEntity(pickedObject.id.id)
        }
        else if (this.context.editMode === 'point'){
            this.getClickPosition(mousePosition, this.viewer.scene)
                .then(position => {
                    this.context.methods.dropMarker(position)
                })
                .catch(error => console.log(error))
        }
        else if (this.context.editMode === 'route'){
            this.getClickPosition(mousePosition, this.viewer.scene)
                .then(position => {
                    this.context.methods.dropRouteJoint(position)
                })
                .catch(error => console.log(error))
        }
    }
    async getClickPosition(mousePosition, scene){
        let cartesian = scene.pickPosition(mousePosition)
        let cartographic = Cartographic.fromCartesian(cartesian);
        let sampledArray = await sampleTerrainMostDetailed(terrainProvider, [cartographic])
        cartographic = sampledArray[0]
        cartesian = new Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height)
        return cartesian
    }
    handleHover(event){
        const mousePosition = event.endPosition
        const pickedObject = this.viewer.scene.pick(mousePosition)
        if (pickedObject){
            this.context.methods.highlightEntity(pickedObject.id.id)
        }
        else{
            this.context.methods.removeHighlights()
        }
    }
    render() {
        const waypoints = this.drawWaypoints();
        const routes = this.drawRoutes();
        const selected = this.drawSelected();

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
                            {waypoints}
                            {routes}
                            {selected}
                        <ScreenSpaceEventHandler>
                            <ScreenSpaceEvent action={e => this.handleClick(e)} type={ScreenSpaceEventType.LEFT_CLICK} />
                            <ScreenSpaceEvent action={e => this.handleHover(e)} type={ScreenSpaceEventType.MOUSE_MOVE}/>
                        </ScreenSpaceEventHandler>
                    </Globe>
                </Viewer>
                {infoPane}
            </div>
        );
    }
}

export default Map

/*

    handleHover(e){
        console.log('handle hover')
        const {viewer} = this;
        let pickedObject = viewer.scene.pick(e.endPosition)
        if(pickedObject){
            console.log(pickedObject)
        }
    }

*/
import React from "react"
import { Globe, Viewer, Entity, ScreenSpaceEventHandler, ScreenSpaceEvent } from 'resium'
import { 
            PolylineOutlineMaterialProperty,
            PolylineGraphics,
            Color,
            Ion, 
            Cartesian3, 
            createWorldTerrain, 
            ScreenSpaceEventType, 
            sampleTerrainMostDetailed, 
            Cartographic
        } from 'cesium'
import TerraContext from '../TerraContext'
import Toolbar from './Toolbar'
import Display from './Display'

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZWI5Mzc5NS1iZjNmLTQ0OTEtYTNjOS0xYWY1MTBmNGE0YjAiLCJpZCI6MTg4MzcsInNjb3BlcyI6WyJhc2wiLCJhc3IiLCJhc3ciLCJnYyJdLCJpYXQiOjE1NzQ4MTM3MDJ9.q8-BHVsogGtuJUBMi5K8V-h9frZOQWsZGJwf-CuyDCY'

const terrainProvider = createWorldTerrain();
//const grandTetonCoordinates = new Cartesian3(-1640873.683562967, -4320866.876996664, 4393353.31858848)

class Map extends React.Component {
    static contextType = TerraContext

    drawEntities(){
        return this.context.entities.map((entity, index) => {
            console.log('redraw')
            const isSelected = this.context.selected === index
            const pixelSize = isSelected ? 16 : 14
            const width = isSelected ? 6 : 4
            const outlineWidth = isSelected ? 2 : 0
            if (entity.type === 'waypoint'){
                return (
                    <Entity 
                        key={entity.id}
                        id={entity.id}
                        position={entity.position}
                        point={{
                            pixelSize,
                            color: Color.CORNFLOWERBLUE,
                            outlineColor: Color.WHITE,
                            outlineWidth,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }}
                    />
                )
            }
            else {
                return (
                    <Entity
                        key={entity.id}
                        id={entity.id}
                        position={entity.position[0]}
                        polyline={new PolylineGraphics({
                            positions: entity.position,
                            width,
                            clampToGround: true,
                            material: new PolylineOutlineMaterialProperty({
                                color: Color.CORNFLOWERBLUE,
                                outlineColor: Color.WHITE,
                                outlineWidth: outlineWidth
                            }),
                        })}
                    />
                )
            }
        }) 
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
            this.context.methods.selectEntity(pickedObject.id.id)
            this.viewer.scene.requestRender()
        }
        else if (this.context.toolbar.selectedTool === 'add point'){
            this.getClickPosition(mousePosition, this.viewer.scene)
                .then(position => {
                    this.context.methods.dropWaypoint(position)
                })
                .catch(error => console.log(error))
        }
        else if (this.context.toolbar.selectedTool === 'add route'){
            this.getClickPosition(mousePosition, this.viewer.scene)
                .then(position => {
                    this.context.methods.dropRouteJoint(position)
                    this.context.methods.setDisplay('edit')
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

        //change cursor when hovering
        if (pickedObject){
            document.body.style.cursor = 'pointer';
        }
        else{
            document.body.style.cursor = 'default';
        }
    }
    requestRender(){
        this.viewer.scene.requestRender()
    }
    render() {
        const entities = this.drawEntities();
        const display = this.context.display ? <Display requestRender={() => this.requestRender()}/> : ''

        return (
            <div className='map-container'>
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
                    maximumRenderTimeChange= {Infinity}
                    scene3DOnly={true}>
                    <Globe depthTestAgainstTerrain={true}>
                        <Toolbar/>
                        {entities}
                        {display}
                        <ScreenSpaceEventHandler>
                            <ScreenSpaceEvent action={e => this.handleClick(e)} type={ScreenSpaceEventType.LEFT_CLICK} />
                            <ScreenSpaceEvent action={e => this.handleHover(e)} type={ScreenSpaceEventType.MOUSE_MOVE}/>
                        </ScreenSpaceEventHandler>
                    </Globe>
                </Viewer>
            </div>
        );
    }
}

export default Map
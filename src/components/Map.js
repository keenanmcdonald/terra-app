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
import {Route} from 'react-router-dom'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import MessageDisplay from './MessageDisplay'


Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZWI5Mzc5NS1iZjNmLTQ0OTEtYTNjOS0xYWY1MTBmNGE0YjAiLCJpZCI6MTg4MzcsInNjb3BlcyI6WyJhc2wiLCJhc3IiLCJhc3ciLCJnYyJdLCJpYXQiOjE1NzQ4MTM3MDJ9.q8-BHVsogGtuJUBMi5K8V-h9frZOQWsZGJwf-CuyDCY'

const terrainProvider = createWorldTerrain();
const GRAND_TETON = {
    destination: new Cartesian3(-1631671.044420763, -4323646.892947312, 4389361.1347925365),
    orientation: {direction: new Cartesian3(-0.7298340716352859, 0.680904387616289, -0.060921611971013895), up: new Cartesian3(-0.5138818030145764, -0.4876629521263775, 0.7057693232592888)},
    duration: 0,
}

class Map extends React.Component {
    static contextType = TerraContext
    
    componentDidMount(){
        this.viewer.camera.flyTo(GRAND_TETON)
    }

    drawEntities(){
        /*
        if (this.context.loadEntities){
            this.context.methods.loadEntities()
        }*/
        this.requestRender()

        let entities = this.context.entities
    
        return entities.map((entity, index) => {
            const isSelected = (this.context.selected === index || !entity.saved) && this.context.mode === 'select'
            entity.isSelected = isSelected

            let color = Color.DODGERBLUE
            if (!entity.saved) {
                color = Color.LIGHTBLUE
            }
            else if (this.context.user && (this.context.user.user_name === entity.user_name)) {
                color = Color.CORNFLOWERBLUE
            }
            entity.color = color

            if (entity.type === 'waypoint'){
                return this.drawWaypoint(entity)
            }
            else {
                return this.drawRoute(entity)
            }
        })
    }

    drawWaypoint(waypoint){
        const pixelSize = waypoint.isSelected ? 16 : 14
        const outlineWidth = waypoint.isSelected ? 2 : 0

        return (
            <Entity 
                key={waypoint.id}
                id={waypoint.id}
                position={waypoint.position}
                point={{
                    pixelSize,
                    color: waypoint.color,
                    outlineColor: Color.WHITE,
                    outlineWidth,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                }}
            />
        )
    }

    drawRoute(route){
        const pixelSize = route.isSelected ? 12 : 10
        const width = route.isSelected ? 6 : 4
        const outlineWidth = route.isSelected ? 2 : 0

        let joints = [];
        for (let i = 0; i < route.position.length; i++){
            joints.push(
                <Entity
                    key={`r${route.id}j${i}`}
                    id={`r${route.id}j${i}`}
                    isEndpoint={(i === 0 || i === route.position.length-1)}
                    position={route.position[i]}
                    point={{
                        pixelSize,
                        color: route.color,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY
                    }}
                />
            )
        }
        return (
            <div className='route'>
                <Entity
                    key={route.id}
                    id={route.id}
                    position={route.position[0]}
                    polyline={new PolylineGraphics({
                        positions: route.position,
                        width,
                        clampToGround: true,
                        material: new PolylineOutlineMaterialProperty({
                            color: route.color,
                            outlineColor: Color.WHITE,
                            outlineWidth: outlineWidth
                        }),
                    })}
                />
                <div className={'route-joints'}>
                    {joints}
                </div>
            </div>
            
        )
    }

    logCameraPosition(){
        console.log(this.viewer.camera)
    }

    //when a user clicks on the map, if the user clicked on an entity -> selects the entity, if not -> checks current selected tool and drops a new waypoint or route
    handleClick(event) {
        //this.logCameraPosition()
        const mousePosition = event.position
        const pickedObject = this.viewer.scene.pick(mousePosition)
        if (pickedObject){
            this.context.methods.selectEntity(pickedObject.id.id)
        }
        else if (this.context.mode === 'add point'){
            this.getClickPosition(mousePosition, this.viewer.scene)
                .then(position => {
                    this.context.methods.dropWaypoint(position)
                })
                .catch(error => console.log(error))
        }
        else if (this.context.mode === 'add route' || this.context.mode === 'create route'){
            this.getClickPosition(mousePosition, this.viewer.scene)
                .then(position => {
                    this.context.methods.dropRouteJoint(position)
                })
                .catch(error => console.log(error))
        }
        else {
            this.context.methods.cancelEdit()
            this.context.methods.setMode('')
        }
        this.viewer.scene.requestRender()
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
        if (this.viewer){
            this.viewer.scene.requestRender()
        }
    }
    render() {
        const entities = this.drawEntities();
        const display = ['edit', 'create', 'create route', 'select'].some(item => item === this.context.mode) ? <Display requestRender={() => this.requestRender()}/> : ''
        const message = <MessageDisplay hidden={this.context.message.hidden} text={this.context.message.text}/>

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
                        {message}
                        {entities}
                        {display}
                        <ScreenSpaceEventHandler>
                            <ScreenSpaceEvent action={e => this.handleClick(e)} type={ScreenSpaceEventType.LEFT_CLICK} />
                            <ScreenSpaceEvent action={e => this.handleHover(e)} type={ScreenSpaceEventType.MOUSE_MOVE}/>
                        </ScreenSpaceEventHandler>
                        <Route exact path='/' component={Toolbar}/>
                        <Route path='/login' component={LoginForm}/>
                        <Route path='/signup' component={SignupForm}/>
                    </Globe>
                </Viewer>
            </div>
        );
    }
}

export default Map
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
            Cartographic,
        } from 'cesium'
import TerraContext from '../../TerraContext'
import Toolbar from './Toolbar/Toolbar'
import {Route} from 'react-router-dom'
import LoginForm from './Pages/LoginForm/LoginForm'
import SignupForm from './Pages/SignupForm/SignupForm'
import MessageDisplay from './MessageDisplay/MessageDisplay'
import LandingPage from './Pages/LandingPage/LandingPage'
import ErrorBoundary from './ErrorBoundary'

Ion.defaultAccessToken = process.env.REACT_APP_CESIUM_ACCESS_KEY

const terrainProvider = createWorldTerrain();

class Map extends React.Component {
    static contextType = TerraContext
 
    constructor(props){
        super(props)

        //this.sampleHeightsAlongLine = this.sampleHeightsAlongLine.bind(this)
        //this.requestRender = this.requestRender.bind(this)

        this.state = {
            viewer: this.viewer
        }
    }


    selectRandomElement(views){
        const viewsArray = Object.values(views)
        const index = Math.floor(Math.random() * viewsArray.length)
        return viewsArray[index]
    }

    //reads entities in app's state from context. Draws them on the map
    drawEntities(){
        this.requestRender()

        let entities = this.context.entities
    
        return entities.map((entity, index) => {
            const isSelected = (this.context.selected === index || !entity.saved) && (this.context.mode === 'select' || this.context.mode === 'edit')
            entity.isSelected = isSelected
            let outlineColor = isSelected ? Color.WHITE : Color.GREY

            let color = Color.fromBytes(255, 174, 75)
            
            if (!entity.saved) {
                color = new Color.fromBytes(100, 149, 255, 100) //new Color.fromBytes(116, 192, 67, 100)
                outlineColor = Color.WHITE
            }
            else if (this.context.user && (this.context.user.user_name === entity.user_name)) {
                color = new Color.fromBytes(100, 149, 255, 255) //new Color.fromBytes(116, 192, 67, 255)
            }

            entity.color = color
            entity.outlineColor = outlineColor

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
        const outlineWidth = waypoint.isSelected ? 2 : 1
        const cartesian = new Cartesian3.fromRadians(waypoint.position.longitude, waypoint.position.latitude, waypoint.position.height)

        return (
            <Entity 
                key={waypoint.id}
                id={waypoint.id}
                position={cartesian}
                type={'waypoint'}
                point={{
                    pixelSize,
                    color: waypoint.color,
                    outlineColor: waypoint.outlineColor,
                    outlineWidth,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                }}
            />
        )
    }

    drawRoute(route){
        const width = route.isSelected ? 7 : 5
        const outlineWidth = route.isSelected ? 2 : 0
        const cartesianPositions = []

        let joints = [];
        for (let i = 0; i < route.position.length; i++){
            const isEndpoint = (i === 0 || i === route.position.length-1)
            cartesianPositions.push(new Cartesian3.fromRadians(route.position[i].longitude, route.position[i].latitude, route.position[i].height))
            const pixelSize = route.isSelected ? (isEndpoint ? 12 : 8) : (isEndpoint ? 10 : 8)
            joints.push(
                <Entity
                    key={`r${route.id}j${i}`}
                    id={`r${route.id}j${i}`}
                    isEndpoint={isEndpoint}
                    type={'joint'}
                    position={cartesianPositions[i]}
                    point={{
                        pixelSize,
                        color: route.color,
                        outlineColor: route.outlineColor,
                        outlineWidth: isEndpoint ? 1 : 0,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY
                    }}
                />
            )
        }
        return (
            <div className='route' key={route.id}>
                <Entity
                    key={route.id}
                    id={route.id}
                    type={'polyline'}
                    position={cartesianPositions[0]}
                    polyline={new PolylineGraphics({
                        positions: cartesianPositions,
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

    //handles clicks on the map based on current mode, whether user clicks on an entity or not
    handleClick(event) {
        //console.log(this.viewer.camera)
        const mousePosition = event.position
        const pickedObject = this.viewer.scene.pick(mousePosition)
        if (this.context.mode === 'add point'){
            if (pickedObject){
                this.context.methods.dropWaypoint(pickedObject.id.position._value)
            }
            else{
                this.getClickPosition(mousePosition, this.viewer.scene)
                    .then(position => {
                        this.context.methods.dropWaypoint(position)
                    })
                    .catch(error => console.log(error))
            }
        }
        else if (this.context.mode === 'create route' || this.context.mode === 'add route'){
            if (pickedObject && (pickedObject.id.type === 'point' || pickedObject.id.type === 'joint')){
                this.context.methods.dropRouteJoint(pickedObject.id.position)
            }
            else{
                this.getClickPosition(mousePosition, this.viewer.scene)
                .then(position => {
                    this.context.methods.dropRouteJoint(position)
                })
                .catch(error => console.log(error))
            }
        }
        else {
            if (pickedObject){
                let id;
                if (pickedObject.id.type === 'joint'){
                    id = parseInt(pickedObject.id.id.split(/[a-zA-Z]/)[1])
                }
                else{
                    id = pickedObject.id.id
                }
                this.context.methods.selectEntity(id)
                }
            else {
                this.context.methods.cancelEdit()
                this.context.methods.setMode('')
            }
        }
        this.viewer.scene.requestRender()
    }

    //gets the position of a click and the height of the terrain at that position, returns Cartesian3
    async getClickPosition(mousePosition, scene){
        let cartesian = scene.pickPosition(mousePosition)
        let cartographic = Cartographic.fromCartesian(cartesian);
        let sampledArray = await sampleTerrainMostDetailed(terrainProvider, [cartographic])
        const position = sampledArray[0]
        return position
    }

    //turns the cursor to a pointer when hovering over an entity
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

    flyTo(position){

        //if position is a route, choose the point in the middle of the route
        if (position.length) {
            position = position[Math.floor(position.length/2)]
        }

        this.viewer.camera.flyTo({
            destination: Cartesian3.fromRadians(position.longitude, position.latitude, position.height+10000),
            duration: 2.0,
        })
        this.context.methods.cancelFlyTo()
    }

    //rerenders the Cesium map, normally, the map does not render unless the view moves, this method is called when there is a change made to entities displayed on the map
    requestRender(){
        if (this.viewer){
            this.viewer.scene.requestRender()
        }
    }
    
    render() {
        const entities = this.drawEntities();
        const message = <MessageDisplay hidden={this.context.message.hidden} text={this.context.message.text}/>

        if (this.context.flyToSelected){
            this.flyTo(this.context.entities[this.context.selected].position)
        }

        return (
            <div className={`map-container ${this.props.hidePanel ? 'no-panel' : ''}`}>
                <ErrorBoundary>
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
                            <Toolbar flyTo={(position) => this.flyTo(position)}/>
                            <ScreenSpaceEventHandler>
                                <ScreenSpaceEvent action={e => this.handleClick(e)} type={ScreenSpaceEventType.LEFT_CLICK} />
                                <ScreenSpaceEvent action={e => this.handleHover(e)} type={ScreenSpaceEventType.MOUSE_MOVE}/>
                            </ScreenSpaceEventHandler>
                            <Route path='/welcome' component={LandingPage}/>
                            <Route path='/login' component={LoginForm}/>
                            <Route path='/signup' component={SignupForm}/>
                        </Globe>
                    </Viewer>
                </ErrorBoundary>
            </div>
        );
    }
}

export default Map
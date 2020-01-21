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
import TerraContext from '../../TerraContext'
import Toolbar from '../Toolbar/Toolbar'
import Display from '../Display/Display'
import {Route} from 'react-router-dom'
import LoginForm from '../Pages/LoginForm/LoginForm'
import SignupForm from '../Pages/SignupForm/SignupForm'
import MessageDisplay from '../Header/MessageDisplay/MessageDisplay'
import LandingPage from '../Pages/LandingPage/LandingPage'

Ion.defaultAccessToken = process.env.REACT_APP_CESIUM_ACCESS_KEY

const terrainProvider = createWorldTerrain();

/*const MOUNTAIN_VIEWS = {
    GrandTeton: {
        destination: new Cartesian3(-1631671.044420763, -4323646.892947312, 4389361.1347925365),
        orientation: {direction: new Cartesian3(-0.7298340716352859, 0.680904387616289, -0.060921611971013895), up: new Cartesian3(-0.5138818030145764, -0.4876629521263775, 0.7057693232592888)},
    },
    Orizaba: {
        destination: new Cartesian3(-768856.7886796016, -5986001.429157894, 2081366.4297407947),
        orientation: {direction: new Cartesian3(0.38626413322197944, -0.04613584813909305, -0.9212336852844448), up: new Cartesian3(-0.0033169618581180838, -0.9988113438994612, 0.04863020729735895)},    
    },
    Denali: {
        destination: new Cartesian3(-2509961.713939744, -1400628.0705196098, 5681935.078713867),
        orientation: {direction: new Cartesian3(-0.8493720621232732, -0.15615300528867923, -0.5041659836043805), up: new Cartesian3(-0.46426077041257685, -0.2333297158691932, 0.8544115991419605)},
    },
    Fuji: {
        destination: new Cartesian3(-3912756.3324862844, 3431761.9013772095, 3683337.2288680817),
        orientation: {direction: new Cartesian3(-0.17159108061857778, 0.277971183976757, -0.9451394193084471), up: new Cartesian3(-0.6936508568463772, 0.6471652645570205, 0.31626825504171086)},
    },
}*/
class Map extends React.Component {
    static contextType = TerraContext
    
    
    /*componentDidMount(){
        //select random view from the defined set and fly to it
        const view = this.selectRandomElement(MOUNTAIN_VIEWS)
        this.viewer.camera.flyTo({...view, duration: 0})
    }*/

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

            let color = Color.CORNFLOWERBLUE
            if (!entity.saved) {
                color = new Color.fromBytes(116, 192, 67, 100)
                outlineColor = Color.WHITE
            }
            else if (this.context.user && (this.context.user.user_name === entity.user_name)) {
                color = new Color.fromBytes(116, 192, 67, 255)
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

        return (
            <Entity 
                key={waypoint.id}
                id={waypoint.id}
                position={waypoint.position}
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

        let joints = [];
        for (let i = 0; i < route.position.length; i++){
            const isEndpoint = (i === 0 || i === route.position.length-1)
            const pixelSize = route.isSelected ? (isEndpoint ? 12 : 8) : (isEndpoint ? 10 : 8)
            joints.push(
                <Entity
                    key={`r${route.id}j${i}`}
                    id={`r${route.id}j${i}`}
                    isEndpoint={isEndpoint}
                    type={'joint'}
                    position={route.position[i]}
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
        cartographic = sampledArray[0]
        cartesian = new Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height)
        return cartesian
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

    //rerenders the Cesium map, normally, the map does not render unless the view moves, this method is called when there is a change made to entities displayed on the map
    requestRender(){
        if (this.viewer){
            this.viewer.scene.requestRender()
        }
    }
    
    render() {
        const entities = this.drawEntities();
        const display = ['edit', 'create point', 'create route', 'select'].some(item => item === this.context.mode) ? <Display requestRender={() => this.requestRender()}/> : ''
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
                        <Toolbar/>
                        <ScreenSpaceEventHandler>
                            <ScreenSpaceEvent action={e => this.handleClick(e)} type={ScreenSpaceEventType.LEFT_CLICK} />
                            <ScreenSpaceEvent action={e => this.handleHover(e)} type={ScreenSpaceEventType.MOUSE_MOVE}/>
                        </ScreenSpaceEventHandler>
                        <Route path='/welcome' component={LandingPage}/>
                        <Route path='/login' component={LoginForm}/>
                        <Route path='/signup' component={SignupForm}/>
                    </Globe>
                </Viewer>
            </div>
        );
    }
}

export default Map
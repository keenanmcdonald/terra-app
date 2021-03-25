import React, {useContext, useState, useEffect} from 'react'
import TerraContext from '../../../TerraContext'
import {Entity} from 'resium'
import { 
            PolylineOutlineMaterialProperty,
            PolylineGraphics,
            Color,
            Cartesian3, 
        } from 'cesium'
import {useQuery, useMutation, QueryClient} from 'react-query'
import EntityApiService from '../../../services/EntityApiService'

export default function Entities(props){
    const context = useContext(TerraContext)
    const [entities, setEntities] = useState([])
    const {data, isFetching} = useQuery('entities', EntityApiService.getEntities)

    //reads entities in app's state from context. Draws them on the map
    useEffect(() => {
        if (data && data.length >= 1){
            setEntities(data.map((entity, index) => {
                const isSelected = (context.selected === index || !entity.saved) && (context.mode === 'select' || context.mode === 'edit')
                entity.isSelected = isSelected
                let outlineColor = isSelected ? Color.WHITE : Color.GREY
    
                let color = Color.fromBytes(255, 174, 75)
                
                if (!entity.saved) {
                    color = new Color.fromBytes(100, 149, 255, 100) //new Color.fromBytes(116, 192, 67, 100)
                    outlineColor = Color.WHITE
                }
                else if (context.user && (context.user.user_name === entity.user_name)) {
                    color = new Color.fromBytes(100, 149, 255, 255) //new Color.fromBytes(116, 192, 67, 255)
                }
    
                entity.color = color
                entity.outlineColor = outlineColor
    
                if (entity.type === 'waypoint'){
                    return drawWaypoint(entity)
                }
                else {
                    return drawRoute(entity)
                }
            }))    
        }
    }, [data])

    function drawWaypoint(waypoint){
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

    function drawRoute(route){
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
    return (
        <>
            {entities}
        </>
    )

}
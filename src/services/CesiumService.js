import config from '../config'
import {Cartographic, Math as CesiumMath} from 'cesium'
import * as turf from '@turf/turf'

const EntityApiService = {
    parseEntityData(entities){
        //convert position data from server to Cartesian3 objects
        let newEntities = []
        for (const entity of entities){
          if (entity.type === 'waypoint'){
            entity.position = new Cartographic(entity.position[0][1], entity.position[0][0], entity.position[0][2]);
          } 
          else if (entity.type === 'route'){
            let newPosition = []
            for (const position of entity.position){
              newPosition.push(new Cartographic(position[1], position[0], position[2]))
            }
            entity.distance = this.calculateRouteDistance(entity.position)
            entity.position = newPosition
            entity.saved = true
          }
          //mark entities loaded from server as saved
          entity.saved = true
          newEntities.push(entity)
        }
        return newEntities
    },
    calculateRouteDistance(positions){
        let totalDistance = 0
        for (let i = 1; i < positions.length; i++){
            totalDistance += this.calculateLegDistance(positions[i-1], positions[i])
        }
        return totalDistance
    },
    calculateLegDistance(point1, point2){
        let from;
        let to;
        if (point1.latitude){
            from = turf.point([CesiumMath.toDegrees(point1.longitude), CesiumMath.toDegrees(point1.latitude)])
            to = turf.point([CesiumMath.toDegrees(point2.longitude), CesiumMath.toDegrees(point2.latitude)])  
        }
        else{
            from = turf.point([CesiumMath.toDegrees(point1[1]), CesiumMath.toDegrees(point1[0])])
            to = turf.point([CesiumMath.toDegrees(point2[1]), CesiumMath.toDegrees(point2[0])])  
        }
        return turf.distance(from, to, {units: 'miles'})
    },
}

export default EntityApiService


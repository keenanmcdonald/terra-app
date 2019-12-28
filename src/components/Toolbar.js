import React from 'react'
import AddRouteButton from './AddRouteButton'
import AddWaypointButton from './AddWaypointButton'
import LoadEntitiesButton from './LoadEntitiesButton'

function Toolbar(){
    return (
        <div className='toolbar'>
            <AddWaypointButton/>
            <AddRouteButton/>
            <LoadEntitiesButton/>
        </div>
    )
}

export default Toolbar